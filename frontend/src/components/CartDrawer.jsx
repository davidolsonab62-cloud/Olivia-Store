import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { useCart } from '../contexts/CartContext';
import { formatUSD } from '../lib/api';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const CartDrawer = () => {
  const { open, setOpen, items, removeItem, updateQty, subtotal } = useCart();
  const navigate = useNavigate();

  const goCheckout = () => { setOpen(false); navigate('/checkout'); };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col" data-testid="cart-drawer">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl">Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {items.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>Your cart is empty</p>
              <Link onClick={() => setOpen(false)} to="/shop" className="text-[hsl(var(--accent))] text-sm font-medium mt-2 inline-block">Continue shopping →</Link>
            </div>
          )}
          {items.map((it) => (
            <div key={it.key} className="flex gap-3 p-3 rounded-md border border-border bg-card">
              <img src={it.image} alt={it.name} className="h-20 w-20 object-cover rounded-md bg-secondary" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">{it.brand}</div>
                <div className="font-medium leading-snug line-clamp-2">{it.name}</div>
                {it.size && <div className="text-xs text-muted-foreground mt-0.5">Size: {it.size}</div>}
                <div className="mt-2 flex items-center justify-between">
                  <div className="inline-flex items-center border border-border rounded-md">
                    <button onClick={() => updateQty(it.key, it.quantity - 1)} className="h-7 w-7 inline-flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                    <span className="w-8 text-center text-sm">{it.quantity}</span>
                    <button onClick={() => updateQty(it.key, it.quantity + 1)} className="h-7 w-7 inline-flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                  </div>
                  <div className="text-sm font-semibold">{formatUSD(it.unit_price * it.quantity)}</div>
                </div>
              </div>
              <button onClick={() => removeItem(it.key)} className="text-muted-foreground hover:text-destructive" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-lg">{formatUSD(subtotal)}</span>
            </div>
            <button data-testid="cart-drawer-checkout-button" onClick={goCheckout} className="w-full h-11 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium hover:opacity-90">Checkout</button>
            <p className="text-xs text-muted-foreground mt-2 text-center">Free shipping. Pay with crypto or PayPal.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
