---
name: GPT-OSS (gpt-oss-120b / gpt-oss-20b)
description: OpenAI's open-weight MoE reasoning models (Apache-2.0). gpt-oss-120b fits one 80GB GPU; gpt-oss-20b fits 16GB. Both support configurable reasoning effort, function calling, browsing, Python execution, and Structured Outputs. Must be used with the openai-harmony response format.
triggers: [gpt-oss, gpt-oss-120b, gpt-oss-20b, openai open model, open weight reasoning, openai open source, harmony format, gpt oss, openai gpt-oss]
version: "1.0"
source: https://github.com/openai/gpt-oss
---

# GPT-OSS Skill

## § RULES
- Always use the `openai-harmony` package to render prompts and parse responses — without it, model outputs will be malformed.
- Use `temperature=1.0, top_p=1.0` for sampling (model is trained for these values).
- Download weights with the Hugging Face CLI, not `git clone` (repo contains no weights).
- On Windows, use Ollama or LM Studio — the reference implementations require CUDA/Linux.
- Triton and Torch reference code is for education, not production; use vLLM or Transformers for production serving.

---

## Install

```bash
# Base package
pip install gpt-oss

# With PyTorch reference implementation
pip install gpt-oss[torch]

# With Triton kernels (Linux + CUDA)
pip install gpt-oss[triton]

# Apple Metal (macOS, from source)
git clone https://github.com/openai/gpt-oss.git
GPTOSS_BUILD_METAL=1 pip install -e ".[metal]"
```

Python 3.12 required. macOS: `xcode-select --install` first.

### Download weights (Hugging Face)
```bash
pip install huggingface-hub
hf download openai/gpt-oss-20b  --include "original/*" --local-dir gpt-oss-20b/
hf download openai/gpt-oss-120b --include "original/*" --local-dir gpt-oss-120b/
```

---

## Quickest start — Transformers

```python
from transformers import pipeline

pipe = pipeline(
    "text-generation",
    model="openai/gpt-oss-20b",   # or "openai/gpt-oss-120b"
    torch_dtype="auto",
    device_map="auto",
)

messages = [{"role": "user", "content": "Explain MoE routing in two sentences."}]
out = pipe(messages, max_new_tokens=256)
print(out[0]["generated_text"][-1]["content"])
```

The Transformers chat template handles `openai-harmony` automatically.

---

## vLLM server (production)

```bash
uv pip install --pre vllm==0.10.1+gptoss \
  --extra-index-url https://wheels.vllm.ai/gpt-oss/ \
  --extra-index-url https://download.pytorch.org/whl/nightly/cu128 \
  --index-strategy unsafe-best-match

vllm serve openai/gpt-oss-20b
```

Then query with the standard OpenAI client pointing at `http://localhost:8000/v1`.

---

## Ollama (macOS / Windows)

```bash
ollama pull gpt-oss:20b    # or gpt-oss:120b
ollama run  gpt-oss:20b
```

---

## LM Studio

```
lms get openai/gpt-oss-20b
```

---

## openai-harmony API (direct use)

```python
from openai_harmony import (
    HarmonyEncodingName, load_harmony_encoding,
    Conversation, Message, Role,
    SystemContent, DeveloperContent,
)

enc = load_harmony_encoding(HarmonyEncodingName.HARMONY_GPT_OSS)

convo = Conversation(messages=[
    Message(role=Role.SYSTEM, content=SystemContent(text="You are a helpful AI.")),
    Message(role=Role.USER,   content="What is MXFP4 quantization?"),
])

prompt_tokens = enc.render_conversation_for_completion(convo)
# pass prompt_tokens to your inference backend, then:
# parsed = enc.parse_messages_from_completion_tokens(completion_tokens)
```

---

## Reasoning effort

| `reasoning_effort` | Tokens used | Use for |
|---|---|---|
| `low` | Fewest | Fast responses, simple tasks |
| `medium` | Moderate | General use |
| `high` | Most | Complex reasoning, math, code |

Pass via the vLLM `SamplingParams` extra body or the CLI `-r` flag.

---

## Terminal chat CLI

```bash
# Start interactive chat with 20b model, triton backend
python -m gpt_oss.chat --backend triton gpt-oss-20b/original/

# Non-interactive, high reasoning, enable browser
python -m gpt_oss.chat -r high -b gpt-oss-20b/original/

# Enable Python code execution tool
python -m gpt_oss.chat -p gpt-oss-20b/original/

# Custom context window
python -m gpt_oss.chat -c 32768 gpt-oss-20b/original/
```

CLI flags: `-r REASONING_EFFORT`, `-a` (all tools), `-b` (browser), `-p` (python), `-c CONTEXT`, `--backend {triton,torch,vllm,metal,ollama,transformers}`.

---

## Responses API server

```bash
python -m gpt_oss.responses_api.serve \
  --checkpoint gpt-oss-20b/original/ \
  --port 8080 \
  --inference-backend triton
```

Then query with the OpenAI Responses API client against `http://localhost:8080`.

---

## Browser tool

```python
from gpt_oss.tools.simple_browser import SimpleBrowserTool, YouComBackend
import os

tool = SimpleBrowserTool(backend=YouComBackend(api_key=os.environ["YDC_API_KEY"]))
# build harmony system message with tool config:
# system = SystemContent(...).with_tools(tool.tool_config)
# ... render, run inference, parse response, then:
# result = await tool.process(last_message)   # when recipient == "browser"
```

Also: `ExaBackend` (needs `EXA_API_KEY`). Methods: `search`, `open`, `find`.

---

## Python execution tool

```python
from gpt_oss.tools.python_docker.docker_tool import PythonTool

tool = PythonTool()   # stateless, runs in Docker
# build system message: SystemContent(...).with_python()
# when recipient == "python": result = await tool.process(last_message)
```

---

## Codex CLI integration

`~/.codex/config.toml`:
```toml
[profiles.oss]
model    = "gpt-oss:20b"
provider = "ollama"

[providers.ollama]
name     = "Ollama"
base_url = "http://localhost:11434/v1"
api_key  = "ollama"
```

```bash
codex -p oss "explain this codebase"
```

---

## Model specs

| | gpt-oss-120b | gpt-oss-20b |
|---|---|---|
| Total params | ~117B | ~21B |
| Active params | ~5.1B | ~3.6B |
| Weight format | MXFP4 (MoE) + BF16 | MXFP4 (MoE) + BF16 |
| Min GPU memory | 80GB (H100 / MI300X) | 16GB |
| Recommended sampling | temp=1.0, top_p=1.0 | temp=1.0, top_p=1.0 |

---

## MCP server

```bash
cd gpt-oss-mcp-server
# follow README in that directory for MCP tool registration
```

---

## Caveats
- Apache-2.0 license; weights hosted on Hugging Face.
- Windows is untested — use Ollama or LM Studio on Windows.
- Triton/Torch implementations are reference/educational; use vLLM or Transformers for production.
- `openai-harmony` is required for correct output parsing regardless of inference backend.
