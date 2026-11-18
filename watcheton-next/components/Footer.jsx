import Link from 'next/link';
import Image from 'next/image';
import { collections, WA_NUMBER } from '@/lib/watches';

const year = new Date().getFullYear();
const PHONE = `+${WA_NUMBER.slice(0, 2)} ${WA_NUMBER.slice(2, 5)} ${WA_NUMBER.slice(5)}`;

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="footer__brand">
          <Image src="/images/logo.webp" alt="Watcheton" width={64} height={64} style={{ objectFit: 'contain' }} />
          <p className="footer__tagline">TIME ELEVATED.</p>
          <p className="footer__sub">Watches with the Watcheton W, delivered across Pakistan.</p>
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <h4>Collections</h4>
            <ul>
              <li><Link href="/collection">All watches</Link></li>
              {collections.map((c) => <li key={c.id}><span>{c.id}</span></li>)}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">Our story</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/contact#faq">Delivery &amp; returns</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Get in touch</h4>
            <ul>
              <li><a href={`tel:+${WA_NUMBER}`}>{PHONE}</a></li>
              <li><span>Mon – Sat, 10 AM – 8 PM PKT</span></li>
              <li><span>Cash on delivery</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p>© {year} Watcheton Timepieces</p>
        </div>
      </div>
    </footer>
  );
}
