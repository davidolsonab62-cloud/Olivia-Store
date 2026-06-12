import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ArrowDownToLine } from 'lucide-react';
import { toast } from 'sonner';

const AdminWithdrawals = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ currency: 'btc', address: '', amount: '', note: '' });

  const load = () => api.get('/admin/withdrawals').then((r) => setItems(r.data.items));
  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/withdrawals', { ...form, amount: parseFloat(form.amount) });
      toast.success('Withdrawal recorded');
      setOpen(false); setForm({ currency: 'btc', address: '', amount: '', note: '' });
      load();
    } catch (err) { toast.error(err?.response?.data?.detail || 'Failed'); }
  };

  const setStatus = async (id, status) => {
    try { await api.put(`/admin/withdrawals/${id}`, { status }); load(); toast.success('Updated'); }
    catch { toast.error('Update failed'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl">Withdrawals</h1>
        <button onClick={() => setOpen(true)} className="h-10 px-4 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium inline-flex items-center gap-2"><ArrowDownToLine className="h-4 w-4" /> New withdrawal</button>
      </div>
      <p className="text-sm text-muted-foreground">Record manual withdrawals of crypto to your wallet (e.g., admin payouts from NOWPayments balance).</p>

      <div className="rounded-[var(--radius)] bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary"><tr><th className="text-left p-3">Currency</th><th className="text-left p-3">Address</th><th className="text-right p-3">Amount</th><th className="text-left p-3">Status</th><th className="text-left p-3">Note</th><th className="text-left p-3">Date</th><th className="text-right p-3">Actions</th></tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan="7" className="p-6 text-center text-muted-foreground">No withdrawals recorded</td></tr>}
            {items.map((w) => (
              <tr key={w.id} className="border-t border-border">
                <td className="p-3 uppercase">{w.currency}</td>
                <td className="p-3 font-mono text-xs break-all max-w-[200px]">{w.address}</td>
                <td className="p-3 text-right font-mono">{w.amount}</td>
                <td className="p-3 capitalize"><span className="px-2 py-1 rounded-full text-xs bg-secondary">{w.status}</span></td>
                <td className="p-3 text-xs">{w.note}</td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(w.created_at).toLocaleString()}</td>
                <td className="p-3 text-right space-x-1">
                  {w.status !== 'sent' && <button onClick={() => setStatus(w.id, 'sent')} className="h-8 px-2 rounded-md border border-border text-xs hover:bg-secondary">Mark sent</button>}
                  {w.status !== 'cancelled' && <button onClick={() => setStatus(w.id, 'cancelled')} className="h-8 px-2 rounded-md border border-border text-xs hover:bg-secondary">Cancel</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-heading text-2xl">Record withdrawal</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="w-full px-3 py-2 rounded-md bg-background border border-input">
              {['btc','eth','usdttrc20','usdterc20','bnbbsc','ltc'].map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
            </select>
            <input required placeholder="Destination wallet address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 rounded-md bg-background border border-input" />
            <input required type="number" step="0.00000001" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-3 py-2 rounded-md bg-background border border-input" />
            <textarea placeholder="Note (optional)" rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="w-full px-3 py-2 rounded-md bg-background border border-input" />
            <button className="w-full h-10 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium">Save</button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWithdrawals;
