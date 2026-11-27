---
name: Karpathy Guidelines
description: A CLAUDE.md ruleset derived from Andrej Karpathy's observations on LLM coding pitfalls — think before coding, simplicity first, surgical changes, goal-driven execution. Use when an AI coding agent is over-engineering, touching unrelated files, inventing abstractions, or declaring success without verifying.
triggers: [karpathy, karpathy guidelines, claude.md rules, agent over-engineering, llm coding pitfalls, simplicity first, surgical changes, stop over engineering, coding guidelines, agent discipline]
version: "1.0"
source: https://github.com/multica-ai/andrej-karpathy-skills
---

# Karpathy Guidelines Skill

## § RULES
- State assumptions out loud before writing code. If genuinely confused, ask rather than guess.
- Write the minimum code that solves the stated problem. Nothing speculative, no "we might need this later".
- Touch only what the task requires. Mention unrelated dead code; do not delete it as a bonus.
- Define success criteria first, write the test, then loop until it actually passes.
- These bias toward caution over speed. On trivial tasks, use judgement rather than ceremony.

---

## The four principles

### 1. Think Before Coding
Surface the tradeoffs and assumptions *before* the diff exists. An agent that starts typing immediately has already committed to an architecture nobody reviewed.

### 2. Simplicity First
The failure mode is not too little code — it is a factory, an interface, and a config flag where one function was asked for.

### 3. Surgical Changes
Scope creep in an agent looks like helpfulness. Renaming variables, reformatting, and "cleaning up" an adjacent file all make the diff unreviewable.

### 4. Goal-Driven Execution
"Should work" is not a result. Define what done looks like, write the check, run it.

---

## Install

**Plugin (recommended):**

```bash
/plugin marketplace add forrestchang/andrej-karpathy-skills
/plugin install andrej-karpathy-skills@karpathy-skills
```

**Straight to CLAUDE.md** — new project:

```bash
curl -o CLAUDE.md https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md
```

Existing project — append rather than overwrite:

```bash
curl https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md >> CLAUDE.md
```

> The README's install commands point at `forrestchang/`, while the repo also lives at `multica-ai/`. The README does not explain the relationship — verify the owner before trusting either, especially for a `curl | ` style install.

Cursor users get `.cursor/rules/karpathy-guidelines.mdc` instead; see `CURSOR.md`.

---

## Merge, don't replace

This is meant to sit alongside your project's own CLAUDE.md, not stand in for it. Project-specific conventions — build commands, directory layout, house style — still have to be written by you. The Karpathy rules govern *how* the agent works, not *what* your codebase is.

---

## Where it fits

| Skill | Governs |
|---|---|
| `karpathy-guidelines` | agent behaviour and discipline |
| `ai-coding-agent-guardrails` | securing agents in a team |
| `code-simplify` (command) | fixing complexity after the fact |

This one is preventative; the others are corrective.

---

## Caveats
- ~236k stars, MIT per the README.
- Repo contents: `CLAUDE.md`, `CURSOR.md`, `EXAMPLES.md`, `.claude-plugin/`, `.cursor/rules/`, `skills/karpathy-guidelines/`.
- Derived from Karpathy's public observations; it is not authored or endorsed by him.
