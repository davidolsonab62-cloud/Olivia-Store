import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Truck, Coins, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';

const Section = ({ children, className = '' }) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.section>
);

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNew] = useState([]);
  const [best, setBest] = useState([]);
  const [cats, setCats] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get('/products?featured=true&limit=8').then((r) => setFeatured(r.data.items));
    api.get('/products?new=true&limit=8').then((r) => setNew(r.data.items));
    api.get('/products?best_seller=true&limit=8').then((r) => setBest(r.data.items));
    api.get('/categories').then((r) => setCats(r.data));
    api.get('/testimonials').then((r) => setTestimonials(r.data));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none hero-accent" />
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="text-xs tracking-[0.22em] uppercase text-muted-foreground">Maison · Est. 2026</div>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl leading-[1.02] mt-3">Objects you<br />keep for life.</h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-[52ch]">
              An online maison curating sneakers, watches, art, fashion and rare electronics. Paid in fiat or in crypto — your address is unique to your order.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link data-testid="home-hero-primary-cta" to="/shop" className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium hover:opacity-90">
                Shop the maison <ArrowRight className="h-4 w-4" />
              </Link>
              <Link data-testid="home-hero-secondary-cta" to="/shop/watches" className="inline-flex items-center gap-2 h-11 px-5 rounded-md border border-border hover:border-[hsl(var(--brass))] font-medium">
                See watches
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
              {[
                { icon: Coins, t: 'Pay in crypto' },
                { icon: ShieldCheck, t: 'Authenticity' },
                { icon: Truck, t: 'Fully insured' },
                { icon: Shield, t: 'Secure' },
              ].map((f) => (
                <div key={f.t} className="text-xs text-muted-foreground inline-flex items-center gap-1.5"><f.icon className="h-4 w-4" />{f.t}</div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="grid grid-cols-2 gap-3">
            <div className="aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden bg-secondary">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80" alt="" className="h-full w-full object-cover" />
            </div>
            <div className="aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden bg-secondary mt-8">
              <img src="https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80" alt="" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <Section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Departments</div>
            <h2 className="font-heading text-3xl sm:text-4xl mt-1">Shop by category</h2>
          </div>
          <Link to="/shop" className="text-sm text-[hsl(var(--accent))] font-medium">View all →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {cats.slice(0, 12).map((c) => (
            <Link key={c.slug} to={`/shop/${c.slug}`} className="group relative aspect-square overflow-hidden rounded-[var(--radius)] bg-secondary">
              <img src={c.image} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white font-medium">{c.name}</div>
            </Link>
          ))}
        </div>
      </Section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <Section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Editor's selection</div>
              <h2 className="font-heading text-3xl sm:text-4xl mt-1">Featured</h2>
            </div>
            <Link to="/shop" className="text-sm text-[hsl(var(--accent))] font-medium">All featured →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </Section>
      )}

      {/* BEST SELLERS */}
      {best.length > 0 && (
        <Section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Most loved</div>
              <h2 className="font-heading text-3xl sm:text-4xl mt-1">Best sellers</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {best.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </Section>
      )}

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <Section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Just landed</div>
              <h2 className="font-heading text-3xl sm:text-4xl mt-1">New arrivals</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </Section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <Section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground text-center">Words from clients</div>
          <h2 className="font-heading text-3xl sm:text-4xl text-center mt-1">Reviews</h2>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((t, idx) => (
              <div key={idx} className="rounded-[var(--radius)] bg-card border border-border p-5">
                <div className="text-amber-500 mb-2">★★★★★</div>
                <p className="text-sm leading-relaxed">“{t.text}”</p>
                <div className="mt-3 text-xs text-muted-foreground">{t.name} · {t.role}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* CRYPTO STRIP */}
      <Section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="rounded-[var(--radius-lg)] bg-card border border-border p-6 md:p-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="text-xs tracking-[0.18em] uppercase text-[hsl(var(--accent))]">Crypto-native</div>
            <h3 className="font-heading text-3xl sm:text-4xl mt-1">Each order gets a unique address.</h3>
            <p className="mt-3 text-muted-foreground">Pay with Bitcoin, Ethereum, USDT, BNB or Litecoin. We confirm on-chain and ship within 48 hours.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['BTC','ETH','USDT-TRC20','USDT-ERC20','BNB','LTC'].map((c) => (
                <span key={c} className="text-xs font-mono px-3 py-1.5 rounded-full bg-secondary">{c}</span>
              ))}
            </div>
          </div>
          <div className="aspect-[4/3] rounded-[var(--radius)] overflow-hidden bg-secondary">
            <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80" alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Home;
