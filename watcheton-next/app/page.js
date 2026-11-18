import Image from 'next/image';
import Link from 'next/link';
import { watches } from '@/lib/watches';
import HeroSlider from '@/components/HeroSlider';
import WatchCard from '@/components/WatchCard';
import GiftFinder from '@/components/GiftFinder';

const FEATURED = watches.filter((w) => w.featured).slice(0, 8);

const PROMISES = [
  { title: 'Free delivery', text: 'Anywhere in Pakistan, in a matte-black gift box.' },
  { title: 'Cash on delivery', text: 'See it, hold it, then pay. No card needed.' },
  { title: '1-year warranty', text: 'Covers the movement. Repairs handled by us.' },
  { title: '30-day returns', text: 'Not right on your wrist? Send it back.' },
];

const OCCASIONS = [
  {
    title: 'The Boardroom',
    text: 'Two-tone gold, a black sunray dial and the W at twelve. A first impression made before you speak.',
    href: '/product/1', watch: 'Meridian Classic',
  },
  {
    title: 'The Evening',
    text: 'A champagne dial on black ceramic. Quiet, slim, and easy to notice across a table.',
    href: '/product/3', watch: 'Élite Dame',
  },
  {
    title: 'The Journey',
    text: 'A second time zone on a 24-hour gold bezel. Home and away, read at a glance.',
    href: '/product/13', watch: 'GMT Navigator',
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero__bg">
          <HeroSlider />
          <div className="hero__bg-overlay" />
        </div>

        <div className="hero__content container">
          <div className="hero__text">
            <span className="hero__eyebrow">Watcheton Timepieces</span>
            <h1 className="hero__title">TIME<br /><em>ELEVATED.</em></h1>
            <p className="hero__sub">
              Not just a watch. A part of<br />how the world sees you.
            </p>
            <div className="hero__cta">
              <Link href="/collection" className="btn btn--gold btn--lg">
                Explore the Collection <span className="btn__arrow">→</span>
              </Link>
              <Link href="/about" className="btn btn--outline btn--lg">Our Story</Link>
            </div>
          </div>
        </div>
      </section>

      {/* PROMISES */}
      <section className="promise-strip">
        <div className="container promise-strip__grid">
          {PROMISES.map((p) => (
            <div key={p.title} className="promise">
              <h3 className="promise__title">{p.title}</h3>
              <p className="promise__text">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="section container">
        <div className="section__head reveal">
          <span className="hero__eyebrow">The Collection</span>
          <h2 className="section-title">Featured Timepieces</h2>
          <p className="section-sub">Japanese and Swiss movements, sapphire and ceramic, priced for Pakistan.</p>
        </div>
        <div className="col-grid col-grid--4">
          {FEATURED.map((w, i) => <WatchCard key={w.id} watch={w} index={i} />)}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href="/collection" className="btn btn--outline btn--lg">View all {watches.length} watches →</Link>
        </div>
      </section>

      {/* QUOTE */}
      <section className="quote-section">
        <div className="container">
          <figure className="quote reveal reveal--scale">
            <span className="quote__mark" aria-hidden="true">“</span>
            <blockquote className="quote__text">
              The two most powerful warriors are patience and time.
            </blockquote>
            <figcaption className="quote__cite">Leo Tolstoy · <em>War and Peace</em></figcaption>
          </figure>
        </div>
      </section>

      {/* EDITORIAL */}
      <section className="editorial reveal reveal--scale">
        <div className="editorial__media editorial__media--photo">
          <Image
            src="/images/watches/showcase.webp"
            alt="Meridian Classic beside the Watcheton gift box and warranty card"
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
        <div className="editorial__body">
          <span className="editorial__eyebrow">The Signature</span>
          <h2 className="editorial__title">One Detail.<br /><em>Everything.</em></h2>
          <p className="editorial__text">
            Every Watcheton carries the W at twelve o’clock. It is the one thing that stays the same across every collection — from the steel Meridian to the ceramic Skeleton Tourbillon.
          </p>
          <p className="editorial__text">
            What you open is what you see here: the watch, its pillow, the gift box and a warranty card with your serial number.
          </p>
          <Link href="/product/1" className="btn btn--gold">See the Meridian Classic →</Link>
        </div>
      </section>

      {/* OCCASIONS */}
      <section className="section container">
        <div className="section__head reveal">
          <span className="hero__eyebrow">Worn Everywhere</span>
          <h2 className="section-title">A Watch for Every Chapter</h2>
        </div>
        <div className="occasion-list">
          {OCCASIONS.map((o, i) => (
            <Link key={o.title} href={o.href} className={`occasion-row reveal reveal--d${i + 1}`}>
              <span className="occasion-row__num">0{i + 1}</span>
              <div>
                <h3 className="occasion-row__title">{o.title}</h3>
                <p className="occasion-row__text">{o.text}</p>
              </div>
              <span className="occasion-row__watch">{o.watch} →</span>
            </Link>
          ))}
        </div>
      </section>

      <GiftFinder />

      {/* COUPLE */}
      <section className="couple-promise">
        <div className="couple-promise__inner reveal reveal--scale">
          <span className="couple-promise__eyebrow">Lumière Couple Set</span>
          <h2 className="couple-promise__title">Two Watches.<br />One Bond.</h2>
          <p className="couple-promise__text">
            A 40mm His and a 36mm Hers, with matching serial numbers engraved inside both casebacks. A gift that keeps the date for you.
          </p>
          <Link href="/product/5" className="btn btn--gold btn--lg">See the Couple Set →</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="hero__eyebrow">Not sure which one?</span>
          <h2>Tell us the occasion.</h2>
          <p>A gift, a milestone, or one for yourself. We’ll suggest two or three that fit.</p>
          <Link href="/contact" className="btn btn--gold btn--lg">Ask for a recommendation →</Link>
        </div>
      </section>
    </>
  );
}
