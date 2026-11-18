'use client';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { watches, collections, WA_NUMBER } from '@/lib/watches';
import { useSaved } from '@/lib/storage';
import WatchCard from '@/components/WatchCard';

const TABS = ['All', ...collections.map((c) => c.id), 'Saved'];

const SORTS = {
  featured: { label: 'Featured', fn: (a, b) => Number(b.featured) - Number(a.featured) },
  low: { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  high: { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
};

const BUDGETS = {
  any: { label: 'Any budget', test: () => true },
  u25: { label: 'Under Rs. 25,000', test: (p) => p < 25000 },
  u40: { label: 'Rs. 25,000 – 40,000', test: (p) => p >= 25000 && p <= 40000 },
  u60: { label: 'Rs. 40,000 – 60,000', test: (p) => p > 40000 && p <= 60000 },
  o60: { label: 'Above Rs. 60,000', test: (p) => p > 60000 },
};

const MOVEMENTS = ['Any movement', 'Automatic', 'Quartz', 'Chronograph', 'Manual-Wind', 'Smart'];

export default function CollectionPage() {
  const [budget, setBudget] = useState('any');
  const [movement, setMovement] = useState(MOVEMENTS[0]);
  const [active, setActive] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const { saved } = useSaved();

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('view') === 'saved') setActive('Saved');
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return watches
      .filter((w) => active === 'All' || (active === 'Saved' ? saved.includes(w.id) : w.collection === active))
      .filter((w) => !q || [w.name, w.collection, w.movement, w.material].some((s) => s.toLowerCase().includes(q)))
      .filter((w) => BUDGETS[budget].test(w.price))
      .filter((w) => movement === MOVEMENTS[0] || w.movement.includes(movement))
      .sort(SORTS[sort].fn);
  }, [active, query, sort, saved, budget, movement]);

  const reset = () => { setQuery(''); setActive('All'); setBudget('any'); setMovement(MOVEMENTS[0]); };

  const current = collections.find((c) => c.id === active);
  const count = (tab) =>
    tab === 'All' ? watches.length : tab === 'Saved' ? saved.length : watches.filter((w) => w.collection === tab).length;

  return (
    <div className="page">
      <div className="col-hero">
        <div className="col-hero__bg">
          <Image
            src="/images/watches/showcase.webp"
            alt="Watcheton Meridian Classic with its gift box"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          <div className="col-hero__overlay" />
        </div>
        <div className="container col-hero__content">
          <span className="hero__eyebrow">Our Timepieces</span>
          <h1 className="col-hero__title">The Collection</h1>
          <p className="col-hero__sub">{watches.length} watches across {collections.length} collections. Every one carries the W.</p>
        </div>
      </div>

      <div className="col-tabs-wrap">
        <div className="container">
          <div className="col-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`col-tab ${active === tab ? 'col-tab--active' : ''}`}
                onClick={() => setActive(tab)}
              >
                {tab === 'Saved' ? '♡ Saved' : tab}
                <span className="col-tab__count">{count(tab)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container col-grid-wrap">
        <div className="col-toolbar">
          <input
            type="search"
            className="col-search"
            placeholder="Search by name, movement or material"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search watches"
          />
          <select className="col-sort" value={budget} onChange={(e) => setBudget(e.target.value)} aria-label="Filter by budget">
            {Object.entries(BUDGETS).map(([k, b]) => <option key={k} value={k}>{b.label}</option>)}
          </select>
          <select className="col-sort" value={movement} onChange={(e) => setMovement(e.target.value)} aria-label="Filter by movement">
            {MOVEMENTS.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select className="col-sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort watches">
            {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
          </select>
        </div>

        {current && <p className="col-count"><strong>{current.tagline}.</strong> {current.desc}</p>}

        {active === 'Saved' && saved.length > 0 && (
          <div className="saved-actions">
            <p>{saved.length} saved · Rs. {watches.filter((w) => saved.includes(w.id)).reduce((s, w) => s + w.price, 0).toLocaleString()} together</p>
            <a
              className="btn btn--gold btn--sm"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                `Hi Watcheton, I'm deciding between these watches:\n${watches.filter((w) => saved.includes(w.id)).map((w) => `• ${w.name} — Rs. ${w.price.toLocaleString()}`).join('\n')}\nWhich would you recommend?`,
              )}`}
            >
              Ask us about these
            </a>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="col-grid">
            {filtered.map((w, i) => <WatchCard key={w.id} watch={w} index={i} />)}
          </div>
        ) : (
          <div className="col-empty">
            {active === 'Saved' && !query
              ? <p>Nothing saved yet. Tap the heart on any watch to keep it here.</p>
              : <p>No watches match these filters.</p>}
            <button className="btn btn--outline" onClick={reset}>Show all watches</button>
          </div>
        )}

        <div className="col-bottom-cta">
          <p>Can’t decide between two? Tell us the occasion and we’ll help.</p>
          <Link href="/contact" className="btn btn--outline btn--lg">Ask for a recommendation →</Link>
        </div>
      </div>
    </div>
  );
}
