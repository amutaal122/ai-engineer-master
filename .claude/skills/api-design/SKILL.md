---
name: API Design
description: Design HTTP APIs that survive their consumers — resource modeling, status codes, error shapes, pagination, idempotency, versioning, and what counts as a breaking change. Use before implementing an endpoint and when reviewing an API change.
triggers: [api design, rest api, endpoint design, http status code, api versioning, breaking change, pagination, idempotency, error response, openapi, api contract, rate limiting]
version: "1.0"
source: community
---

# API Design Skill

## § RULES
- Design the error responses with the same care as the success ones. Consumers spend most of their debugging there.
- Every mutating endpoint that a client might retry needs an idempotency story.
- Adding a required request field or removing any response field is breaking. Version it or don't do it.
- Paginate every list endpoint from day one. Retrofitting pagination is a breaking change.
- Return the created or updated resource. Forcing a follow-up GET doubles the round trips.

---

## Resources, not actions

```
GET    /orders?status=pending    list
POST   /orders                   create
GET    /orders/{id}              read
PATCH  /orders/{id}              partial update
DELETE /orders/{id}              delete
```

For genuine verbs that do not map to CRUD, a sub-resource is clearer than contorting the model:

```
POST /orders/{id}/cancel
POST /orders/{id}/refunds
```

Plural nouns, lowercase, hyphens. Be consistent above all — a predictable API beats a clever one.

---

## Status codes that mean something

| Code | Use for |
|---|---|
| 200 | success with a body |
| 201 | created — include a `Location` header |
| 202 | accepted, work is async — return a status URL |
| 204 | success, no body |
| 400 | malformed request |
| 401 | not authenticated |
| 403 | authenticated but not allowed |
| 404 | not found — **also use for "exists but you may not see it"** |
| 409 | conflict with current state |
| 422 | well-formed but semantically invalid |
| 429 | rate limited — include `Retry-After` |
| 503 | temporarily down — include `Retry-After` |

Never return 200 with `{"error": ...}`. Clients branch on the status code; a 200 error body breaks every generic retry layer.

---

## One error shape, everywhere

```json
{
  "error": {
    "code": "insufficient_funds",
    "message": "Balance 42.00 is below the required 99.00",
    "details": [{"field": "amount", "issue": "exceeds_balance"}],
    "request_id": "req_01HX…"
  }
}
```

- `code` is a stable machine-readable string — consumers switch on it, so **changing it is breaking**
- `message` is for humans and may change freely
- `request_id` on every response, success or failure. It is the single most useful field you will ship.

---

## Pagination

Cursor-based, by default:

```
GET /orders?limit=50&cursor=eyJpZCI6MTIzfQ

{ "data": [...], "next_cursor": "eyJpZCI6MTczfQ", "has_more": true }
```

Offset pagination skips and duplicates rows when the underlying data changes between pages, and gets slower the deeper you go. Use it only for small, static datasets.

Always cap `limit` server-side.

---

## Idempotency

Networks retry. Without idempotency, a timeout on `POST /payments` leaves the client unable to know whether it charged the customer.

```
POST /payments
Idempotency-Key: 01HX8Z...
```

Server stores the key with the response for 24h+; a repeat key returns the stored response instead of acting again. `PUT` and `DELETE` are naturally idempotent; `POST` and `PATCH` are not.

---

## Versioning

Prefer never breaking. When you must:

| Approach | Note |
|---|---|
| URL path `/v2/orders` | most visible, easiest to route and cache |
| Header `Accept: application/vnd.api.v2+json` | cleaner URLs, easy to get wrong |
| Date version `2026-01-15` | good for many small changes |

Whichever you pick: announce, run both, give a deprecation window with dates, and emit `Deprecation` / `Sunset` headers so clients can detect it in CI.

### Breaking vs not

| Safe | Breaking |
|---|---|
| add an optional request field | add a required request field |
| add a response field | remove or rename a response field |
| add a new endpoint | change a status code |
| add a new enum value in a *request* | add a new enum value in a *response* |
| relax validation | tighten validation |

---

## Rate limiting

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1735689600
Retry-After: 30
```

Return 429, not 503. Tell the client when to come back — otherwise it retries immediately and makes the problem worse.

---

## Caveats
- Write the OpenAPI spec first and generate from it; a spec derived from the implementation documents bugs as behaviour.
- `PATCH` semantics are underspecified — say whether you accept JSON Merge Patch or a partial object, and whether `null` clears a field.
- For long-running AI calls, prefer 202 plus a status endpoint, or SSE streaming, over a request that holds a connection for 30 seconds.
