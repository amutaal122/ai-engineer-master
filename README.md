# AI Engineer Master

> Professional Claude Code skill system for **AI · ML · Data Science · Data Analytics** engineers.
> Build any project at professional job level — right structure first, then enhance.

## At a Glance

| | Count |
|---|---|
| Skills | 61 |
| Agents | 13 |
| Commands | 9 |
| Workflows | 4 |

---

## Engineer Master Assistant

`docs/engineer-master-assistant.html` is a single-file assistant for this skill system. Open it in a browser:
recommends skills and agents for your project, plans it across the 7 phases (`/plan <idea>`), and browses
the full catalog. It works offline from the skill files, or with an OpenAI / Anthropic key in Settings.

Rebuild it after you change skills:
```bash
cd tools/assistant
node gen-kb.js ../.. kb.json && node build-assistant.js
```
Copy the new `master-assistant-standalone.html` to `docs/engineer-master-assistant.html`.

---

## Install (any project)

```bash
git clone https://github.com/amutaal122/ai-engineer-master.git temp
xcopy /E /I temp\.claude .claude
rmdir /S /Q temp
```

PowerShell:
```powershell
git clone https://github.com/amutaal122/ai-engineer-master.git temp
Copy-Item temp\.claude .claude -Recurse
Remove-Item temp -Recurse -Force
```

---

## Skills

### LLM / AI Engineering
- `anthropic-sdk` — Claude API, streaming, tool use, prompt caching
- `openai-sdk` — GPT API, function calling, embeddings
- `langchain` — LLM chains, RAG, agents, LangSmith
- `huggingface` — transformers, fine-tuning, PEFT/LoRA, embeddings
- `prompt-engineering` — write, optimize, evaluate prompts
- `llm-evaluation` — eval strategy, golden sets, metrics
- `ai-engineer` — production LLM apps, RAG, orchestration

### ML / Data Science
- `pandas` — data loading, cleaning, transformation, time series
- `scikit-learn` — ML pipelines, cross-val, tuning, evaluation
- `postgres` — SQL, indexes, window functions, analytics
- `mongodb` — NoSQL, flexible schema, aggregation pipelines
- `ab-testing` — experiment design, statistical testing

### AI Agent Development
- `ai-agent-development` — autonomous agents, CrewAI, LangGraph
- `ai-agents-architect` — architecture, tool use, memory, planning
- `ai-agent-tool-routing` — tool registry, MCP router
- `ai-agent-security` — prompt injection defense, guardrails
- `ai-code-generation-guardrails` — reviewing AI-generated code
- `ai-coding-agent-guardrails` — secure Claude Code in teams
- `ai-agent-evaluation-benchmarking` — agent benchmarks
- `agent-memory-discipline` — long-term memory patterns
- `agent-qa-authoring` — agent QA tests and suites

### Backend / API
- `fastapi` — async REST APIs, Pydantic, OpenAPI
- `sqlalchemy` — async ORM, Alembic migrations
- `redis` — caching, rate limiting, pub/sub, LLM cache
- `celery` — background tasks, beat scheduler
- `graphql` — schema, resolvers, subscriptions

### Infrastructure / DevOps
- `docker` — multi-stage builds, compose, production
- `kubernetes` — deployments, HPA, ingress, AI workloads
- `github-actions` — CI/CD, Docker publish, eval CI
- `mcp-builder` — MCP servers for LLM tool integration

### Testing / Security / Quality
- `pytest` — fixtures, async tests, coverage
- `security-audit` — web app + API security
- `webapp-testing` — E2E, browser automation
- `git-advanced` — rebase, stash, bisect, hooks
- `git-workflow` — branching, PRs, release strategy

### UI / GPT Apps
- `ui-design` — design tokens, typography, layout, dark mode, components, accessibility
- `gpt-chat-ui` — ChatGPT-style chat app: SSE streaming, markdown, tool calls, history

### ML Research (20 skills)
Deep reference skills covering model architecture, tokenization, fine-tuning, interpretability, data processing, post-training, safety, distributed training, inference serving, MLOps, RAG, and emerging techniques.

---

## Agents

| Agent | Role |
|---|---|
| `researcher` | Research before anything — stack, models, competitive |
| `ux-researcher` | User interviews, JTBD mapping |
| `prompt-engineer` | System prompts, few-shot, eval rubrics |
| `data-analyst` | Metrics, SQL analysis, cohort, A/B |
| `performance-engineer` | Profiling, latency budget |
| `observability-engineer` | Metrics, logs, traces, SLOs |
| `api-integrator` | OAuth, webhooks, retry logic |
| `dependency-auditor` | CVE scan, license compliance |
| `code-reviewer` | Code correctness, security, architecture |
| `security-auditor` | Vulnerability detection, threat modeling |
| `test-engineer` | Test strategy and coverage |
| `web-performance-auditor` | Core Web Vitals, rendering |
| `ui-designer` | UI design, tokens, dark mode, chat and dashboard layouts |

---

## Workflows

| Workflow | Agents | Use for |
|---|---|---|
| `master-pipeline` | 20 agents · 7 phases | Any serious AI product |
| `greenfield-project` | 9 agents · 10 phases | New project from zero |
| `prompt-dev` | 4 agents · 5 phases | LLM prompt iteration |
| `research-first` | 4 agents · 4 phases | Before every feature |

### Master Pipeline Phases
```
1. Research   → researcher · ux-researcher
2. Design     → architect · schema-designer · prompt-engineer
3. Build      → developer · api-integrator · feature-flag-engineer
4. Quality    → contract-tester · qa-engineer · ml-evaluator · performance-engineer
5. Security   → security-reviewer · dependency-auditor · compliance-reviewer
6. Ship       → tech-writer · devops-engineer
7. Operate    → observability-engineer · sre-engineer · data-analyst · incident-commander
```

---

## Philosophy

- Research first — never skip it
- Lightweight but complete — every skill fits in one file
- Professional job level — covers junior to staff engineer
- AI/ML first — built for LLM products, not generic CRUD apps
