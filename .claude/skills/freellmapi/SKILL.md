---
name: FreeLLMAPI
description: Self-hosted router that exposes one OpenAI-compatible endpoint backed by ~87 free-tier providers (~1,300 model endpoints). No cloud billing — provider keys are encrypted locally and the router handles failover, rate-limit tracking, and model selection automatically.
triggers: [freellmapi, free llm, free api, llm router, free models, openai compatible free, local llm router, llm proxy, free tier llm, aggregate llm]
version: "1.0"
source: https://github.com/tashfeenahmed/freellmapi
---

# FreeLLMAPI Skill

## § RULES
- Always set `base_url` to your FreeLLMAPI instance; never hard-code a provider URL.
- Prefer `model="auto"` for general tasks; use `auto:fast` for latency-sensitive paths and `auto:smart` for quality-critical ones.
- Read `X-Routed-Via` headers in production to log which provider actually served each request.
- Run one instance per developer; treat the unified key like a secret — never commit it.
- For Claude Code integration use `npx freellmapi setup-claude` rather than editing config by hand.

## Install

### Docker (recommended)
```bash
curl -fsSL https://freellmapi.co/install.sh | bash
# Opens on http://localhost:3001
```

### Windows desktop app
Download the `.exe` from GitHub Releases or install from the Microsoft Store.

### From source
```bash
git clone https://github.com/tashfeenahmed/freellmapi.git
cd freellmapi
npm install
npm run dev        # API :3001, dashboard :5173
```

After install: open the dashboard → **Keys** page → add provider API keys (OpenAI, Anthropic, Google, Groq, etc.) → copy the unified `freellmapi-...` bearer token.

---

## Basic usage — Python (openai SDK)

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:3001/v1",
    api_key="freellmapi-YOUR_UNIFIED_KEY",
)

response = client.chat.completions.create(
    model="auto",          # router picks the best available free model
    messages=[{"role": "user", "content": "Summarise the PEFT paper in 3 bullets."}],
    stream=False,
)
print(response.choices[0].message.content)
print("Routed via:", response.headers.get("x-routed-via"))  # e.g. openrouter/mistral-7b
```

### Streaming
```python
stream = client.chat.completions.create(
    model="auto:fast",
    messages=[{"role": "user", "content": "Write a FastAPI health endpoint."}],
    stream=True,
)
for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="", flush=True)
```

---

## Model selection

| `model=` value | Behaviour |
|---|---|
| `auto` | Router picks the best available free model |
| `auto:fast` | Optimise for lowest latency |
| `auto:smart` | Optimise for highest quality |
| `fusion` | Fan out to several models, synthesise one answer |
| A named profile | Use a custom routing profile defined in the dashboard |
| A specific model ID | Pin to one model (e.g. `gpt-4o-mini`) |

---

## Endpoints

| Endpoint | Use |
|---|---|
| `POST /v1/chat/completions` | OpenAI-style chat |
| `POST /v1/completions` | Legacy text completions |
| `POST /v1/responses` | Responses API |
| `POST /v1/embeddings` | Text embeddings |
| `POST /v1/images/generations` | Image generation |
| `POST /v1/audio/speech` | TTS |
| `POST /v1/audio/transcriptions` | STT / Whisper |
| `POST /v1/messages` | Anthropic-style messages |
| `GET  /v1/models` | List all available models |
| `GET/POST /mcp` | MCP server endpoint |

---

## Claude Code integration

```bash
# Point Claude Code at your local instance
npx freellmapi setup-claude \
  --url http://localhost:3001 \
  --api-key freellmapi-YOUR_UNIFIED_KEY

# Or launch Claude Code through the router directly
npx freellmapi launch
npx freellmapi launch-codex   # for Codex CLI
```

---

## LangChain integration

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    base_url="http://localhost:3001/v1",
    api_key="freellmapi-YOUR_UNIFIED_KEY",
    model="auto:smart",
)
result = llm.invoke("Explain RAG in one paragraph.")
print(result.content)
```

---

## Environment variables pattern

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url=os.environ["FREELLMAPI_BASE_URL"],   # http://localhost:3001/v1
    api_key=os.environ["FREELLMAPI_KEY"],
)
```

`.env`:
```
FREELLMAPI_BASE_URL=http://localhost:3001/v1
FREELLMAPI_KEY=freellmapi-...
```

---

## Managing provider keys (CLI)

```bash
npx freellmapi keys add      # interactive wizard
npx freellmapi keys list     # show configured providers
npx freellmapi keys test     # ping each provider
npx freellmapi keys remove   # remove a provider key
```

---

## Logging routed provider

```python
# Check which provider served the request
import httpx

with httpx.Client() as http:
    r = http.post(
        "http://localhost:3001/v1/chat/completions",
        headers={"Authorization": "Bearer freellmapi-YOUR_KEY"},
        json={"model": "auto", "messages": [{"role": "user", "content": "ping"}]},
    )
    print(r.headers.get("x-routed-via"))  # e.g. groq/llama-3-8b
    print(r.json()["choices"][0]["message"]["content"])
```

---

## Caveats
- Free-tier quotas, latency, and uptime vary per provider — no SLA.
- The Premium plan ($19/yr) gives an updated model catalog feed; the router itself is always free.
- Each provider's terms of service apply to your usage of their free tier.
- MIT-licensed; designed for personal development and experimentation.
