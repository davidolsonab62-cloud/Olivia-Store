import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { api, formatUSD, formatCrypto } from '../lib/api';
import { Coins, CreditCard, ChevronRight, Check } from 'lucide-react';
import { toast } from 'sonner';

const STEPS = ['Cart', 'Details', 'Payment'];

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(items.length === 0 ? 0 : 1);
  const [currencies, setCurrencies] = useState([]);
  const [shipping, setShipping] = useState({ full_name: '', email: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: '' });
  const [method, setMethod] = useState('crypto');
  const [payCurrency, setPayCurrency] = useState('btc');
  const [estimate, setEstimate] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { api.get('/crypto/currencies').then((r) => setCurrencies(r.data.currencies)); }, []);

  useEffect(() => {
    if (method !== 'crypto' || !payCurrency || subtotal <= 0) { setEstimate(null); return; }
    api.get(`/crypto/estimate?amount=${subtotal}&pay_currency=${payCurrency}`).then((r) => setEstimate(r.data)).catch(() => setEstimate(null));
  }, [payCurrency, method, subtotal]);

  const total = useMemo(() => subtotal, [subtotal]);

  const orderItems = items.map((i) => ({
    product_id: i.product_id,
    product_slug: i.product_slug,
    name: i.name,
    image: i.image,
    size: i.size,
    quantity: i.quantity,
    unit_price: i.unit_price,
    total_price: i.unit_price * i.quantity,
  }));

  const placeOrder = async () => {
    setSubmitting(true);
    try {
      const payload = { items: orderItems, shipping, payment_method: method };
      if (method === 'crypto') payload.pay_currency = payCurrency;
      const r = await api.post('/orders', payload);
      const orderNumber = r.data.order.order_number;
      clear();
      if (method === 'crypto') navigate(`/pay/${orderNumber}`);
      else navigate(`/orders/${orderNumber}`);
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Could not place order');
    } finally { setSubmitting(false); }
  };

  if (items.length === 0 && step === 0) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-3xl mb-3">Your cart is empty</h1>
        <button onClick={() => navigate('/shop')} className="h-11 px-6 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium">Shop the maison</button>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stepper */}
      <div className="flex items-center justify-between gap-2 mb-8" data-testid="checkout-stepper">
        {STEPS.map((label, idx) => (
          <React.Fragment key={label}>
            <div className={`flex items-center gap-2 ${idx <= step ? '' : 'opacity-50'}`}>
              <div className={`h-8 w-8 rounded-full inline-flex items-center justify-center text-sm font-semibold border ${idx < step ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] border-transparent' : idx === step ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-transparent' : 'border-border'}`}>
                {idx < step ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <div className="text-sm font-medium uppercase tracking-[0.18em]">{label}</div>
            </div>
            {idx < STEPS.length - 1 && <div className="flex-1 h-px bg-border" />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {step === 1 && (
            <div className="rounded-[var(--radius)] bg-card border border-border p-5">
              <div className="font-heading text-2xl mb-4">Shipping details</div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input data-testid="checkout-full-name" required placeholder="Full name" value={shipping.full_name} onChange={(e) => setShipping({ ...shipping, full_name: e.target.value })} className="px-3 py-2 rounded-md bg-background border border-input outline-none" />
                <input data-testid="checkout-email" required type="email" placeholder="Email" value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} className="px-3 py-2 rounded-md bg-background border border-input outline-none" />
                <input data-testid="checkout-phone" placeholder="Phone" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} className="px-3 py-2 rounded-md bg-background border border-input outline-none sm:col-span-2" />
                <input data-testid="checkout-address1" required placeholder="Street address" value={shipping.address_line1} onChange={(e) => setShipping({ ...shipping, address_line1: e.target.value })} className="px-3 py-2 rounded-md bg-background border border-input outline-none sm:col-span-2" />
                <input placeholder="Apartment, suite (optional)" value={shipping.address_line2} onChange={(e) => setShipping({ ...shipping, address_line2: e.target.value })} className="px-3 py-2 rounded-md bg-background border border-input outline-none sm:col-span-2" />
                <input data-testid="checkout-city" required placeholder="City" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className="px-3 py-2 rounded-md bg-background border border-input outline-none" />
                <input placeholder="State / Province" value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} className="px-3 py-2 rounded-md bg-background border border-input outline-none" />
                <input placeholder="Postal code" value={shipping.postal_code} onChange={(e) => setShipping({ ...shipping, postal_code: e.target.value })} className="px-3 py-2 rounded-md bg-background border border-input outline-none" />
                <input data-testid="checkout-country" required placeholder="Country" value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} className="px-3 py-2 rounded-md bg-background border border-input outline-none" />
              </div>
              <div className="mt-4 flex justify-end">
                <button data-testid="checkout-continue-payment" onClick={() => {
                  if (!shipping.full_name || !shipping.email || !shipping.address_line1 || !shipping.city || !shipping.country) {
                    toast.error('Please fill in required fields'); return;
                  }
                  setStep(2);
                }} className="h-11 px-5 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium inline-flex items-center gap-2">
                  Continue to payment <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-[var(--radius)] bg-card border border-border p-5">
              <div className="font-heading text-2xl mb-4">Payment method</div>
              <div className="grid sm:grid-cols-2 gap-3">
                <button data-testid="checkout-payment-method-crypto" onClick={() => setMethod('crypto')} className={`rounded-md border p-4 text-left ${method === 'crypto' ? 'border-[hsl(var(--accent))] ring-2 ring-[hsl(var(--accent))]' : 'border-border'}`}>
                  <div className="flex items-center gap-2 font-semibold"><Coins className="h-5 w-5" />Cryptocurrency</div>
                  <p className="text-xs text-muted-foreground mt-1">Unique address per order. BTC, ETH, USDT, BNB, LTC.</p>
                </button>
                <button data-testid="checkout-payment-method-paypal" onClick={() => setMethod('paypal')} className={`rounded-md border p-4 text-left ${method === 'paypal' ? 'border-[hsl(var(--accent))] ring-2 ring-[hsl(var(--accent))]' : 'border-border'}`}>
                  <div className="flex items-center gap-2 font-semibold"><CreditCard className="h-5 w-5" />PayPal / Google Pay</div>
                  <p className="text-xs text-muted-foreground mt-1">Pay in fiat. Converted to crypto by admin.</p>
                </button>
              </div>

              {method === 'crypto' && (
                <div className="mt-5">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Choose currency</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {currencies.map((c) => (
                      <button key={c.code} data-testid={`pay-currency-${c.code}`} onClick={() => setPayCurrency(c.code)} className={`px-3 py-3 rounded-md border text-left text-sm ${payCurrency === c.code ? 'border-[hsl(var(--accent))] bg-secondary' : 'border-border hover:bg-secondary'}`}>
                        <div className="font-semibold">{c.label}</div>
                        <div className="text-xs text-muted-foreground">{c.network}</div>
                      </button>
                    ))}
                  </div>
                  {estimate && (
                    <div className="mt-4 rounded-md bg-secondary p-3 text-sm flex items-center justify-between">
                      <span className="text-muted-foreground">You'll pay</span>
                      <span className="font-mono font-semibold">{formatCrypto(estimate.estimated_amount, payCurrency)}</span>
                    </div>
                  )}
                </div>
              )}

              {method === 'paypal' && (
                <div className="mt-5 rounded-md bg-secondary p-4 text-sm">
                  <p className="text-muted-foreground">PayPal Checkout will activate once Client ID / Secret are added in <code>/app/backend/.env</code>. Your order will be recorded; admin can manually mark as paid.</p>
                </div>
              )}

              <div className="mt-5 flex items-center justify-between">
                <button onClick={() => setStep(1)} className="h-11 px-5 rounded-md border border-border">Back</button>
                <button data-testid="checkout-place-order" onClick={placeOrder} disabled={submitting || (method === 'crypto' && !payCurrency)} className="h-11 px-5 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium disabled:opacity-50">{submitting ? 'Creating order...' : 'Place order'}</button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-[var(--radius)] bg-card border border-border p-5 lg:sticky lg:top-20">
            <div className="font-heading text-xl mb-3">Order summary</div>
            <div className="space-y-3 max-h-[320px] overflow-y-auto">
              {items.map((it) => (
                <div key={it.key} className="flex gap-3 text-sm">
                  <img src={it.image} alt={it.name} className="h-14 w-14 rounded-md object-cover bg-secondary" />
                  <div className="flex-1">
                    <div className="font-medium leading-snug line-clamp-2">{it.name}</div>
                    <div className="text-xs text-muted-foreground">{it.size ? `${it.size} · ` : ''}Qty {it.quantity}</div>
                  </div>
                  <div className="font-semibold">{formatUSD(it.unit_price * it.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-4 pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatUSD(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>Free</span></div>
              <div className="flex justify-between text-base font-semibold mt-2"><span>Total</span><span>{formatUSD(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
