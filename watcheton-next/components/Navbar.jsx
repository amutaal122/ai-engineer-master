'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSaved } from '@/lib/storage';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/collection', label: 'Collection' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const TICKS = Array.from({ length: 12 }, (_, k) => k);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { saved } = useSaved();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  const isActive = (l) => {
    if (l.neverActive) return false;
    if (l.href === '/') return pathname === '/';
    return pathname === l.href || pathname.startsWith(`${l.href}/`);
  };

  return (
    <>
      <div className="announce-bar">
        <span className="announce-bar__item announce-bar__item--gold">Free delivery across Pakistan</span>
        <span className="announce-bar__sep">·</span>
        <span className="announce-bar__item">1-year warranty</span>
        <span className="announce-bar__sep">·</span>
        <span className="announce-bar__item">Cash on delivery</span>
      </div>

      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          <Link href="/" className="navbar__brand" onClick={close} aria-label="Watcheton Timepieces — home">
            <svg className="navbar__emblem" viewBox="0 0 44 44" aria-hidden="true">
              <circle cx="22" cy="22" r="20" />
              {TICKS.map((k) => (
                <line key={k} x1="22" y1="3" x2="22" y2={k % 3 === 0 ? 7.5 : 5.5} transform={`rotate(${k * 30} 22 22)`} />
              ))}
              <text x="22" y="29.5" textAnchor="middle" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="22" fontWeight="600">W</text>
            </svg>
            <span className="brand__text">
              <span className="brand__name">WATCHETON</span>
              <span className="brand__sub">TIMEPIECES</span>
            </span>
          </Link>

          <ul className="navbar__nav">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className={isActive(l) ? 'is-active' : ''}>{l.label}</Link>
              </li>
            ))}
          </ul>

          <div className="navbar__tools">
            <Link href="/collection" className="navbar__tool" aria-label="Browse the collection">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
              </svg>
            </Link>
            <Link href="/collection?view=saved" className="navbar__tool navbar__saved" aria-label={`Saved watches (${saved.length})`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M12 21s-7.5-4.6-9.6-9.4C.9 8.2 3 4.5 6.6 4.5c2 0 3.5 1.1 4.4 2.6.9-1.5 2.4-2.6 4.4-2.6 3.6 0 5.7 3.7 4.2 7.1C19.5 16.4 12 21 12 21z" />
              </svg>
              {saved.length > 0 && <span className="navbar__count">{saved.length}</span>}
            </Link>
            <button
              className="navbar__hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`navbar__menu ${menuOpen ? 'navbar__menu--open' : ''}`} aria-hidden={!menuOpen}>
        <div className="navbar__menu-inner">
          <div className="navbar__menu-head">
            <Image
              src="/images/logo.webp"
              alt="Watcheton"
              width={44}
              height={44}
              style={{ objectFit: 'contain' }}
            />
            <button
              className="navbar__menu-close"
              onClick={close}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <ul>
            {LINKS.map((l) => (
              <li key={l.label}><Link href={l.href} onClick={close}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
