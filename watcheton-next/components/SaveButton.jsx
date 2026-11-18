'use client';
import { useSaved } from '@/lib/storage';

export default function SaveButton({ id, name, large = false }) {
  const { isSaved, toggle } = useSaved();
  const on = isSaved(id);
  return (
    <button
      type="button"
      className={`save-btn ${on ? 'save-btn--on' : ''} ${large ? 'save-btn--lg' : ''}`}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from saved` : `Save ${name}`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(id); }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M12 21s-7.5-4.6-9.6-9.4C.9 8.2 3 4.5 6.6 4.5c2 0 3.5 1.1 4.4 2.6.9-1.5 2.4-2.6 4.4-2.6 3.6 0 5.7 3.7 4.2 7.1C19.5 16.4 12 21 12 21z" />
      </svg>
      {large && <span>{on ? 'Saved' : 'Save for later'}</span>}
    </button>
  );
}
