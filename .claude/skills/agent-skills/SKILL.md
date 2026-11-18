---
name: Agent Skills
description: Author Agent Skills the way Anthropic's own repo does — SKILL.md folders with YAML frontmatter that Claude loads dynamically for specialized tasks. Covers the file format, folder layout, installing Anthropic's skill marketplace in Claude Code, using skills from claude.ai and the API, and the rules that keep a skill from going stale.
triggers: [agent skills, write a skill, author a skill, skill.md, anthropic skills, skill frontmatter, skill format, create custom skill, skill marketplace, plugin marketplace, agentskills, skill template]
version: "1.0"
source: https://github.com/anthropics/skills
---

# Agent Skills Skill

## § RULES
- A skill is a **folder**, not a file: `SKILL.md` plus whatever scripts and resources it needs beside it.
- Frontmatter needs exactly two fields — `name` and `description`. Everything else is your own convention, so do not assume a tool reads it.
- Write `description` for the *router*, not the reader: it is what decides whether the skill gets loaded at all, so it must say what the skill does **and when to use it**.
- Keep the body instructional. A skill that just links out teaches the model nothing once loaded.
- Test a skill before anything depends on it — Anthropic ships its own examples marked for demonstration only.

---

## What a skill is

> Skills are folders of instructions, scripts, and resources that Claude loads dynamically to improve performance on specialized tasks.

The point is repeatability: the same task gets done the same way every time, without re-explaining it in each conversation.

---

## File format

```
my-skill/
  SKILL.md          # required
  scripts/          # optional helpers the skill tells Claude to run
  references/       # optional deeper docs the skill points to
```

`SKILL.md`:

```markdown
---
name: my-skill
description: What this does and when to use it.
---

# My Skill

Instructions in markdown.

## Examples
...

## Guidelines
...
```

### Frontmatter fields

| Field | Required | Rule |
|---|---|---|
| `name` | yes | unique identifier, lowercase, hyphens instead of spaces |
| `description` | yes | a complete description of what the skill does **and when to use it** |

Anthropic's repo states these two are all that is required. Other fields you may see in the wild (`triggers`, `version`, `source`) are conventions of specific skill packs, not part of the required format.

---

## Install Anthropic's skills in Claude Code

```bash
/plugin marketplace add anthropics/skills
```

Then install a bundle:

```bash
/plugin install document-skills@anthropic-agent-skills
/plugin install example-skills@anthropic-agent-skills
```

Invoke by naming the skill in your request:

```
Use the PDF skill to extract the form fields from path/to/some-file.pdf
```

---

## Where skills work

| Surface | How |
|---|---|
| Claude Code | `/plugin marketplace add`, then `/plugin install` |
| claude.ai | example skills are already available on paid plans; custom skills are uploaded in settings |
| Claude API | pre-built skills can be used and custom skills uploaded via the Skills API |

---

## What is in the repo

| Path | Holds |
|---|---|
| `skills/` | the example skills themselves |
| `spec/` | the Agent Skills specification |
| `template/` | a starting skeleton for a new skill |
| `.claude-plugin/` | marketplace metadata |

Skill sets cover creative and design, development and technical, enterprise and communication, and the document skills (`docx`, `pdf`, `pptx`, `xlsx`).

---

## Writing a description that actually fires

The description is the only thing the model sees before deciding to load the skill. Compare:

```yaml
# weak - says what, never when
description: Helps with PDFs.

# strong - what, plus the situations that should trigger it
description: Extract text, tables, and form fields from PDF files, fill
  form fields, merge and split documents. Use when the user supplies a
  .pdf or asks to read, edit, or generate one.
```

---

## Caveats
- 197k+ stars. Many skills in the repo are Apache-2.0; the repo does not state a single repo-wide license, and a `THIRD_PARTY_NOTICES.md` is present — check per skill before reuse.
- Anthropic states the examples are "for demonstration and educational purposes only" and that behavior may differ from what is shown.
- How Claude discovers and ranks skills is not documented in the repo; treat the description as the whole interface.
- The standard lives at agentskills.io; the repo is one implementation of it.
