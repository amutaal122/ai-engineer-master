# AI Engineer Master

> Professional Claude Code skill system for **AI · ML · Data Science · Data Analytics** engineers.
> Build any project at professional job level — right structure first, then enhance.

## At a Glance

| | Count |
|---|---|
| Skills | 70 |
| Agents | 13 |
| Commands | 10 |
| Workflows | 4 |

---

## Install in Any AI Coding Tool

### Claude Code
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

macOS / Linux:
```bash
git clone https://github.com/amutaal122/ai-engineer-master.git temp
cp -r temp/.claude .claude
rm -rf temp
```

### Cursor / Windsurf / Zed / any tool that reads `.claude/`
Same steps above — the `.claude/` folder is the entire skill system.
Drop it into your project root and restart your editor.

### Quickest (zip download)
1. Download [ai-engineer-master-skills.zip](https://github.com/amutaal122/ai-engineer-master/raw/main/dist/ai-engineer-master-skills.zip)
2. Unzip into your project root — it extracts to `.claude/`

Everything in one download (skills + docs + tools): [ai-engineer-master-complete.zip](https://github.com/amutaal122/ai-engineer-master/raw/main/dist/ai-engineer-master-complete.zip)

---

## Engineer Master Assistant

`docs/engineer-master-assistant.html` — open in any browser. Recommends skills and agents for your project, plans it across the 7 phases (`/plan <idea>`), and browses the full catalog. Works offline or with an OpenAI / Anthropic key in Settings.

Also in `docs/`: `pipeline-orbit.html` (interactive 3D view of the 7-phase pipeline) and `chat-studio.html` (ChatGPT-style chat UI with streaming).

Rebuild after changing skills:
```bash
cd tools/assistant
node gen-kb.js ../.. kb.json && node build-assistant.js
```
Copy `master-assistant-standalone.html` to `docs/engineer-master-assistant.html`.

---

## Skills

### LLM / AI Engineering
| Skill | What it covers |
|---|---|
| `anthropic-sdk` | Claude API, streaming, tool use, prompt caching |
| `openai-sdk` | GPT API, function calling, embeddings |
| `claude-api` | Claude API patterns, model selection, rate limits |
| `langchain` | LLM chains, RAG, agents, LangSmith |
| `huggingface` | Transformers, fine-tuning, PEFT/LoRA, embeddings |
| `prompt-engineering` | Write, optimize, evaluate prompts |
| `llm-evaluation` | Eval strategy, golden sets, metrics |
| `ai-engineer` | Production LLM apps, RAG, orchestration |
| `freellmapi` | Self-hosted free LLM router — 87+ providers, 1,300+ models, OpenAI-compatible |
| `free-claude-code` | Local proxy routing Claude Code/Codex/Aider to 61+ providers; multi-key rotation |
| `gpt-oss` | OpenAI open-weight MoE models (gpt-oss-120b / gpt-oss-20b, Apache-2.0) |

### ML / Data Science
| Skill | What it covers |
|---|---|
| `pandas` | Data loading, cleaning, transformation, time series |
| `scikit-learn` | ML pipelines, cross-val, tuning, evaluation |
| `postgres` | SQL, indexes, window functions, analytics |
| `mongodb` | NoSQL, flexible schema, aggregation pipelines |
| `ab-testing` | Experiment design, statistical testing |

### AI Agent Development
| Skill | What it covers |
|---|---|
| `ai-agent-development` | Autonomous agents, CrewAI, LangGraph |
| `ai-agents-architect` | Architecture, tool use, memory, planning |
| `ai-agent-tool-routing` | Tool registry, MCP router |
| `ai-agent-security` | Prompt injection defense, guardrails |
| `ai-code-generation-guardrails` | Reviewing AI-generated code |
| `ai-coding-agent-guardrails` | Secure Claude Code in teams |
| `ai-agent-evaluation-benchmarking` | Agent benchmarks |
| `agent-memory-discipline` | Long-term memory patterns |
| `agent-qa-authoring` | Agent QA tests and suites |
| `mcp-builder` | MCP servers for LLM tool integration |
| `openbot` | Self-hostable AI coworker workspace — AG-UI, browser automation, CEL policy |
| `agent-browser` | Accessibility-tree browser CLI for agents — @ref handles, daemon, MCP mode |
| `skillspector` | NVIDIA security scanner for agent skills — YARA, CVE lookup, prompt-injection detection |
| `claude-code-templates` | Registry + CLI for 1,980+ ready-made skills, agents, commands, MCP servers |

### Backend / API
| Skill | What it covers |
|---|---|
| `fastapi` | Async REST APIs, Pydantic, OpenAPI |
| `sqlalchemy` | Async ORM, Alembic migrations |
| `redis` | Caching, rate limiting, pub/sub, LLM cache |
| `celery` | Background tasks, beat scheduler |
| `graphql` | Schema, resolvers, subscriptions |
| `nextjs` | Full-stack React, server components, API routes |
| `typescript` | Types, generics, decorators, strict mode |

### Infrastructure / DevOps
| Skill | What it covers |
|---|---|
| `docker` | Multi-stage builds, compose, production |
| `kubernetes` | Deployments, HPA, ingress, AI workloads |
| `github-actions` | CI/CD, Docker publish, eval CI |
| `git-advanced` | Rebase, stash, bisect, hooks |
| `git-workflow` | Branching, PRs, release strategy |

### Testing / Security / Quality
| Skill | What it covers |
|---|---|
| `pytest` | Fixtures, async tests, coverage |
| `security-audit` | Web app + API security |
| `webapp-testing` | E2E, browser automation |

### Browser & Dev Tools
| Skill | What it covers |
|---|---|
| `chrome-devtools-mcp` | MCP server + CLI to control Chrome — navigation, screenshots, traces, console, network |

### UI / GPT Apps
| Skill | What it covers |
|---|---|
| `ui-design` | Design tokens, typography, layout, dark mode, components, accessibility |
| `gpt-chat-ui` | ChatGPT-style chat app: SSE streaming, markdown, tool calls, history |

### ML Research (21 skills)
Deep reference skills covering model architecture, tokenization, fine-tuning, mechanistic interpretability, data processing, post-training, safety/alignment, distributed training, infrastructure, optimization, evaluation, inference serving, MLOps, agents, RAG, prompt engineering, observability, multimodal, emerging techniques, ML paper writing, and extras (20+ sub-skills: LLaMA, GRPO, SwanLab, OpenPi, OpenVLA, etc.).

| Skill | What it covers |
|---|---|
| `research-01-model-architecture` | Transformer internals, attention, MoE |
| `research-02-tokenization` | BPE, SentencePiece, tokenizer training |
| `research-03-fine-tuning` | SFT, LoRA, QLoRA, PEFT patterns |
| `research-04-mechanistic-interpretability` | Circuits, probing, SAEs |
| `research-05-data-processing` | Deduplication, filtering, quality pipelines |
| `research-06-post-training` | RLHF, DPO, reward modeling |
| `research-07-safety-alignment` | Constitutional AI, guardrails, red-teaming |
| `research-08-distributed-training` | FSDP, DeepSpeed, Megatron |
| `research-09-infrastructure` | GPU clusters, checkpointing, profiling |
| `research-10-optimization` | Quantization, pruning, distillation |
| `research-11-evaluation` | Benchmarks, eval harness, LLM-as-judge |
| `research-12-inference-serving` | vLLM, TensorRT, speculative decoding |
| `research-13-mlops` | MLflow, W&B, experiment tracking |
| `research-14-agents` | Research agents, tool use, planning |
| `research-15-rag` | Retrieval, chunking, hybrid search |
| `research-16-prompt-engineering` | Chain-of-thought, few-shot, eval prompts |
| `research-17-observability` | LLM monitoring, traces, SLOs |
| `research-18-multimodal` | Vision-language, audio, video models |
| `research-19-emerging-techniques` | Test-time compute, long context, new architectures |
| `research-20-ml-paper-writing` | Writing, structuring, and presenting ML papers |
| `research-21-extras` | 20+ sub-skills: LLaMA, GRPO, SwanLab, OpenPi, OpenVLA, Axolotl, and more |

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
