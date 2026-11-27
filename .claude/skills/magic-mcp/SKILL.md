---
name: Magic MCP
description: 21st.dev's MCP server for UI — search 10,000+ React/Tailwind components, generate new ones with AI, fetch logos, and publish your own, from Cursor, Claude Code, Windsurf or Codex. Covers the legacy @21st-dev/magic proxy, the current 21st MCP endpoint, tool renames, and the AI-access gate.
triggers: [magic mcp, 21st dev, 21st mcp, generate ui component, react tailwind components, component search, logo search, v0 alternative, ui generation mcp, 21st_magic_component_builder]
version: "1.0"
source: https://github.com/21st-dev/magic-mcp
---

# Magic MCP Skill

## § RULES
- `generate` and `iterate_generation` only appear when AI access is enabled. Check `get_usage.aiGenerationEnabled` before calling them.
- On `ai_subscription_required`, **stop** — do not retry until AI access is actually enabled. Retrying burns calls and never succeeds.
- With AI off, the workflow is `search` → `get_component` → adapt the code yourself. That path always works.
- Old Magic API keys were reset. A pre-v0.2.0 key will fail; issue a new one.
- Generated components are a starting point. Review them against your own design tokens before merging.

---

## What changed

`@21st-dev/magic` is now a **stdio compatibility proxy** (since v0.2.0) that forwards to the 21st MCP server. It exists to keep old configs working. New setups should point at the HTTP endpoint directly.

---

## Install

```bash
npx @21st-dev/cli@latest init --client claude
```

`--client` takes `cursor | claude | vscode | windsurf | codex`.

Claude Code plugin:

```bash
claude plugin marketplace add 21st-dev/magic-mcp
/plugin install 21st
```

Legacy proxy, if you need it:

```bash
npx -y @21st-dev/magic@latest API_KEY="..."
```

---

## Manual MCP config

```json
{
  "mcpServers": {
    "21st": {
      "url": "https://21st.dev/api/mcp",
      "headers": { "x-api-key": "YOUR_21ST_API_KEY" }
    }
  }
}
```

Get a key at https://21st.dev/mcp. Plugins read `API_KEY_21ST`; the proxy also accepts `TWENTY_FIRST_API_KEY`.

Keep the key in your MCP client's secret storage or an env var — never commit it.

---

## Tools

| Legacy name | Now |
|---|---|
| `21st_magic_component_builder` | `generate` |
| `21st_magic_component_refiner` | `generate` |
| `21st_magic_component_inspiration` | `get_inspiration` |
| `logo_search` | `search_logo` |

Also: `search`, `get_component`, `get_usage`, `iterate_generation`. Call `tools/list` for the authoritative set — the mapping above is what the README documents, not a guarantee.

---

## Two workflows

**With AI access:**
```
get_usage → generate → iterate_generation
```

**Without (always available):**
```
search → get_component → adapt by hand
```

The second is often better anyway: a vetted component from the registry beats a generated one you then have to debug.

---

## Where it fits

| Skill | Role |
|---|---|
| `ui-ux-pro-max` | decide style and palette first |
| `magic-mcp` | source or generate the actual component |
| `ui-design` | make it match your tokens |

---

## Caveats
- ~6.7k stars, ISC licence.
- Generation is a paid feature; search is the free path.
- Components are React + Tailwind. Other stacks need porting.
- The package name and the service name have diverged — "Magic MCP" the repo, "21st MCP" the server.
