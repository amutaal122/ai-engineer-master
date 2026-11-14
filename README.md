# AI Engineer Master

A complete Claude Code skill system for AI engineers — 20 agents, 14 skills, and a 7-phase pipeline covering the full AI product lifecycle.

## What's inside

```
.claude/
├── agents/          # 8 specialized agents
├── skills/          # 14 technical skills
│   └── ai-engineer-master/
│       └── workflows/   # 4 workflow blueprints
```

## Agents

| Agent | Role |
|---|---|
| researcher | Tech stack, model selection, competitive analysis |
| ux-researcher | User interviews, JTBD, friction mapping |
| prompt-engineer | System prompts, few-shot, eval rubrics |
| data-analyst | Metrics, cohort analysis, SQL patterns |
| performance-engineer | Profiling, latency budget, flamegraphs |
| observability-engineer | Metrics, logs, traces, SLO alerts |
| api-integrator | OAuth, webhooks, retry, rate limiting |
| dependency-auditor | CVE scan, license check, pin versions |

## Skills

`anthropic-sdk` · `openai-sdk` · `langchain` · `redis` · `celery` · `kubernetes` · `github-actions` · `sqlalchemy` · `docker` · `postgres` · `typescript` · `pytest` · `nextjs` · `git-advanced`

## Workflows

| Workflow | Agents | Use when |
|---|---|---|
| master-pipeline | 20 agents · 7 phases | Any serious AI product |
| greenfield-project | 9 agents · 10 phases | Starting from zero |
| prompt-dev | 4 agents · 5 phases | Building/iterating LLM prompts |
| research-first | 4 agents · 4 phases | Before any new feature |

## 7-Phase Master Pipeline

```
Phase 1 — Research:  researcher · ux-researcher
Phase 2 — Design:    architect · schema-designer · prompt-engineer
Phase 3 — Build:     developer · api-integrator · feature-flag-engineer
Phase 4 — Quality:   contract-tester · qa-engineer · ml-evaluator · performance-engineer
Phase 5 — Security:  security-reviewer · dependency-auditor · compliance-reviewer
Phase 6 — Ship:      tech-writer · devops-engineer
Phase 7 — Operate:   observability-engineer · sre-engineer · data-analyst · incident-commander
```

## Usage

Copy the `.claude/` folder into any project root. Claude Code will auto-load agents and skills.

```bash
# Use a skill
/docker         # Docker multi-stage builds, compose, secrets
/anthropic-sdk  # Messages API, streaming, tool use, prompt caching
/kubernetes     # Deployments, HPA, ingress, resource sizing

# Use a workflow
/research-first          # Research before building anything
/master-pipeline         # Full AI product lifecycle
```
