# AI Engineer Master

> Professional skill system for **AI · ML · Data Science · Data Analytics** engineers.
> Works with Claude Code, Cursor, Windsurf, Cline, Copilot, Continue, Zed, and any AI coding tool.

## At a Glance

| | Count |
|---|---|
| Skills | 77 |
| Agents | 13 |
| Commands | 11 |
| Workflows | 4 |

---

## Install — One Line

Run from your **project root**.

### macOS / Linux
```bash
curl -fsSL https://github.com/amutaal122/ai-engineer-master/raw/main/install.sh | bash
```

### Windows (PowerShell)
```powershell
irm https://github.com/amutaal122/ai-engineer-master/raw/main/install.ps1 | iex
```

That drops `.claude/` into the current directory and prints what landed.

### Then check it worked

```bash
bash .claude/doctor.sh        # macOS / Linux
```
```powershell
./.claude/doctor.ps1          # Windows
```

Doctor reports the skill/agent/command counts, flags any broken frontmatter, and tells you which tools are wired.

---

## Install — Only What You Need

70+ skills in a small repo is noise. Pick a subset:

```bash
curl -fsSL https://github.com/amutaal122/ai-engineer-master/raw/main/install.sh | bash -s -- \
  --only fastapi,postgres,docker,pytest
```

```powershell
irm https://github.com/amutaal122/ai-engineer-master/raw/main/install.ps1 -OutFile install.ps1
./install.ps1 -Only fastapi,postgres,docker,pytest
```

See the list first with `--list` / `-List`.

### All installer options

| bash | PowerShell | Does |
|---|---|---|
| `--only a,b,c` | `-Only a,b,c` | install just these skills |
| `--tool NAME` | `-Tool NAME` | write the rules file that tool reads |
| `--update` | `-Update` | refresh skills, keep your `.claude/CLAUDE.md` |
| `--list` | `-List` | list available skills and exit |
| `--help` | `-Help` | usage |

---

## Install — By AI Tool

Claude Code reads `.claude/` natively — nothing else to do. Every other tool needs a rules file telling it the skills exist, and `--tool` writes that file for you:

```bash
curl -fsSL .../install.sh | bash -s -- --tool cursor
```
```powershell
./install.ps1 -Tool cursor
```

| `--tool` value | Writes | Read by |
|---|---|---|
| `claude` | nothing needed | Claude Code |
| `cursor` | `.cursor/rules/skills.mdc` | Cursor |
| `windsurf` | `.windsurf/rules/skills.md` | Windsurf |
| `copilot` | `.github/copilot-instructions.md` | GitHub Copilot |
| `cline` | `.clinerules` | Cline / Roo Code |
| `continue` | `.continue/rules/skills.md` | Continue |
| `zed` | `.rules` | Zed |
| `codex` | `AGENTS.md` | Codex / Aider / OpenCode |
| `all` | all of the above | a mixed-tool team |

`AGENTS.md` is the emerging cross-tool standard — `--tool codex` is the safest single pick if you are not sure what your teammates use.

**Restart your editor after installing.** Rules files are read at startup.

### Any other tool

Every skill is a plain Markdown file at `.claude/skills/<name>/SKILL.md` — paste one into any chat as context. `SKILLS.json` at the repo root is the machine-readable catalog (id, description, triggers, domain) if you want to build your own picker.

---

## Download (no terminal)

| File | Contents |
|---|---|
| [ai-engineer-master-skills.zip](https://github.com/amutaal122/ai-engineer-master/raw/main/dist/ai-engineer-master-skills.zip) | `.claude/` + `SKILLS.json` — drop into any project |
| [ai-engineer-master-complete.zip](https://github.com/amutaal122/ai-engineer-master/raw/main/dist/ai-engineer-master-complete.zip) | Skills + docs + tools + installers |

Extract at your project root, then run doctor.

---

## Engineer Master Assistant

`docs/engineer-master-assistant.html` — open in any browser. Recommends skills and agents, plans projects across 7 phases (`/plan <idea>`), and browses the full catalog. Works offline or with an OpenAI / Anthropic key in Settings.

Also in `docs/`: `pipeline-orbit.html` (3D pipeline view) and `chat-studio.html` (ChatGPT-style UI).

Rebuild after changing skills:
```bash
cd tools/assistant
node gen-kb.js ../.. kb.json && node build-assistant.js
```

`gen-kb.js` also regenerates `SKILLS.json` at the repo root. Repackage the zips with:
```powershell
./tools/build-dist.ps1
```

---

## Skills

### Setup
| Skill | What it covers |
|---|---|
| `easy-install` | Install, update, verify, and wire the pack into any AI tool; offline install; troubleshooting |
| `agent-skills` | Author Agent Skills: SKILL.md format, frontmatter, folder layout, Anthropic's marketplace |

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
| `scrapling` | Web scraping for agents — stealth fetchers, spiders, CLI, MCP server |

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
| `agent-desktop` | Computer use via the OS accessibility tree — no screenshots, element refs, MCP mode |
| `ag-ui` | Agent-User Interaction Protocol — 31 event types, SSE/Protobuf, TS/Python/.NET SDKs |

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
| `pyrit` | Microsoft's AI red teaming toolkit — jailbreak, injection, and harm testing |
| `codex-security` | OpenAI's security CLI/SDK — repo and diff scans, SARIF export, CI action |

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

## Commands

Slash commands available in Claude Code once installed.

| Command | Does |
|---|---|
| `/install` | Install, update, verify, or wire the pack for any AI tool |
| `/spec` | Write a structured specification before writing code |
| `/plan` | Break work into small verifiable tasks with acceptance criteria |
| `/build` | Implement tasks incrementally — build, test, verify, commit |
| `/test` | TDD loop — failing test, implement, verify |
| `/review` | Five-axis review: correctness, readability, architecture, security, performance |
| `/code-simplify` | Reduce complexity without changing behavior |
| `/constraints` | Define and enforce the project's quality bar |
| `/common-ground` | Surface hidden assumptions for confirmation |
| `/webperf` | Web performance audit |
| `/ship` | Pre-launch checklist, then a go/no-go call |

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
