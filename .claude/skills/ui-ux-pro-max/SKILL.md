---
name: UI UX Pro Max
description: Offline design-intelligence search over 80 UI styles, 194 product palettes, 74 font pairings, 25 chart types, 22 tech stacks and 141 UX guidelines, with a design-system generator that returns pattern, colors, typography, anti-patterns and a pre-delivery checklist. Use before building any UI to pick a style and palette that fits the industry.
triggers: [ui ux pro max, uipro, design system, color palette, font pairing, ui style, design intelligence, what colors should i use, landing page design, choose a ui style, design anti-patterns, chart type]
version: "1.0"
source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
---

# UI UX Pro Max Skill

## § RULES
- No emojis as icons. Use a real icon set — Heroicons, Lucide.
- `cursor-pointer` on every clickable element.
- Light-mode text contrast ≥ 4.5:1.
- Visible focus states for keyboard navigation.
- Respect `prefers-reduced-motion`.
- Test at 375, 768, 1024 and 1440px.
- Badge meaning must never rely on colour alone.
- Text must reflow without clipping; chips wrap or collapse to a `+n` disclosure.
- Honour industry anti-patterns — no AI purple/pink gradients on a banking product.

---

## Install

```bash
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

Alternatives:

```bash
gh skill install nextlevelbuilder/ui-ux-pro-max-skill .claude/skills/ui-ux-pro-max

npm install -g ui-ux-pro-max-cli && uipro init --ai claude
npx ui-ux-pro-max-cli init --ai claude
```

`uipro` also takes `--global`, `--dry-run`, and `uipro uninstall`.

Python 3.x, standard library only, **no network calls** — the whole corpus is local.

---

## Search

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "glassmorphism" --domain style
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "form validation" --stack react
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fintech" --domain product --rtl=partial
```

Domains: `style`, `typography`, `chart`, `ux`, `icons`, `product`, `stack`.

BM25 ranking over the local corpus — results are retrieved, not generated, so they are the same every run.

---

## Generate a design system

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness" \
  --design-system -p "Serenity Spa"

python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fintech banking" \
  --design-system -f markdown

python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fintech" \
  --design-system --persist -p "MyApp"      # writes design-system/myapp/MASTER.md
```

Output gives you a pattern, style, colour set, typography, the anti-patterns for that industry, and a pre-delivery checklist.

Workflow mode:

```
/ui-ux-pro-max Build a landing page for my SaaS product
```

---

## What's in the corpus

| Data | Count |
|---|---|
| Searchable styles | 80 (51 active) |
| Product types and palettes | 194 |
| Reasoning rules | 194 |
| Font pairings | 74 |
| Chart types | 25 |
| Tech stacks | 22 |
| UX guidelines | 141 |

---

## How to use it with the pack's own design skills

| Skill | Role |
|---|---|
| `ui-ux-pro-max` | **decide** — which style, palette, and type pairing fit this industry |
| `ui-design` | **build** — tokens, layout, dark mode, components |
| `ui-skills` | **polish** — distilled craft lessons |
| `gpt-chat-ui` | chat-specific patterns |

Run this one first; it answers the questions the others assume you have already settled.

---

## Caveats
- ~155k stars, MIT.
- The README has a Basic vs Premium section — that is marketing; the skill itself is the MIT-licensed local corpus.
- Style counts move between releases; `51 active` of 80 means not every style is wired up.
