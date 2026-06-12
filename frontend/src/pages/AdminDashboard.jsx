import React, { useEffect, useState } from 'react';
import { api, formatUSD } from '../lib/api';
import { TrendingUp, ShoppingCart, Users, Package, Clock, CheckCircle2 } from 'lucide-react';

const Kpi = ({ icon: Icon, label, value }) => (
  <div className="rounded-[var(--radius)] bg-card border border-border p-4">
    <div className="flex items-center justify-between">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="mt-2 text-2xl font-semibold">{value}</div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => { api.get('/admin/stats').then((r) => setStats(r.data)); }, []);

  if (!stats) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of store performance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi icon={TrendingUp} label="Revenue" value={formatUSD(stats.revenue)} />
        <Kpi icon={ShoppingCart} label="Total orders" value={stats.total_orders} />
        <Kpi icon={CheckCircle2} label="Paid" value={stats.paid_orders} />
        <Kpi icon={Clock} label="Pending" value={stats.pending_orders} />
        <Kpi icon={Users} label="Customers" value={stats.customers} />
        <Kpi icon={Package} label="Products" value={stats.products} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-[var(--radius)] bg-card border border-border p-5">
          <div className="font-heading text-xl mb-3">Top selling</div>
          {stats.top_products.length === 0 ? (
            <div className="text-sm text-muted-foreground">No paid orders yet.</div>
          ) : (
            <div className="space-y-3">
              {stats.top_products.map((p) => (
                <div key={p._id} className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="h-12 w-12 rounded-md object-cover bg-secondary" />
                  <div className="flex-1">
                    <div className="text-sm font-medium leading-snug line-clamp-1">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.qty} sold</div>
                  </div>
                  <div className="text-sm font-semibold">{formatUSD(p.revenue)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[var(--radius)] bg-card border border-border p-5">
          <div className="font-heading text-xl mb-3">Recent orders</div>
          {stats.recent_orders.length === 0 ? (
            <div className="text-sm text-muted-foreground">No orders yet.</div>
          ) : (
            <div className="divide-y divide-border">
              {stats.recent_orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <div className="font-mono">{o.order_number}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                  </div>
                  <div className="text-right">
                    <div>{formatUSD(o.total_amount)}</div>
                    <div className="text-xs text-muted-foreground capitalize">{o.status.replace(/_/g, ' ')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
