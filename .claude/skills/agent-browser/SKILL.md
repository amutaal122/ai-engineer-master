---
name: Agent Browser
description: Browser automation CLI for AI agents. Takes an accessibility-tree snapshot of any page as @ref handles, then lets the agent click, type, and navigate using those refs. A background daemon keeps the browser session alive between commands.
triggers: [agent browser, agent-browser, vercel agent browser, browser automation cli, accessibility tree browser, browser agent cli, snapshot browser, @ref browser]
version: "1.0"
source: https://github.com/vercel-labs/agent-browser
---

# Agent Browser Skill

## § RULES
- Always call `snapshot` before any interaction — refs change after navigation or DOM updates.
- Use `agent-browser mcp` mode when connecting to an MCP-compatible agent framework.
- Prefer `agent-browser skills get core` to load the official interaction skill set.
- Do not share a browser daemon between untrusted contexts.

---

## Install

```bash
# npm (global)
npm install -g agent-browser
agent-browser install      # installs the daemon

# macOS (Homebrew)
brew install agent-browser

# No install needed (npx)
npx agent-browser open example.com
```

---

## Core commands

```bash
# Open a URL (starts daemon automatically)
agent-browser open https://news.ycombinator.com

# Get the accessibility tree with @ref handles
agent-browser snapshot -i

# Click an element
agent-browser click @e1

# Type into a focused element
agent-browser type "search term"

# Press a key
agent-browser key Enter

# Get current URL
agent-browser get url

# Get page title
agent-browser get title

# Navigate back / forward
agent-browser back
agent-browser forward

# Reload
agent-browser reload

# Close browser
agent-browser close
```

---

## MCP server mode

```bash
# Start as a stdio MCP server (for LangChain, LangGraph, etc.)
agent-browser mcp
```

Then register `agent-browser mcp` as a tool server in your agent's MCP config:
```json
{
  "mcpServers": {
    "agent-browser": {
      "command": "agent-browser",
      "args": ["mcp"]
    }
  }
}
```

---

## Skills integration

```bash
# Install the official "core" skill set
agent-browser skills get core

# List installed skills
agent-browser skills list
```

---

## Typical agent loop

```python
import subprocess, json

def run(cmd): return subprocess.run(["agent-browser"] + cmd.split(), capture_output=True, text=True).stdout

run("open https://github.com/trending")
snapshot = run("snapshot -i")           # returns tree with @e1, @e2 ... refs
# agent picks a ref from the snapshot
run("click @e5")                        # click on a trending repo
run("get url")                          # confirm navigation
run("snapshot -i")                      # re-snapshot after navigation
```

---

## Caveats
- 52k+ GitHub stars; Apache-2.0 license.
- Refs are only valid for the current snapshot — always re-snapshot after any navigation or DOM mutation.
- The daemon stays running between commands; call `close` explicitly when done.
