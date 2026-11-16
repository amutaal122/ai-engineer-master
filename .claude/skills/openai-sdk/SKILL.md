---
name: openai-sdk
description: OpenAI API — chat completions, streaming, function calling, embeddings, assistants, vision, structured outputs, and async patterns using the Python SDK.
triggers: [openai, gpt, openai api, openai sdk, chatgpt api, gpt-4, gpt-4o, openai embeddings, openai function calling, openai assistants, openai structured output, tiktoken]
version: "1.0"
source: https://platform.openai.com/docs
---

# OpenAI API

## Setup
```python
pip install openai
export OPENAI_API_KEY="sk-..."
```

## Basic chat
```python
from openai import AsyncOpenAI
client = AsyncOpenAI()  # reads OPENAI_API_KEY

response = await client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful AI engineer."},
        {"role": "user",   "content": "Explain RAG in 3 bullet points."},
    ],
    max_tokens=512,
    temperature=0.7,
)
print(response.choices[0].message.content)
print(f"Tokens: {response.usage.prompt_tokens} / {response.usage.completion_tokens}")
```

## Models (2026)
| Model | Context | Best for |
|---|---|---|
| `gpt-4o` | 128k | General purpose, multimodal |
| `gpt-4o-mini` | 128k | Fast, cheap, most tasks |
| `o1` | 200k | Complex reasoning |
| `o3-mini` | 200k | Reasoning, cheaper |
| `text-embedding-3-small` | — | Embeddings (default) |
| `text-embedding-3-large` | — | High-quality embeddings |

## Streaming
```python
async def stream_response(prompt: str):
    stream = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        stream=True,
    )
    async for chunk in stream:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content
```

## Function calling (tool use)
```python
tools = [{
    "type": "function",
    "function": {
        "name": "search_docs",
        "description": "Search documentation for a query",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "top_k": {"type": "integer", "default": 5},
            },
            "required": ["query"],
        },
    },
}]

response = await client.chat.completions.create(
    model="gpt-4o", messages=messages, tools=tools, tool_choice="auto"
)

# Handle tool calls
if response.choices[0].finish_reason == "tool_calls":
    tool_call = response.choices[0].message.tool_calls[0]
    args = json.loads(tool_call.function.arguments)
    result = await search_docs(**args)
    messages += [
        response.choices[0].message,
        {"role": "tool", "tool_call_id": tool_call.id, "content": str(result)},
    ]
    final = await client.chat.completions.create(model="gpt-4o", messages=messages)
```

## Structured output (guaranteed JSON schema)
```python
from pydantic import BaseModel

class ExtractedInfo(BaseModel):
    name: str
    age: int
    skills: list[str]

response = await client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Extract: Alice, 29, Python and ML."}],
    response_format=ExtractedInfo,
)
info = response.choices[0].message.parsed  # → ExtractedInfo instance
```

## Vision
```python
response = await client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": [
        {"type": "text", "text": "What's in this image?"},
        {"type": "image_url", "image_url": {"url": "https://...", "detail": "high"}},
        # or base64: "data:image/png;base64,..."
    ]}],
)
```

## Embeddings
```python
# Single
response = await client.embeddings.create(
    model="text-embedding-3-small",
    input="The quick brown fox",
)
vector = response.data[0].embedding  # list[float], dim=1536

# Batch (up to 2048 inputs)
texts = ["doc1...", "doc2...", "doc3..."]
response = await client.embeddings.create(model="text-embedding-3-small", input=texts)
vectors = [d.embedding for d in response.data]

# Similarity
import numpy as np
def cosine_sim(a, b): return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
```

## Token counting (tiktoken)
```python
import tiktoken
enc = tiktoken.encoding_for_model("gpt-4o")
tokens = enc.encode(text)
print(len(tokens))
```

## Rules
- Use `gpt-4o-mini` as default — 10× cheaper than `gpt-4o`, near-same quality for most tasks
- Always set `max_tokens` to prevent runaway costs
- Use `response_format={"type": "json_object"}` only when you don't have Pydantic schema
- Prefer structured output (`beta.chat.completions.parse`) over JSON mode — no parsing errors
- Retry on `RateLimitError` and `APIConnectionError` with exponential backoff
