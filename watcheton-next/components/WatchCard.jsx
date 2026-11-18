import Image from 'next/image';
import Link from 'next/link';
import SaveButton from './SaveButton';

export default function WatchCard({ watch: w, index = 0 }) {
  const save = w.originalPrice ? w.originalPrice - w.price : 0;
  return (
    <article className={`watch-card reveal reveal--d${(index % 4) + 1}`}>
      <div className="watch-card__img-wrap">
        <Link href={`/product/${w.id}`} className="watch-card__img-link" tabIndex={-1} aria-hidden="true">
          <Image
            src={w.image} alt="" fill
            sizes="(max-width:600px) 100vw,(max-width:900px) 50vw,25vw"
            style={{ objectFit: 'cover' }} className="watch-card__img"
          />
          <div className="watch-card__shimmer" />
          {w.badge && <span className={`wc-badge wc-badge--${w.badge.toLowerCase()}`}>{w.badge}</span>}
        </Link>
        <SaveButton id={w.id} name={w.name} />
      </div>
      <Link href={`/product/${w.id}`} className="watch-card__body">
        <span className="watch-card__col">{w.collection}</span>
        <h3 className="watch-card__name">{w.name}</h3>
        <p className="watch-card__tagline">{w.movement} · {w.caseSize}</p>
        <div className="watch-card__price-row">
          <span className="watch-card__price">Rs. {w.price.toLocaleString()}</span>
          {w.originalPrice && <span className="watch-card__orig">Rs. {w.originalPrice.toLocaleString()}</span>}
        </div>
        {save > 0 && <span className="value-pill">Save Rs. {save.toLocaleString()}</span>}
        {w.badge === 'Limited' && <span className="scarcity-line">Numbered limited edition</span>}
      </Link>
    </article>
  );
}
