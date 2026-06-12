# plan.md — Olivia Dante Art Store

## 1) Objectives
- Deliver a premium, mobile-first e-commerce MVP for **Olivia Dante Art Store** with catalog → cart → checkout.
- Prove the **core workflow** works first: **NOWPayments** creates a payment and returns a **unique deposit address per order**, and order/payment status can be tracked to completion.
- Build V1 app around the proven crypto flow; add PayPal Checkout as a **stub** that activates when keys are provided.
- Provide admin dashboard for product/order/payment management and basic analytics.

## 2) Implementation Steps

### Phase 1 — Core POC: NOWPayments integration (isolation, must pass before app build)
**User stories (POC UX)**
1. As a developer, I want to fetch supported currencies so I can validate required coins are available.
2. As a developer, I want to create a $50 BTC payment so I can validate payment creation works.
3. As a developer, I want to see the returned deposit address and confirm it is unique per new order.
4. As a developer, I want to query payment status repeatedly so I can confirm state transitions are readable.
5. As a developer, I want a minimal webhook handler signature plan so I can reliably update order state in real-time later.

**Steps**
- Websearch: NOWPayments best practices (payment creation params, IPN/webhooks, required headers, sandbox vs prod, confirmation handling, expiry).
- Create `test_core.py` (sandbox-ready) that:
  - Loads `NOWPAYMENTS_API_KEY` from env.
  - Calls: list available currencies.
  - Creates a payment: price_amount=50, price_currency=USD, pay_currency=BTC.
  - Prints: payment_id, pay_address, pay_amount, expiration/time_limit (if provided).
  - Creates a second payment with same params and verifies **pay_address differs**.
  - Polls status endpoints for both payments (prints status + timestamps).
- Define mapping from NOWPayments statuses → store statuses:
  - Awaiting Payment / Payment Detected / Confirming / Paid / Expired.
- POC exit gate: do not proceed until POC consistently returns unique addresses and status endpoint works without undocumented errors.

**Deliverables**
- `test_core.py` runnable locally with sandbox key.
- A short integration note: endpoints used, required headers, webhook verification approach, recommended polling cadence as fallback.

---

### Phase 2 — V1 App Development (MVP, build around proven crypto flow; defer auth hardening)
**User stories (shopper + admin)**
1. As a shopper, I want to browse a premium homepage (featured/best/new/categories) so I can discover products quickly.
2. As a shopper, I want to search/filter and view product cards (sizes/stock/rating) so I can compare items.
3. As a shopper, I want a product detail page with images/specs/reviews so I can decide confidently.
4. As a shopper, I want a 3-step checkout and crypto payment page with QR/timer/status so I can pay correctly.
5. As an admin, I want to add/edit/delete products and manage inventory so the store stays up to date.

**Backend (FastAPI + MongoDB)**
- Data models/collections: users, products, categories, orders, payments/transactions, reviews, inventory.
- Public APIs (no auth required initially except admin endpoints):
  - Products: list/search/filter, detail, related.
  - Categories: list.
  - Cart: server-side optional (or client-side + order draft).
  - Orders: create order draft, attach customer/shipping, create NOWPayments payment, get payment session.
  - Payments: webhook endpoint (IPN) + polling endpoint to refresh status.
- Admin APIs (simple seeded admin JWT to start):
  - CRUD products/categories, upload images, inventory adjustments.
  - Orders/payments list + export CSV.
  - Record/manual “withdrawal” action (MVP: record destination + tx metadata; later automate payout API).

**Crypto flow (core)**
- On “Place Order” (crypto):
  - Create Order (status=Awaiting Payment).
  - Call NOWPayments create payment; store payment_id, address, amounts, expiry.
  - Render payment page: address, QR, amount due, countdown, live status.
- Status updates:
  - Primary: NOWPayments webhook → update payment + order.
  - Fallback: client polls backend `/payments/{orderId}/status`.

**Frontend (React + Tailwind)**
- Pages: Home, Catalog, Product Detail, Cart, Checkout (3-step), Payment Status, Order Tracking, Admin Dashboard.
- Components: premium header/nav, hero, product card grid, image gallery, size selector, cart drawer, checkout stepper, status pill, dark/light toggle.
- Seed catalog: sample products across requested categories + placeholder/AI images.

**End of phase testing (1 full E2E pass)**
- Run: browse → add to cart → checkout → create crypto payment → payment page shows address/QR/timer → status refresh (polling) works.
- Admin: login with seeded creds → create/edit product → inventory changes reflect in catalog.

---

### Phase 3 — Feature Expansion (stabilize + add secondary flows)
**User stories**
1. As a user, I want to register/login so I can manage my orders and addresses.
2. As a user, I want password reset via email token so I can regain access.
3. As a user, I want wishlist/favorites so I can save items for later.
4. As an admin, I want dashboard analytics so I can understand sales performance.
5. As an admin, I want reports export (CSV) so I can do accounting and reconciliation.

**Scope**
- Full user accounts: JWT auth, bcrypt, reset-token email flow.
- Saved addresses, order history, order tracking UI.
- Reviews: authenticated create + public read.
- Admin analytics widgets (sales/orders/revenue/most-sold).
- PayPal Checkout stub UI + backend config flags; activate when keys are present.

**End of phase testing (1 full E2E pass)**
- Multi-user: register → order → view history; admin views matching order/payment.

---

### Phase 4 — Production hardening (security + ops)
**User stories**
1. As an operator, I want rate limiting so the API is resilient to abuse.
2. As a user, I want secure sessions so my account and payments are protected.
3. As an admin, I want safer admin access controls so only authorized users manage the store.
4. As a developer, I want monitoring/logging so incidents are diagnosable.
5. As a business owner, I want reliable deployments so downtime is minimized.

**Scope**
- Security: strict input validation (pydantic), CORS, secure headers, XSS-safe rendering, webhook signature verification, JWT refresh strategy.
- Background jobs: reconcile/poll stuck payments; expire unpaid orders.
- Deployment: frontend on Vercel; backend on Railway/VPS; env management; HTTPS.

**End of phase testing (1 full E2E pass)**
- Regression on checkout + webhook + admin + auth; verify rate limits and webhook verification.

## 3) Next Actions (immediate)
1. Obtain NOWPayments sandbox/prod API key; set `NOWPAYMENTS_API_KEY`.
2. Run Phase 1 websearch + implement `test_core.py` POC.
3. If POC passes, scaffold backend order/payment endpoints + webhook, then frontend checkout/payment page.

## 4) Success Criteria
- POC: can create 2 payments and confirm **distinct deposit addresses**, and status checks work reliably.
- V1: end-to-end shopping flow works (browse → cart → checkout → NOWPayments payment page with QR/timer/status).
- Admin: seeded admin can manage products/inventory and view orders/payments.
- Stability: webhook + polling keeps order statuses accurate; no broken critical paths on mobile.
