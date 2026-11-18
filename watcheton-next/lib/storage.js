'use client';
import { useEffect, useState, useCallback } from 'react';

const EVENT = 'watcheton-storage';

function read(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}

function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function useIdList(key) {
  const [ids, setIds] = useState([]);

  useEffect(() => {
    const sync = () => setIds(read(key));
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [key]);

  const set = useCallback((next) => write(key, next), [key]);
  return [ids, set];
}

export function useSaved() {
  const [ids, set] = useIdList('watcheton-saved');
  const toggle = (id) => set(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  return { saved: ids, isSaved: (id) => ids.includes(id), toggle };
}

export const COMPARE_MAX = 3;

export function useCompare() {
  const [ids, set] = useIdList('watcheton-compare');
  const toggle = (id) => {
    if (ids.includes(id)) set(ids.filter((x) => x !== id));
    else if (ids.length < COMPARE_MAX) set([...ids, id]);
  };
  return { compare: ids, inCompare: (id) => ids.includes(id), toggle, clear: () => set([]), full: ids.length >= COMPARE_MAX };
}

export function pushRecent(id) {
  const next = [id, ...read('watcheton-recent').filter((x) => x !== id)].slice(0, 6);
  write('watcheton-recent', next);
}
