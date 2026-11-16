---
name: nextjs
description: Next.js App Router — Server Components, Client Components, data fetching, caching, Server Actions, routing, layouts, middleware, and performance patterns.
triggers: [nextjs, next.js, app router, server component, client component, server action, use client, use server, next config, next middleware, route handler, next cache, revalidate]
version: "1.0"
source: https://nextjs.org/docs
---

# Next.js App Router

## Component model
```tsx
// Server Component (default) — runs on server, no JS shipped
// ✓ async/await, DB access, secrets, heavy libs
// ✗ useState, useEffect, event handlers, browser APIs

export default async function Page() {
  const data = await db.query('SELECT ...');  // direct DB, no fetch needed
  return <div>{data.map(...)}</div>;
}

// Client Component — add "use client" at top
'use client';
import { useState } from 'react';
export function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n+1)}>{n}</button>;
}

// Pattern: Server fetches data, Client handles interaction
// Pass data as props from Server → Client
```

## Data fetching
```tsx
// Server Component — fetch with caching
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 },      // ISR: revalidate every 60s
    // next: { tags: ['products'] } // tag-based revalidation
    // cache: 'no-store'            // SSR: always fresh
    // cache: 'force-cache'         // SSG: cache forever (default)
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

// Parallel fetching (don't await sequentially)
const [user, orders] = await Promise.all([getUser(id), getOrders(id)]);
```

## Caching and revalidation
```tsx
import { revalidatePath, revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Tag-based revalidation (call from Server Action or Route Handler)
revalidateTag('products');
revalidatePath('/dashboard');

// Cache expensive DB query
const getProducts = unstable_cache(
  async () => db.query('SELECT * FROM products'),
  ['products-list'],
  { revalidate: 300, tags: ['products'] }
);
```

## Server Actions
```tsx
// app/actions.ts
'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  // validate with zod
  await db.insert(products).values({ name });
  revalidatePath('/products');
  redirect('/products');
}

// In component:
<form action={createProduct}>
  <input name="name" />
  <button type="submit">Create</button>
</form>

// Programmatic call from Client Component:
'use client';
import { createProduct } from './actions';
const result = await createProduct(formData);
```

## Routing
```
app/
  layout.tsx              # root layout (always rendered)
  page.tsx                # / route
  loading.tsx             # Suspense fallback for this segment
  error.tsx               # error boundary (must be 'use client')
  not-found.tsx           # 404 for this segment
  products/
    page.tsx              # /products
    [id]/
      page.tsx            # /products/:id
      layout.tsx          # nested layout
  (marketing)/            # route group (no URL segment)
    about/page.tsx        # /about
  api/
    users/route.ts        # /api/users — Route Handler
```

## Route Handlers
```ts
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get('id');
  const user = await db.getUser(id);
  return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const user = await db.createUser(body);
  return NextResponse.json(user, { status: 201 });
}
```

## Middleware
```ts
// middleware.ts (project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('session')?.value;
  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

## Dynamic params
```tsx
// app/products/[id]/page.tsx
interface Props { params: Promise<{ id: string }> }  // Next 15+: params is a Promise

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  return <div>{product.name}</div>;
}

// Generate static paths (SSG)
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(p => ({ id: p.id }));
}
```

## Image and Font
```tsx
import Image from 'next/image';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

<Image src="/hero.jpg" alt="Hero" width={800} height={400} priority />
// priority: above-fold images; lazy-load others (default)
```

## Rules
- Default to Server Components — only add `'use client'` when you need interactivity
- Colocate data fetching with the component that needs it (no prop drilling)
- Use `loading.tsx` + `Suspense` for streaming — avoids blocking entire page
- Server Actions over API routes for mutations from forms
- `revalidateTag` over `revalidatePath` — more granular, less cache busting
