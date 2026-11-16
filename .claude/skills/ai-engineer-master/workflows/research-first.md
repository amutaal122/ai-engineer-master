# Workflow: Research First

**When to use:** Before ANY new feature, library choice, architecture decision, or AI model selection. Research BEFORE building — always.

**Agents:** researcher → architect → developer → qa-engineer

---

## Phase 1 — Research (researcher)

**TASK:** Investigate the problem space before any design decisions.

**OBJECTIVE:** Produce a Research Brief with verified findings and a clear recommendation.

**INPUT FILES:**
- Requirements doc or user story (if any)
- Existing codebase context

**EXPECTED OUTPUT:**
- `research/brief-[topic]-[date].md` — structured Research Brief (see researcher agent format)

**CONSTRAINTS:**
- Minimum 3 independent sources for any recommendation
- Flag confidence level: High / Medium / Low
- Note source dates — tech info expires fast

**ACCEPTANCE CRITERIA:**
- [ ] Sub-questions identified and answered
- [ ] Trade-offs documented (not just the winner)
- [ ] Recommendation is actionable: "Use X because Y, implement as Z"
- [ ] Open questions listed for architect review

---

## Phase 2 — Architecture (architect)

**TASK:** Design solution based on research findings.

**OBJECTIVE:** Produce Architecture Decision Record (ADR) + system design.

**INPUT FILES:**
- `research/brief-[topic]-[date].md`

**EXPECTED OUTPUT:**
- `docs/adr/ADR-[N]-[topic].md` — Architecture Decision Record

**ADR FORMAT:**
```markdown
# ADR-N: [Title]
**Date:** YYYY-MM-DD  **Status:** Proposed / Accepted / Deprecated

## Context
[What problem this solves]

## Decision
[What we decided and why]

## Alternatives considered
| Option | Pro | Con | Rejected because |
|---|---|---|---|

## Consequences
[What changes, what risks, what we gain]
```

**ACCEPTANCE CRITERIA:**
- [ ] All research findings addressed
- [ ] At least 2 alternatives considered
- [ ] Risks documented

---

## Phase 3 — Implementation (developer)

**TASK:** Build according to ADR and research brief.

**OBJECTIVE:** Working implementation with tests.

**INPUT FILES:**
- `docs/adr/ADR-[N]-[topic].md`
- `research/brief-[topic]-[date].md`

**CONSTRAINTS:**
- Do not deviate from ADR without updating it first
- If research said "don't do X" — don't do X

**ACCEPTANCE CRITERIA:**
- [ ] Implementation matches ADR
- [ ] Unit + integration tests written
- [ ] No shortcuts that research flagged as anti-patterns

---

## Phase 4 — Validation (qa-engineer)

**TASK:** Validate implementation against research-identified risks.

**OBJECTIVE:** Confirm the implementation actually solves what research identified.

**ACCEPTANCE CRITERIA:**
- [ ] Edge cases from research brief tested
- [ ] Performance targets from research met
- [ ] Security concerns from research addressed
