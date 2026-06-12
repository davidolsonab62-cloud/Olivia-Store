import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

const AdminCustomers = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/admin/customers').then((r) => setItems(r.data.items)); }, []);
  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl">Customers</h1>
      <div className="rounded-[var(--radius)] bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary"><tr><th className="text-left p-3">Email</th><th className="text-left p-3">Name</th><th className="text-left p-3">Role</th><th className="text-left p-3">Joined</th></tr></thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.full_name || '—'}</td>
                <td className="p-3 capitalize"><span className="px-2 py-1 rounded-full text-xs bg-secondary">{u.role}</span></td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;
