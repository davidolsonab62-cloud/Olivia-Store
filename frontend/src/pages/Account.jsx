import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatUSD } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const Account = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) return;
    api.get('/orders').then((r) => setOrders(r.data.items));
    if (user.favorites?.length) {
      Promise.all(user.favorites.map((id) => api.get(`/products?limit=1&q=${id}`).catch(() => null)));
    }
    // Simpler: fetch all and filter
    api.get('/products?limit=200').then((r) => {
      setFavorites(r.data.items.filter((p) => user.favorites?.includes(p.id)));
    });
  }, [user]);

  if (!user) return <div className="max-w-[800px] mx-auto py-20 text-center text-muted-foreground">Please sign in.</div>;

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Account</div>
      <h1 className="font-heading text-4xl mt-1">{user.full_name || user.email}</h1>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="rounded-[var(--radius)] bg-card border border-border p-5">
          <div className="font-heading text-2xl mb-3">Order history</div>
          {orders.length === 0 ? (
            <div className="text-sm text-muted-foreground">No orders yet. <Link to="/shop" className="text-[hsl(var(--accent))]">Start shopping →</Link></div>
          ) : (
            <div className="divide-y divide-border">
              {orders.map((o) => (
                <Link key={o.id} to={`/orders/${o.order_number}`} className="flex items-center justify-between py-3 hover:bg-secondary px-2 -mx-2 rounded-md">
                  <div>
                    <div className="font-mono text-sm">{o.order_number}</div>
                    <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()} · {o.items.length} item(s)</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatUSD(o.total_amount)}</div>
                    <div className="text-xs text-muted-foreground capitalize">{o.status.replace(/_/g, ' ')}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[var(--radius)] bg-card border border-border p-5">
          <div className="font-heading text-2xl mb-3">Saved items</div>
          {favorites.length === 0 ? (
            <div className="text-sm text-muted-foreground">No saved items yet.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {favorites.map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`} className="rounded-md border border-border overflow-hidden hover:shadow">
                  <div className="aspect-square bg-secondary"><img src={p.images?.[0]} alt={p.name} className="h-full w-full object-cover" /></div>
                  <div className="p-2">
                    <div className="text-xs text-muted-foreground">{p.brand}</div>
                    <div className="text-sm font-medium leading-snug line-clamp-2">{p.name}</div>
                    <div className="text-sm font-semibold mt-1">{formatUSD(p.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
