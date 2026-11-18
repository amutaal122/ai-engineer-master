'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SLIDES = [
  {
    src: '/images/watches/hero-bg.webp',
    alt: 'Watcheton Meridian Classic — two-tone gold automatic',
    name: 'Meridian Classic',
    eyebrow: 'Heritage Collection',
    sub: 'The one that started it all.',
    href: '/product/1',
  },
  {
    src: '/images/watches/skeleton-tourbillon.webp',
    alt: 'Watcheton Skeleton Tourbillon — exposed movement, 18k gold bridges',
    name: 'Skeleton Tourbillon',
    eyebrow: 'Élite · Limited 50 Pieces',
    sub: 'Every gear. Every jewel. All yours.',
    href: '/product/12',
  },
  {
    src: '/images/watches/gmt-navigator.webp',
    alt: 'Watcheton GMT Navigator — black PVD, 24hr gold ceramic bezel',
    name: 'GMT Navigator',
    eyebrow: 'Sport Collection · New Arrival',
    sub: 'Karachi at 12. The world on the bezel.',
    href: '/product/13',
  },
  {
    src: '/images/watches/aurum-chrono.webp',
    alt: 'Watcheton Aurum Chrono — black ceramic chronograph',
    name: 'Aurum Chrono',
    eyebrow: 'Élite Collection',
    sub: 'Three dials. One obsession.',
    href: '/product/7',
  },
  {
    src: '/images/watches/aurum-heart.webp',
    alt: 'Watcheton Aurum Heart — open-heart aperture, limited edition',
    name: 'Aurum Heart',
    eyebrow: 'Élite · Limited 100 Pieces',
    sub: 'The movement you can see beating.',
    href: '/product/6',
  },
];

const pad = (n) => String(n).padStart(2, '0');

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const go = useCallback((dir) => {
    setTransitioning(true);
    setTimeout(() => {
      setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);
      setTransitioning(false);
    }, 120);
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => go(1), 7000);
    return () => clearInterval(t);
  }, [paused, go]);

  const current = SLIDES[index];

  return (
    <>
      {/* Slides */}
      <div className="hero__media" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {SLIDES.map((s, n) => (
          <div key={s.src} className={`hero__slide ${n === index ? 'is-active' : ''}`} aria-hidden={n !== index}>
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="(max-width: 900px) 100vw, 65vw"
              priority={n === 0}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              className="hero__bg-img"
            />
          </div>
        ))}
      </div>

      {/* Slide info + controls */}
      <div className="hero__pagination" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>

        {/* Dot nav */}
        <div className="hero__dots">
          {SLIDES.map((s, n) => (
            <button
              key={n}
              className={`hero__dot ${n === index ? 'hero__dot--active' : ''}`}
              onClick={() => { setTransitioning(true); setTimeout(() => { setIndex(n); setTransitioning(false); }, 120); }}
              aria-label={`Go to ${s.name}`}
            />
          ))}
        </div>

        <div className={`hero__slide-info ${transitioning ? 'hero__slide-info--out' : ''}`}>
          <span className="hero__slide-eyebrow">{current.eyebrow}</span>
          <Link href={current.href} className="hero__caption">
            {current.name} <span className="hero__caption-arrow">→</span>
          </Link>
          <p className="hero__slide-sub">{current.sub}</p>
        </div>

        <div className="hero__page-row">
          <span className="hero__page-num" aria-live="polite">
            {pad(index + 1)} <i>/</i> {pad(SLIDES.length)}
          </span>
          <div className="hero__page-arrows">
            <button type="button" onClick={() => go(-1)} aria-label="Previous slide">‹</button>
            <button type="button" onClick={() => go(1)} aria-label="Next slide">›</button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="hero__progress" aria-hidden="true">
          <div
            key={index}
            className={`hero__progress-bar ${!paused ? 'hero__progress-bar--running' : ''}`}
          />
        </div>
      </div>
    </>
  );
}
