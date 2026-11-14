# Workflow: Master Pipeline (Complete AI Engineer System)

**When to use:** Any serious AI product — from idea to production. This is the full pipeline. Skip phases only with explicit justification.

**All Agents (in order):**
researcher → ux-researcher → architect → schema-designer → prompt-engineer →
developer → api-integrator → feature-flag-engineer → contract-tester →
qa-engineer → ml-evaluator → performance-engineer → security-reviewer →
dependency-auditor → compliance-reviewer → tech-writer →
devops-engineer → observability-engineer → sre-engineer →
data-analyst → incident-commander (on-call)

---

## PHASE 1 — RESEARCH
*"What are we building and why?"*

### 1a. Technical Research (researcher)
**TASK:** Investigate problem domain, tech stack, AI model options, competitive landscape.

**OBJECTIVE:** Validated decisions — no guessing allowed downstream.

**EXPECTED OUTPUT:**
- `research/brief-technical.md` — stack recommendation + trade-offs
- `research/brief-models.md` — LLM/model selection (benchmark data)
- `research/brief-competitive.md` — what competitors do, gaps

**ACCEPTANCE CRITERIA:**
- [ ] ≥3 independent sources per recommendation
- [ ] Model selection includes cost-per-token, latency, benchmark scores
- [ ] Known failure modes documented
- [ ] Confidence: High / Medium / Low stated for each finding

---

### 1b. User Research (ux-researcher)
**TASK:** Understand what users actually need (not what was assumed).

**OBJECTIVE:** Jobs-to-be-done + usability requirements that shape architecture.

**EXPECTED OUTPUT:**
- `research/jtbd.md` — Jobs-to-be-done map
- `research/personas.md` — 2-3 user personas with AI literacy levels
- `research/friction-map.md` — where users currently struggle

**ACCEPTANCE CRITERIA:**
- [ ] ≥5 user interviews or usability sessions
- [ ] At least 1 AI-specific UX concern identified
- [ ] Requirements handed off as: Insight → User Story → Acceptance Criteria

---

## PHASE 2 — DESIGN
*"How will we build it?"*

### 2a. Architecture (architect)
**INPUT:** Research briefs + JTBD

**TASK:** Design system architecture — services, data flow, component boundaries.

**EXPECTED OUTPUT:**
- `docs/architecture.md` — C4 model (Context, Containers, Components)
- `docs/adr/` — ADR for every major technical decision

**ACCEPTANCE CRITERIA:**
- [ ] All external dependencies mapped
- [ ] Auth and authorization strategy defined
- [ ] Observability hooks planned (metrics, logs, traces)
- [ ] AI/LLM integration points identified
- [ ] Scalability approach stated

---

### 2b. Schema Design (schema-designer)
**INPUT:** Architecture doc

**TASK:** Database schema, entity relationships, index strategy, migration plan.

**EXPECTED OUTPUT:**
- `db/schema.sql` or `src/models/*.py`
- `db/migrations/` (Alembic or equivalent)
- `docs/data-model.md`

**ACCEPTANCE CRITERIA:**
- [ ] 3NF (or documented denormalization)
- [ ] UUID PKs on public entities
- [ ] Indexes on all FK + filter columns
- [ ] Zero blocking migrations (CONCURRENTLY, batched)
- [ ] Multi-tenancy strategy if applicable (RLS / schema / DB)

---

### 2c. Prompt Design (prompt-engineer)
**INPUT:** Research brief (model selection) + architecture

**TASK:** Design all LLM prompts — system prompts, few-shot examples, eval rubrics.

**EXPECTED OUTPUT:**
- `prompts/[feature]-v1.md` — versioned prompt per feature
- `evals/golden-set-[feature].jsonl` — ≥20 labeled examples
- `evals/rubric-[feature].md` — scoring criteria

**ACCEPTANCE CRITERIA:**
- [ ] Every prompt has explicit output schema
- [ ] Few-shot covers adversarial + edge cases
- [ ] Eval pass rate target stated before writing code

---

## PHASE 3 — BUILD
*"Make it work."*

### 3a. Core Implementation (developer)
**INPUT:** Architecture, schema, prompt designs

**TASK:** Implement business logic, API endpoints, background jobs.

**CONSTRAINTS:**
- Pydantic validation at all API boundaries
- Async (FastAPI + asyncio) throughout
- No secrets in code — use environment variables
- OpenAPI schema auto-generated

**ACCEPTANCE CRITERIA:**
- [ ] All endpoints from architecture implemented
- [ ] Unit tests for core business logic
- [ ] Error handling returns meaningful messages (not 500 stack traces)

---

### 3b. API Integration (api-integrator)
**INPUT:** Architecture (external services list)

**TASK:** Integrate all third-party APIs — LLM providers, payment, auth, webhooks.

**ACCEPTANCE CRITERIA:**
- [ ] Retry with exponential backoff on all external calls
- [ ] Webhook signatures validated
- [ ] Idempotency keys on all state-changing calls
- [ ] Circuit breaker for each external dependency
- [ ] Secrets in env vars / vault

---

### 3c. Feature Flags (feature-flag-engineer)
**INPUT:** Feature list from architecture

**TASK:** Wrap all new AI features in feature flags for gradual rollout.

**ACCEPTANCE CRITERIA:**
- [ ] Every AI feature behind a flag (default OFF in prod)
- [ ] Rollout plan: 1% → 10% → 50% → 100%
- [ ] Kill switch tested before launch

---

## PHASE 4 — QUALITY
*"Does it work correctly?"*

### 4a. Contract Tests (contract-tester)
**INPUT:** OpenAPI spec + external API contracts

**TASK:** Consumer-driven contract tests for all API boundaries.

**ACCEPTANCE CRITERIA:**
- [ ] Pact consumer tests for every API consumer
- [ ] Provider tests run in CI
- [ ] Breaking change detection (oasdiff) in CI

---

### 4b. QA (qa-engineer)
**INPUT:** All implemented features

**TASK:** Integration + E2E test suite with real infrastructure.

**ACCEPTANCE CRITERIA:**
- [ ] ≥80% code coverage (no mocked DB)
- [ ] Happy path + top 5 failure paths tested
- [ ] Load test: handles 2× expected peak traffic

---

### 4c. AI Quality (ml-evaluator)
**INPUT:** Prompts + golden sets from prompt-engineer

**TASK:** Run evals on all AI features.

**ACCEPTANCE CRITERIA:**
- [ ] ≥90% pass rate on golden set (classification/extraction)
- [ ] ≥80% (generation tasks)
- [ ] Regression eval in CI — blocks deploy on drop > 5%
- [ ] Hallucination audit on 50 random outputs

---

### 4d. Performance (performance-engineer)
**INPUT:** Load test results

**TASK:** Profile, identify bottlenecks, optimize to meet latency budget.

**LATENCY BUDGET:**
- LLM streaming first token: < 500ms
- API endpoint (non-AI): < 200ms
- DB query: < 10ms (cached), < 100ms (cold)
- Vector search: < 50ms

**ACCEPTANCE CRITERIA:**
- [ ] All endpoints within budget at P95
- [ ] Flamegraph attached to PR
- [ ] Before/after numbers documented

---

## PHASE 5 — SECURITY
*"Is it safe to ship?"*

### 5a. Security Review (security-reviewer)
**TASK:** Full security audit.

**CHECKLIST:**
- [ ] Auth on all protected routes (no accidental public endpoints)
- [ ] Input validation at all boundaries (Pydantic + SQL ORM)
- [ ] Rate limiting on all public endpoints
- [ ] No PII in logs
- [ ] CORS configured correctly
- [ ] Secrets not in code, git history, or logs
- [ ] Prompt injection protection (AI inputs sanitized)

---

### 5b. Dependency Audit (dependency-auditor)
**TASK:** CVE scan + license check.

**ACCEPTANCE CRITERIA:**
- [ ] Zero Critical/High CVEs
- [ ] No GPL-contaminated dependencies
- [ ] All deps pinned to exact versions

---

### 5c. Compliance (compliance-reviewer) [if applicable]
**TASK:** GDPR / SOC2 / HIPAA control verification.

**ACCEPTANCE CRITERIA:**
- [ ] Data retention policy implemented
- [ ] Right-to-delete endpoint working
- [ ] Audit log for sensitive operations
- [ ] AI outputs logged for compliance review

---

## PHASE 6 — SHIP
*"Get it to users."*

### 6a. Documentation (tech-writer)
**EXPECTED OUTPUT:**
- `README.md` — setup + quickstart
- `docs/api.md` — OpenAPI published
- `docs/runbook.md` — operate, debug, rollback
- `docs/ai-behavior.md` — what AI does, limitations, known issues

---

### 6b. Deploy (devops-engineer)
**TASK:** Production deployment via CI/CD.

**EXPECTED OUTPUT:**
- Kubernetes manifests or cloud deploy config
- GitHub Actions deploy workflow
- Feature flags set to 1% rollout

**ACCEPTANCE CRITERIA:**
- [ ] Zero-downtime rolling deploy
- [ ] Automated rollback on health check failure
- [ ] Deploy verified in staging first

---

## PHASE 7 — OPERATE
*"Keep it working."*

### 7a. Observability (observability-engineer)
**TASK:** Wire up monitoring, alerts, dashboards.

**EXPECTED OUTPUT:**
- Grafana dashboard: traffic, latency, error rate, AI metrics
- Alerts: SLO burn rate, eval score drop, cost spike
- Runbooks for each alert

**ACCEPTANCE CRITERIA:**
- [ ] Every SLO has an alert
- [ ] Every alert has a runbook
- [ ] Token cost/hour visible in dashboard

---

### 7b. Reliability (sre-engineer)
**TASK:** Define and monitor SLOs.

**SLOs:**
- Availability: ≥99.9%
- API latency P95: ≤2s
- AI quality eval: ≥85%
- Error rate: ≤0.1%

---

### 7c. Analytics (data-analyst)
**TASK:** Define product metrics, build cohort analysis, weekly reporting.

**METRICS TO TRACK:**
- DAU, WAU, retention (D1, D7, D30)
- AI feature adoption rate
- Task success rate (did AI output lead to user action?)
- Cost per user / per request
- Eval score trend over time

---

### 7d. On-Call (incident-commander)
**TASK:** Manage incidents when they occur.

**SEV LEVELS:**
- SEV-1: Full outage → response in 15 min
- SEV-2: Partial degradation → response in 1 hour
- SEV-3: Performance issue → response in 4 hours

**POST-MORTEM:** Required for all SEV-1/2 within 72 hours.

---

## Quick Reference — Agent × Phase

| Phase | Agents |
|---|---|
| Research | researcher, ux-researcher |
| Design | architect, schema-designer, prompt-engineer |
| Build | developer, api-integrator, feature-flag-engineer |
| Quality | contract-tester, qa-engineer, ml-evaluator, performance-engineer |
| Security | security-reviewer, dependency-auditor, compliance-reviewer |
| Ship | tech-writer, devops-engineer |
| Operate | observability-engineer, sre-engineer, data-analyst, incident-commander |

**Total agents: 20 | Phases: 7 | This is the complete system.**
