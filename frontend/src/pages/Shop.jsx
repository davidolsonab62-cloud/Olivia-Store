import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Shop = () => {
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/categories').then((r) => setCats(r.data)); }, []);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (category) qs.set('category', category);
    if (q) qs.set('q', q);
    qs.set('sort', sort);
    qs.set('limit', '60');
    api.get(`/products?${qs.toString()}`).then((r) => setItems(r.data.items)).finally(() => setLoading(false));
  }, [category, q, sort]);

  const title = useMemo(() => {
    if (q) return `Search: “${q}”`;
    if (category) {
      const c = cats.find((c) => c.slug === category);
      return c?.name || category;
    }
    return 'All products';
  }, [category, q, cats]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Maison</div>
          <h1 className="font-heading text-4xl sm:text-5xl mt-1">{title}</h1>
          <p className="text-muted-foreground text-sm mt-2">{items.length} items</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-40" data-testid="shop-sort"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_asc">Price: Low → High</SelectItem>
              <SelectItem value="price_desc">Price: High → Low</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => { setParams({}); window.history.pushState({}, '', '/shop'); window.location.href = '/shop'; }} className={`text-xs px-3 py-1.5 rounded-full border ${!category && !q ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'hover:bg-secondary'}`}>All</button>
        {cats.map((c) => (
          <a key={c.slug} href={`/shop/${c.slug}`} className={`text-xs px-3 py-1.5 rounded-full border ${category === c.slug ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'hover:bg-secondary'}`}>{c.name}</a>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-[var(--radius)] bg-secondary animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 mt-6">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Shop;
