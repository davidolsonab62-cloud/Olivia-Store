import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Moon, Sun, ShoppingBag, User, Search, Menu, LogOut, LayoutDashboard, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from './ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from './ui/dropdown-menu';
import AuthDialog from './AuthDialog';

const NAV = [
  { to: '/shop', label: 'Shop' },
  { to: '/shop/sneakers', label: 'Sneakers' },
  { to: '/shop/watches', label: 'Watches' },
  { to: '/shop/electronics', label: 'Electronics' },
  { to: '/shop/art', label: 'Art' },
  { to: '/shop/furniture', label: 'Furniture' },
];

const Header = () => {
  const { theme, toggle } = useTheme();
  const { count, setOpen } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [query, setQuery] = useState('');

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button data-testid="header-mobile-menu" className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-secondary">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader><SheetTitle className="font-heading text-2xl">Olivia Dante</SheetTitle></SheetHeader>
                <nav className="mt-6 flex flex-col gap-1">
                  {NAV.map((n) => (
                    <NavLink key={n.to} to={n.to} onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md hover:bg-secondary">
                      {n.label}
                    </NavLink>
                  ))}
                  <div className="border-t border-border my-3" />
                  <Link to="/account" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md hover:bg-secondary">My Account</Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md hover:bg-secondary">Admin Dashboard</Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
            <Link to="/" data-testid="header-logo" className="font-heading text-xl sm:text-2xl tracking-tight">
              Olivia Dante
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) => `px-3 py-2 text-sm rounded-md hover:bg-secondary ${isActive ? 'bg-secondary font-semibold' : ''}`}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <form onSubmit={submitSearch} className="hidden lg:flex items-center bg-secondary rounded-full px-3 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                data-testid="header-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="bg-transparent text-sm outline-none ml-2 w-40"
              />
            </form>
            <button data-testid="theme-toggle" onClick={toggle} className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-secondary" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button data-testid="header-account-button" className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-secondary">
                    <User className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/account')}><User className="mr-2 h-4 w-4" />My Account</DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}><LayoutDashboard className="mr-2 h-4 w-4" />Admin Dashboard</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} data-testid="header-logout"><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button data-testid="header-signin-button" onClick={() => setAuthOpen(true)} className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-secondary" aria-label="Sign in">
                <User className="h-5 w-5" />
              </button>
            )}
            <button data-testid="header-cart-button" onClick={() => setOpen(true)} className="h-9 px-3 inline-flex items-center justify-center rounded-full hover:bg-secondary relative">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="ml-2 inline-flex items-center justify-center text-xs font-semibold bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] rounded-full h-5 min-w-[20px] px-1.5">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
};

export default Header;
