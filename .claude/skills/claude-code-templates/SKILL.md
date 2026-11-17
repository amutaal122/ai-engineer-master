---
name: Claude Code Templates
description: CLI and registry for 1,980+ ready-made Claude Code components — skills, agents, commands, hooks, MCP servers, and settings. Every component is scanned with SkillSpector before publishing. Install any component into the current project with one command.
triggers: [claude code templates, claude-code-templates, cct, component registry, skill registry, agent registry, install skill, install agent, install command, install mcp, skill marketplace]
version: "1.0"
source: https://github.com/davila7/claude-code-templates
---

# Claude Code Templates Skill

## § RULES
- Run the interactive picker (`npx claude-code-templates@latest`) to browse before installing blind.
- Always use `--yes` only after verifying the component in `--search` or the interactive picker.
- Prefer `--analytics` to check a component's adoption before adding it to production projects.
- All published components pass SkillSpector security scanning — but still review trigger words and permissions.

---

## Install (no global install needed)

```bash
npx claude-code-templates@latest
```

This opens an interactive picker to browse and install any component type.

---

## Install by component type

```bash
# Install a skill
npx claude-code-templates@latest --skill creative-design/frontend-design

# Install an agent
npx claude-code-templates@latest --agent development-tools/code-reviewer

# Install a command
npx claude-code-templates@latest --command git/smart-commit

# Install an MCP server
npx claude-code-templates@latest --mcp database/postgresql-integration

# Install settings preset
npx claude-code-templates@latest --settings security/strict-mode
```

---

## Search the registry

```bash
# Find components by keyword
npx claude-code-templates@latest --search "code review"
npx claude-code-templates@latest --search "testing"
npx claude-code-templates@latest --search "react"
npx claude-code-templates@latest --search "security"
```

---

## Skip confirmation prompt

```bash
npx claude-code-templates@latest --skill creative-design/frontend-design --yes
```

---

## Inspect a component before installing

```bash
# View usage analytics and metadata
npx claude-code-templates@latest --analytics --skill creative-design/frontend-design

# Health check on installed components
npx claude-code-templates@latest --health-check
```

---

## Browse chat history

```bash
# View your component install history
npx claude-code-templates@latest --chats
```

---

## Component categories

| Category | Examples |
|---|---|
| Skills | frontend-design, testing, security, documentation |
| Agents | code-reviewer, refactor-agent, debug-agent |
| Commands | smart-commit, pr-review, changelog |
| MCP servers | postgresql, redis, github, filesystem |
| Hooks | pre-commit, post-edit, session-start |
| Settings | strict-mode, permissive-dev, team-shared |

---

## Typical workflow

```bash
# 1. Search for what you need
npx claude-code-templates@latest --search "api design"

# 2. Preview and install
npx claude-code-templates@latest --skill backend/api-design

# 3. Verify installation
ls .claude/skills/api-design/

# 4. Health-check all installed components
npx claude-code-templates@latest --health-check
```

---

## Caveats
- 33k+ GitHub stars; MIT license.
- All components are SkillSpector-scanned, but always review permissions and trigger words.
- Registry grows continuously — run `--search` fresh rather than relying on cached results.
- Requires Node.js; no global install needed with npx.
