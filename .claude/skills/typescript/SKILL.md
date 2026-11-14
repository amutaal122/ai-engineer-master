---
name: typescript
description: TypeScript — type patterns, generics, utility types, discriminated unions, type guards, declaration merging, satisfies, and strict-mode best practices.
triggers: [typescript, ts, generic type, utility type, discriminated union, type guard, satisfies, keyof, typeof, infer, mapped type, conditional type, tsconfig]
version: "1.0"
source: https://www.typescriptlang.org/docs
---

# TypeScript

## tsconfig (strict baseline)
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## Utility types
```ts
Partial<T>           // all fields optional
Required<T>          // all fields required
Readonly<T>          // all fields readonly
Pick<T, 'a'|'b'>     // keep only listed keys
Omit<T, 'a'|'b'>     // remove listed keys
Record<K, V>         // object with keys K and values V
Exclude<T, U>        // remove U from union T
Extract<T, U>        // keep only U from union T
NonNullable<T>       // remove null | undefined
ReturnType<typeof fn>
Parameters<typeof fn>[0]
Awaited<Promise<T>>  // unwrap promise → T
```

## Generics
```ts
// Constrained generic
function getField<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Generic with default
type ApiResponse<T = unknown> = { data: T; status: number; };

// Conditional type
type IsArray<T> = T extends any[] ? true : false;

// Infer
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type FirstArg<F> = F extends (a: infer A, ...args: any[]) => any ? A : never;
```

## Discriminated unions
```ts
type Result<T> =
  | { ok: true;  value: T }
  | { ok: false; error: string };

function handle<T>(r: Result<T>) {
  if (r.ok) {
    console.log(r.value);  // narrowed: T
  } else {
    console.log(r.error);  // narrowed: string
  }
}

// Pattern: exhaustive switch
type Shape = { kind: 'circle'; r: number } | { kind: 'rect'; w: number; h: number };
function area(s: Shape): number {
  switch (s.kind) {
    case 'circle': return Math.PI * s.r ** 2;
    case 'rect':   return s.w * s.h;
    default: s satisfies never; throw new Error('unreachable');
  }
}
```

## Type guards
```ts
// User-defined
function isString(v: unknown): v is string {
  return typeof v === 'string';
}

// Class guard
function isDate(v: unknown): v is Date {
  return v instanceof Date;
}

// Assertion function (throws on failure)
function assertDefined<T>(v: T | null | undefined): asserts v is T {
  if (v == null) throw new Error('Expected defined value');
}

// Narrowing with 'in'
if ('email' in user) { /* user has email */ }
```

## Mapped and template literal types
```ts
// Make all methods async
type Async<T> = { [K in keyof T]: T[K] extends (...a: any[]) => any
  ? (...a: Parameters<T[K]>) => Promise<ReturnType<T[K]>>
  : T[K] };

// Template literal
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<'click'>;  // → "onClick"

// Key remapping
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };
```

## `satisfies` operator (TS 4.9+)
```ts
const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
} satisfies Record<string, string | number[]>;

// palette.red is number[] (not string | number[]) — narrowed!
// palette.green is string
```

## Declaration merging / module augmentation
```ts
// Extend Express Request
declare global {
  namespace Express {
    interface Request { user?: User; }
  }
}

// Extend a module
declare module 'some-lib' {
  interface Options { myOption?: boolean; }
}
```

## Strict patterns
```ts
// Never use `any` — use `unknown` + narrow
function parse(raw: unknown): User {
  if (typeof raw !== 'object' || raw === null) throw new Error();
  // narrow further...
}

// Const assertions
const ROLES = ['admin', 'user', 'guest'] as const;
type Role = typeof ROLES[number];  // 'admin' | 'user' | 'guest'

// Branded types (prevent ID confusion)
type UserId = string & { readonly __brand: 'UserId' };
type OrderId = string & { readonly __brand: 'OrderId' };
const uid = '123' as UserId;
// fn(orderId: OrderId) won't accept uid — compile error
```
