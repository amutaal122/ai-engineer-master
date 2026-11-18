export const dynamic = 'force-static';

import { watches } from '@/lib/watches';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function sitemap() {
  return [
    ...['', '/collection', '/about', '/contact'].map((p) => ({ url: `${BASE}${p}`, priority: p ? 0.8 : 1 })),
    ...watches.map((w) => ({ url: `${BASE}/product/${w.id}`, priority: 0.7 })),
  ];
}