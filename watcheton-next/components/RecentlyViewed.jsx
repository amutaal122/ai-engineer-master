'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { watches } from '@/lib/watches';
import { useIdList, pushRecent } from '@/lib/storage';

export default function RecentlyViewed({ currentId }) {
  const [ids] = useIdList('watcheton-recent');

  useEffect(() => { pushRecent(currentId); }, [currentId]);

  const items = ids.filter((id) => id !== currentId).map((id) => watches.find((w) => w.id === id)).filter(Boolean);
  if (items.length === 0) return null;

  return (
    <section className="recent container">
      <h2 className="recent__title">Recently viewed</h2>
      <div className="recent__row">
        {items.map((w) => (
          <Link key={w.id} href={`/product/${w.id}`} className="recent__item">
            <div className="recent__img"><Image src={w.image} alt={w.name} fill sizes="160px" style={{ objectFit: 'cover' }} /></div>
            <span className="recent__name">{w.name}</span>
            <span className="recent__price">Rs. {w.price.toLocaleString()}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
