---
name: anthropic-sdk
description: Anthropic Claude API — messages, streaming, tool use, vision, prompt caching, token counting, batch API, and multi-turn conversations using the Python SDK.
triggers: [anthropic, claude api, claude sdk, anthropic sdk, claude messages, claude streaming, claude tools, claude vision, claude cache, prompt caching anthropic, claude batch, claude haiku, claude sonnet, claude opus]
version: "1.0"
source: https://docs.anthropic.com
---

# Anthropic Claude API

## Setup
```python
pip install anthropic
export ANTHROPIC_API_KEY="sk-ant-..."
```

## Basic message
```python
import anthropic
client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY

message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain async/await in Python"}],
)
print(message.content[0].text)
print(f"Tokens: {message.usage.input_tokens} in / {message.usage.output_tokens} out")
```

## Models (2026)
| Model | Speed | Cost | Best for |
|---|---|---|---|
| `claude-haiku-4-5` | Fastest | $ | Classification, extraction, simple tasks |
| `claude-sonnet-4-5` | Balanced | $$ | Most tasks — default choice |
| `claude-opus-4-5` | Powerful | $$$$ | Complex reasoning, hard problems |

## Streaming
```python
# Async streaming
async with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": prompt}],
) as stream:
    async for text in stream.text_stream:
        print(text, end="", flush=True)
    final = await stream.get_final_message()

# FastAPI streaming endpoint
from fastapi.responses import StreamingResponse

@app.post("/chat")
async def chat(prompt: str):
    async def generate():
        async with client.messages.stream(...) as stream:
            async for text in stream.text_stream:
                yield f"data: {json.dumps({'text': text})}\n\n"
    return StreamingResponse(generate(), media_type="text/event-stream")
```

## Tool use (function calling)
```python
tools = [{
    "name": "get_weather",
    "description": "Get current weather for a city",
    "input_schema": {
        "type": "object",
        "properties": {
            "city": {"type": "string", "description": "City name"},
            "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
        },
        "required": ["city"],
    },
}]

response = client.messages.create(
    model="claude-sonnet-4-5", max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}],
)

# Handle tool call
if response.stop_reason == "tool_use":
    tool_use = next(b for b in response.content if b.type == "tool_use")
    tool_result = call_tool(tool_use.name, tool_use.input)

    # Continue conversation with tool result
    final = client.messages.create(
        model="claude-sonnet-4-5", max_tokens=1024,
        tools=tools,
        messages=[
            {"role": "user", "content": "What's the weather in Tokyo?"},
            {"role": "assistant", "content": response.content},
            {"role": "user", "content": [{"type": "tool_result",
                "tool_use_id": tool_use.id, "content": str(tool_result)}]},
        ],
    )
```

## Vision (image input)
```python
import base64

with open("diagram.png", "rb") as f:
    img_b64 = base64.standard_b64encode(f.read()).decode()

message = client.messages.create(
    model="claude-sonnet-4-5", max_tokens=1024,
    messages=[{"role": "user", "content": [
        {"type": "image", "source": {"type": "base64",
            "media_type": "image/png", "data": img_b64}},
        {"type": "text", "text": "Describe what this diagram shows."},
    ]}],
)

# URL source (no base64 needed)
{"type": "image", "source": {"type": "url", "url": "https://..."}}
```

## Prompt caching (reduce cost by up to 90%)
```python
# Mark large static content as cacheable
message = client.messages.create(
    model="claude-sonnet-4-5", max_tokens=1024,
    system=[{
        "type": "text",
        "text": LARGE_SYSTEM_PROMPT,       # cached after first call
        "cache_control": {"type": "ephemeral"},
    }],
    messages=[{"role": "user", "content": user_question}],
)
# cache_creation_input_tokens vs cache_read_input_tokens in usage
# Min cacheable: 1024 tokens (Haiku) / 2048 (Sonnet/Opus)
```

## Multi-turn conversation
```python
messages = []

def chat(user_input: str) -> str:
    messages.append({"role": "user", "content": user_input})
    response = client.messages.create(
        model="claude-sonnet-4-5", max_tokens=1024,
        system="You are a helpful AI engineer assistant.",
        messages=messages,
    )
    reply = response.content[0].text
    messages.append({"role": "assistant", "content": reply})
    return reply
```

## Token counting
```python
# Count before sending (no API charge)
count = client.messages.count_tokens(
    model="claude-sonnet-4-5",
    messages=[{"role": "user", "content": prompt}],
)
print(count.input_tokens)
```

## Batch API (async large-scale)
```python
batch = client.messages.batches.create(requests=[
    {"custom_id": f"req-{i}",
     "params": {"model": "claude-haiku-4-5", "max_tokens": 256,
                "messages": [{"role": "user", "content": item}]}}
    for i, item in enumerate(items)
])
# Poll until complete, then retrieve results
# Up to 100k requests per batch, 50% cheaper
```

## Rules
- Default to `claude-sonnet-4-5` — best price/performance
- Always set `max_tokens` — required parameter
- Use prompt caching for system prompts > 2048 tokens
- Stream for latency-sensitive UX
- Batch API for offline jobs (evals, bulk extraction, data processing)
