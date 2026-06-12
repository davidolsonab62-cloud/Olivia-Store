import React, { useEffect, useState } from 'react';
import { api, formatUSD } from '../lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const empty = { slug: '', name: '', brand: '', category_slug: 'sneakers', description: '', price: 0, stock: 0, images: '', sizes: '', is_featured: false, is_new: false, is_best_seller: false };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => api.get('/products?limit=200').then((r) => setProducts(r.data.items));

  useEffect(() => {
    load();
    api.get('/categories').then((r) => setCats(r.data));
  }, []);

  const startCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const startEdit = (p) => {
    setEditing(p);
    setForm({
      ...p,
      images: (p.images || []).join('\n'),
      sizes: (p.sizes || []).join(','),
    });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10) || 0,
      images: typeof form.images === 'string' ? form.images.split(/\n+/).map((s) => s.trim()).filter(Boolean) : form.images,
      sizes: typeof form.sizes === 'string' ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean) : form.sizes,
    };
    try {
      if (editing) {
        await api.put(`/admin/products/${editing.id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/admin/products', payload);
        toast.success('Product created');
      }
      setOpen(false); load();
    } catch (err) { toast.error(err?.response?.data?.detail || 'Save failed'); }
  };

  const remove = async (p) => {
    if (!confirm(`Delete ${p.name}?`)) return;
    try { await api.delete(`/admin/products/${p.id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Could not delete'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl">Products</h1>
        <button data-testid="admin-product-new" onClick={startCreate} className="h-10 px-4 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> New product
        </button>
      </div>

      <div data-testid="admin-products-table" className="rounded-[var(--radius)] bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr><th className="text-left p-3">Product</th><th className="text-left p-3">Category</th><th className="text-right p-3">Price</th><th className="text-right p-3">Stock</th><th className="text-right p-3">Actions</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3 flex items-center gap-3">
                  <img src={p.images?.[0]} className="h-10 w-10 rounded-md object-cover bg-secondary" />
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.brand}</div>
                  </div>
                </td>
                <td className="p-3 capitalize">{p.category_slug}</td>
                <td className="p-3 text-right">{formatUSD(p.price)}</td>
                <td className="p-3 text-right">{p.stock}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => startEdit(p)} className="inline-flex items-center h-8 px-2 rounded-md border border-border hover:bg-secondary"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => remove(p)} className="inline-flex items-center h-8 px-2 rounded-md border border-border hover:bg-secondary"><Trash2 className="h-3.5 w-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle className="font-heading text-2xl">{editing ? 'Edit product' : 'New product'}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="grid sm:grid-cols-2 gap-3">
            <input required placeholder="Slug (url id)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="px-3 py-2 rounded-md bg-background border border-input" />
            <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 rounded-md bg-background border border-input" />
            <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="px-3 py-2 rounded-md bg-background border border-input" />
            <select value={form.category_slug} onChange={(e) => setForm({ ...form, category_slug: e.target.value })} className="px-3 py-2 rounded-md bg-background border border-input">
              {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            <input required type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="px-3 py-2 rounded-md bg-background border border-input" />
            <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="px-3 py-2 rounded-md bg-background border border-input" />
            <textarea placeholder="Image URLs (one per line)" rows={3} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="sm:col-span-2 px-3 py-2 rounded-md bg-background border border-input" />
            <input placeholder="Sizes (comma-separated)" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="sm:col-span-2 px-3 py-2 rounded-md bg-background border border-input" />
            <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="sm:col-span-2 px-3 py-2 rounded-md bg-background border border-input" />
            <label className="text-sm inline-flex items-center gap-2"><input type="checkbox" checked={!!form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />Featured</label>
            <label className="text-sm inline-flex items-center gap-2"><input type="checkbox" checked={!!form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} />New</label>
            <label className="text-sm inline-flex items-center gap-2"><input type="checkbox" checked={!!form.is_best_seller} onChange={(e) => setForm({ ...form, is_best_seller: e.target.checked })} />Best Seller</label>
            <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setOpen(false)} className="h-10 px-4 rounded-md border border-border">Cancel</button>
              <button type="submit" data-testid="admin-product-save" className="h-10 px-4 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium">Save</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
