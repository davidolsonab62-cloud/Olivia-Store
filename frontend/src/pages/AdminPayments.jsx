import React, { useEffect, useState } from 'react';
import { api, formatCrypto, formatUSD } from '../lib/api';

const AdminPayments = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/admin/payments').then((r) => setItems(r.data.items)); }, []);
  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl">Payments</h1>
      <div className="rounded-[var(--radius)] bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary"><tr><th className="text-left p-3">Payment ID</th><th className="text-left p-3">Order</th><th className="text-left p-3">Currency</th><th className="text-right p-3">Amount</th><th className="text-right p-3">USD</th><th className="text-left p-3">Status</th><th className="text-left p-3">Address</th></tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan="7" className="p-6 text-center text-muted-foreground">No payments yet</td></tr>}
            {items.map((p) => (
              <tr key={p.payment_id} className="border-t border-border">
                <td className="p-3 font-mono text-xs">{p.payment_id}</td>
                <td className="p-3 font-mono text-xs">{p.order_number}</td>
                <td className="p-3 uppercase">{p.pay_currency}</td>
                <td className="p-3 text-right font-mono">{formatCrypto(p.pay_amount, p.pay_currency)}</td>
                <td className="p-3 text-right">{formatUSD(p.price_amount)}</td>
                <td className="p-3 capitalize"><span className="px-2 py-1 rounded-full text-xs bg-secondary">{p.status.replace(/_/g, ' ')}</span></td>
                <td className="p-3 font-mono text-xs break-all max-w-[200px]">{p.pay_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;
