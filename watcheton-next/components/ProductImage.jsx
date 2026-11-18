'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

export default function ProductImage({ src, alt, children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <>
      <button type="button" className="pd-img-frame pd-img-frame--zoom" onClick={() => setOpen(true)} aria-label={`Enlarge photo of ${alt}`}>
        <Image src={src} alt={alt} fill sizes="(max-width:768px) 100vw, 54vw" style={{ objectFit: 'cover' }} priority className="pd-main-img" />
        {children}
        <span className="pd-zoom-hint">Click to enlarge</span>
      </button>
      {open && createPortal(
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={() => setOpen(false)}>
          <button type="button" className="lightbox__close" aria-label="Close">✕</button>
          <div className="lightbox__img">
            <Image src={src} alt={alt} fill sizes="100vw" style={{ objectFit: 'contain' }} />
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
