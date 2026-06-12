from dotenv import load_dotenv
from pathlib import Path
import os, requests, json

load_dotenv(Path("backend") / ".env")
API_KEY = os.environ.get("NOWPAYMENTS_API_KEY")
BASE_URL = os.environ.get("NOWPAYMENTS_BASE_URL", "https://api.nowpayments.io/v1").rstrip("/")
HEADERS = {"x-api-key": API_KEY, "Content-Type": "application/json", "Accept": "application/json"}

print("Using BASE_URL:", BASE_URL)
print("API_KEY present:", bool(API_KEY))

try:
    r = requests.get(f"{BASE_URL}/status", headers=HEADERS, timeout=15)
    print("/status ->", r.status_code)
    print(r.text[:500])
except Exception as e:
    print("/status error:", type(e).__name__, e)

try:
    r2 = requests.get(f"{BASE_URL}/currencies", headers=HEADERS, timeout=20)
    print("/currencies ->", r2.status_code)
    try:
        j = r2.json()
        print("JSON keys:", list(j.keys()))
        print(json.dumps(j, indent=2)[:2000])
    except Exception as e:
        print("/currencies json parse error:", type(e).__name__, e)
except Exception as e:
    print("/currencies error:", type(e).__name__, e)
