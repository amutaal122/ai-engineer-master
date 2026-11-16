---
name: ui-design
description: Professional UI design system for AI/ML products - tokens, typography, layout, dark mode, components, states, accessibility, and review checklist for dashboards, chat apps and data tools.
triggers: [ui design, ux design, design system, frontend design, dashboard design, landing page, tailwind, css, dark mode, color palette, typography, layout, component library, accessibility, responsive, figma, mockup, wireframe]
version: "1.0"
source: personal
---

# UI Design

## §PROCESS (do in order)
1. **Job**: one sentence - who uses this and what is the single task.
2. **Content first**: real labels, numbers, states. Never lorem ipsum.
3. **Tokens**: define color, type, space, radius before any component.
4. **Layout**: structure and hierarchy, then components, then polish.
5. **States**: empty, loading, error, success, disabled for every component.
6. **Review**: run §CHECKLIST.

## §TOKENS (copy and adapt)
```css
:root{
  --bg:#ffffff; --surface:#f6f7f9; --border:#e4e7ec;
  --fg:#101828; --muted:#667085; --accent:#4f46e5; --accent-fg:#ffffff;
  --ok:#12b76a; --warn:#f79009; --err:#f04438;
  --r-sm:6px; --r-md:10px; --r-lg:16px;
  --s1:4px; --s2:8px; --s3:12px; --s4:16px; --s6:24px; --s8:32px;
  --font:"Inter",system-ui,sans-serif; --mono:"JetBrains Mono",ui-monospace,monospace;
  color-scheme:light;
}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){
  --bg:#0b0d12; --surface:#141821; --border:#262c3a; --fg:#eef1f6; --muted:#98a2b3;
  --accent:#8b8bff; --accent-fg:#0b0d12; color-scheme:dark}}
:root[data-theme=dark]{ /* same dark values */ }
```
Rules: every color is a token; both themes defined; body sets explicit background.

## §TYPE
| Role | Size / weight | Use |
|---|---|---|
| Display | 32-48 / 700 | one hero line only |
| H1-H2 | 24-28 / 600 | page, section |
| Body | 14-16 / 400, line-height 1.5 | text, max 65ch wide |
| Label | 12 / 500, +0.04em, uppercase | eyebrows, table heads |
| Mono | 13 | code, ids, numbers in tables (`tabular-nums`) |

Two families max. Scale: 12, 14, 16, 20, 24, 32, 48.

## §LAYOUT
- 8px spacing grid; use `gap`, not margins between siblings.
- Content width 1100-1200px; reading width 65ch; side gutter >= 16px.
- Summary before detail. Primary action once per view.
- Mobile first: stack to one column under 640px; tables scroll in their own container.
- Align to a baseline; repeated cards share edges and padding.

## §COLOR
- One accent. Semantic colors (ok/warn/err) are separate from the accent.
- Neutrals carry a slight hue toward the accent, never pure grey.
- Contrast: text >= 4.5:1, large text and icons >= 3:1.
- Never use color alone to show state: add icon or text.

## §COMPONENTS
| Component | Must have |
|---|---|
| Button | primary / secondary / ghost, loading, disabled, visible focus ring |
| Input | label (not placeholder-only), hint, error text, `id`/`for` |
| Table | sticky head, right-align numbers, row hover, empty state |
| Card | use sparingly; border or fill, not both plus shadow |
| Modal | focus trap, Esc to close, return focus |
| Toast | says what happened ("Saved"), auto-dismiss 4s, `aria-live` |
| Chart | one scale, labels name real values, theme-token colors |

## §AI PRODUCT PATTERNS
- Streaming text: append tokens, keep scroll pinned only if user is at bottom.
- Show model, latency, token cost in a quiet footer or tooltip.
- Confidence and sources: inline citations, expandable evidence.
- Always offer: stop, regenerate, copy, thumbs feedback.
- Long jobs: progress with named steps, not a bare spinner.

## §A11Y
- Semantic HTML first (`button`, `nav`, `main`, `label`).
- Keyboard: all controls reachable, visible `:focus-visible`.
- `prefers-reduced-motion`: disable non-essential animation.
- Touch targets >= 40px. `lang` set. Alt text on meaningful images.

## §CHECKLIST (before shipping)
- [ ] One clear job and one primary action
- [ ] All colors from tokens; light and dark both checked
- [ ] Empty, loading, error states exist
- [ ] Works at 400px with no horizontal page scroll
- [ ] Keyboard and screen-reader pass; contrast pass
- [ ] Real content, no placeholder text
- [ ] No generic look: cream+serif+terracotta, purple gradient hero, emoji headings, everything centered

## §RULES
- Respect an existing design system first; this skill only fills gaps.
- Hierarchy through size, weight and space before color.
- Remove an element before adding a decoration.
