from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional, Any
import uuid

from pydantic import BaseModel, EmailStr, Field, ConfigDict


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def new_id() -> str:
    return str(uuid.uuid4())


# ---------- Enums ----------
class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"


class PaymentStatus(str, Enum):
    AWAITING = "awaiting_payment"
    DETECTED = "payment_detected"
    CONFIRMING = "confirming"
    PAID = "paid"
    EXPIRED = "expired"
    FAILED = "failed"
    UNDERPAID = "underpaid"
    REFUNDED = "refunded"


class OrderStatus(str, Enum):
    DRAFT = "draft"
    PENDING = "pending_payment"
    PAID = "paid"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    EXPIRED = "expired"


class PaymentMethod(str, Enum):
    CRYPTO = "crypto"
    PAYPAL = "paypal"
    GOOGLE_PAY = "google_pay"


# ---------- User ----------
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    email: EmailStr
    full_name: str = ""
    role: UserRole = UserRole.USER
    addresses: List[dict] = []
    favorites: List[str] = []
    created_at: datetime = Field(default_factory=now_utc)


class UserPublic(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: UserRole
    favorites: List[str] = []


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str = ""


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ---------- Category ----------
class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    slug: str
    name: str
    description: str = ""
    image: str = ""
    order: int = 0


class CategoryCreate(BaseModel):
    slug: str
    name: str
    description: str = ""
    image: str = ""
    order: int = 0


# ---------- Product ----------
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    slug: str
    name: str
    brand: str = ""
    category_slug: str
    description: str = ""
    specs: dict = {}
    price: float
    compare_at_price: Optional[float] = None
    currency: str = "USD"
    images: List[str] = []
    sizes: List[str] = []
    stock: int = 0
    rating: float = 4.7
    reviews_count: int = 0
    is_featured: bool = False
    is_new: bool = False
    is_best_seller: bool = False
    tags: List[str] = []
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)


class ProductCreate(BaseModel):
    slug: str
    name: str
    brand: str = ""
    category_slug: str
    description: str = ""
    specs: dict = {}
    price: float
    compare_at_price: Optional[float] = None
    images: List[str] = []
    sizes: List[str] = []
    stock: int = 0
    is_featured: bool = False
    is_new: bool = False
    is_best_seller: bool = False
    tags: List[str] = []


class ProductUpdate(BaseModel):
    slug: Optional[str] = None
    name: Optional[str] = None
    brand: Optional[str] = None
    category_slug: Optional[str] = None
    description: Optional[str] = None
    specs: Optional[dict] = None
    price: Optional[float] = None
    compare_at_price: Optional[float] = None
    images: Optional[List[str]] = None
    sizes: Optional[List[str]] = None
    stock: Optional[int] = None
    is_featured: Optional[bool] = None
    is_new: Optional[bool] = None
    is_best_seller: Optional[bool] = None
    tags: Optional[List[str]] = None


# ---------- Review ----------
class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    product_id: str
    user_id: Optional[str] = None
    author_name: str
    rating: int = 5
    title: str = ""
    body: str = ""
    created_at: datetime = Field(default_factory=now_utc)


class ReviewCreate(BaseModel):
    product_id: str
    author_name: str
    rating: int = 5
    title: str = ""
    body: str = ""


# ---------- Order ----------
class OrderItem(BaseModel):
    product_id: str
    product_slug: str
    name: str
    image: str = ""
    size: Optional[str] = None
    quantity: int = 1
    unit_price: float
    total_price: float


class ShippingAddress(BaseModel):
    full_name: str
    email: EmailStr
    phone: str = ""
    address_line1: str
    address_line2: str = ""
    city: str
    state: str = ""
    postal_code: str = ""
    country: str


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    order_number: str
    user_id: Optional[str] = None
    customer_email: EmailStr
    items: List[OrderItem]
    subtotal: float
    shipping_fee: float = 0.0
    total_amount: float
    currency: str = "USD"
    shipping: ShippingAddress
    payment_method: PaymentMethod = PaymentMethod.CRYPTO
    pay_currency: Optional[str] = None
    status: OrderStatus = OrderStatus.DRAFT
    payment_id: Optional[str] = None
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)


class CreateOrderRequest(BaseModel):
    items: List[OrderItem]
    shipping: ShippingAddress
    payment_method: PaymentMethod = PaymentMethod.CRYPTO
    pay_currency: Optional[str] = None  # used when payment_method == crypto


# ---------- Payment ----------
class Payment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    payment_id: str  # NOWPayments id
    order_id: str
    order_number: str
    pay_address: str
    pay_amount: float
    pay_currency: str
    price_amount: float
    price_currency: str
    amount_received: float = 0.0
    status: PaymentStatus = PaymentStatus.AWAITING
    nowpayments_status: str = "waiting"
    expiration_time: Optional[datetime] = None
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
    raw: Optional[Any] = None


class Withdrawal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    currency: str
    address: str
    amount: float
    status: str = "pending"
    note: str = ""
    created_at: datetime = Field(default_factory=now_utc)


class WithdrawalCreate(BaseModel):
    currency: str
    address: str
    amount: float
    note: str = ""


class NewsletterSub(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    email: EmailStr
    created_at: datetime = Field(default_factory=now_utc)


class NewsletterCreate(BaseModel):
    email: EmailStr


def serialize_doc(doc: Optional[dict]) -> Optional[dict]:
    """Make MongoDB doc JSON-safe for FastAPI responses."""
    if doc is None:
        return None
    out = {}
    for k, v in doc.items():
        if k == "_id":
            continue
        if isinstance(v, datetime):
            out[k] = v.isoformat()
        elif isinstance(v, dict):
            out[k] = serialize_doc(v)
        elif isinstance(v, list):
            out[k] = [serialize_doc(x) if isinstance(x, dict) else (x.isoformat() if isinstance(x, datetime) else x) for x in v]
        else:
            out[k] = v
    return out
