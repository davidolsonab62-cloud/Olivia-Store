import React, { useEffect, useState } from 'react';
import { api, formatUSD, BACKEND_URL } from '../lib/api';
import { Download } from 'lucide-react';

const statusBadge = (s) => {
  const map = {
    paid: 'bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]',
    pending_payment: 'bg-secondary',
    expired: 'bg-muted text-muted-foreground',
    cancelled: 'bg-muted text-muted-foreground',
    draft: 'bg-muted text-muted-foreground',
  };
  return map[s] || 'bg-secondary';
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');

  const load = () => {
    const qs = filter ? `?status_filter=${filter}` : '';
    api.get(`/admin/orders${qs}`).then((r) => setOrders(r.data.items));
  };
  useEffect(load, [filter]);

  const downloadCSV = async () => {
    const tok = localStorage.getItem('od_token');
    const r = await fetch(`${BACKEND_URL}/api/admin/export/orders.csv`, { headers: { Authorization: `Bearer ${tok}` } });
    const txt = await r.text();
    const blob = new Blob([txt], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'orders.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="font-heading text-3xl">Orders</h1>
        <div className="flex gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 rounded-md bg-background border border-input text-sm">
            <option value="">All statuses</option>
            <option value="pending_payment">Pending payment</option>
            <option value="paid">Paid</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button onClick={downloadCSV} className="h-10 px-3 rounded-md border border-border inline-flex items-center gap-2"><Download className="h-4 w-4" /> Export CSV</button>
        </div>
      </div>
      <div data-testid="admin-orders-table" className="rounded-[var(--radius)] bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr><th className="text-left p-3">Order</th><th className="text-left p-3">Customer</th><th className="text-left p-3">Method</th><th className="text-right p-3">Total</th><th className="text-left p-3">Status</th><th className="text-left p-3">Date</th></tr>
          </thead>
          <tbody>
            {orders.length === 0 && <tr><td colSpan="6" className="p-6 text-center text-muted-foreground">No orders</td></tr>}
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="p-3 font-mono text-xs">{o.order_number}</td>
                <td className="p-3">{o.customer_email}</td>
                <td className="p-3 capitalize">{o.payment_method}{o.pay_currency ? ` (${o.pay_currency.toUpperCase()})` : ''}</td>
                <td className="p-3 text-right">{formatUSD(o.total_amount)}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusBadge(o.status)}`}>{o.status.replace(/_/g, ' ')}</span></td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
