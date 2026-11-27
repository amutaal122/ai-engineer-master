---
name: Ruflo
description: An agent meta-harness for Claude Code and Codex — 100+ agents, swarm coordination, self-learning memory, vector RAG, federation across machines, a TUI, and 48 Claude Code plugins. Use when orchestrating many agents, sharing memory between them, or running coordinated work across more than one machine.
triggers: [ruflo, claude-flow, agent swarm, multi agent orchestration, agent harness, agent federation, swarm coordination, agent memory, 100 agents, npx ruflo]
version: "1.0"
source: https://github.com/ruvnet/ruflo
---

# Ruflo Skill

## § RULES
- **Review mods before installing.** They run with your account's permissions — a mod is code, not config.
- Network, spending, and destructive actions require confirmation even under `auto` approval. Do not configure that away.
- Start at the lowest console permission that works: `read` → `write` → `manage` → `full`.
- Federation opens a machine to remote coordination. Only join endpoints you control or trust.
- Self-learning quality tracks the memory and feedback you configure. Bad feedback produces confidently wrong agents.

---

## Install

```bash
npx ruflo@latest init          # in your project folder
npx ruflo@latest init wizard   # guided; works in PowerShell and cmd
```

Global:

```bash
npm install -g ruflo@latest
```

POSIX one-liner:

```bash
curl -fsSL https://cdn.jsdelivr.net/gh/ruvnet/ruflo@main/scripts/install.sh | bash
```

Claude Code plugins (needs Claude Code **2.1.287+**):

```bash
/plugin marketplace add ruvnet/ruflo
/plugin install ruflo-core@ruflo
```

---

## MCP

```bash
claude mcp add claude-flow -- npx ruflo@latest mcp start
```

Other clients: command `npx`, args `["-y", "ruflo@latest", "mcp", "start"]`.

---

## CLI

```bash
npx ruflo@latest init --dry-run
npx ruflo@latest mcp start
npx ruflo@latest tui                    # --plain for a single frame
npx ruflo@latest federation init
npx ruflo@latest federation join <endpoint>
npx ruflo@latest federation send
npx ruflo@latest federation status
```

`init --grok` is also mentioned.

---

## Permission model

| Level | Grants |
|---|---|
| `read` | observe only |
| `write` | modify files |
| `manage` | control agents and tasks |
| `full` | everything |

Approval is `ask` or `auto`. Even `auto` still gates network, spending, and destructive operations — that gate is the safety floor, so leave it on.

---

## What you get

100+ agents, swarm coordination, adaptive memory with vector RAG, federation across machines, security guardrails, a TUI, and 48 Claude Code plugins. Providers listed: Claude, GPT, Gemini, Cohere, Ollama.

---

## When this is the wrong tool

A meta-harness earns its complexity only at scale. For a single agent doing a single task, the harness is overhead — and its memory and swarm layers add failure modes that are hard to debug. Reach for it when you genuinely have many agents that must share state or span machines.

| Skill | Scale |
|---|---|
| `ai-agent-development` | building one agent |
| `ai-agents-architect` | designing the architecture |
| `ruflo` | running many, with shared memory |
| `openbot` | a hosted agent workspace |

---

## Caveats
- ~82.5k stars, MIT.
- The README documents no API-key setup for the listed providers; expect to configure those yourself.
- `curl | bash` runs remote code — read the script first if that matters to you.
- The package was formerly known as claude-flow; the MCP registration name still reflects that.
