# AI Engineer Master

> Professional skill system for **AI · ML · Data Science · Data Analytics** engineers.
> Works with Claude Code, Cursor, Windsurf, Cline, Copilot, Continue, Zed, and any AI coding tool.

## At a Glance

| | Count |
|---|---|
| Skills | 70 |
| Agents | 13 |
| Commands | 10 |
| Workflows | 4 |

---

## Install — One Line

### macOS / Linux
```bash
curl -fsSL https://github.com/amutaal122/ai-engineer-master/raw/main/install.sh | bash
```

### Windows (PowerShell)
```powershell
irm https://github.com/amutaal122/ai-engineer-master/raw/main/install.ps1 | iex
```

Both scripts download and extract the `.claude/` folder into your current project directory, then print "Done."

---

## Install — By AI Tool

### Claude Code
The `.claude/` folder is natively supported — skills, agents, and commands load automatically.

```bash
# macOS / Linux
curl -fsSL https://github.com/amutaal122/ai-engineer-master/raw/main/install.sh | bash

# Windows
irm https://github.com/amutaal122/ai-engineer-master/raw/main/install.ps1 | iex
```

Or with git:
```bash
git clone https://github.com/amutaal122/ai-engineer-master.git temp
cp -r temp/.claude .claude && rm -rf temp          # macOS/Linux
# xcopy /E /I temp\.claude .claude && rmdir /S /Q temp  # Windows CMD
```

### Cursor
1. Run the one-line installer above — this gives you `.claude/skills/`.
2. Add to your `.cursor/rules/` (or `.cursorrules`) a reference line:
   ```
   Skills library: see .claude/skills/ for detailed patterns on each technology.
   ```
3. When asking Cursor for help, say: *"use the fastapi skill in .claude/skills/fastapi/"*

### Windsurf
1. Run the one-line installer.
2. In `.windsurf/rules/global_rules.md`, add:
   ```
   Detailed engineering patterns are in .claude/skills/<skill-name>/SKILL.md
   ```

### GitHub Copilot
1. Run the one-line installer.
2. Create or update `.github/copilot-instructions.md`:
   ```markdown
   This project uses AI Engineer Master skills in .claude/skills/.
   When working on FastAPI, refer to .claude/skills/fastapi/SKILL.md, etc.
   ```

### Cline / OpenCode / Aider / Roo Code
1. Run the one-line installer.
2. Add to your `.clinerules` (or equivalent config):
   ```
   Engineering skill guides are in .claude/skills/. Reference the relevant SKILL.md file for each technology.
   ```

### Continue
1. Run the one-line installer.
2. In `.continue/config.json`, add the `.claude/skills/` path as a context provider or docs source.

### Zed
1. Run the one-line installer.
2. Reference `.claude/skills/<name>/SKILL.md` in your assistant rules inside `.zed/settings.json`.

### Any other tool
Run the one-line installer. Every skill is a plain Markdown file at `.claude/skills/<name>/SKILL.md` — paste the relevant file into any AI chat as context.

---

## Download (no terminal)

| File | Contents |
|---|---|
| [ai-engineer-master-skills.zip](https://github.com/amutaal122/ai-engineer-master/raw/main/dist/ai-engineer-master-skills.zip) | Only the `.claude/` folder — drop into any project |
| [ai-engineer-master-complete.zip](https://github.com/amutaal122/ai-engineer-master/raw/main/dist/ai-engineer-master-complete.zip) | Skills + docs + tools |

---

## Engineer Master Assistant

`docs/engineer-master-assistant.html` — open in any browser. Recommends skills and agents, plans projects across 7 phases (`/plan <idea>`), and browses the full catalog. Works offline or with an OpenAI / Anthropic key in Settings.

Also in `docs/`: `pipeline-orbit.html` (3D pipeline view) and `chat-studio.html` (ChatGPT-style UI).

Rebuild after changing skills:
```bash
cd tools/assistant
node gen-kb.js ../.. kb.json && node build-assistant.js
```

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
| `skillspector` | NVIDIA security scanner for agent skills — YARA, CVE lookup, prompt-injection |
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
Deep reference skills covering model architecture, tokenization, fine-tuning, mechanistic interpretability, data processing, post-training, safety/alignment, distributed training, infrastructure, optimization, evaluation, inference serving, MLOps, agents, RAG, prompt engineering, observability, multimodal, emerging techniques, ML paper writing, and extras (20+ sub-skills).

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
