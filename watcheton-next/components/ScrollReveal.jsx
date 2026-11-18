'use client';
import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    const scan = () => document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => io.observe(el));
    scan();

    // New pages and filtered cards render later, and React re-renders can strip is-visible from className.
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') { scan(); return; }
      }
      mutations.forEach(({ target: el }) => {
        if (el.classList.contains('reveal') && !el.classList.contains('is-visible')) { io.unobserve(el); io.observe(el); }
      });
    });
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  return null;
}
