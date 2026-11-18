import Link from 'next/link';
import { watches } from '@/lib/watches';
import WatchCard from '@/components/WatchCard';

export const metadata = { title: 'Page not found — Watcheton Timepieces' };

export default function NotFound() {
  return (
    <div className="page">
      <section className="section container notfound">
        <span className="hero__eyebrow">404</span>
        <h1 className="section-title">This page has stopped ticking.</h1>
        <p className="section-sub">The link may be old or mistyped. These are still running:</p>
        <div className="col-grid col-grid--3">
          {watches.filter((w) => w.featured).slice(0, 3).map((w, i) => <WatchCard key={w.id} watch={w} index={i} />)}
        </div>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn--gold">Back to home</Link>
          <Link href="/collection" className="btn btn--outline">Browse the collection</Link>
        </div>
      </section>
    </div>
  );
}
