import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, formatUSD } from '../lib/api';
import { BadgeCheck, Truck, Mail } from 'lucide-react';

const OrderTrack = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    api.get(`/orders/${orderId}`).then((r) => { setOrder(r.data.order); setPayment(r.data.payment); });
  }, [orderId]);

  if (!order) return <div className="max-w-[800px] mx-auto py-20 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Order {order.order_number}</div>
      <h1 className="font-heading text-4xl mt-1">Thank you</h1>
      <p className="text-muted-foreground mt-2">A confirmation has been emailed to {order.customer_email}.</p>

      <div className="mt-6 rounded-[var(--radius)] bg-card border border-border p-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Status</div>
            <div className="mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-secondary"><BadgeCheck className="h-4 w-4" />{order.status.replace(/_/g, ' ')}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Total</div>
            <div className="mt-1 text-lg font-semibold">{formatUSD(order.total_amount)}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Payment</div>
            <div className="mt-1 text-sm">{order.payment_method}{order.pay_currency ? ` · ${order.pay_currency.toUpperCase()}` : ''}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Shipping</div>
            <div className="mt-1 text-sm">{order.shipping.full_name}, {order.shipping.city}, {order.shipping.country}</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Items</div>
          <div className="mt-2 space-y-3">
            {order.items.map((it, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <img src={it.image} alt={it.name} className="h-14 w-14 rounded-md object-cover bg-secondary" />
                <div className="flex-1">
                  <div className="font-medium leading-snug">{it.name}</div>
                  <div className="text-xs text-muted-foreground">{it.size ? `${it.size} · ` : ''}Qty {it.quantity}</div>
                </div>
                <div className="font-semibold">{formatUSD(it.total_price)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {payment && order.payment_method === 'crypto' && order.status !== 'paid' && (
          <Link to={`/pay/${order.order_number}`} className="h-11 px-5 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium inline-flex items-center gap-2">Continue payment</Link>
        )}
        <Link to="/shop" className="h-11 px-5 rounded-md border border-border inline-flex items-center gap-2"><Truck className="h-4 w-4" />Keep shopping</Link>
        <a href={`mailto:hello@oliviadante.com?subject=Order%20${order.order_number}`} className="h-11 px-5 rounded-md border border-border inline-flex items-center gap-2"><Mail className="h-4 w-4" />Contact us</a>
      </div>
    </div>
  );
};

export default OrderTrack;
