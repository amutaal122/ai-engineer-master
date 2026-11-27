---
name: UI Skills
description: A registry of design-engineering skills from ibelick, reachable through an npx CLI or a hosted MCP endpoint, plus a playbook of distilled UI craft lessons. Use to pull a focused skill such as baseline-ui or a motion skill into a project without installing a whole pack.
triggers: [ui-skills, design engineer, baseline ui, motion skill, ui playbook, ui craft, design engineering, npx ui-skills, ui skills mcp, fetch a ui skill]
version: "1.0"
source: https://github.com/ibelick/ui-skills
---

# UI Skills Skill

## § RULES
- Browse before you fetch — `categories` then `list` costs nothing and avoids pulling the wrong skill.
- Fetch one skill at a time. The point of this registry is a small focused drop-in, not a bulk install.
- The registry is remote and changes; re-run `list` rather than trusting a cached skill name.
- Read a skill before applying it. These are opinions about craft, not neutral config.

---

## Use it

No install step — everything runs through `npx`:

```bash
npx ui-skills start                     # interactive
npx ui-skills categories                # what exists
npx ui-skills list --category motion    # skills in a category
npx ui-skills get baseline-ui           # fetch one
```

---

## MCP endpoint

```
https://www.ui-skills.com/mcp
```

Tools: `list_skills`, `get_skill`.

Wire it up so the agent can pull a skill mid-task instead of you fetching by hand:

```json
{ "mcpServers": { "ui-skills": { "url": "https://www.ui-skills.com/mcp" } } }
```

---

## Playbook

Distilled UI lessons live at `ui-skills.com/playbook` — short, specific craft notes rather than a framework. Worth reading end to end once; it is the kind of material that changes how you review a UI rather than how you build one.

---

## Where it fits

| Skill | Role |
|---|---|
| `ui-ux-pro-max` | decide the style, palette, typography |
| `ui-design` | the pack's own tokens-and-components guide |
| `ui-skills` | pull one focused craft skill on demand |

This is the lightest of the three: reach for it when you want one specific technique, not a system.

---

## Caveats
- ~11.5k stars, MIT, by ibelick.
- The README names only `baseline-ui` as an example; the full catalogue is whatever `npx ui-skills list` returns today, not a fixed set.
- The CLI and MCP both hit a hosted service, so this one needs network access — unlike `ui-ux-pro-max`, which is fully local.
- `DESIGN.md` in the repo holds the project's own design rules; the README does not reproduce them.
