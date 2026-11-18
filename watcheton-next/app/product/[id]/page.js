import Link from 'next/link';
import { notFound } from 'next/navigation';
import { watches } from '@/lib/watches';
import WatchCard from '@/components/WatchCard';
import ProductImage from '@/components/ProductImage';
import OrderPanel from '@/components/OrderPanel';
import RecentlyViewed from '@/components/RecentlyViewed';
import FitChecker from '@/components/FitChecker';
import StickyBuyBar from '@/components/StickyBuyBar';

export async function generateStaticParams() {
  return watches.map((w) => ({ id: String(w.id) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const w = watches.find((w) => w.id === Number(id));
  if (!w) return {};
  return { title: `${w.name} — Watcheton Timepieces`, description: w.description };
}


export default async function ProductPage({ params }) {
  const { id } = await params;
  const w = watches.find((w) => w.id === Number(id));
  if (!w) notFound();

  const related = watches.filter((x) => x.collection === w.collection && x.id !== w.id).slice(0, 3);
  const others  = related.length < 3 ? [...related, ...watches.filter((x) => x.id !== w.id && !related.includes(x)).slice(0, 3 - related.length)] : related;
  const discount = w.originalPrice ? Math.round((1 - w.price / w.originalPrice) * 100) : null;

  return (
    <div className="page">

      {/* ── BREADCRUMB ── */}
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/collection">Collection</Link>
          <span aria-hidden="true"> / </span>
          <span>{w.name}</span>
        </nav>
      </div>

      {/* ── DETAIL LAYOUT ── */}
      <div className="pd-layout container">

        {/* LEFT — image panel */}
        <div className="pd-gallery">
          <ProductImage src={w.image} alt={w.name}>
            <span className="pd-corner pd-corner--tl" aria-hidden="true" />
            <span className="pd-corner pd-corner--br" aria-hidden="true" />
            {w.badge && (
              <span className={`wc-badge wc-badge--${w.badge.toLowerCase()} pd-badge`}>{w.badge}</span>
            )}
            {discount && !w.badge && (
              <span className="wc-badge wc-badge--sale pd-badge">Save {discount}%</span>
            )}
          </ProductImage>
        </div>

        {/* RIGHT — info panel */}
        <div className="pd-info">
          <span className="hero__eyebrow">{w.collection} Collection</span>
          <h1 className="pd-name">{w.name}</h1>
          <p className="pd-tagline">{w.tagline}</p>

          {/* Price */}
          <div className="pd-price-block">
            <span className="pd-price">Rs. {w.price.toLocaleString()}</span>
            {w.originalPrice && (
              <div className="pd-price-row">
                <span className="pd-orig">Rs. {w.originalPrice.toLocaleString()}</span>
                <span className="pd-save">You save Rs. {(w.originalPrice - w.price).toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="pd-desc">{w.description}</p>

          {/* Key features */}
          <ul className="pd-features">
            {w.details.map((d) => (
              <li key={d}>
                <span className="pd-features__icon">◆</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* BUY */}
          <OrderPanel watch={w} />

          {/* Trust badges */}
          <div className="pd-trust">
            {[
              { icon: '🚚', text: 'Free Delivery' },
              { icon: '↩', text: '30-Day Returns' },
              { icon: '🛡️', text: '1-Year Warranty' },
              { icon: '📦', text: 'Gift Box Included' },
            ].map((t) => (
              <div key={t.text} className="pd-trust__item">
                <span>{t.icon}</span>
                <span>{t.text}</span>
              </div>
            ))}
          </div>

          <FitChecker caseSize={w.caseSize} />

          {/* Specs table */}
          <div className="pd-specs">
            <h4 className="pd-specs__title">Specifications</h4>
            <table className="pd-spec-table">
              <tbody>
                {[
                  ['Movement', w.movement],
                  ['Case Material', w.material],
                  ['Case Size', w.caseSize],
                  ['Water Resistance', w.waterResistance],
                  ['Caseback', w.caseback],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td className="pd-spec-key">{k}</td>
                    <td className="pd-spec-val">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── YOU MAY ALSO LIKE ── */}
      {others.length > 0 && (
        <section className="related-section">
          <div className="container">
            <div className="section__head" style={{ textAlign: 'center', marginBottom: 48 }}>
              <span className="hero__eyebrow">Explore More</span>
              <h2 className="section-title">You May Also Like</h2>
            </div>
            <div className="col-grid col-grid--3">
              {others.map((r, i) => <WatchCard key={r.id} watch={r} index={i} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <Link href="/collection" className="btn btn--outline btn--lg">View All {watches.length} Watches →</Link>
            </div>
          </div>
        </section>
      )}

      <RecentlyViewed currentId={w.id} />
      <StickyBuyBar name={w.name} price={w.price} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: `Watcheton ${w.name}`,
          image: w.image,
          description: w.description,
          brand: { '@type': 'Brand', name: 'Watcheton' },
          offers: { '@type': 'Offer', price: w.price, priceCurrency: 'PKR', availability: 'https://schema.org/InStock' },
        }).replace(/</g, '\\u003c') }}
      />
    </div>
  );
}
