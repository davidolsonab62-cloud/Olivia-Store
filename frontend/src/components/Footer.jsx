import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Instagram, Twitter } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'sonner';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/newsletter', { email });
      toast.success("Subscribed! Welcome to the Olivia Dante list.");
      setEmail('');
    } catch {
      toast.error('Could not subscribe — please try again.');
    } finally { setLoading(false); }
  };

  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="font-heading text-2xl">Olivia Dante</div>
          <p className="text-sm text-muted-foreground mt-3 max-w-[28ch]">An online maison for objects that age beautifully — paid in fiat or in crypto.</p>
          <div className="mt-4 flex items-center gap-2">
            <a className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-secondary" href="#" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
            <a className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-secondary" href="#" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>
          </div>
        </div>
        <div>
          <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Shop</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-[hsl(var(--accent))]" to="/shop">All products</Link></li>
            <li><Link className="hover:text-[hsl(var(--accent))]" to="/shop/sneakers">Sneakers</Link></li>
            <li><Link className="hover:text-[hsl(var(--accent))]" to="/shop/watches">Watches</Link></li>
            <li><Link className="hover:text-[hsl(var(--accent))]" to="/shop/electronics">Electronics</Link></li>
            <li><Link className="hover:text-[hsl(var(--accent))]" to="/shop/art">Art</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Contact</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" />hello@oliviadante.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" />+1 (415) 555-0142</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" />2 Rue du Marais, Paris</li>
          </ul>
        </div>
        <div>
          <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Newsletter</div>
          <p className="text-sm text-muted-foreground mt-3">Quiet drops. No spam.</p>
          <form onSubmit={subscribe} className="mt-3 flex gap-2">
            <input data-testid="footer-newsletter-email" type="email" required placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 px-3 py-2 rounded-md bg-background border border-input text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
            <button data-testid="footer-newsletter-submit" disabled={loading} className="px-3 py-2 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium hover:opacity-90 disabled:opacity-60">{loading ? '...' : 'Join'}</button>
          </form>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Olivia Dante Art Store</div>
          <div className="flex items-center gap-4">
            <span>BTC · ETH · USDT · BNB · LTC</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
