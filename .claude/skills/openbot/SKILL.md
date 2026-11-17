---
name: OpenBot
description: Self-hostable workspace for AI coworkers (Bots). Each Bot gets a sandboxed Chromium container, shell access, and MCP tool integrations. Any AG-UI endpoint can be a Bot — LangGraph, Mastra, CrewAI, Pydantic AI, etc. Policy-gated (CEL) with full audit log.
triggers: [openbot, copilotkit openbot, ai coworker, ai workspace, ag-ui, browser automation agent, self-hosted ai agent, agentic workspace, openbot bot, copilotkit agent]
version: "1.0"
source: https://github.com/CopilotKit/OpenBot
---

# OpenBot Skill

## § RULES
- OpenBot is an **application**, not an npm library — clone and self-host it; nothing is imported.
- Always run inside WSL 2 on Windows (OpenBot's Chromium container layer requires Linux).
- Policy rules (CEL) default to deny-before-allow and fail closed — write allow rules explicitly.
- Never commit `KEY_ENCRYPTION_KEY`, model keys, or `BETTER_AUTH_SECRET` to the repo.
- For agents you build, expose an AG-UI endpoint and register it at `/bots`; private addresses need `AGENT_ENDPOINT_ALLOWED_HOSTS`.

---

## Install and run (local dev)

### Prerequisites
- Docker + Docker Compose
- Bun 1.4+
- CopilotKit account (for the Intelligence service)
- OpenAI or Anthropic API key

```bash
git clone https://github.com/CopilotKit/OpenBot.git
cd OpenBot
cp .env.example .env
bun install

# Log in to CopilotKit and wire up the Intelligence service
npx --yes copilotkit@latest login
npx --yes copilotkit@latest local setup
npx --yes copilotkit@latest local connect --approve-connection

# Generate encryption key and add to .env
openssl rand -base64 32    # → KEY_ENCRYPTION_KEY=<value>

bash scripts/start.sh      # http://localhost:3010
bash scripts/stop.sh       # shut down
```

### Single container (Docker)
```bash
docker run -p 3001:3001 \
  --env-file .env \
  -e EMBEDDED_POSTGRES=on \
  -v openbot-data:/var/lib/postgresql \
  ghcr.io/copilotkit/openbot:latest
```

### Kubernetes (Helm)
```bash
helm install openbot \
  https://github.com/CopilotKit/OpenBot/releases/download/v1.1.0/openbot-bundle-0.1.0.tgz \
  --namespace openbot --create-namespace \
  --values openbot-values.yaml \
  --timeout 15m
```

---

## Key environment variables

```env
# Model provider — pick one
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=sk-ant-...
BOT_PROVIDER=anthropic

# Auth
BETTER_AUTH_SECRET=<32+ chars>
BETTER_AUTH_URL=http://localhost:3010
TRUSTED_ORIGINS=http://localhost:3010
INITIAL_ADMIN_EMAILS=you@example.com

# Encryption
KEY_ENCRYPTION_KEY=<base64, 32 bytes>

# Single-user mode (no sign-in)
OPENBOT_SINGLE_USER=true

# Allow private agent endpoints
AGENT_ENDPOINT_ALLOWED_HOSTS=agents.internal,10.0.0.42:9000
```

OAuth providers: `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, Microsoft, Okta, SAML/OIDC.

---

## Bring your own agent (AG-UI)

Any HTTP endpoint that speaks the [AG-UI protocol](https://github.com/ag-ui-protocol/ag-ui) can be a Bot.

### LangGraph example
```python
# agent.py — expose an AG-UI endpoint
from copilotkit.langchain import copilotkit_customize_config
from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    messages: list

def my_node(state: State, config):
    # your LangGraph logic here
    return state

builder = StateGraph(State)
builder.add_node("run", my_node)
builder.set_entry_point("run")
builder.add_edge("run", END)
graph = builder.compile()
```

```python
# server.py — FastAPI + CopilotKit AG-UI adapter
from fastapi import FastAPI
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitSDK, LangGraphAgent
from agent import graph

app = FastAPI()
sdk = CopilotKitSDK(agents=[LangGraphAgent(name="my-bot", description="My agent", graph=graph)])
add_fastapi_endpoint(app, sdk, "/copilotkit")
```

Then in OpenBot: **Bots → New Bot → enter `http://host:8000/copilotkit`**.

### Supported frameworks
- LangGraph (Python / JS)
- Mastra
- CrewAI
- Pydantic AI
- Google ADK
- Any custom AG-UI endpoint

---

## REST API

Base: `http://localhost:3010/api/v2/organizations/default`

| Method | Path | Description |
|---|---|---|
| `GET` | `/bots` | List Bots |
| `POST` | `/bots` | Create a Bot |
| `GET` | `/bots/{botId}/channels` | List channels |
| `POST` | `/bots/{botId}/channels` | Start a conversation |
| `GET` | `/bots/{botId}/channels/{channelId}/runs` | List runs |
| `POST` | `/admin/policies` | Create a CEL policy rule |
| `GET` | `/admin/audit` | Audit log |

Headers: `Authorization: Bearer <api-key>` or session cookie.  
Idempotent writes: `Idempotency-Key: <uuid>`.  
Errors: RFC 9457 problem-details JSON.

Full spec: `api/openapi.yaml` and `api/asyncapi.yaml` (WebSocket streams).

---

## Bot policy rules (CEL)

Policy checks run before every action (browser, shell, MCP). Rules are written in [CEL](https://cel.dev/):

```yaml
# Allow browsing news sites, deny everything else
- effect: allow
  condition: 'tool.name == "browser_navigate" && page.host in ["news.ycombinator.com", "bbc.com"]'

# Deny shell commands from all bots by default
- effect: deny
  condition: 'command != ""'

# Allow a specific bot to run approved commands
- effect: allow
  condition: 'bot.id == "my-trusted-bot" && command in ["ls", "cat", "git status"]'
```

CEL variables: `tool.name`, `bot.id`, `page.host`, `command`, `mcp.*`.

---

## Dev workflow

```bash
bun run dev          # start app only (hot-reload)
bun run build        # production build
bun run test         # run tests
bun run lint         # Biome lint
bun run typecheck    # TypeScript check
bun run api:generate # regenerate API client into app/src/lib/api/generated
```

---

## Add a Bot from YAML

```bash
# Copy an example catalog YAML into the agents folder
cp examples/fintech/catalog/meeting-follow-ups.yaml examples/fintech/agents/
bash scripts/stop.sh && bash scripts/start.sh
```

---

## Caveats
- The CopilotKit **Intelligence** service (threads, memory, Automatic Learning) is separately licensed — free for local/personal macOS use; paid for Kubernetes/production.
- Local setup requires a CopilotKit account and the `npx copilotkit` CLI.
- MIT-licensed application code; 12.7k GitHub stars.
- gVisor (`runsc`) sandbox is optional but recommended for untrusted Bots.
