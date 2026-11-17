---
name: Free Claude Code (fcc)
description: Local proxy that routes Claude Code, Codex, OpenCode, Aider, and others to 61+ free-tier model providers (NVIDIA NIM, OpenRouter, Groq, Ollama, and more). Supports multi-key rotation, fallback chains, and exposes Anthropic, OpenAI, and Gemini endpoints on localhost.
triggers: [free claude code, fcc, fcc-server, free codex, local llm proxy, multi-provider proxy, claude code free, free coding agent, provider rotation, free ai proxy]
version: "1.0"
source: https://github.com/Alishahryar1/free-claude-code
---

# Free Claude Code (fcc) Skill

## § RULES
- Always review each upstream provider's terms of service before use.
- Never commit provider API keys — store them in `~/.fcc/config.yaml` or env vars.
- Use multi-key rotation for providers with strict rate limits (e.g. NVIDIA NIM).
- Keep `fcc-server` running in a separate terminal; it must be alive before launching any coding agent.
- Treat `fcc-server` as a local dev tool, not a production API gateway.

---

## Install

### macOS / Linux
```bash
curl -fsSL "https://raw.githubusercontent.com/Alishahryar1/free-claude-code/main/scripts/install.sh" | sh
```

### Windows (PowerShell)
```powershell
irm "https://raw.githubusercontent.com/Alishahryar1/free-claude-code/main/scripts/install.ps1" | iex
```

---

## Start the proxy

```bash
fcc-server          # starts on http://127.0.0.1:8082
```

---

## Launch coding agents through the proxy

```bash
fcc-claude          # Claude Code → fcc-server
fcc-codex           # Codex CLI  → fcc-server
fcc-opencode        # OpenCode   → fcc-server
fcc-aider           # Aider      → fcc-server
```

---

## Endpoints

Base URL: `http://127.0.0.1:8082`

| Endpoint | Protocol |
|---|---|
| `POST /v1/messages` | Anthropic Messages API |
| `POST /v1/chat/completions` | OpenAI Chat Completions |
| `POST /v1/responses` | OpenAI Responses API |
| `POST /v1/models/{model}:generateContent` | Gemini |
| `GET  /v1/models` | List available models |

---

## Model IDs

Format: `<provider>/<model-id>`

```
groq/llama-3.3-70b-versatile
openrouter/meta-llama/llama-3.1-8b-instruct:free
nvidia/meta/llama-3.1-70b-instruct
ollama/llama3.2
```

---

## Python usage (OpenAI client)

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:8082/v1",
    api_key="any-string",           # fcc ignores the key
)

response = client.chat.completions.create(
    model="groq/llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "Explain async/await in Python."}],
)
print(response.choices[0].message.content)
```

---

## Python usage (Anthropic client)

```python
import anthropic

client = anthropic.Anthropic(
    base_url="http://127.0.0.1:8082",
    api_key="any-string",
)

message = client.messages.create(
    model="groq/llama-3.3-70b-versatile",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a FastAPI health endpoint."}],
)
print(message.content[0].text)
```

---

## Multi-key rotation config

`~/.fcc/config.yaml`:
```yaml
providers:
  groq:
    keys:
      - gsk_key1...
      - gsk_key2...
    rotation: round-robin

  nvidia:
    keys:
      - nvapi-key1...
    fallback: groq/llama-3.3-70b-versatile
```

---

## Fallback chain

```yaml
fallback_chain:
  - groq/llama-3.3-70b-versatile
  - openrouter/meta-llama/llama-3.1-70b-instruct:free
  - ollama/llama3.2
```

The proxy tries each in order on rate-limit or error.

---

## Supported providers (sample)
NVIDIA NIM, OpenRouter, Groq, Ollama, Together AI, Mistral, Cohere, Google AI, Fireworks, Perplexity, DeepSeek, and more — 61+ total.

---

## Caveats
- 71k+ GitHub stars; AGPL-3.0 license.
- Each provider's free tier has its own rate limits and terms.
- Local dev tool — not intended as a production gateway.
- API key is ignored by fcc but required as a non-empty string by some clients.
