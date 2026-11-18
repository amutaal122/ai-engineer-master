---
name: Agent Desktop
description: Computer-use CLI that lets an AI agent see and operate desktop apps on macOS, Windows, and Linux through the OS accessibility tree instead of screenshots and pixel matching. Covers snapshots, element refs, the 61 commands, MCP mode, per-OS permissions, and the retry rules that keep an automation from flailing.
triggers: [agent-desktop, computer use, desktop automation, control desktop app, accessibility tree, ax api, ui automation, at-spi, automate gui, operate an app, desktop agent, screenshot free automation]
version: "1.0"
source: https://github.com/vercel-labs/agent-desktop
---

# Agent Desktop Skill

## § RULES
- Refs belong to the snapshot that produced them. A bare `@e8` is rejected — always pass the full `@snapshot:element` form.
- On `STALE_REF` or `AMBIGUOUS_TARGET`, take a **new snapshot**. Never retry the old ref.
- Retry a failed command only when `error.disposition.retry` is `safe`. Anything else means re-observe first.
- Snapshots, screenshots, and clipboard reads can contain private desktop content — keep them out of logs, uploads, and transcripts.
- There is no model inside: the observe → act → verify loop is the calling agent's job.

---

## What makes it different

Screenshot-based computer use asks a model to find a button in an image. Agent Desktop reads the application's **accessibility tree** as JSON, where every actionable element already has a ref and a list of allowed actions. The agent acts on a ref, re-reads the tree to confirm the effect, and repeats.

A `screenshot` command still exists for when you genuinely need pixels.

---

## Install

```bash
npm install -g agent-desktop     # bun, yarn, pnpm work too
brew install agent-desktop       # macOS and Linux
```

Native archives are on GitHub Releases — keep the helper binary beside the executable. There is no official Scoop package.

| OS | Minimum | Backend |
|---|---|---|
| macOS | 13+, Intel or Apple Silicon | AX API |
| Windows | 10 1809+, x64 or ARM64 | UI Automation |
| Linux | Ubuntu 24.04+, X11 or Wayland | AT-SPI |

---

## First run

```bash
agent-desktop status              # platform, permissions, supported surfaces
agent-desktop permissions --guide # macOS: walks through the Accessibility grant
```

On macOS the Accessibility grant is mandatory — nothing works until it is given.

---

## The core loop

```bash
# 1. observe
agent-desktop snapshot --app Finder -i

# 2. act on a ref from that snapshot
agent-desktop click @s8f3k2p9:e8

# 3. observe again to verify
agent-desktop snapshot --app Finder -i
```

For a dense app, map it cheaply first, then drill in:

```bash
agent-desktop snapshot --skeleton --app Slack -i --compact
agent-desktop snapshot --root @s8f3k2p9:e3 -i --compact
```

---

## Snapshot output

One JSON envelope per command:

```json
{
  "version": "2.6",
  "ok": true,
  "command": "snapshot",
  "data": {
    "snapshot_id": "s8f3k2p9",
    "ref_count": 42,
    "tree": [ { "ref_id": "@s8f3k2p9:e8", "available_actions": ["click", "focus"] } ]
  }
}
```

Read `available_actions` before acting — it tells you what the element will accept.

---

## Command groups

| Group | Commands |
|---|---|
| Observe | `snapshot`, `find`, `get`, `is`, `screenshot`, `list-surfaces` |
| Act on a ref | `click`, `type`, `set-value`, `scroll`, … |
| Keyboard & mouse | `press`, `hover`, `drag`, … |
| Apps & windows | `launch`, `list-apps`, `focus-window`, … |
| Sessions | `session`, `trace`, `cursor-overlay` |
| System | `status`, `permissions`, `version`, `batch`, `skills` |

61 command names, 57 operational. `key-down`, `key-up`, `mouse-down`, and `mouse-up` refuse to run until a daemon can guarantee a held key or button gets released.

Useful flags: `--window-id`, `--headed`, `--stdin` (for `type`, `set-value`, `clipboard-set`), `--session`, `--trace`.

---

## Headless vs headed

Ref actions are **headless by default** — they go through the accessibility API without moving the pointer or stealing focus, so they do not fight the human at the keyboard. `--headed` sends physical input instead, for the rare app that only responds to real events.

---

## MCP mode

```bash
agent-desktop mcp
```

Serves every command as an MCP tool over stdio, named `desktop_snapshot`, `desktop_click`, `desktop_session_start`, and so on.

```json
{ "mcpServers": { "agent-desktop": { "command": "agent-desktop", "args": ["mcp"] } } }
```

Install as a skill:

```bash
npx skills add https://github.com/vercel-labs/agent-desktop --skill agent-desktop
```

Before first use, have the agent run `agent-desktop skills get desktop` and `agent-desktop skills get platform`.

---

## Windows gotcha

In PowerShell, quote refs — a bare `@token` is the splatting operator:

```powershell
agent-desktop click '@s8f3k2p9:e8'
```

---

## Caveats
- ~25.3k stars, Apache-2.0, from vercel-labs. Rust core shipped as a CLI plus a C library.
- Multiple windows: `snapshot` returns candidate window ids in `error.details`; pass one with `--window-id`.
- Per-OS permission steps beyond the macOS guide are on the platform docs pages, not in the README.
- Pairs with `agent-browser` — that one drives a browser, this one drives the whole desktop.
