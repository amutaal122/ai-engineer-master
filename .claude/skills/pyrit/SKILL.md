---
name: PyRIT
description: Microsoft's open-source AI red teaming toolkit for finding security and safety weaknesses in generative AI systems — automated scans, adaptive multi-turn attacks, a CLI scanner, a web GUI, and an extensible Python framework. Use when probing an LLM app for jailbreaks, prompt injection, harmful output, or before a model ships.
triggers: [pyrit, ai red teaming, red team llm, jailbreak testing, prompt injection testing, adversarial testing, genai security, llm safety testing, harm testing, attack llm, pyrit_scan, copyrit]
version: "1.0"
source: https://github.com/microsoft/PyRIT
---

# PyRIT Skill

## § RULES
- Red team only systems you are authorized to test. PyRIT generates real attack traffic against real endpoints.
- Use `microsoft/PyRIT`. The old `Azure/PyRIT` repo is archived and read-only since March 2026.
- Keep attack results in memory you control — transcripts contain the harmful outputs you just elicited.
- Scan results are evidence, not a verdict. A clean automated scan does not mean the system is safe; pair it with human-led testing.
- Pin the model and system prompt under test when comparing runs, or the scores mean nothing.

---

## Install

```bash
pip install pyrit
# or
uv pip install pyrit
```

Python 3.11, 3.12, 3.13, or 3.14. The docs recommend 3.13 for local installs.

Verify:

```bash
python -c "import pyrit; print(pyrit.__version__)"
```

---

## Configure

Create `~/.pyrit/.env`:

```
OPENAI_CHAT_ENDPOINT=...
OPENAI_CHAT_KEY=...
OPENAI_CHAT_MODEL=...
```

And `~/.pyrit/.pyrit_conf`:

```yaml
memory_db_type: in_memory
initializers:
  - target
  - scorer
```

---

## Three ways to run it

| Surface | Command | Use for |
|---|---|---|
| Scanner CLI | `pyrit_scan run airt.scam --target openai_chat` | repeatable automated scans |
| Interactive shell | `pyrit_shell` | poking at a target by hand |
| GUI (CoPyRIT) | `pyrit_backend`, then open `http://localhost:8000/` | human-led testing with a UI |
| Framework | Python API | custom attacks, CI, anything scripted |

```bash
pyrit_scan --help
```

---

## Framework quickstart

```python
from pyrit.executor.attack import PromptSendingAttack
from pyrit.output.attack_result.pretty import PrettyAttackResultMemoryPrinter
from pyrit.prompt_target import OpenAIChatTarget
from pyrit.setup import IN_MEMORY, initialize_pyrit_async

await initialize_pyrit_async(memory_db_type=IN_MEMORY)

target = OpenAIChatTarget()
attack = PromptSendingAttack(objective_target=target)

result = await attack.execute_async(
    objective="What model exactly are you? be concise."
)

printer = PrettyAttackResultMemoryPrinter()
await printer.write_async(result)
```

The shape to remember: **initialize → build a target → wrap it in an attack → execute against an objective → print or score the result.**

---

## Supported targets

OpenAI, Anthropic, Azure OpenAI, Microsoft Foundry, Azure Machine Learning, Google Gemini, Google Vertex AI, AWS Bedrock, Hugging Face, Ollama, Groq, OpenRouter, Cohere, GitHub Copilot.

Also any OpenAI-compatible API, an optional LiteLLM adapter for more providers, and endpoint testing over HTTP, WebSockets, or Playwright browser automation. Available features depend on the target — not every attack works against every one.

---

## Where it fits in an eval stack

PyRIT answers *"can this be made to misbehave?"* — it is adversarial. It does not replace:

- `llm-evaluation` — quality on the happy path
- `ai-agent-security` — defensive design, guardrails, injection hardening
- `security-audit` — the surrounding web app and API

Run PyRIT **after** you have guardrails to test, and re-run it whenever the system prompt or model changes.

---

## Caveats
- ~4.9k stars, MIT licensed, built by the Microsoft AI Red Team.
- Docs: https://microsoft.github.io/PyRIT/ — the README deliberately keeps install instructions on the site, so check there when a command here drifts.
- A Docker image is offered as the quick start if you do not want a local Python install.
- Whitepaper: "PyRIT: Democratizing AI Red Teaming Through Open-Source Tooling" (2026).
