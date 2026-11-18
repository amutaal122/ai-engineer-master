import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Our Story — Watcheton Timepieces',
  description: 'Why we started, what we believe, and why every Watcheton is built the way it is.',
};

export default function AboutPage() {
  return (
    <div className="page">

      {/* ── HERO ── */}
      <div className="about-hero">
        <div className="about-hero__bg">
          <Image
            src="/images/watch-hero.webp" alt="Watcheton"
            priority
            fill style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div className="about-hero__overlay" />
        </div>
        <div className="container about-hero__content">
          <span className="hero__eyebrow">Our Story</span>
          <h1 className="hero__title" style={{ fontSize: 'clamp(2.5rem,6vw,5.5rem)' }}>
            Crafted for<br /><em>Those Who Know.</em>
          </h1>
          <p className="hero__sub" style={{ maxWidth: 460 }}>
            Not the loudest watch in the room.<br />The most remembered.
          </p>
        </div>
      </div>

      {/* ── FOUNDER LETTER ── */}
      <section className="founder-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="hero__eyebrow">Why We Started</span>
            <h2 className="section-title">Why Watcheton</h2>
          </div>
          <div className="founder-letter reveal reveal--scale">
            <div className="founder-letter__body">
              <p>
                Most watches sold in Pakistan are either cheap copies or imports carrying heavy retail markups. <strong>Watcheton exists for the space between.</strong>
              </p>
              <p>
                We pick proven Japanese Miyota and Swiss ETA movements, put them in steel and ceramic cases, and add one signature: the W at twelve. Then we sell direct, so the price reflects the watch, not the shop it sits in.
              </p>
              <p>
                Every order is confirmed by a person, packed in our gift box, and covered by a one-year warranty. <strong>Wear it well.</strong>
              </p>
            </div>
            <div className="founder-letter__sign">
              <p className="founder-letter__sign-name">— The Watcheton Team</p>
              <p className="founder-letter__sign-title">Karachi, Pakistan</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="section section--dark">
        <div className="container">
          <div className="section__head" style={{ textAlign: 'center' }}>
            <span className="hero__eyebrow">What We Stand For</span>
            <h2 className="section-title">The Principles Behind the Watch</h2>
            <p className="section-sub">Not marketing words. The actual things we refuse to compromise on.</p>
          </div>
          <div className="values-grid">
            {[
              {
                icon: '◈', title: 'Precision',
                text: 'Japanese Miyota and Swiss ETA movements regulated to ±15 seconds per day — accuracy you can trust, day in, day out. The same calibers found in watches costing five times more.',
              },
              {
                icon: '◎', title: 'Craft',
                text: 'Every case is hand-finished. Every dial inspected by eye before it ships. We don\'t send anything we wouldn\'t put on our own wrist.',
              },
              {
                icon: '◇', title: 'Honesty',
                text: 'No retail markups. You buy directly from us — which means a luxury watch at a price that actually respects your intelligence.',
              },
              {
                icon: '✦', title: 'Real Service',
                text: '1-year warranty, 30-day returns, and every order confirmed by a person — not an automated system.',
              },
            ].map((v, i) => (
              <div key={v.title} className={`value-card reveal reveal--d${(i % 4) + 1}`}>
                <div className="value-card__icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL — Meridian Noir ── */}
      <section className="editorial">
        <div className="editorial__body">
          <span className="editorial__eyebrow">Heritage Collection</span>
          <h2 className="editorial__title">Dark.<br /><em>Intentional.</em></h2>
          <p className="editorial__pull">
            "The Meridian Noir is for the ones who don't need to shout."
          </p>
          <p className="editorial__text">
            All-black PVD case. Anthracite blue-grey dial. Green lume that glows long after sunset. The Noir wears differently at night — and that's the whole point. Some statements are made in silence.
          </p>
          <p className="editorial__text">
            Ceramic black bezel. Dauphine hands with lume tips. 50m water resistance.
            Everything a dress watch needs. Nothing it doesn't.
          </p>
          <Link href="/product/2" className="btn btn--outline">See the Meridian Noir →</Link>
        </div>
        <div className="editorial__media editorial__media--photo">
          <Image
            src="/images/watches/meridian-noir.webp"
            alt="Meridian Noir"
            fill
            sizes="(max-width: 900px) 100vw, 45vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="hero__eyebrow">Ready?</span>
          <h2>Let's Find Your Watch.</h2>
          <p>Browse the full collection or get in touch — we reply in minutes.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
            <Link href="/collection" className="btn btn--outline btn--lg">Browse Collection →</Link>
            <Link href="/contact" className="btn btn--gold btn--lg">Contact Us →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
