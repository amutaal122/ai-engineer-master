'use client';
import { useState } from 'react';
import { WA_NUMBER } from '@/lib/watches';
import SaveButton from './SaveButton';
import CompareButton from './CompareButton';

const FAST = ['karachi'];
const MAJOR = ['lahore', 'islamabad', 'rawalpindi', 'faisalabad', 'multan', 'hyderabad', 'peshawar', 'sialkot', 'gujranwala', 'quetta'];

function deliveryEstimate(city) {
  const c = city.trim().toLowerCase();
  if (c.length < 3) return null;
  const days = FAST.includes(c) ? 1 : MAJOR.includes(c) ? 2 : 3;
  const d = new Date();
  for (let added = 0; added < days + 1;) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) added += 1;
  }
  return `Estimated arrival in ${city.trim()}: ${d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`;
}

export default function OrderPanel({ watch }) {
  const [form, setForm] = useState({ name: '', city: '', qty: 1, gift: false, note: '' });
  const [copied, setCopied] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const total = watch.price * Number(form.qty);

  const submit = (e) => {
    e.preventDefault();
    const lines = [
      `Order: Watcheton ${watch.name}`,
      `Quantity: ${form.qty}`,
      `Total: Rs. ${total.toLocaleString()} (cash on delivery)`,
      `Name: ${form.name}`,
      `City: ${form.city}`,
      form.gift && 'This is a gift — please leave the price off the box.',
      form.note && `Note: ${form.note}`,
    ].filter(Boolean);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
  };

  const share = async () => {
    const data = { title: `Watcheton ${watch.name}`, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(data); } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(data.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <form className="order-panel" id="order" onSubmit={submit}>
      <div className="order-panel__grid">
        <label>Your name<input value={form.name} onChange={set('name')} required autoComplete="name" /></label>
        <label>City<input value={form.city} onChange={set('city')} required autoComplete="address-level2" /></label>
        <label>Quantity
          <select value={form.qty} onChange={set('qty')}>{[1, 2, 3].map((n) => <option key={n}>{n}</option>)}</select>
        </label>
        <div className="order-panel__total"><span>Total</span><strong>Rs. {total.toLocaleString()}</strong></div>
      </div>
      {deliveryEstimate(form.city) && <p className="order-panel__eta">{deliveryEstimate(form.city)} · dispatched within 24 hours</p>}
      <label className="order-panel__check"><input type="checkbox" checked={form.gift} onChange={set('gift')} /> It’s a gift (no price on the box)</label>
      <label>Note <span className="order-panel__opt">(optional)</span>
        <textarea rows={2} value={form.note} onChange={set('note')} placeholder="Strap size, delivery timing, engraving request…" />
      </label>
      <button type="submit" className="btn btn--gold btn--xl">Place order</button>
      <p className="pd-buy__note">Sends your order to us in a chat. You pay cash when it arrives.</p>
      <div className="order-panel__row">
        <SaveButton id={watch.id} name={watch.name} large />
        <CompareButton id={watch.id} name={watch.name} />
        <button type="button" className="save-btn save-btn--lg" onClick={share}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>
          <span>{copied ? 'Link copied' : 'Share'}</span>
        </button>
      </div>
    </form>
  );
}
