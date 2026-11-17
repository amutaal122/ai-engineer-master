---
name: Chrome DevTools MCP
description: MCP server and CLI that lets a coding agent control and inspect a live Chrome browser. Covers navigation, screenshots, performance traces, network/console inspection, and Puppeteer-based automation — no manual browser setup required.
triggers: [chrome devtools mcp, chrome mcp, browser devtools, puppeteer mcp, chrome automation, devtools mcp, browser inspector agent, chrome control agent, web automation mcp]
version: "1.0"
source: https://github.com/ChromeDevTools/chrome-devtools-mcp
---

# Chrome DevTools MCP Skill

## § RULES
- Always use `--isolated` in CI or automated runs to avoid cross-tab interference.
- Prefer `--slim` when you only need snapshot/screenshot — omits the full DevTools panel and uses less memory.
- Read `X-Routed-Via` headers when combining with a proxy like freellmapi.
- Never commit Chrome profile data or trace files to the repo.

---

## Install

### As a Claude Code plugin (easiest)
```
/plugin marketplace add ChromeDevTools/chrome-devtools-mcp
```

### Via MCP config (`.claude/mcp.json` or Claude Code settings)
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

### Global CLI
```bash
npm install -g chrome-devtools-mcp
```

### Flags
| Flag | Purpose |
|---|---|
| `--headless` | Run Chrome headlessly |
| `--isolated` | Isolated session (no shared state) |
| `--slim` | Lightweight mode — fewer DevTools features |
| `--no-usage-statistics` | Disable telemetry |

---

## CLI usage

```bash
# Open a tab (returns a tab ID, e.g. 1)
chrome-devtools open_tab 1 --url "https://example.com"

# Navigate
chrome-devtools navigate_page 1 --url "https://news.ycombinator.com"

# Take a screenshot
chrome-devtools take_screenshot 1 --filePath ./screenshot.png

# Get the accessibility tree snapshot (agent-friendly refs)
chrome-devtools snapshot 1

# Click an element by ref from snapshot
chrome-devtools click 1 --ref @e12

# Type into a focused element
chrome-devtools type 1 --text "search query"

# Read console output
chrome-devtools get_console 1

# Read network requests
chrome-devtools get_network 1

# Start a performance trace
chrome-devtools start_trace 1
chrome-devtools stop_trace 1 --filePath ./trace.json

# Run JavaScript in the page
chrome-devtools evaluate 1 --expression "document.title"

# Close the tab
chrome-devtools close_tab 1
```

---

## MCP tool examples (agent calling MCP tools)

When the MCP server is running, the agent calls tools like:
```
navigate_page(tabId=1, url="https://github.com/trending")
take_screenshot(tabId=1, filePath="./gh-trending.png")
get_console(tabId=1)
evaluate(tabId=1, expression="window.location.href")
```

Full tool reference: `docs/tool-reference.md` in the repo.

---

## Typical agent workflow

```
1. open_tab → get tabId
2. navigate_page → load target
3. snapshot → get accessibility tree with @refs
4. click / type on refs
5. take_screenshot → verify visual state
6. get_console + get_network → debug or extract data
7. close_tab → clean up
```

---

## Caveats
- Requires Node.js and Chrome/Chromium installed.
- 58k+ GitHub stars; Apache-2.0 license.
- Full DevTools panel only in non-slim mode — use slim for speed.
