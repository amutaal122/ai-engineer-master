---
name: System Design
description: Design systems and record the decisions — ADRs, capacity math, consistency choices, failure modes, caching layers, queues, and the scaling patterns that matter before you need them. Use before building anything non-trivial, or when reviewing an existing architecture.
triggers: [system design, architecture, adr, architecture decision record, scalability, how should i structure, design review, capacity planning, consistency, cap theorem, microservices, monolith, queue, caching strategy]
version: "1.0"
source: community
---

# System Design Skill

## § RULES
- Do the capacity arithmetic before choosing components. Most systems are far smaller than their design assumes.
- Every significant decision gets an ADR, and the ADR records the rejected options with reasons.
- Start with a monolith unless you can name the specific scaling or team boundary that forces a split.
- Name the failure mode of every network call before writing it.
- Prefer boring technology. Novelty is a budget — spend it on the actual problem.

---

## Capacity first

Before any diagram:

```
DAU × actions/user/day ÷ 86,400          = average RPS
average RPS × peak factor (3–10×)        = peak RPS
rows/day × bytes/row × retention         = storage
peak RPS × payload                        = bandwidth
```

Run the numbers. 1M DAU doing 10 actions/day is ~116 average RPS — a single well-tuned server. Most "we need microservices" conversations end here.

---

## Latency budget

Allocate the user-facing target across hops, then design to fit:

| Operation | Order of magnitude |
|---|---|
| Memory read | 100 ns |
| SSD random read | 100 µs |
| Same-DC round trip | 0.5 ms |
| Database query (indexed) | 1–10 ms |
| Cross-region round trip | 50–150 ms |
| LLM call | 1–30 s |

An LLM call dominates everything else by three orders of magnitude. If your design has two sequential model calls in the request path, that is your architecture — optimise it or make it asynchronous.

---

## Consistency: pick deliberately, per-operation

| Need | Use |
|---|---|
| Money, inventory, auth | strong — a transaction |
| Feeds, counts, search | eventual — accept a stale read |
| User's own writes | read-your-writes — route to primary after a write |

The common bug is a UI that writes to a primary and immediately reads from a replica. Decide this per operation, not once for the system.

---

## Scaling order

Work down this list; stop when the numbers are satisfied.

1. **Measure** — find the actual bottleneck
2. **Index and fix queries** — usually the whole problem
3. **Cache** — read-heavy, tolerant of staleness
4. **Scale vertically** — a bigger box is cheap compared to engineering time
5. **Read replicas** — read-heavy workloads
6. **Queue the slow work** — anything not needed for the response
7. **Scale horizontally** — stateless services first
8. **Shard** — last resort; it makes every query and migration harder

---

## Caching

| Pattern | Reads | Writes | Risk |
|---|---|---|---|
| Cache-aside | app checks cache, falls back to DB | app invalidates | stampede on expiry |
| Write-through | always fresh | slower writes | cache churn on rarely-read data |
| Write-behind | fast | async flush | data loss on crash |

Always set a TTL, even with explicit invalidation — it bounds how wrong you can be. Guard against stampede with a lock or jittered expiry.

Cache invalidation is hard because it is a distributed-consistency problem in disguise. The best cache key is one that changes when the content changes.

---

## Queues

Queue anything not needed to answer the request: email, thumbnails, indexing, webhooks, long model calls.

Non-negotiables:
- **Idempotent consumers** — every queue redelivers eventually
- **Dead-letter queue** — with an alert; a silent DLQ is a data-loss bug
- **Visibility timeout > worst-case processing time**, or you process twice
- **Explicit ordering stance** — most queues do not guarantee it

---

## Writing the ADR

```markdown
# ADR-00N: <decision>
Status: proposed | accepted | superseded by ADR-00M
Date: YYYY-MM-DD

## Context
Forces at play, with the capacity numbers.

## Decision
What we are doing.

## Alternatives considered
- X — rejected because …
- Y — rejected because …

## Consequences
Easier / harder / locked in.
```

Six months later the Alternatives section is the only part anyone needs.

---

## Caveats
- A design nobody can operate is not a good design — involve the sre-engineer before finalising.
- Microservices trade a code problem for a distributed-systems problem. Make that trade consciously.
- For AI systems, token cost and provider rate limits are first-class capacity constraints.
