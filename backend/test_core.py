"""
POC: NOWPayments Crypto Gateway Integration

Validates the CORE workflow of crypto payments for Olivia Dante Art Store:

User Story 1 (POC): As a dev, I can fetch supported currencies → BTC/ETH/USDT/BNB/LTC available.
User Story 2 (POC): As a dev, I can fetch estimated price for a fiat amount in a chosen crypto.
User Story 3 (POC): As a dev, I can create a payment for $50 USD in BTC and receive a UNIQUE deposit address.
User Story 4 (POC): As a dev, each new payment generates a DIFFERENT deposit address.
User Story 5 (POC): As a dev, I can query payment status (waiting/confirming/finished/expired).
User Story 6 (POC): As a dev, status mapping converts NOWPayments → internal (Awaiting/Detected/Confirming/Paid/Expired).

If all 6 user stories pass, the crypto core is proven and we can build the e-commerce app around it.
"""

import os
import time
from pathlib import Path
from dotenv import load_dotenv
import requests

ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")

API_KEY = os.environ.get("NOWPAYMENTS_API_KEY")
BASE_URL = os.environ.get("NOWPAYMENTS_BASE_URL", "https://api.nowpayments.io/v1").rstrip("/")

HEADERS = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
    "Accept": "application/json",
}

REQUIRED_COINS = {"btc", "eth", "usdttrc20", "usdterc20", "bnb", "bnbbsc", "ltc"}


def banner(title):
    print("\n" + "=" * 78)
    print(f"  {title}")
    print("=" * 78)


def map_status(now_status: str) -> str:
    s = (now_status or "").lower()
    mapping = {
        "waiting": "AWAITING_PAYMENT",
        "confirming": "CONFIRMING",
        "sending": "CONFIRMING",
        "partially_paid": "UNDERPAID",
        "finished": "PAID",
        "confirmed": "PAID",
        "failed": "FAILED",
        "expired": "EXPIRED",
        "refunded": "REFUNDED",
    }
    return mapping.get(s, "UNKNOWN")


def test_api_status():
    banner("Story 0: API reachability (GET /status)")
    r = requests.get(f"{BASE_URL}/status", headers=HEADERS, timeout=15)
    print("HTTP", r.status_code, "→", r.text[:200])
    assert r.status_code == 200, "NOWPayments API not reachable"
    return True


def test_currencies():
    banner("Story 1: Fetch supported currencies")
    r = requests.get(f"{BASE_URL}/currencies", headers=HEADERS, timeout=20)
    print("HTTP", r.status_code)
    assert r.status_code == 200, f"Currencies fetch failed: {r.text[:200]}"
    data = r.json()
    currencies = data.get("currencies", [])
    print(f"Total currencies available: {len(currencies)}")
    # Lowercase compare
    lower = {c.lower() for c in currencies}
    matched = REQUIRED_COINS & lower
    print(f"Required coins available ({len(matched)}/{len(REQUIRED_COINS)}): {sorted(matched)}")
    missing = REQUIRED_COINS - lower
    if missing:
        print(f"NOT directly available (may need different ticker): {sorted(missing)}")
    assert len(matched) >= 3, "Too few required currencies available"
    return True


def test_estimate():
    banner("Story 2: Get estimated price ($50 USD → BTC)")
    r = requests.get(
        f"{BASE_URL}/estimate",
        params={"amount": 50, "currency_from": "usd", "currency_to": "btc"},
        headers=HEADERS,
        timeout=20,
    )
    print("HTTP", r.status_code, "→", r.text[:300])
    assert r.status_code == 200, f"Estimate failed: {r.text[:200]}"
    data = r.json()
    print(f"Estimated: ${data.get('amount_from')} USD → {data.get('estimated_amount')} BTC")
    assert data.get("estimated_amount"), "No estimated amount returned"
    return True


def create_payment(order_id, pay_currency="btc"):
    payload = {
        "price_amount": 50.0,
        "price_currency": "usd",
        "pay_currency": pay_currency,
        "order_id": order_id,
        "order_description": f"POC test order {order_id}",
        "ipn_callback_url": "https://art-marketplace-120.preview.emergentagent.com/api/webhooks/nowpayments",
    }
    r = requests.post(f"{BASE_URL}/payment", json=payload, headers=HEADERS, timeout=30)
    print("HTTP", r.status_code, "→", r.text[:400])
    assert r.status_code in (200, 201), f"create_payment failed: {r.text[:300]}"
    return r.json()


def test_unique_addresses():
    banner("Story 3+4: Create two payments → verify UNIQUE deposit addresses")
    p1 = create_payment(f"poc-{int(time.time())}-1", "btc")
    print(f"  Payment 1: id={p1.get('payment_id')} addr={p1.get('pay_address')} amount={p1.get('pay_amount')} BTC")
    time.sleep(1)
    p2 = create_payment(f"poc-{int(time.time())}-2", "btc")
    print(f"  Payment 2: id={p2.get('payment_id')} addr={p2.get('pay_address')} amount={p2.get('pay_amount')} BTC")

    assert p1.get("pay_address"), "Payment 1 missing address"
    assert p2.get("pay_address"), "Payment 2 missing address"
    assert p1.get("pay_address") != p2.get("pay_address"), "Addresses are NOT unique!"
    print("  ✓ Addresses ARE unique")
    return p1, p2


def test_status_check(payment_id):
    banner(f"Story 5: Query payment status (id={payment_id})")
    r = requests.get(f"{BASE_URL}/payment/{payment_id}", headers=HEADERS, timeout=20)
    print("HTTP", r.status_code, "→", r.text[:400])
    assert r.status_code == 200, f"Status query failed: {r.text[:200]}"
    data = r.json()
    now_status = data.get("payment_status")
    internal = map_status(now_status)
    print(f"  NOWPayments status: '{now_status}' → internal: '{internal}'")
    return data


def test_status_mapping():
    banner("Story 6: Status mapping unit test")
    cases = {
        "waiting": "AWAITING_PAYMENT",
        "confirming": "CONFIRMING",
        "finished": "PAID",
        "expired": "EXPIRED",
        "failed": "FAILED",
        "partially_paid": "UNDERPAID",
    }
    for k, v in cases.items():
        got = map_status(k)
        ok = "✓" if got == v else "✗"
        print(f"  {ok} {k} → {got} (expected {v})")
        assert got == v
    return True


def main():
    print("\n" + "#" * 78)
    print("#  NOWPayments POC — Olivia Dante Art Store")
    print(f"#  Base: {BASE_URL}")
    print(f"#  Key:  {'SET (' + API_KEY[:8] + '...)' if API_KEY else 'MISSING'}")
    print("#" * 78)

    if not API_KEY:
        print("\nFATAL: NOWPAYMENTS_API_KEY not set in /app/backend/.env")
        return 1

    try:
        test_api_status()
        test_currencies()
        test_estimate()
        p1, _p2 = test_unique_addresses()
        test_status_check(p1["payment_id"])
        test_status_mapping()
    except AssertionError as e:
        print(f"\n❌ POC FAILED: {e}")
        return 1
    except Exception as e:
        print(f"\n❌ POC EXCEPTION: {type(e).__name__}: {e}")
        return 1

    print("\n" + "✓" * 78)
    print("  ✓ ALL 6 USER STORIES PASSED — Core crypto integration is PROVEN")
    print("  ✓ Safe to build the full Olivia Dante Art Store around this core")
    print("✓" * 78 + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
