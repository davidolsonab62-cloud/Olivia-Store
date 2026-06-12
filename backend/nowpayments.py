import os
import logging
from typing import Any, Dict, Optional
import httpx

logger = logging.getLogger("nowpayments")

BASE_URL = os.environ.get("NOWPAYMENTS_BASE_URL", "https://api.nowpayments.io/v1").rstrip("/")
API_KEY = os.environ.get("NOWPAYMENTS_API_KEY", "")
IPN_SECRET = os.environ.get("NOWPAYMENTS_IPN_SECRET", "")


def _headers() -> Dict[str, str]:
    return {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


# Supported pay currencies in our store. NOWPayments ticker form.
SUPPORTED_CURRENCIES = [
    {"code": "btc", "label": "Bitcoin (BTC)", "network": "Bitcoin"},
    {"code": "eth", "label": "Ethereum (ETH)", "network": "Ethereum"},
    {"code": "usdttrc20", "label": "USDT (TRC20)", "network": "Tron"},
    {"code": "usdterc20", "label": "USDT (ERC20)", "network": "Ethereum"},
    {"code": "bnbbsc", "label": "BNB (BSC)", "network": "BNB Smart Chain"},
    {"code": "ltc", "label": "Litecoin (LTC)", "network": "Litecoin"},
]

SUPPORTED_CODES = {c["code"] for c in SUPPORTED_CURRENCIES}


def map_status(now_status: str) -> str:
    s = (now_status or "").lower()
    table = {
        "waiting": "awaiting_payment",
        "confirming": "confirming",
        "sending": "confirming",
        "partially_paid": "underpaid",
        "finished": "paid",
        "confirmed": "paid",
        "failed": "failed",
        "expired": "expired",
        "refunded": "refunded",
    }
    return table.get(s, "awaiting_payment")


class NOWPaymentsError(Exception):
    pass


async def api_status() -> bool:
    try:
        async with httpx.AsyncClient(timeout=10.0) as c:
            r = await c.get(f"{BASE_URL}/status", headers=_headers())
            return r.status_code == 200
    except Exception:
        return False


async def get_estimate(price_amount: float, price_currency: str, pay_currency: str) -> Dict[str, Any]:
    if not API_KEY:
        raise NOWPaymentsError("NOWPayments API key not configured")
    async with httpx.AsyncClient(timeout=15.0) as c:
        r = await c.get(
            f"{BASE_URL}/estimate",
            params={"amount": price_amount, "currency_from": price_currency, "currency_to": pay_currency},
            headers=_headers(),
        )
        if r.status_code != 200:
            raise NOWPaymentsError(f"Estimate failed [{r.status_code}]: {r.text[:200]}")
        return r.json()


async def create_payment(
    price_amount: float,
    pay_currency: str,
    order_id: str,
    ipn_callback_url: str,
    price_currency: str = "usd",
    order_description: str = "",
    is_fixed_rate: bool = True,
) -> Dict[str, Any]:
    if not API_KEY:
        raise NOWPaymentsError("NOWPayments API key not configured")
    payload = {
        "price_amount": price_amount,
        "price_currency": price_currency,
        "pay_currency": pay_currency,
        "order_id": order_id,
        "order_description": order_description or f"Olivia Dante Order {order_id}",
        "ipn_callback_url": ipn_callback_url,
        "is_fixed_rate": is_fixed_rate,
    }
    async with httpx.AsyncClient(timeout=30.0) as c:
        r = await c.post(f"{BASE_URL}/payment", json=payload, headers=_headers())
        if r.status_code not in (200, 201):
            raise NOWPaymentsError(f"create_payment failed [{r.status_code}]: {r.text[:300]}")
        return r.json()


async def get_payment_status(payment_id: str) -> Dict[str, Any]:
    if not API_KEY:
        raise NOWPaymentsError("NOWPayments API key not configured")
    async with httpx.AsyncClient(timeout=15.0) as c:
        r = await c.get(f"{BASE_URL}/payment/{payment_id}", headers=_headers())
        if r.status_code != 200:
            raise NOWPaymentsError(f"get_payment_status failed [{r.status_code}]: {r.text[:200]}")
        return r.json()


async def get_minimum_amount(currency_from: str, currency_to: str = "usd") -> Dict[str, Any]:
    async with httpx.AsyncClient(timeout=15.0) as c:
        r = await c.get(
            f"{BASE_URL}/min-amount",
            params={"currency_from": currency_from, "currency_to": currency_to},
            headers=_headers(),
        )
        if r.status_code != 200:
            raise NOWPaymentsError(f"min-amount failed [{r.status_code}]: {r.text[:200]}")
        return r.json()
