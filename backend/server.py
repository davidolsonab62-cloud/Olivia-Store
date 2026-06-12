"""Olivia Dante Art Store — FastAPI backend.

Routes are all mounted under /api.
"""
from __future__ import annotations

import hashlib
import hmac
import json
import logging
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Query, Request, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
import certifi
import ssl

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from .models import (  # noqa: E402
    Category,
    CategoryCreate,
    CreateOrderRequest,
    NewsletterCreate,
    NewsletterSub,
    Order,
    OrderStatus,
    Payment,
    PaymentMethod,
    PaymentStatus,
    Product,
    ProductCreate,
    ProductUpdate,
    Review,
    ReviewCreate,
    User,
    UserCreate,
    UserLogin,
    UserPublic,
    UserRole,
    Withdrawal,
    WithdrawalCreate,
    new_id,
    now_utc,
    serialize_doc,
)
from .auth import (  # noqa: E402
    create_access_token,
    get_current_admin,
    get_current_user,
    get_current_user_optional,
    hash_password,
    verify_password,
)
from . import nowpayments  # noqa: E402
from .seed_data import CATEGORIES, PRODUCTS, REVIEWS, TESTIMONIALS  # noqa: E402

# ---------- Setup ----------
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s [%(name)s] %(message)s")
logger = logging.getLogger("oliviadante")

MONGO_URL = os.environ.get("MONGO_URL", "").strip()
DB_NAME = os.environ.get("DB_NAME", "").strip() or "oliviadante_store"
PUBLIC_BACKEND_URL = os.environ.get("PUBLIC_BACKEND_URL", "http://localhost:3002").strip().rstrip("/")

if not MONGO_URL and os.environ.get("RENDER_SERVICE_ID"):
    raise RuntimeError(
        "MONGO_URL is required in Render. Set the database connection string in Render environment variables."
    )

if not MONGO_URL:
    MONGO_URL = "mongodb://localhost:27017"

client_kwargs = {
    "serverSelectionTimeoutMS": 15000,
    "connectTimeoutMS": 10000,
    "socketTimeoutMS": 20000,
}
if ".mongodb.net" in MONGO_URL or MONGO_URL.startswith("mongodb+srv://"):
    client_kwargs.update(
        {
            "tls": True,
            "ssl": True,
            "tlsCAFile": certifi.where(),
            "ssl_cert_reqs": ssl.CERT_REQUIRED,
            "tlsAllowInvalidCertificates": False,
            "tlsAllowInvalidHostnames": False,
        }
    )

client = AsyncIOMotorClient(MONGO_URL, **client_kwargs)
db = client[DB_NAME]

app = FastAPI(title="Olivia Dante Art Store API", version="1.0.0")
api = APIRouter(prefix="/api")


# ---------- Helpers ----------
def order_number_for(_id: str) -> str:
    return "OD-" + _id.replace("-", "")[:10].upper()


async def find_product(query: dict) -> Optional[dict]:
    return await db.products.find_one(query)


def public_user(u: dict) -> dict:
    return {
        "id": u["id"],
        "email": u["email"],
        "full_name": u.get("full_name", ""),
        "role": u.get("role", "user"),
        "favorites": u.get("favorites", []),
    }


# ---------- Auth ----------
@api.post("/auth/register")
async def register(body: UserCreate):
    existing = await db.users.find_one({"email": body.email.lower()})
    if existing:
        raise HTTPException(409, "Email already registered")
    user = User(email=body.email.lower(), full_name=body.full_name).model_dump()
    user["password_hash"] = hash_password(body.password)
    user["created_at"] = user["created_at"].isoformat()
    await db.users.insert_one(user)
    token = create_access_token(user["id"], user["role"], user["email"])
    return {"token": token, "user": public_user(user)}


@api.post("/auth/login")
async def login(body: UserLogin):
    u = await db.users.find_one({"email": body.email.lower()})
    if not u or not verify_password(body.password, u.get("password_hash", "")):
        raise HTTPException(401, "Invalid email or password")
    token = create_access_token(u["id"], u.get("role", "user"), u["email"])
    return {"token": token, "user": public_user(u)}


@api.get("/auth/me")
async def get_me(payload: dict = Depends(get_current_user)):
    u = await db.users.find_one({"id": payload["sub"]})
    if not u:
        raise HTTPException(404, "User not found")
    return public_user(u)


@api.post("/auth/favorites/{product_id}")
async def toggle_favorite(product_id: str, payload: dict = Depends(get_current_user)):
    u = await db.users.find_one({"id": payload["sub"]})
    favs = set(u.get("favorites", []))
    if product_id in favs:
        favs.discard(product_id)
        action = "removed"
    else:
        favs.add(product_id)
        action = "added"
    await db.users.update_one({"id": payload["sub"]}, {"$set": {"favorites": list(favs)}})
    return {"action": action, "favorites": list(favs)}


# ---------- Categories ----------
@api.get("/categories")
async def list_categories():
    docs = await db.categories.find({}, {"_id": 0}).sort("order", 1).to_list(200)
    return docs


@api.post("/admin/categories")
async def create_category(body: CategoryCreate, _admin: dict = Depends(get_current_admin)):
    if await db.categories.find_one({"slug": body.slug}):
        raise HTTPException(409, "Category slug exists")
    cat = Category(**body.model_dump()).model_dump()
    await db.categories.insert_one(cat)
    return serialize_doc(cat)


# ---------- Products ----------
@api.get("/products")
async def list_products(
    category: Optional[str] = None,
    q: Optional[str] = None,
    featured: Optional[bool] = None,
    new: Optional[bool] = None,
    best_seller: Optional[bool] = None,
    sort: str = "newest",  # newest | price_asc | price_desc | rating
    limit: int = Query(60, le=200),
    skip: int = 0,
):
    flt: dict = {}
    if category:
        flt["category_slug"] = category
    if q:
        flt["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"brand": {"$regex": q, "$options": "i"}},
            {"tags": {"$elemMatch": {"$regex": q, "$options": "i"}}},
        ]
    if featured is not None:
        flt["is_featured"] = featured
    if new is not None:
        flt["is_new"] = new
    if best_seller is not None:
        flt["is_best_seller"] = best_seller

    sort_spec: List = [("created_at", -1)]
    if sort == "price_asc":
        sort_spec = [("price", 1)]
    elif sort == "price_desc":
        sort_spec = [("price", -1)]
    elif sort == "rating":
        sort_spec = [("rating", -1)]

    cursor = db.products.find(flt, {"_id": 0}).sort(sort_spec).skip(skip).limit(limit)
    docs = await cursor.to_list(limit)
    total = await db.products.count_documents(flt)
    return {"items": docs, "total": total}


@api.get("/products/{slug}")
async def get_product(slug: str):
    p = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not p:
        raise HTTPException(404, "Product not found")
    return p


@api.get("/products/{slug}/related")
async def related_products(slug: str, limit: int = 6):
    p = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not p:
        return {"items": []}
    cursor = db.products.find(
        {"category_slug": p["category_slug"], "slug": {"$ne": slug}}, {"_id": 0}
    ).limit(limit)
    items = await cursor.to_list(limit)
    return {"items": items}


@api.post("/admin/products")
async def admin_create_product(body: ProductCreate, _admin: dict = Depends(get_current_admin)):
    if await db.products.find_one({"slug": body.slug}):
        raise HTTPException(409, "Product slug exists")
    p = Product(**body.model_dump()).model_dump()
    p["created_at"] = p["created_at"].isoformat()
    p["updated_at"] = p["updated_at"].isoformat()
    await db.products.insert_one(p)
    return serialize_doc(p)


@api.put("/admin/products/{product_id}")
async def admin_update_product(
    product_id: str, body: ProductUpdate, _admin: dict = Depends(get_current_admin)
):
    p = await db.products.find_one({"id": product_id})
    if not p:
        raise HTTPException(404, "Product not found")
    upd = {k: v for k, v in body.model_dump(exclude_unset=True).items() if v is not None}
    upd["updated_at"] = now_utc().isoformat()
    await db.products.update_one({"id": product_id}, {"$set": upd})
    p2 = await db.products.find_one({"id": product_id}, {"_id": 0})
    return p2


@api.delete("/admin/products/{product_id}")
async def admin_delete_product(product_id: str, _admin: dict = Depends(get_current_admin)):
    r = await db.products.delete_one({"id": product_id})
    if r.deleted_count == 0:
        raise HTTPException(404, "Product not found")
    return {"ok": True}


# ---------- Reviews ----------
@api.get("/products/{slug}/reviews")
async def product_reviews(slug: str):
    p = await db.products.find_one({"slug": slug}, {"id": 1})
    if not p:
        return {"items": []}
    cursor = db.reviews.find({"product_id": p["id"]}, {"_id": 0}).sort("created_at", -1)
    items = await cursor.to_list(200)
    return {"items": items}


@api.post("/reviews")
async def create_review(body: ReviewCreate, user: Optional[dict] = Depends(get_current_user_optional)):
    rev = Review(
        product_id=body.product_id,
        user_id=user["sub"] if user else None,
        author_name=body.author_name,
        rating=max(1, min(5, body.rating)),
        title=body.title,
        body=body.body,
    ).model_dump()
    rev["created_at"] = rev["created_at"].isoformat()
    await db.reviews.insert_one(rev)
    # update product rating
    pipeline = [
        {"$match": {"product_id": body.product_id}},
        {"$group": {"_id": "$product_id", "avg": {"$avg": "$rating"}, "n": {"$sum": 1}}},
    ]
    res = await db.reviews.aggregate(pipeline).to_list(1)
    if res:
        await db.products.update_one(
            {"id": body.product_id},
            {"$set": {"rating": round(res[0]["avg"], 1), "reviews_count": res[0]["n"]}},
        )
    return serialize_doc(rev)


# ---------- Testimonials ----------
@api.get("/testimonials")
async def list_testimonials():
    docs = await db.testimonials.find({}, {"_id": 0}).to_list(100)
    return docs


# ---------- Newsletter ----------
@api.post("/newsletter")
async def newsletter_sub(body: NewsletterCreate):
    if await db.newsletter.find_one({"email": body.email.lower()}):
        return {"ok": True, "already_subscribed": True}
    sub = NewsletterSub(email=body.email.lower()).model_dump()
    sub["created_at"] = sub["created_at"].isoformat()
    await db.newsletter.insert_one(sub)
    return {"ok": True}


# ---------- Crypto support ----------
@api.get("/crypto/currencies")
async def crypto_currencies():
    return {"currencies": nowpayments.SUPPORTED_CURRENCIES}


@api.get("/crypto/estimate")
async def crypto_estimate(amount: float, pay_currency: str, price_currency: str = "usd"):
    if pay_currency.lower() not in nowpayments.SUPPORTED_CODES:
        raise HTTPException(400, "Unsupported pay currency")
    try:
        data = await nowpayments.get_estimate(amount, price_currency, pay_currency.lower())
        return data
    except nowpayments.NOWPaymentsError as e:
        raise HTTPException(502, str(e))


# ---------- Orders ----------
@api.post("/orders")
async def create_order(body: CreateOrderRequest, user: Optional[dict] = Depends(get_current_user_optional)):
    if not body.items:
        raise HTTPException(400, "Order must contain items")

    # Verify product stock and compute server-side total
    subtotal = 0.0
    enriched_items: List[dict] = []
    for it in body.items:
        prod = await db.products.find_one({"id": it.product_id})
        if not prod:
            raise HTTPException(400, f"Product not found: {it.product_id}")
        if prod.get("stock", 0) < it.quantity:
            raise HTTPException(400, f"Insufficient stock for {prod['name']}")
        unit = float(prod["price"])
        total = unit * it.quantity
        subtotal += total
        enriched_items.append(
            {
                "product_id": prod["id"],
                "product_slug": prod["slug"],
                "name": prod["name"],
                "image": (prod.get("images") or [""])[0],
                "size": it.size,
                "quantity": it.quantity,
                "unit_price": unit,
                "total_price": total,
            }
        )

    shipping_fee = 0.0  # free worldwide v1
    total_amount = round(subtotal + shipping_fee, 2)

    if body.payment_method == PaymentMethod.CRYPTO:
        if not body.pay_currency or body.pay_currency.lower() not in nowpayments.SUPPORTED_CODES:
            raise HTTPException(400, "pay_currency required for crypto payment method")

    order_id = new_id()
    order = {
        "id": order_id,
        "order_number": order_number_for(order_id),
        "user_id": user["sub"] if user else None,
        "customer_email": body.shipping.email,
        "items": enriched_items,
        "subtotal": round(subtotal, 2),
        "shipping_fee": shipping_fee,
        "total_amount": total_amount,
        "currency": "USD",
        "shipping": body.shipping.model_dump(),
        "payment_method": body.payment_method.value,
        "pay_currency": (body.pay_currency or "").lower() or None,
        "status": OrderStatus.PENDING.value,
        "payment_id": None,
        "created_at": now_utc().isoformat(),
        "updated_at": now_utc().isoformat(),
    }
    await db.orders.insert_one(order)

    # For crypto, create NOWPayments payment immediately
    payment_doc = None
    if body.payment_method == PaymentMethod.CRYPTO:
        ipn_url = f"{PUBLIC_BACKEND_URL}/api/webhooks/nowpayments"
        try:
            np = await nowpayments.create_payment(
                price_amount=total_amount,
                pay_currency=body.pay_currency.lower(),
                order_id=order["order_number"],
                ipn_callback_url=ipn_url,
                order_description=f"Olivia Dante {order['order_number']}",
            )
        except nowpayments.NOWPaymentsError as e:
            # Roll back order to draft so customer can retry
            await db.orders.update_one(
                {"id": order_id}, {"$set": {"status": OrderStatus.DRAFT.value}}
            )
            raise HTTPException(502, f"Could not create crypto payment: {e}")

        expiration = now_utc() + timedelta(minutes=60)
        payment_doc = {
            "id": new_id(),
            "payment_id": str(np.get("payment_id")),
            "order_id": order_id,
            "order_number": order["order_number"],
            "pay_address": np.get("pay_address"),
            "pay_amount": float(np.get("pay_amount") or 0),
            "pay_currency": (np.get("pay_currency") or body.pay_currency).lower(),
            "price_amount": float(np.get("price_amount") or total_amount),
            "price_currency": np.get("price_currency") or "usd",
            "amount_received": 0.0,
            "status": nowpayments.map_status(np.get("payment_status", "waiting")),
            "nowpayments_status": np.get("payment_status", "waiting"),
            "expiration_time": expiration.isoformat(),
            "created_at": now_utc().isoformat(),
            "updated_at": now_utc().isoformat(),
            "raw": np,
        }
        await db.payments.insert_one(payment_doc)
        await db.orders.update_one(
            {"id": order_id},
            {"$set": {"payment_id": payment_doc["payment_id"], "updated_at": now_utc().isoformat()}},
        )
        order["payment_id"] = payment_doc["payment_id"]

    return {"order": serialize_doc(order), "payment": serialize_doc(payment_doc)}


@api.get("/orders/{order_id_or_number}")
async def get_order(order_id_or_number: str):
    o = await db.orders.find_one(
        {"$or": [{"id": order_id_or_number}, {"order_number": order_id_or_number}]}, {"_id": 0}
    )
    if not o:
        raise HTTPException(404, "Order not found")
    payment = None
    if o.get("payment_id"):
        payment = await db.payments.find_one({"payment_id": o["payment_id"]}, {"_id": 0})
    return {"order": o, "payment": payment}


@api.get("/orders/{order_id_or_number}/payment")
async def get_order_payment(order_id_or_number: str, sync: bool = False):
    o = await db.orders.find_one(
        {"$or": [{"id": order_id_or_number}, {"order_number": order_id_or_number}]}, {"_id": 0}
    )
    if not o:
        raise HTTPException(404, "Order not found")
    if not o.get("payment_id"):
        raise HTTPException(404, "No payment attached to order")
    payment = await db.payments.find_one({"payment_id": o["payment_id"]}, {"_id": 0})
    if not payment:
        raise HTTPException(404, "Payment not found")

    if sync:
        try:
            np = await nowpayments.get_payment_status(payment["payment_id"])
            new_status = nowpayments.map_status(np.get("payment_status", "waiting"))
            actually_paid = float(np.get("actually_paid") or 0)
            await db.payments.update_one(
                {"payment_id": payment["payment_id"]},
                {
                    "$set": {
                        "status": new_status,
                        "nowpayments_status": np.get("payment_status"),
                        "amount_received": actually_paid,
                        "updated_at": now_utc().isoformat(),
                        "raw": np,
                    }
                },
            )
            payment.update(
                {
                    "status": new_status,
                    "nowpayments_status": np.get("payment_status"),
                    "amount_received": actually_paid,
                }
            )
            if new_status == PaymentStatus.PAID.value and o.get("status") != OrderStatus.PAID.value:
                await db.orders.update_one(
                    {"id": o["id"]},
                    {"$set": {"status": OrderStatus.PAID.value, "updated_at": now_utc().isoformat()}},
                )
                o["status"] = OrderStatus.PAID.value
                # Decrement stock once
                for it in o["items"]:
                    await db.products.update_one(
                        {"id": it["product_id"]}, {"$inc": {"stock": -it["quantity"]}}
                    )
        except nowpayments.NOWPaymentsError as e:
            logger.warning("Sync failed: %s", e)

    return {"order": o, "payment": payment}


@api.get("/orders")
async def my_orders(user: dict = Depends(get_current_user)):
    cursor = db.orders.find({"user_id": user["sub"]}, {"_id": 0}).sort("created_at", -1)
    items = await cursor.to_list(200)
    return {"items": items}


# ---------- Webhooks ----------
@api.post("/webhooks/nowpayments")
async def nowpayments_webhook(request: Request):
    raw = await request.body()
    sig = request.headers.get("x-nowpayments-sig") or request.headers.get("X-Nowpayments-Sig")

    secret = nowpayments.IPN_SECRET
    if secret and sig:
        # NOTE: NOWPayments uses sorted-key JSON for signature
        try:
            payload = json.loads(raw.decode("utf-8"))
            sorted_body = json.dumps(payload, sort_keys=True, separators=(",", ":"))
            computed = hmac.new(secret.encode("utf-8"), sorted_body.encode("utf-8"), hashlib.sha512).hexdigest()
            if not hmac.compare_digest(computed, sig):
                logger.warning("IPN signature mismatch")
                raise HTTPException(400, "Invalid signature")
        except HTTPException:
            raise
        except Exception as e:
            logger.warning("IPN sig verify failed: %s", e)

    try:
        payload = json.loads(raw.decode("utf-8"))
    except Exception:
        raise HTTPException(400, "Invalid JSON")

    payment_id = str(payload.get("payment_id") or "")
    if not payment_id:
        raise HTTPException(400, "Missing payment_id")

    np_status = payload.get("payment_status") or "waiting"
    new_status = nowpayments.map_status(np_status)
    actually_paid = float(payload.get("actually_paid") or 0)

    await db.payments.update_one(
        {"payment_id": payment_id},
        {
            "$set": {
                "status": new_status,
                "nowpayments_status": np_status,
                "amount_received": actually_paid,
                "updated_at": now_utc().isoformat(),
                "raw": payload,
            }
        },
    )

    order_number = str(payload.get("order_id") or "")
    if new_status == PaymentStatus.PAID.value and order_number:
        order = await db.orders.find_one({"order_number": order_number})
        if order and order.get("status") != OrderStatus.PAID.value:
            await db.orders.update_one(
                {"order_number": order_number},
                {"$set": {"status": OrderStatus.PAID.value, "updated_at": now_utc().isoformat()}},
            )
            for it in order.get("items", []):
                await db.products.update_one(
                    {"id": it["product_id"]}, {"$inc": {"stock": -it["quantity"]}}
                )

    if new_status == PaymentStatus.EXPIRED.value and order_number:
        await db.orders.update_one(
            {"order_number": order_number},
            {"$set": {"status": OrderStatus.EXPIRED.value, "updated_at": now_utc().isoformat()}},
        )

    return {"ok": True}


# ---------- Admin ----------
@api.get("/admin/stats")
async def admin_stats(_admin: dict = Depends(get_current_admin)):
    total_orders = await db.orders.count_documents({})
    paid_orders = await db.orders.count_documents({"status": OrderStatus.PAID.value})
    pending_orders = await db.orders.count_documents({"status": OrderStatus.PENDING.value})
    expired_orders = await db.orders.count_documents({"status": OrderStatus.EXPIRED.value})

    # revenue (paid orders)
    pipeline = [
        {"$match": {"status": OrderStatus.PAID.value}},
        {"$group": {"_id": None, "total": {"$sum": "$total_amount"}}},
    ]
    rev_res = await db.orders.aggregate(pipeline).to_list(1)
    revenue = float(rev_res[0]["total"]) if rev_res else 0.0

    customers = await db.users.count_documents({"role": "user"})
    products_count = await db.products.count_documents({})

    # most sold (sum quantities across paid orders)
    pipeline2 = [
        {"$match": {"status": OrderStatus.PAID.value}},
        {"$unwind": "$items"},
        {
            "$group": {
                "_id": "$items.product_id",
                "name": {"$first": "$items.name"},
                "image": {"$first": "$items.image"},
                "qty": {"$sum": "$items.quantity"},
                "revenue": {"$sum": "$items.total_price"},
            }
        },
        {"$sort": {"qty": -1}},
        {"$limit": 5},
    ]
    top = await db.orders.aggregate(pipeline2).to_list(5)

    # recent orders
    recent = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).limit(8).to_list(8)

    return {
        "total_orders": total_orders,
        "paid_orders": paid_orders,
        "pending_orders": pending_orders,
        "expired_orders": expired_orders,
        "revenue": round(revenue, 2),
        "customers": customers,
        "products": products_count,
        "top_products": top,
        "recent_orders": recent,
    }


@api.get("/admin/orders")
async def admin_list_orders(
    _admin: dict = Depends(get_current_admin),
    status_filter: Optional[str] = None,
    limit: int = 100,
    skip: int = 0,
):
    flt: dict = {}
    if status_filter:
        flt["status"] = status_filter
    cursor = db.orders.find(flt, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit)
    items = await cursor.to_list(limit)
    return {"items": items}


@api.get("/admin/customers")
async def admin_list_customers(_admin: dict = Depends(get_current_admin)):
    cursor = db.users.find({}, {"_id": 0, "password_hash": 0}).sort("created_at", -1)
    items = await cursor.to_list(500)
    return {"items": items}


@api.get("/admin/payments")
async def admin_list_payments(_admin: dict = Depends(get_current_admin)):
    cursor = db.payments.find({}, {"_id": 0}).sort("created_at", -1)
    items = await cursor.to_list(500)
    return {"items": items}


@api.get("/admin/withdrawals")
async def admin_list_withdrawals(_admin: dict = Depends(get_current_admin)):
    cursor = db.withdrawals.find({}, {"_id": 0}).sort("created_at", -1)
    items = await cursor.to_list(500)
    return {"items": items}


@api.post("/admin/withdrawals")
async def admin_create_withdrawal(body: WithdrawalCreate, _admin: dict = Depends(get_current_admin)):
    w = Withdrawal(**body.model_dump()).model_dump()
    w["created_at"] = w["created_at"].isoformat()
    await db.withdrawals.insert_one(w)
    return serialize_doc(w)


@api.put("/admin/withdrawals/{wid}")
async def admin_update_withdrawal(wid: str, body: dict, _admin: dict = Depends(get_current_admin)):
    allowed = {k: v for k, v in body.items() if k in {"status", "note"}}
    if not allowed:
        raise HTTPException(400, "No updatable fields")
    await db.withdrawals.update_one({"id": wid}, {"$set": allowed})
    w = await db.withdrawals.find_one({"id": wid}, {"_id": 0})
    return w


@api.get("/admin/export/orders.csv")
async def admin_export_orders(_admin: dict = Depends(get_current_admin)):
    from fastapi.responses import PlainTextResponse

    rows = ["order_number,status,customer_email,total_amount,currency,payment_method,pay_currency,created_at"]
    cursor = db.orders.find({}, {"_id": 0}).sort("created_at", -1)
    async for o in cursor:
        rows.append(
            ",".join(
                [
                    o.get("order_number", ""),
                    o.get("status", ""),
                    o.get("customer_email", ""),
                    str(o.get("total_amount", "")),
                    o.get("currency", ""),
                    o.get("payment_method", ""),
                    o.get("pay_currency", "") or "",
                    o.get("created_at", ""),
                ]
            )
        )
    return PlainTextResponse("\n".join(rows), media_type="text/csv")


# ---------- Healthcheck ----------
@api.get("/")
async def root():
    return {"name": "Olivia Dante Art Store", "status": "ok"}


# ---------- Startup: seed data ----------
async def seed_database():
    # Admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@oliviadante.com").lower()
    admin_pw = os.environ.get("ADMIN_PASSWORD", "Admin@123")
    if not await db.users.find_one({"email": admin_email}):
        admin = User(email=admin_email, full_name="Olivia Dante Admin", role=UserRole.ADMIN).model_dump()
        admin["password_hash"] = hash_password(admin_pw)
        admin["created_at"] = admin["created_at"].isoformat()
        await db.users.insert_one(admin)
        logger.info("Seeded admin user: %s", admin_email)

    # Categories
    for c in CATEGORIES:
        if not await db.categories.find_one({"slug": c["slug"]}):
            cat = Category(**c).model_dump()
            await db.categories.insert_one(cat)
    logger.info("Categories: %d", await db.categories.count_documents({}))

    # Products
    products_by_slug = {}
    for p in PRODUCTS:
        if not await db.products.find_one({"slug": p["slug"]}):
            prod = Product(**p).model_dump()
            prod["created_at"] = prod["created_at"].isoformat()
            prod["updated_at"] = prod["updated_at"].isoformat()
            await db.products.insert_one(prod)
            products_by_slug[p["slug"]] = prod["id"]
        else:
            existing = await db.products.find_one({"slug": p["slug"]})
            products_by_slug[p["slug"]] = existing["id"]
    logger.info("Products: %d", await db.products.count_documents({}))

    # Reviews
    if await db.reviews.count_documents({}) == 0:
        for r in REVIEWS:
            pid = products_by_slug.get(r["product_slug"])
            if not pid:
                continue
            rev = Review(
                product_id=pid,
                author_name=r["author_name"],
                rating=r["rating"],
                title=r["title"],
                body=r["body"],
            ).model_dump()
            rev["created_at"] = rev["created_at"].isoformat()
            await db.reviews.insert_one(rev)
        # Set reviews_count/rating on products
        for slug, pid in products_by_slug.items():
            pipeline = [
                {"$match": {"product_id": pid}},
                {"$group": {"_id": "$product_id", "avg": {"$avg": "$rating"}, "n": {"$sum": 1}}},
            ]
            res = await db.reviews.aggregate(pipeline).to_list(1)
            if res:
                await db.products.update_one(
                    {"id": pid},
                    {"$set": {"rating": round(res[0]["avg"], 1), "reviews_count": res[0]["n"]}},
                )

    # Testimonials
    if await db.testimonials.count_documents({}) == 0:
        for t in TESTIMONIALS:
            await db.testimonials.insert_one({"id": new_id(), **t})

    logger.info("Seed complete.")


@app.on_event("startup")
async def on_startup():
    await seed_database()


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


# ---------- App config ----------

@app.get("/")
async def app_root():
    return {
        "name": "Olivia Dante Art Store API",
        "status": "ok",
        "api_root": "/api/",
    }

app.include_router(api)

cors_origins = os.environ.get("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
