---
description: End-to-end developer workflow from ticket to production and back — 9 stages, 14 agents, with explicit gates, artifacts and rollback at every step.
---

# Workflow: Developer Complete

**When to use:** Any feature or change big enough to need more than one sitting. This is the full lifecycle — ticket to production to the feedback loop. For a one-line fix, skip to Stage 4.

**Agents:** researcher → architect · schema-designer → developer · feature-flag-engineer → test-engineer · qa-engineer · contract-tester · ml-evaluator → code-reviewer · security-reviewer · compliance-reviewer → tech-writer · devops-engineer → sre-engineer · observability-engineer → data-analyst · incident-commander

**The rule that makes this work:** every stage has an exit gate. You do not proceed because time passed; you proceed because the gate is satisfied. A gate you skip becomes a defect you pay for two stages later, at roughly ten times the cost.

---

## Stage 0 — Understand the ticket

**TASK:** Establish what is actually being asked before anyone opens an editor.

**OUTPUT:** A restated problem, in your words, with the acceptance criteria made testable.

**CONSTRAINTS:**
- Vague criteria ("should be fast") are rewritten as measurable ones ("p95 under 400 ms") or sent back
- Name what is explicitly out of scope

**GATE:**
- [ ] You can state the problem without reading the ticket again
- [ ] Every acceptance criterion is something you could write a test for
- [ ] Out-of-scope is written down

> Skipping this is the single most expensive habit in software. Most rework comes from building the wrong thing correctly.

---

## Stage 1 — Research (researcher)

**TASK:** Investigate before deciding. Prior art, library options, how the existing codebase already solves adjacent problems.

**OUTPUT:** `research/brief-<topic>-<date>.md`

**CONSTRAINTS:**
- Minimum 3 independent sources for any recommendation
- Note source dates — technical information expires fast
- Check the codebase first; the pattern you need often already exists

**GATE:**
- [ ] Trade-offs documented, not just the winner
- [ ] Recommendation is actionable: "use X because Y, implemented as Z"
- [ ] Confidence level stated: high / medium / low

**Skip when:** the approach is already established in the codebase.

---

## Stage 2 — Design (architect, schema-designer)

**TASK:** Turn the research into a design and record why.

**OUTPUT:**
- `docs/adr/ADR-00N-<slug>.md`
- Component diagram with trust boundaries marked
- Schema DDL, index list, migration plan

**CONSTRAINTS:**
- Capacity arithmetic before component choice (see `system-design`)
- Every network call has a named failure mode
- Every migration has an expand/contract sequence and a rollback note
- Trust boundaries handed explicitly to Stage 5

**GATE:**
- [ ] ADR lists rejected alternatives with reasons
- [ ] Every nullable column has exactly one meaning
- [ ] Migration can run while the old code is still deployed
- [ ] PII fields flagged for compliance review

**Skip when:** no new component, no schema change, no new dependency.

---

## Stage 3 — Plan the slices

**TASK:** Break the design into increments that each leave the system working.

**OUTPUT:** An ordered task list, each one sentence, each independently verifiable.

**GATE:**
- [ ] Every slice can be described in one sentence
- [ ] Every slice has an acceptance criterion
- [ ] Slices are ordered so the system is never broken between them

---

## Stage 4 — Build (developer, feature-flag-engineer)

**TASK:** Implement slice by slice.

Per slice: failing test → minimum code → full suite → commit.

**OUTPUT:** Working code, one commit per slice; flag definition if gated.

**CONSTRAINTS:**
- Touch only files the slice requires
- Unrelated problems get written down, not fixed
- No speculative abstraction; three similar lines beat a premature base class
- Secrets from the environment, never a literal
- Risky changes go behind a flag — default off, fail closed, owner and removal date at creation

**GATE:**
- [ ] All slices complete, tests green, build passes
- [ ] No commented-out code, debug prints, or unowned TODOs
- [ ] Deferred items written down

**If the design turns out wrong:** stop and return to Stage 2. Do not silently redesign mid-build.

---

## Stage 5 — Verify (test-engineer, qa-engineer, contract-tester, ml-evaluator)

**TASK:** Prove it works, including where it was not designed to.

**OUTPUT:** Test suite, QA report, contract verdict, eval report if model-backed.

**CONSTRAINTS:**
- test-engineer: unit for logic, integration for boundaries, E2E for critical flows only
- qa-engineer: tests against acceptance criteria, not the diff; works the edges
- contract-tester: classifies the change compatible or breaking; breaking needs a migration path before merge
- ml-evaluator: golden set, metrics with baselines, ship/no-ship threshold

**GATE:**
- [ ] Every acceptance criterion exercised, with a result
- [ ] Edge cases probed: boundaries, nulls, unicode, concurrency, permissions, failure injection
- [ ] No breaking contract change without a named migration path
- [ ] For model changes: metric deltas against baseline, with sample size
- [ ] Anything untested is stated as untested

---

## Stage 6 — Review (code-reviewer, security-reviewer, compliance-reviewer)

**TASK:** Three independent reads with different questions.

**OUTPUT:** Review findings, severity-ranked; a merge verdict.

**CONSTRAINTS:**
- code-reviewer: correctness, readability, architecture, security, performance
- security-reviewer: scoped to the diff, against Stage 2's trust boundaries; findings must describe a concrete attack
- compliance-reviewer: data inventory, retention, consent, audit trail — runs only if PII or automated decisions are involved

**GATE:**
- [ ] No blocker findings open
- [ ] Should-fix items either fixed or ticketed with an owner
- [ ] No secrets in the diff, logs, or error messages

---

## Stage 7 — Ship (tech-writer, devops-engineer)

**TASK:** Document it and get it running, with a way back.

**OUTPUT:** Docs/changelog/runbook, pipeline run, deployed artifact, rollback procedure.

**CONSTRAINTS:**
- Build once, promote the artifact; config from the environment
- Migrations follow expand → backfill → migrate → contract, deployed separately from code
- Ramp a flagged change: internal → 1% → 5% → 25% → 100%, checking metrics between steps
- Rollback must have been executed at least once, not just written down

**GATE:**
- [ ] Rollback path exists and is tested — including for the migration
- [ ] Smoke tests pass against the deployed environment
- [ ] Runbook written for anything that can page someone
- [ ] Changelog states what changed and what consumers must do

---

## Stage 8 — Operate (sre-engineer, observability-engineer)

**TASK:** Make the new behaviour visible and make failure detectable.

**OUTPUT:** SLI/SLO definitions, dashboards, burn-rate alerts with runbook links.

**CONSTRAINTS:**
- Instrument boundaries: inbound, outbound, queue, DB
- Alert on user-visible symptoms; causes go on dashboards
- Every alert links to a runbook and has a human action
- For AI features also track: tokens, cost per request, time to first token, refusal rate, tool-call errors — labelled with model and prompt version

**GATE:**
- [ ] You can answer "is it working" from a dashboard in under a minute
- [ ] Every new alert has a runbook
- [ ] Error budget policy agreed before it is needed

---

## Stage 9 — Learn (data-analyst, incident-commander)

**TASK:** Find out whether it did what it was supposed to.

**OUTPUT:** An impact readout against the original acceptance criteria; a postmortem if anything broke.

**CONSTRAINTS:**
- Measure the metric the ticket claimed it would move
- Flag cleanup: release flags past their removal date are debt
- Incidents get a blameless postmortem within a few days, with owned and dated actions

**GATE:**
- [ ] Outcome measured against Stage 0's criteria
- [ ] Release flags removed, dead branches deleted
- [ ] Postmortem actions tracked like any other work

---

## Compressing this

Full workflow for a significant feature. For smaller work:

| Change | Stages |
|---|---|
| One-line fix | 4 → 6 → 7 |
| Bug fix | 0 → 4 (failing test first) → 5 → 6 → 7 |
| Small feature, known pattern | 0 → 3 → 4 → 5 → 6 → 7 → 8 |
| New component or schema | all |
| Model or prompt change | 0 → 4 → 5 (ml-evaluator) → 6 → 7 → 8 → 9 |

Compressing is fine. Compressing *silently* is not — say which stages you skipped and why, so the gap is a decision rather than an oversight.

---

## Related

- `system-design`, `api-design`, `debugging` — Stage 2 and 4 reference material
- `observability`, `incident-response` — Stages 8 and 9
- `master-pipeline` — the 7-phase AI-product variant of this workflow
- `research-first` — Stage 1 on its own
