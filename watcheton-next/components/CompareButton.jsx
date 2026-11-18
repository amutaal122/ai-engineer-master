'use client';
import { useCompare } from '@/lib/storage';

export default function CompareButton({ id, name }) {
  const { inCompare, toggle, full } = useCompare();
  const on = inCompare(id);
  return (
    <button
      type="button"
      className={`save-btn save-btn--lg ${on ? 'save-btn--on' : ''}`}
      onClick={() => toggle(id)}
      disabled={!on && full}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from compare` : `Add ${name} to compare`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M8 3v18M16 3v18M3 8h5M16 16h5"/></svg>
      <span>{on ? 'Comparing' : full ? 'Compare full' : 'Compare'}</span>
    </button>
  );
}
