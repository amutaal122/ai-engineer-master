---
name: Debugging
description: Systematic debugging — reproduce, bisect, form falsifiable hypotheses, read the whole error, and prove the fix. Covers heisenbugs, production-only failures, performance mysteries, and debugging LLM behaviour. Use when something is broken and the cause is not obvious.
triggers: [debug, debugging, not working, why is this failing, cannot reproduce, intermittent bug, heisenbug, works locally, production only, bisect, root cause, stack trace, race condition]
version: "1.0"
source: community
---

# Debugging Skill

## § RULES
- Reproduce it reliably before changing anything. A fix for a bug you cannot reproduce is a guess you cannot verify.
- Read the entire error — the message, the stack, the cause chain, and the first failure, not the last.
- One change at a time. Two simultaneous changes and you learn nothing from the result.
- Write the failing test before the fix. It proves the diagnosis and prevents the regression.
- Never "fix" by adding a retry or a sleep until you know why it fails.

---

## The loop

```
1. Reproduce      reliably, in the smallest possible case
2. Observe        read the full error; gather real data
3. Hypothesise    a falsifiable statement with a predicted observation
4. Test           one change; does the observation match?
5. Fix            minimal change at the actual cause
6. Prove          failing test now passes; full suite still green
```

Most lost time comes from skipping step 1 or guessing at step 3.

---

## Make it reproducible

If it is intermittent, you are missing a variable. Candidates: time, ordering, concurrency, cache state, uninitialised memory, random seeds, locale, timezone, DNS, leftover data from a previous run.

Shrink aggressively. Delete half the input; still fails? Delete half again. A 10-line reproduction usually makes the cause obvious without further work.

---

## Hypotheses must be falsifiable

Bad: "something's wrong with the cache."
Good: "the cache returns a stale value because invalidation runs before the write commits — if so, adding a log of commit and invalidation timestamps will show invalidation first."

Then look. If the prediction fails, the hypothesis is dead; do not patch it to survive.

---

## Bisect

Worked before, broken now — let git find it:

```bash
git bisect start
git bisect bad
git bisect good v1.2.0
# repeat: git bisect good | git bisect bad
git bisect run ./test.sh      # automated
git bisect reset
```

Ten commits of history is three or four steps. Bisect also works on configuration, dependency versions, and data — halve any space you can order.

---

## "Works on my machine"

Diff the environments systematically, in this order:

1. **Data** — production has nulls, duplicates, unicode and volumes your fixtures do not
2. **Config** — env vars, feature flags, secrets
3. **Versions** — runtime, dependencies, OS, container base
4. **Concurrency** — one user locally, thousands in production
5. **Network** — latency, timeouts, proxies, DNS
6. **Resources** — memory and CPU limits that do not exist on your laptop

Data is first because it is first most of the time.

---

## Performance mysteries

Measure; never guess. Profile before optimising, and confirm what kind of slow it is:

| Symptom | Likely |
|---|---|
| slow with more rows, fine with few | missing index, or N+1 query |
| slow after running a while | leak, or unbounded cache |
| slow under concurrency only | lock contention, or pool exhaustion |
| occasional slow spikes | GC, a cold cache, or a retry storm |

For N+1, log the query count per request — it is the single most common web performance bug.

---

## Debugging LLM behaviour

Non-determinism is not an excuse to stop being systematic:

- Pin the seed and temperature to 0 where the API allows it
- Log the **exact** final prompt, not the template
- Bisect the prompt: remove sections until behaviour changes
- Distinguish *the model got it wrong* from *the parsing got it wrong* — log the raw response before any post-processing
- Run it 10 times before concluding anything about a change

---

## When stuck

Explain the problem out loud, line by line, to someone or something. You will usually find it mid-sentence.

Then check the assumptions you have not questioned: that the code you are editing is the code that runs, that the build is current, that the config you are reading is the config that is loaded, that the test is actually executing.

---

## Caveats
- A bug that disappears when you add logging is a race condition or a memory error; the logging changed the timing or the layout.
- Resist fixing the symptom at the boundary — the null check at the top of the function hides the question of why it was null.
- If a fix works and you do not know why, you have not finished.
