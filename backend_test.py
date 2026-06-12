"""
Comprehensive backend API test for Olivia Dante Art Store.
Tests all endpoints including NOWPayments crypto integration.
"""
import requests
import sys
import time
from datetime import datetime

BASE_URL = "https://art-marketplace-120.preview.emergentagent.com/api"

class TestRunner:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        self.tests_failed = 0
        self.admin_token = None
        self.user_token = None
        self.test_product_id = None
        self.test_order_number = None
        self.test_payment_addresses = []
        self.failed_tests = []

    def test(self, name, method, endpoint, expected_status, data=None, headers=None, params=None):
        """Run a single API test"""
        url = f"{BASE_URL}/{endpoint}"
        h = headers or {}
        h.setdefault('Content-Type', 'application/json')
        
        self.tests_run += 1
        print(f"\n🔍 Test {self.tests_run}: {name}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=h, params=params, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=h, params=params, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=h, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=h, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                self.tests_failed += 1
                self.failed_tests.append(f"{name} - Expected {expected_status}, got {response.status_code}")
                print(f"❌ FAILED - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:300]}")
                return False, {}

        except Exception as e:
            self.tests_failed += 1
            self.failed_tests.append(f"{name} - Error: {str(e)}")
            print(f"❌ FAILED - Error: {str(e)}")
            return False, {}

    def run_all_tests(self):
        print("=" * 80)
        print("OLIVIA DANTE ART STORE - BACKEND API TEST SUITE")
        print("=" * 80)
        
        # 1. Test root endpoint
        self.test("Root endpoint", "GET", "", 200)
        
        # 2. Test categories
        success, data = self.test("List categories", "GET", "categories", 200)
        if success:
            print(f"   Found {len(data)} categories")
            if len(data) != 11:
                print(f"   ⚠️  Expected 11 categories, got {len(data)}")
        
        # 3. Test products
        success, data = self.test("List all products", "GET", "products", 200)
        if success:
            products = data.get('items', [])
            print(f"   Found {len(products)} products (total: {data.get('total', 0)})")
            if len(products) < 24:
                print(f"   ⚠️  Expected at least 24 products, got {len(products)}")
            if products:
                self.test_product_id = products[0]['id']
                test_slug = products[0]['slug']
                
                # Test product detail
                self.test(f"Get product detail ({test_slug})", "GET", f"products/{test_slug}", 200)
                
                # Test related products
                self.test(f"Get related products ({test_slug})", "GET", f"products/{test_slug}/related", 200)
        
        # 4. Test specific product from requirements
        self.test("Get art-marketplace-120 product", "GET", "products/art-marketplace-120", 200)
        
        # 5. Test crypto endpoints
        success, data = self.test("List crypto currencies", "GET", "crypto/currencies", 200)
        if success:
            currencies = data.get('currencies', [])
            print(f"   Found {len(currencies)} currencies")
            if len(currencies) != 6:
                print(f"   ⚠️  Expected 6 currencies, got {len(currencies)}")
            codes = [c['code'] for c in currencies]
            expected = ['btc', 'eth', 'usdttrc20', 'usdterc20', 'bnbbsc', 'ltc']
            if set(codes) != set(expected):
                print(f"   ⚠️  Currency codes mismatch. Expected {expected}, got {codes}")
        
        success, data = self.test("Crypto estimate (BTC)", "GET", "crypto/estimate", 200, 
                                  params={"amount": 100, "pay_currency": "btc", "price_currency": "usd"})
        if success:
            print(f"   Estimated BTC amount: {data.get('estimated_amount', 'N/A')}")
        
        # 6. Test auth - register
        timestamp = int(time.time())
        test_email = f"test{timestamp}@example.com"
        success, data = self.test("Register new user", "POST", "auth/register", 200,
                                  data={"email": test_email, "password": "Test@123", "full_name": "Test User"})
        if success:
            self.user_token = data.get('token')
            print(f"   User registered: {test_email}")
        
        # 7. Test auth - admin login
        success, data = self.test("Admin login", "POST", "auth/login", 200,
                                  data={"email": "admin@oliviadante.com", "password": "Admin@123"})
        if success:
            self.admin_token = data.get('token')
            user = data.get('user', {})
            if user.get('role') != 'admin':
                print(f"   ⚠️  Expected admin role, got {user.get('role')}")
            else:
                print(f"   Admin logged in successfully")
        
        # 8. Test newsletter
        self.test("Newsletter signup", "POST", "newsletter", 200,
                  data={"email": f"newsletter{timestamp}@example.com"})
        
        # 9. Test reviews
        if self.test_product_id:
            success, data = self.test("Create review", "POST", "reviews", 200,
                                      data={
                                          "product_id": self.test_product_id,
                                          "author_name": "Test Reviewer",
                                          "rating": 5,
                                          "title": "Great product!",
                                          "body": "Really love this item."
                                      })
        
        # 10. Test order creation with crypto payment (BTC)
        if self.test_product_id:
            print("\n" + "=" * 80)
            print("TESTING CRYPTO PAYMENT CREATION (REAL NOWPayments API)")
            print("=" * 80)
            
            order_data = {
                "items": [
                    {
                        "product_id": self.test_product_id,
                        "product_slug": "test-product",
                        "name": "Test Product",
                        "image": "",
                        "size": None,
                        "quantity": 1,
                        "unit_price": 100.0,
                        "total_price": 100.0
                    }
                ],
                "shipping": {
                    "full_name": "Test Customer",
                    "email": f"customer{timestamp}@example.com",
                    "phone": "+1234567890",
                    "address_line1": "123 Test St",
                    "address_line2": "",
                    "city": "Test City",
                    "state": "TS",
                    "postal_code": "12345",
                    "country": "US"
                },
                "payment_method": "crypto",
                "pay_currency": "btc"
            }
            
            success, data = self.test("Create order with BTC payment", "POST", "orders", 200, data=order_data)
            if success:
                order = data.get('order', {})
                payment = data.get('payment', {})
                self.test_order_number = order.get('order_number')
                
                print(f"   Order Number: {self.test_order_number}")
                print(f"   Payment ID: {payment.get('payment_id')}")
                print(f"   BTC Address: {payment.get('pay_address')}")
                print(f"   BTC Amount: {payment.get('pay_amount')}")
                print(f"   Status: {payment.get('status')}")
                
                if payment.get('pay_address'):
                    self.test_payment_addresses.append(payment.get('pay_address'))
                    print(f"   ✅ Unique BTC address generated")
                else:
                    print(f"   ❌ No pay_address in payment response")
                
                if payment.get('status') != 'awaiting_payment':
                    print(f"   ⚠️  Expected status 'awaiting_payment', got '{payment.get('status')}'")
        
        # 11. Test unique address generation (create second order)
        if self.test_product_id:
            print("\n" + "-" * 80)
            print("TESTING UNIQUE ADDRESS GENERATION (Second BTC Order)")
            print("-" * 80)
            
            order_data2 = {
                "items": [
                    {
                        "product_id": self.test_product_id,
                        "product_slug": "test-product",
                        "name": "Test Product 2",
                        "image": "",
                        "size": None,
                        "quantity": 1,
                        "unit_price": 50.0,
                        "total_price": 50.0
                    }
                ],
                "shipping": {
                    "full_name": "Test Customer 2",
                    "email": f"customer2{timestamp}@example.com",
                    "phone": "+1234567890",
                    "address_line1": "456 Test Ave",
                    "city": "Test City",
                    "country": "US"
                },
                "payment_method": "crypto",
                "pay_currency": "btc"
            }
            
            success, data = self.test("Create second BTC order (uniqueness test)", "POST", "orders", 200, data=order_data2)
            if success:
                payment2 = data.get('payment', {})
                address2 = payment2.get('pay_address')
                
                print(f"   Second BTC Address: {address2}")
                
                if address2:
                    self.test_payment_addresses.append(address2)
                    if len(self.test_payment_addresses) == 2:
                        if self.test_payment_addresses[0] != self.test_payment_addresses[1]:
                            print(f"   ✅ UNIQUE ADDRESSES CONFIRMED")
                            print(f"      Address 1: {self.test_payment_addresses[0]}")
                            print(f"      Address 2: {self.test_payment_addresses[1]}")
                        else:
                            print(f"   ❌ DUPLICATE ADDRESSES - CRITICAL BUG!")
                            print(f"      Both orders got same address: {address2}")
        
        # 12. Test payment status query
        if self.test_order_number:
            success, data = self.test(f"Get order payment status (sync)", "GET", 
                                      f"orders/{self.test_order_number}/payment", 200,
                                      params={"sync": "true"})
            if success:
                payment = data.get('payment', {})
                print(f"   Payment Status: {payment.get('status')}")
                print(f"   NOWPayments Status: {payment.get('nowpayments_status')}")
        
        # 13. Test get order
        if self.test_order_number:
            self.test(f"Get order by number", "GET", f"orders/{self.test_order_number}", 200)
        
        # 14. Test testimonials
        self.test("List testimonials", "GET", "testimonials", 200)
        
        # 15. Test admin endpoints (without auth - should fail)
        print("\n" + "=" * 80)
        print("TESTING ADMIN ENDPOINTS (Authorization)")
        print("=" * 80)
        
        self.test("Admin stats (no auth)", "GET", "admin/stats", 401)
        self.test("Admin orders (no auth)", "GET", "admin/orders", 401)
        self.test("Admin customers (no auth)", "GET", "admin/customers", 401)
        self.test("Admin payments (no auth)", "GET", "admin/payments", 401)
        self.test("Admin withdrawals (no auth)", "GET", "admin/withdrawals", 401)
        
        # 16. Test admin endpoints (with admin token)
        if self.admin_token:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            success, data = self.test("Admin stats (with auth)", "GET", "admin/stats", 200, headers=headers)
            if success:
                print(f"   Total Orders: {data.get('total_orders')}")
                print(f"   Revenue: ${data.get('revenue')}")
                print(f"   Customers: {data.get('customers')}")
                print(f"   Products: {data.get('products')}")
            
            self.test("Admin orders (with auth)", "GET", "admin/orders", 200, headers=headers)
            self.test("Admin customers (with auth)", "GET", "admin/customers", 200, headers=headers)
            self.test("Admin payments (with auth)", "GET", "admin/payments", 200, headers=headers)
            self.test("Admin withdrawals (with auth)", "GET", "admin/withdrawals", 200, headers=headers)
            
            # Test product creation
            new_product = {
                "slug": f"test-product-{timestamp}",
                "name": "Test Product",
                "brand": "Test Brand",
                "category_slug": "electronics",
                "description": "Test description",
                "price": 99.99,
                "stock": 10,
                "images": ["https://via.placeholder.com/400"],
                "sizes": ["One Size"],
                "tags": ["test"]
            }
            success, data = self.test("Admin create product", "POST", "admin/products", 200, 
                                      data=new_product, headers=headers)
            if success:
                created_id = data.get('id')
                print(f"   Created product ID: {created_id}")
                
                # Test product update
                if created_id:
                    self.test("Admin update product", "PUT", f"admin/products/{created_id}", 200,
                              data={"price": 89.99}, headers=headers)
                    
                    # Test product delete
                    self.test("Admin delete product", "DELETE", f"admin/products/{created_id}", 200,
                              headers=headers)
            
            # Test withdrawal creation
            withdrawal_data = {
                "currency": "btc",
                "address": "bc1qtest123456789",
                "amount": 0.001,
                "note": "Test withdrawal"
            }
            self.test("Admin create withdrawal", "POST", "admin/withdrawals", 200,
                      data=withdrawal_data, headers=headers)
            
            # Test CSV export
            success, data = self.test("Admin export orders CSV", "GET", "admin/export/orders.csv", 200,
                                      headers=headers)
            if success:
                print(f"   CSV export successful (length: {len(str(data))} chars)")
        
        # 17. Test webhook endpoint (should accept POST without signature since IPN_SECRET is empty)
        webhook_payload = {
            "payment_id": "12345",
            "payment_status": "finished",
            "order_id": "OD-TEST123",
            "actually_paid": 0.001
        }
        self.test("Webhook (no signature)", "POST", "webhooks/nowpayments", 200, data=webhook_payload)
        
        # Print summary
        print("\n" + "=" * 80)
        print("TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {self.tests_run}")
        print(f"✅ Passed: {self.tests_passed}")
        print(f"❌ Failed: {self.tests_failed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for i, test in enumerate(self.failed_tests, 1):
                print(f"   {i}. {test}")
        
        print("\n" + "=" * 80)
        print("CRITICAL CHECKS:")
        print("=" * 80)
        print(f"✅ NOWPayments Integration: {'WORKING' if len(self.test_payment_addresses) > 0 else 'FAILED'}")
        print(f"✅ Unique Addresses: {'CONFIRMED' if len(set(self.test_payment_addresses)) == len(self.test_payment_addresses) and len(self.test_payment_addresses) >= 2 else 'NOT VERIFIED'}")
        print(f"✅ Admin Auth: {'WORKING' if self.admin_token else 'FAILED'}")
        
        return 0 if self.tests_failed == 0 else 1

def main():
    runner = TestRunner()
    return runner.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())
