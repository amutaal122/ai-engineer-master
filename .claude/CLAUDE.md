# AI Engineer Master System

Professional skill system for AI / ML / Data Science / Data Analytics engineers.
**61 skills · 13 agents · 12 commands · 4 workflows**

---

## Quick Start

```bash
# Start any project with research first
/research-first        # always research before building

# Full AI product pipeline
/master-pipeline       # 7 phases, 20 agents, idea → production

# New project from scratch
/greenfield-project    # complete scaffolding

# Building an LLM feature
/prompt-dev            # research → design → eval → ship
```

---

## Skills by Domain

### LLM / AI Engineering
| Skill | Use when |
|---|---|
| `/openai-sdk` | OpenAI API — completions, function calling, embeddings |
| `/langchain` | LLM chains, RAG, agents, memory |
| `/huggingface` | Local models, fine-tuning, embeddings, datasets |
| `/prompt-engineering` | Write, optimize, evaluate prompts |
| `/llm-evaluation` | Eval strategy, metrics, golden sets |
| `/ai-engineer` | Production LLM apps, RAG, agent orchestration |

### ML / Data Science
| Skill | Use when |
|---|---|
| `/pandas` | Data loading, cleaning, transformation, pipelines |
| `/scikit-learn` | ML pipelines, training, evaluation, hyperparameter tuning |
| `/huggingface` | Deep learning models, fine-tuning, transformers |
| `/postgres` | SQL queries, indexes, window functions, analytics |
| `/mongodb` | NoSQL, flexible schema, document store |
| `/ab-testing` | Experiment design, statistical testing, rollout |

### AI Agent Development
| Skill | Use when |
|---|---|
| `/ai-agents-architect` | Agent architecture, tool use, memory, planning |
| `/ai-agent-tool-routing` | Tool registry, MCP router, parameter schemas |
| `/ai-agent-security` | Prompt injection, tool abuse, data exfiltration defense |
| `/ai-coding-agent-guardrails` | Secure Claude Code, Cursor, Copilot in teams |
| `/agent-memory-discipline` | When to recall/save from long-term memory |

### Backend / API
| Skill | Use when |
|---|---|
| `/fastapi` | Async REST APIs, Pydantic, dependency injection |
| `/sqlalchemy` | Async ORM, models, Alembic migrations |
| `/redis` | Caching, rate limiting, pub/sub, LLM response cache |
| `/celery` | Background tasks, beat scheduler, LLM job queues |
| `/graphql` | GraphQL schema, resolvers, subscriptions |

### Infrastructure / DevOps
| Skill | Use when |
|---|---|
| `/docker` | Multi-stage builds, compose, secrets, production |
| `/kubernetes` | Deployments, HPA, ingress, AI workload sizing |
| `/github-actions` | CI/CD, Docker publish, ML eval CI |
| `/mcp-builder` | Build MCP servers for LLM tool integration |

### Quality / Security
| Skill | Use when |
|---|---|
| `/pytest` | Unit, integration, async tests, fixtures |
| `/security-audit` | Web app, API security, penetration testing |
| `/ai-agent-evaluation-benchmarking` | Agent benchmarks, task completion rates |
| `/agent-qa-authoring` | Agent QA tests, suites, hooks |
| `/webapp-testing` | E2E testing, browser automation |

### UI / GPT Apps
| Skill | Use when |
|---|---|
| `/ui-design` | Design tokens, layout, dark mode, components, accessibility |
| `/gpt-chat-ui` | ChatGPT-style chat app with streaming, history, tool calls |

### Research (ML)
| Skill | Topic |
|---|---|
| `/research-01-model-architecture` | Transformer internals |
| `/research-02-tokenization` | BPE, tokenization strategies |
| `/research-03-fine-tuning` | SFT, LoRA, PEFT |
| `/research-04-mechanistic-interpretability` | SAE, circuits |
| `/research-05-data-processing` | Data curation, cleaning |
| `/research-06-post-training` | RLHF, DPO, reward models |
| `/research-07-safety-alignment` | Alignment, red-teaming |
| `/research-08-distributed-training` | FSDP, DeepSpeed |
| `/research-09-infrastructure` | GPU clusters, storage |
| `/research-10-optimization` | Quantization, pruning |
| `/research-11-evaluation` | Benchmarks, eval harness |
| `/research-12-inference-serving` | vLLM, TGI, TensorRT |
| `/research-13-mlops` | MLflow, experiment tracking |
| `/research-14-agents` | Agent patterns, planning |
| `/research-15-rag` | RAG pipelines, retrieval |
| `/research-16-prompt-engineering` | Advanced prompting |
| `/research-17-observability` | LLM observability |
| `/research-18-multimodal` | Vision-language models |
| `/research-19-emerging-techniques` | GRPO, speculative decoding |

---

## Agents

| Agent | Role |
|---|---|
| `researcher` | Research FIRST — stack, models, competitive |
| `ux-researcher` | User interviews, JTBD, friction |
| `prompt-engineer` | System prompts, few-shot, eval rubrics |
| `data-analyst` | Metrics, SQL, cohort, A/B analysis |
| `performance-engineer` | Profiling, latency budget, optimization |
| `observability-engineer` | Metrics, logs, traces, SLO |
| `api-integrator` | OAuth, webhooks, retry, rate limiting |
| `dependency-auditor` | CVE scan, license check |
| `code-reviewer` | Correctness, security, architecture review |
| `security-auditor` | Vulnerability detection, threat modeling |
| `test-engineer` | Test strategy, coverage, QA |
| `web-performance-auditor` | Core Web Vitals, loading, rendering |
| `ui-designer` | UI design, tokens, dark mode, chat and dashboard layouts |

---

## Commands

| Command | Action |
|---|---|
| `/build` | Build the current feature |
| `/plan` | Plan implementation before coding |
| `/spec` | Write technical spec |
| `/review` | Code review current changes |
| `/test` | Write tests for current code |
| `/ship` | Pre-ship checklist |
| `/code-simplify` | Simplify and clean current code |
| `/constraints` | List technical constraints |
| `/webperf` | Web performance audit |

---

## Rules (applied to every project)

1. **Research first** — never design or code without a research brief
2. **Pydantic everywhere** — validate at all API boundaries
3. **Async throughout** — no blocking I/O in async contexts
4. **No secrets in code** — env vars only
5. **Eval before ship** — every AI feature needs a golden test set
6. **Pipeline over manual** — always use sklearn Pipeline (no data leakage)
7. **Pin versions** — exact versions in requirements, never `>=`
8. **Observe everything** — structured logs, traces, token cost tracking
