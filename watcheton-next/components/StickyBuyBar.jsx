'use client';
import { useEffect, useState } from 'react';

export default function StickyBuyBar({ name, price }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const form = document.getElementById('order');
    if (!form || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting));
    io.observe(form);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`buy-bar ${show ? 'buy-bar--show' : ''}`} aria-hidden={!show}>
      <div>
        <span className="buy-bar__name">{name}</span>
        <strong className="buy-bar__price">Rs. {price.toLocaleString()}</strong>
      </div>
      <a href="#order" className="btn btn--gold btn--sm" tabIndex={show ? 0 : -1}>Order</a>
    </div>
  );
}
