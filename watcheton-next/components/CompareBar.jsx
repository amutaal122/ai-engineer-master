'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { watches } from '@/lib/watches';
import { useCompare, COMPARE_MAX } from '@/lib/storage';

const ROWS = [
  ['Price', (w) => `Rs. ${w.price.toLocaleString()}`],
  ['Collection', (w) => w.collection],
  ['Movement', (w) => w.movement],
  ['Case', (w) => w.material],
  ['Size', (w) => w.caseSize],
  ['Water resistance', (w) => w.waterResistance],
  ['Caseback', (w) => w.caseback],
];

export default function CompareBar() {
  const { compare, toggle, clear } = useCompare();
  const [open, setOpen] = useState(false);
  const items = compare.map((id) => watches.find((w) => w.id === id)).filter(Boolean);

  useEffect(() => { if (items.length < 2) setOpen(false); }, [items.length]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  if (items.length === 0) return null;

  return (
    <>
      <div className="compare-bar" role="region" aria-label="Compare watches">
        <div className="compare-bar__items">
          {items.map((w) => (
            <button key={w.id} className="compare-bar__item" onClick={() => toggle(w.id)} aria-label={`Remove ${w.name}`}>
              <Image src={w.image} alt="" width={44} height={44} style={{ objectFit: 'cover' }} />
              <span>×</span>
            </button>
          ))}
          <span className="compare-bar__hint">{items.length}/{COMPARE_MAX}{items.length < 2 && ' — add one more'}</span>
        </div>
        <div className="compare-bar__actions">
          <button className="compare-bar__clear" onClick={clear}>Clear</button>
          <button className="btn btn--gold btn--sm" disabled={items.length < 2} onClick={() => setOpen(true)}>Compare</button>
        </div>
      </div>

      {open && (
        <div className="compare-modal" role="dialog" aria-modal="true" aria-label="Watch comparison" onClick={() => setOpen(false)}>
          <div className="compare-modal__panel" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox__close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
            <h2 className="compare-modal__title">Side by side</h2>
            <div className="compare-table" style={{ '--cols': items.length }}>
              <div className="compare-table__label" />
              {items.map((w) => (
                <Link key={w.id} href={`/product/${w.id}`} className="compare-table__head" onClick={() => setOpen(false)}>
                  <div className="compare-table__img"><Image src={w.image} alt={w.name} fill sizes="200px" style={{ objectFit: 'cover' }} /></div>
                  <strong>{w.name}</strong>
                </Link>
              ))}
              {ROWS.map(([label, get]) => (
                <div key={label} className="compare-table__row">
                  <div className="compare-table__label">{label}</div>
                  {items.map((w) => <div key={w.id} className="compare-table__cell">{get(w)}</div>)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
