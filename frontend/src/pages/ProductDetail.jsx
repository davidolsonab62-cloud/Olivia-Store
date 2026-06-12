import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, formatUSD } from '../lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Minus, Plus, ShoppingBag, Zap, ShieldCheck, Truck, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user, toggleFavorite } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [revForm, setRevForm] = useState({ author_name: '', rating: 5, title: '', body: '' });

  useEffect(() => {
    setProduct(null);
    api.get(`/products/${slug}`).then((r) => {
      setProduct(r.data);
      setSize(r.data.sizes?.[0] || null);
      setImgIdx(0);
    });
    api.get(`/products/${slug}/related`).then((r) => setRelated(r.data.items));
    api.get(`/products/${slug}/reviews`).then((r) => setReviews(r.data.items));
  }, [slug]);

  const isFav = useMemo(() => product && user?.favorites?.includes(product.id), [product, user]);

  if (!product) return <div className="max-w-[1280px] mx-auto px-4 py-16 text-center text-muted-foreground">Loading...</div>;

  const onAdd = () => { addItem(product, { size, quantity: qty }); toast.success('Added to cart'); };
  const onBuy = () => { addItem(product, { size, quantity: qty }); navigate('/checkout'); };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', { product_id: product.id, ...revForm });
      const r = await api.get(`/products/${slug}/reviews`);
      setReviews(r.data.items);
      setRevForm({ author_name: '', rating: 5, title: '', body: '' });
      toast.success('Thanks for your review');
    } catch { toast.error('Could not post review'); }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <div className="aspect-[4/5] rounded-[var(--radius)] overflow-hidden bg-secondary border border-border">
            <img src={product.images?.[imgIdx]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {product.images?.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className={`relative h-20 w-20 rounded-md overflow-hidden border ${imgIdx === i ? 'border-[hsl(var(--accent))] ring-2 ring-[hsl(var(--accent))]' : 'border-border'}`}>
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Panel */}
        <div className="lg:col-span-5">
          <div className="rounded-[var(--radius)] bg-card border border-border shadow-sm p-5 lg:sticky lg:top-20">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{product.brand}</div>
            <h1 className="font-heading text-3xl sm:text-4xl mt-1">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <div className="text-2xl font-semibold">{formatUSD(product.price)}</div>
              {product.compare_at_price && (
                <div className="text-sm text-muted-foreground line-through">{formatUSD(product.compare_at_price)}</div>
              )}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">★ {product.rating?.toFixed?.(1)} · {product.reviews_count || 0} reviews · {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}</div>

            {product.sizes?.length > 0 && (
              <div className="mt-5">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Size / Option</div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button key={s} data-testid={`pdp-size-${s}`} onClick={() => setSize(s)} className={`px-3 py-1.5 rounded-full text-sm border ${size === s ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-transparent' : 'hover:bg-secondary'}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center gap-3">
              <div className="inline-flex items-center border border-border rounded-md">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-10 w-10 inline-flex items-center justify-center"><Minus className="h-4 w-4" /></button>
                <span data-testid="pdp-qty-input" className="w-10 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="h-10 w-10 inline-flex items-center justify-center"><Plus className="h-4 w-4" /></button>
              </div>
              <button data-testid="pdp-add-to-cart" onClick={onAdd} disabled={product.stock === 0} className="flex-1 h-11 px-4 rounded-md border border-border font-medium hover:bg-secondary inline-flex items-center justify-center gap-2 disabled:opacity-50">
                <ShoppingBag className="h-4 w-4" /> Add to cart
              </button>
            </div>
            <button data-testid="pdp-buy-now" onClick={onBuy} disabled={product.stock === 0} className="mt-2 w-full h-11 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium hover:opacity-90 inline-flex items-center justify-center gap-2 disabled:opacity-50">
              <Zap className="h-4 w-4" /> Buy now
            </button>
            {user && (
              <button onClick={() => toggleFavorite(product.id)} className="mt-2 w-full h-10 rounded-md border border-border inline-flex items-center justify-center gap-2 hover:bg-secondary">
                <Heart className={`h-4 w-4 ${isFav ? 'fill-[hsl(var(--destructive))] text-[hsl(var(--destructive))]' : ''}`} /> {isFav ? 'Saved' : 'Save'}
              </button>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Authenticity guaranteed</div>
              <div className="flex items-center gap-2"><Truck className="h-4 w-4" />Insured shipping 24–48h</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4 max-w-2xl text-sm leading-relaxed">{product.description}</TabsContent>
          <TabsContent value="specs" className="mt-4">
            <dl className="grid sm:grid-cols-2 gap-3 max-w-2xl">
              {Object.entries(product.specs || {}).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border py-2 text-sm">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium text-right">{String(v)}</dd>
                </div>
              ))}
            </dl>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4 grid lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              {reviews.length === 0 && <div className="text-sm text-muted-foreground">Be the first to write a review.</div>}
              {reviews.map((r) => (
                <div key={r.id} className="rounded-md bg-card border border-border p-4">
                  <div className="text-amber-500 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  <div className="font-medium mt-1">{r.title}</div>
                  <p className="text-sm text-muted-foreground mt-1">{r.body}</p>
                  <div className="mt-2 text-xs text-muted-foreground">{r.author_name}</div>
                </div>
              ))}
            </div>
            <form onSubmit={submitReview} className="rounded-md bg-card border border-border p-4 space-y-3 h-fit">
              <div className="font-medium">Write a review</div>
              <input required value={revForm.author_name} onChange={(e) => setRevForm({ ...revForm, author_name: e.target.value })} placeholder="Your name" className="w-full px-3 py-2 rounded-md bg-background border border-input outline-none" />
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Rating</label>
                <select value={revForm.rating} onChange={(e) => setRevForm({ ...revForm, rating: Number(e.target.value) })} className="px-2 py-1 rounded-md bg-background border border-input">
                  {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <input value={revForm.title} onChange={(e) => setRevForm({ ...revForm, title: e.target.value })} placeholder="Title" className="w-full px-3 py-2 rounded-md bg-background border border-input outline-none" />
              <textarea required value={revForm.body} onChange={(e) => setRevForm({ ...revForm, body: e.target.value })} placeholder="Your thoughts" rows={3} className="w-full px-3 py-2 rounded-md bg-background border border-input outline-none" />
              <button className="h-10 px-4 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium">Submit</button>
            </form>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-heading text-3xl mb-4">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
