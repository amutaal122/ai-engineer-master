---
description: Install, update, verify, or wire the AI Engineer Master skill pack into this project for any AI coding tool.
disable-model-invocation: true
---

Invoke the `easy-install` skill, then act on `$ARGUMENTS`.

## Modes

`$ARGUMENTS` selects what to do. Empty means **status**.

| Argument | Do this |
|---|---|
| *(empty)* | Report install status: run the doctor script and summarize |
| `check` / `doctor` | Run `.claude/doctor.sh` (or `.ps1` on Windows) and explain any warnings |
| `update` | Run the installer with `--update`, then re-run doctor |
| `<tool-name>` | Wire that tool's rules file (`cursor`, `windsurf`, `copilot`, `cline`, `continue`, `zed`, `codex`, `all`) |
| `only <a,b,c>` | Install only the named skills into `.claude/skills/` |
| `list` | List every available skill with its one-line description |

## Rules

- Always run from the **project root**. If `.claude/` sits somewhere else, say so and stop rather than creating a second copy.
- Pick the right script for the platform: `install.sh` on macOS/Linux, `install.ps1` on Windows.
- After any install or update, run doctor and report the skill/agent/command counts.
- When wiring a non-Claude tool, tell the user to restart that editor — rules files are read at startup.
- Never wire a tool the user did not ask for. `all` is opt-in only.

## Status output

Report, in this order:

1. Whether `.claude/skills/` exists and how many skills, agents, and commands are present
2. Any skill with broken or missing frontmatter
3. Which tools are wired and which are not
4. The single next step the user should take, if any
