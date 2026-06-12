import React, { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, Users, Wallet, ArrowDownToLine, LogOut } from 'lucide-react';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/payments', label: 'Payments', icon: Wallet },
];

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/" state={{ from: location }} replace />;
  if (user.role !== 'admin') return <div className="max-w-[800px] mx-auto py-20 text-center">Admin access required.</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside data-testid="admin-sidebar" className="rounded-[var(--radius)] bg-card border border-border p-3 h-fit lg:sticky lg:top-20">
          <div className="px-3 py-2">
            <div className="font-heading text-xl">Olivia Dante</div>
            <div className="text-xs text-muted-foreground">Admin Console</div>
          </div>
          <nav className="mt-2 space-y-1">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${isActive ? 'bg-secondary font-semibold' : 'hover:bg-secondary'}`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </NavLink>
            ))}
            <button onClick={logout} className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary mt-2">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </nav>
          <Link to="/" className="block mt-4 text-xs text-muted-foreground px-3 py-2 hover:text-foreground">← Back to storefront</Link>
        </aside>
        <main className="min-h-[60vh]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
