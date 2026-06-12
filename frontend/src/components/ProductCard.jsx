import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Zap, Heart } from 'lucide-react';
import { Badge } from './ui/badge';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatUSD } from '../lib/api';
import { toast } from 'sonner';

const ProductCard = ({ product }) => {
  const { addItem, setOpen } = useCart();
  const { user, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const isFav = user?.favorites?.includes(product.id);

  const onAdd = (e) => {
    e.preventDefault(); e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };
  const onBuy = (e) => {
    e.preventDefault(); e.stopPropagation();
    addItem(product);
    navigate('/checkout');
  };
  const onFav = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { toast.message('Sign in to save favorites'); return; }
    toggleFavorite(product.id);
  };

  const stockLow = product.stock > 0 && product.stock <= 5;
  const soldOut = product.stock === 0;

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }} data-testid="product-card">
      <Link to={`/product/${product.slug}`} className="group block rounded-[var(--radius)] bg-card border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
          <img src={product.images?.[0]} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_new && <Badge className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">New</Badge>}
            {product.is_best_seller && <Badge variant="secondary">Best Seller</Badge>}
            {stockLow && <Badge className="bg-[hsl(var(--warning))] text-black">Low stock</Badge>}
            {soldOut && <Badge variant="outline" className="opacity-80">Sold out</Badge>}
          </div>
          <button onClick={onFav} className="absolute top-2 right-2 h-8 w-8 inline-flex items-center justify-center rounded-full bg-card/95 hover:bg-card border border-border" aria-label="Favorite">
            <Heart className={`h-4 w-4 ${isFav ? 'fill-[hsl(var(--destructive))] text-[hsl(var(--destructive))]' : ''}`} />
          </button>
        </div>
        <div className="p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-[0.14em]">{product.brand}</div>
          <div className="font-medium leading-snug line-clamp-1 mt-1">{product.name}</div>
          <div className="mt-1 flex items-center justify-between">
            <div className="font-semibold">{formatUSD(product.price)}</div>
            <div className="text-xs text-muted-foreground">★ {product.rating?.toFixed?.(1) ?? product.rating} · {product.reviews_count || 0}</div>
          </div>
          {product.compare_at_price && (
            <div className="text-xs text-muted-foreground line-through">{formatUSD(product.compare_at_price)}</div>
          )}
          <div className="mt-3 flex items-center gap-2">
            <button onClick={onAdd} disabled={soldOut} data-testid="product-card-add-to-cart" className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm font-medium hover:bg-secondary disabled:opacity-50">
              <ShoppingBag className="h-4 w-4" /> Add
            </button>
            <button onClick={onBuy} disabled={soldOut} data-testid="product-card-buy-now" className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium hover:opacity-90 disabled:opacity-50">
              <Zap className="h-4 w-4" /> Buy now
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
