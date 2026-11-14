# Workflow: Greenfield Project

**When to use:** Starting a brand-new project from zero. Full pipeline from idea to deployed, tested, documented service.

**Agents:** researcher → architect → schema-designer → developer → prompt-engineer (if AI) → security-reviewer → qa-engineer → devops-engineer → tech-writer

---

## Phase 1 — Research (researcher)

**TASK:** Research the problem domain, tech stack options, and competitive landscape.

**OBJECTIVE:** Validated tech stack recommendation + identified risks.

**EXPECTED OUTPUT:**
- `research/stack-decision.md`
- `research/competitive-analysis.md`

**KEY QUESTIONS TO ANSWER:**
1. What does the user actually need? (JTBD)
2. What stack fits: Python/FastAPI vs Node vs Go?
3. What AI/LLM provider: Anthropic vs OpenAI vs open-source?
4. What database: Postgres vs Mongo vs vector DB?
5. What are known failure modes in similar systems?

---

## Phase 2 — Architecture (architect)

**TASK:** Define high-level architecture, component boundaries, data flow.

**EXPECTED OUTPUT:**
- `docs/architecture.md` — C4 model (Context, Containers, Components)
- `docs/adr/` — ADRs for every major decision

**ACCEPTANCE CRITERIA:**
- [ ] All external dependencies identified
- [ ] Auth strategy defined
- [ ] Data model overview
- [ ] Scalability approach (horizontal / vertical / serverless)
- [ ] Observability strategy

---

## Phase 3 — Schema (schema-designer)

**TASK:** Design database schema based on architecture.

**EXPECTED OUTPUT:**
- `db/schema.sql` or `models/*.py` (SQLAlchemy)
- `db/migrations/` (Alembic)

**ACCEPTANCE CRITERIA:**
- [ ] 3NF (or documented denormalization reason)
- [ ] UUID PKs for public-facing entities
- [ ] Indexes on all FK columns and query filters
- [ ] Migration safety verified (no blocking ops)

---

## Phase 4 — Scaffolding (developer)

**TASK:** Set up project structure, tooling, CI.

**EXPECTED OUTPUT:**
```
├── src/
│   ├── api/          # FastAPI routes
│   ├── core/         # business logic
│   ├── db/           # SQLAlchemy models + sessions
│   └── services/     # external service clients
├── tests/
├── .github/workflows/ci.yml
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml
└── .env.example
```

**ACCEPTANCE CRITERIA:**
- [ ] uv + ruff + mypy configured
- [ ] CI passing (lint + type + test)
- [ ] Docker build works
- [ ] `.env.example` with all required vars

---

## Phase 5 — Core Features (developer)

**TASK:** Implement core business logic and API endpoints.

**CONSTRAINTS:**
- OpenAPI schema auto-generated (FastAPI)
- Each endpoint ≤ 20 lines — extract to service layer
- No hardcoded values — use settings (Pydantic BaseSettings)

---

## Phase 6 — AI Integration (prompt-engineer) [if applicable]

**TASK:** Design and validate prompts for AI features.

**EXPECTED OUTPUT:**
- `prompts/` — versioned prompt templates
- `evals/` — golden set + eval runner

**ACCEPTANCE CRITERIA:**
- [ ] ≥90% pass rate on golden set
- [ ] Streaming implemented for latency-sensitive paths
- [ ] Prompt caching for large system prompts

---

## Phase 7 — Security (security-reviewer)

**TASK:** Security audit before first deploy.

**CHECKLIST:**
- [ ] Auth on all protected routes
- [ ] Input validation (Pydantic)
- [ ] No secrets in code / logs
- [ ] SQL injection impossible (ORM only)
- [ ] Rate limiting on public endpoints
- [ ] CORS configured correctly

---

## Phase 8 — QA (qa-engineer)

**TASK:** Test coverage for core paths.

**ACCEPTANCE CRITERIA:**
- [ ] ≥80% coverage on `src/`
- [ ] Integration tests with real DB (not mocked)
- [ ] Load test: handles target RPS

---

## Phase 9 — Deploy (devops-engineer)

**TASK:** Production deployment.

**EXPECTED OUTPUT:**
- Kubernetes manifests or Docker Compose prod config
- Monitoring dashboards live
- Alerting configured

---

## Phase 10 — Docs (tech-writer)

**TASK:** API docs + runbook.

**EXPECTED OUTPUT:**
- OpenAPI spec published
- `docs/runbook.md` — how to operate, debug, deploy
- `README.md` — setup + quickstart
