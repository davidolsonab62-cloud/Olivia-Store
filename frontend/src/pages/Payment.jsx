import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Timer, AlertTriangle, Loader2, BadgeCheck } from 'lucide-react';
import { api, formatCrypto, formatUSD } from '../lib/api';
import { Progress } from '../components/ui/progress';
import { toast } from 'sonner';

const statusMeta = {
  awaiting_payment: { label: 'Awaiting Payment', className: 'bg-secondary text-foreground', pulse: true, icon: Timer },
  payment_detected: { label: 'Payment Detected', className: 'bg-[hsl(var(--info))] text-white', pulse: true, icon: Loader2 },
  confirming: { label: 'Confirming', className: 'bg-[hsl(var(--warning))] text-black', pulse: true, icon: Loader2 },
  paid: { label: 'Paid', className: 'bg-[hsl(var(--success))] text-white', pulse: false, icon: BadgeCheck },
  underpaid: { label: 'Underpaid', className: 'bg-[hsl(var(--warning))] text-black', pulse: false, icon: AlertTriangle },
  expired: { label: 'Expired', className: 'bg-muted text-muted-foreground border border-border', pulse: false, icon: AlertTriangle },
  failed: { label: 'Failed', className: 'bg-destructive text-destructive-foreground', pulse: false, icon: AlertTriangle },
  refunded: { label: 'Refunded', className: 'bg-muted text-muted-foreground border border-border', pulse: false, icon: BadgeCheck },
};

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [copied, setCopied] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [total, setTotal] = useState(0);
  const intervalRef = useRef(null);

  const fetchData = async (sync = false) => {
    try {
      const r = await api.get(`/orders/${orderId}/payment?sync=${sync ? 'true' : 'false'}`);
      setOrder(r.data.order);
      setPayment(r.data.payment);
      if (r.data.payment?.expiration_time) {
        const exp = new Date(r.data.payment.expiration_time).getTime();
        const now = Date.now();
        const created = new Date(r.data.payment.created_at).getTime();
        setTotal(Math.max(1, Math.round((exp - created) / 1000)));
        setSeconds(Math.max(0, Math.round((exp - now) / 1000)));
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchData(false);
    intervalRef.current = setInterval(() => fetchData(true), 10000);
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [orderId]);

  // Countdown
  useEffect(() => {
    if (!payment?.expiration_time) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [payment?.expiration_time]);

  if (!payment || !order) {
    return <div className="max-w-[800px] mx-auto px-4 py-20 text-center text-muted-foreground">Loading payment...</div>;
  }

  const meta = statusMeta[payment.status] || statusMeta.awaiting_payment;
  const Icon = meta.icon;
  const isTerminal = ['paid', 'expired', 'failed', 'refunded'].includes(payment.status);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = total ? Math.max(0, Math.min(100, (seconds / total) * 100)) : 0;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(payment.pay_address);
      setCopied(true); toast.success('Address copied');
      setTimeout(() => setCopied(false), 1800);
    } catch { toast.error('Could not copy'); }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Order {order.order_number}</div>
        <h1 className="font-heading text-3xl sm:text-4xl mt-1">Crypto payment</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-[var(--radius-lg)] bg-card border border-border p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div data-testid="payment-status-pill" className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${meta.className} ${meta.pulse ? 'animate-od-pulse' : ''}`}>
              <Icon className={`h-4 w-4 ${payment.status === 'confirming' || payment.status === 'payment_detected' ? 'animate-spin' : ''}`} />
              {meta.label}
            </div>
            {!isTerminal && (
              <div data-testid="payment-countdown-timer" className="text-sm font-mono">
                {minutes}m {String(secs).padStart(2, '0')}s remaining
              </div>
            )}
          </div>
          {!isTerminal && (
            <div className="mt-3">
              <Progress value={progress} />
            </div>
          )}

          {payment.status === 'paid' && (
            <div className="mt-4 rounded-md bg-[hsl(var(--success)/0.12)] border border-[hsl(var(--success)/0.4)] text-foreground p-4 text-sm">
              ✓ Payment confirmed on-chain. We're preparing your order for shipping.
            </div>
          )}
          {payment.status === 'expired' && (
            <div className="mt-4 rounded-md bg-secondary p-4 text-sm">
              This payment window expired. Please create a new order.
            </div>
          )}

          <div className="mt-6 grid sm:grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-md border border-border">
              <QRCodeSVG data-testid="payment-qr-code" value={payment.pay_address} size={200} bgColor="#ffffff" fgColor="#0a0a0a" includeMargin />
              <div className="text-xs text-muted-foreground mt-2">Scan to pay</div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Amount due</div>
                <div data-testid="payment-amount-due" className="font-mono text-2xl mt-1 break-all">{formatCrypto(payment.pay_amount, payment.pay_currency)}</div>
                <div className="text-sm text-muted-foreground">≈ {formatUSD(payment.price_amount)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Wallet address</div>
                <div className="mt-1 flex items-center gap-2">
                  <code data-testid="payment-wallet-address" className="font-mono text-sm break-all bg-secondary px-3 py-2 rounded-md flex-1">{payment.pay_address}</code>
                  <button data-testid="payment-copy-address-button" onClick={copy} className="h-10 w-10 inline-flex items-center justify-center rounded-md border border-border hover:bg-secondary" aria-label="Copy address">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Network</div>
                <div className="mt-1 text-sm font-medium uppercase">{payment.pay_currency}</div>
              </div>
            </div>
          </div>

          {/* Status tracker */}
          <div className="mt-8 grid grid-cols-4 gap-2 text-center">
            {['awaiting_payment', 'payment_detected', 'confirming', 'paid'].map((s, idx) => {
              const states = ['awaiting_payment', 'payment_detected', 'confirming', 'paid'];
              const cur = states.indexOf(payment.status);
              const reached = cur >= 0 && idx <= cur;
              return (
                <div key={s} className="flex flex-col items-center">
                  <div className={`h-2 w-full rounded-full ${reached ? 'bg-[hsl(var(--accent))]' : 'bg-border'}`} />
                  <div className="text-xs mt-2 capitalize">{statusMeta[s].label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-[var(--radius)] bg-card border border-border p-5">
            <div className="font-heading text-xl mb-3">Order</div>
            <div className="space-y-3">
              {order.items.map((it, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <img src={it.image} alt={it.name} className="h-12 w-12 rounded-md object-cover bg-secondary" />
                  <div className="flex-1">
                    <div className="font-medium leading-snug line-clamp-2">{it.name}</div>
                    <div className="text-xs text-muted-foreground">{it.size ? `${it.size} · ` : ''}Qty {it.quantity}</div>
                  </div>
                  <div className="text-sm font-semibold">{formatUSD(it.total_price)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-4 pt-3">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total (USD)</span><span className="font-semibold">{formatUSD(order.total_amount)}</span></div>
            </div>
          </div>
          <div className="rounded-[var(--radius)] bg-card border border-border p-5 text-sm">
            <div className="font-heading text-lg">Need help?</div>
            <p className="text-muted-foreground mt-2">Send the exact amount above to the unique address. Your order will confirm automatically after sufficient blockchain confirmations. Status refreshes every 10 seconds.</p>
            <button onClick={() => fetchData(true)} className="mt-3 h-9 px-3 rounded-md border border-border text-sm hover:bg-secondary">Refresh status</button>
            <button onClick={() => navigate(`/orders/${order.order_number}`)} className="ml-2 mt-3 h-9 px-3 rounded-md border border-border text-sm hover:bg-secondary">View order</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
