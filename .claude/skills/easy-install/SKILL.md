---
name: Easy Install
description: Install, update, verify, and wire the AI Engineer Master skill pack into any AI coding tool — Claude Code, Cursor, Windsurf, Copilot, Cline, Continue, Zed, Aider, or a plain chat window. Covers one-line installers, selective skill install, per-tool rule wiring, offline install, and troubleshooting a broken install.
triggers: [install skills, easy install, how do i install, setup skills, add skills to cursor, add skills to windsurf, add skills to copilot, install ai engineer master, update skills, uninstall skills, skill not loading, skills not working, wire skills, doctor, verify install]
version: "1.0"
source: https://github.com/amutaal122/ai-engineer-master
---

# Easy Install Skill

## § RULES
- Install into the **project root**, not the home directory — skills are per-project so each repo gets only what it needs.
- Prefer `--only` for a focused install; a 70-skill pack in a small repo is noise for the model.
- After installing for a non-Claude tool, you **must** wire a rules file (`--tool <name>` does this) or the tool will never read the skills.
- Run `doctor` after any install or update before assuming skills are live.
- Never commit `.claude/` to a repo you do not own without checking its license policy first.

---

## One-line install

### macOS / Linux
```bash
curl -fsSL https://github.com/amutaal122/ai-engineer-master/raw/main/install.sh | bash
```

### Windows (PowerShell)
```powershell
irm https://github.com/amutaal122/ai-engineer-master/raw/main/install.ps1 | iex
```

Both drop a `.claude/` folder into the current directory and print what landed.

---

## Install only the skills you need

Downloading 70 skills for a Django repo is waste. Pass `--only`:

```bash
# macOS / Linux
curl -fsSL .../install.sh | bash -s -- --only fastapi,postgres,docker,pytest
```

```powershell
# Windows — download first, then run with args
irm https://github.com/amutaal122/ai-engineer-master/raw/main/install.ps1 -OutFile install.ps1
./install.ps1 -Only fastapi,postgres,docker,pytest
```

List what is available before choosing:

```bash
curl -fsSL .../install.sh | bash -s -- --list
```

---

## Wire it into your tool

`--tool` writes the rules file that tool actually reads, so the model is told the skills exist.

```bash
curl -fsSL .../install.sh | bash -s -- --tool cursor
```

```powershell
./install.ps1 -Tool cursor
```

| `--tool` value | Writes | Read by |
|---|---|---|
| `claude` | nothing needed | Claude Code (native `.claude/`) |
| `cursor` | `.cursor/rules/skills.mdc` | Cursor |
| `windsurf` | `.windsurf/rules/skills.md` | Windsurf |
| `copilot` | `.github/copilot-instructions.md` | GitHub Copilot |
| `cline` | `.clinerules` | Cline / Roo Code |
| `continue` | `.continue/rules/skills.md` | Continue |
| `zed` | `.rules` | Zed |
| `codex` | `AGENTS.md` | Codex / Aider / OpenCode |
| `all` | every file above | any mix of tools |

`AGENTS.md` is the emerging cross-tool standard — `--tool codex` is the safest single choice if you are unsure which tool a teammate uses.

---

## Verify the install

```bash
bash .claude/doctor.sh          # macOS / Linux
```
```powershell
./.claude/doctor.ps1            # Windows
```

Doctor reports skill/agent/command counts, flags any `SKILL.md` with broken frontmatter, and names which tool rule files are present or missing.

---

## Update to the latest pack

```bash
curl -fsSL .../install.sh | bash -s -- --update
```
```powershell
./install.ps1 -Update
```

`--update` overwrites `.claude/skills/` but leaves `.claude/CLAUDE.md` and anything you added under `.claude/` alone, so local customisation survives.

---

## Offline / air-gapped install

1. Download `dist/ai-engineer-master-skills.zip` on a connected machine.
2. Move the zip across.
3. Extract at the project root:
   ```bash
   unzip -o ai-engineer-master-skills.zip -d .
   ```
   ```powershell
   Expand-Archive ai-engineer-master-skills.zip -DestinationPath . -Force
   ```
4. Wire the rules file by hand (see the table above) or run `install.ps1 -Tool cursor -Offline`.

---

## Install into a plain chat window

Every skill is a self-contained Markdown file. With no tool integration at all:

```bash
cat .claude/skills/fastapi/SKILL.md
```

Paste that into any chat as context. `SKILLS.json` at the repo root is the machine-readable catalog — id, name, description, triggers, domain — if you want to build your own picker.

---

## Uninstall

```bash
rm -rf .claude
rm -f .cursor/rules/skills.mdc .windsurf/rules/skills.md .clinerules .rules
```
```powershell
Remove-Item -Recurse -Force .claude
```

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Claude Code does not see skills | installed in the wrong directory | `ls .claude/skills` from the repo root; reinstall there |
| Skills install but model ignores them | no rules file for a non-Claude tool | rerun with `--tool <name>` |
| `Expand-Archive` fails on Windows | zip half-downloaded | delete `$env:TEMP\ai-engineer-master-skills.zip` and retry |
| `curl: command not found` | minimal container | installer falls back to `wget`; install one of them |
| A skill loads with no description | malformed YAML frontmatter | run doctor — it names the offending file |
| Updates do not appear | tool cached the old rules | restart the editor after `--update` |

---

## Caveats
- `.claude/skills/` is read at session start by most tools — restart the editor after installing.
- `--only` matches skill directory names exactly; use `--list` to get the spelling right.
- The installer never touches files outside the current directory.
- Piping a remote script to a shell runs remote code — read `install.sh` first if that matters to you.
