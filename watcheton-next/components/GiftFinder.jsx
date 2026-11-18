'use client';
import { useState } from 'react';
import { watches } from '@/lib/watches';
import WatchCard from './WatchCard';

const FOR = [
  { id: 'him', label: 'Him', test: (w) => !['Élite Dame', 'Élite Porcelain'].includes(w.name) },
  { id: 'her', label: 'Her', test: (w) => ['Élite Dame', 'Élite Porcelain', 'Carré Noir', 'Meridian Classic'].includes(w.name) },
  { id: 'both', label: 'A couple', test: (w) => w.collection === 'Couple' },
];

const BUDGET = [
  { id: 'a', label: 'Up to Rs. 25k', max: 25000 },
  { id: 'b', label: 'Up to Rs. 45k', max: 45000 },
  { id: 'c', label: 'No limit', max: Infinity },
];

const STYLE = [
  { id: 'classic', label: 'Classic', test: (w) => ['Heritage', 'Élite', 'Couple'].includes(w.collection) },
  { id: 'sport', label: 'Sporty', test: (w) => w.collection === 'Sport' },
  { id: 'smart', label: 'Smart', test: (w) => w.collection === 'Connect' },
  { id: 'any', label: 'Surprise me', test: () => true },
];

function Choice({ options, value, onChange, name }) {
  return (
    <div className="gift__choices" role="radiogroup" aria-label={name}>
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={value === o.id}
          className={`gift__chip ${value === o.id ? 'gift__chip--on' : ''}`} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function GiftFinder() {
  const [who, setWho] = useState('him');
  const [budget, setBudget] = useState('c');
  const [style, setStyle] = useState('any');

  const f = FOR.find((x) => x.id === who);
  const b = BUDGET.find((x) => x.id === budget);
  const s = STYLE.find((x) => x.id === style);
  const matches = watches.filter((w) => f.test(w) && w.price <= b.max && (who === 'both' || s.test(w)))
    .sort((x, y) => y.price - x.price)
    .slice(0, 3);

  return (
    <section className="section container gift">
      <div className="section__head reveal">
        <span className="hero__eyebrow">Gift Finder</span>
        <h2 className="section-title">Three questions. The right watch.</h2>
      </div>
      <div className="gift__panel">
        <div className="gift__q"><span>Who is it for?</span><Choice name="Who" options={FOR} value={who} onChange={setWho} /></div>
        <div className="gift__q"><span>Your budget</span><Choice name="Budget" options={BUDGET} value={budget} onChange={setBudget} /></div>
        {who !== 'both' && <div className="gift__q"><span>Their style</span><Choice name="Style" options={STYLE} value={style} onChange={setStyle} /></div>}
      </div>
      {matches.length > 0 ? (
        <div className="col-grid col-grid--3" aria-live="polite">
          {matches.map((w, i) => <WatchCard key={w.id} watch={w} index={i} />)}
        </div>
      ) : (
        <p className="col-empty">Nothing in that exact mix — try a higher budget or “Surprise me”.</p>
      )}
    </section>
  );
}
