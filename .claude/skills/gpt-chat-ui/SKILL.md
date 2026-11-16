---
name: gpt-chat-ui
description: Build a ChatGPT-style GPT chat application - streaming UI, message model, markdown and code rendering, tool calls, conversation history, FastAPI + OpenAI/Claude backend, and production polish.
triggers: [gpt, chatgpt, chat ui, chat interface, chatbot, chat app, gpt clone, streaming chat, conversation ui, openai chat, assistant ui, sse, message list, copilot ui]
version: "1.0"
source: personal
---

# GPT Chat UI

## §ARCHITECTURE
```
Browser (HTML/React) --POST /chat (SSE)--> FastAPI --> LLM API (OpenAI / Anthropic)
        |                                      |
   localStorage / DB  <-- history ----------- Postgres (conversations, messages)
```
Keep the API key on the server only. The browser never sees it.

## §MESSAGE MODEL
```python
class Message(BaseModel):
    id: str
    role: Literal["system", "user", "assistant", "tool"]
    content: str
    created_at: datetime
    model: str | None = None
    tokens: int | None = None

class ChatRequest(BaseModel):
    conversation_id: str | None = None
    messages: list[Message]
    model: str = "gpt-4o-mini"
    temperature: float = Field(0.7, ge=0, le=2)
```

## §BACKEND (FastAPI + SSE streaming)
```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from openai import AsyncOpenAI
import json

app = FastAPI()
client = AsyncOpenAI()  # reads OPENAI_API_KEY from env

@app.post("/chat")
async def chat(req: ChatRequest):
    async def gen():
        stream = await client.chat.completions.create(
            model=req.model, temperature=req.temperature, stream=True,
            messages=[{"role": m.role, "content": m.content} for m in req.messages],
        )
        async for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield f"data: {json.dumps({'t': delta})}\n\n"
        yield "data: [DONE]\n\n"
    return StreamingResponse(gen(), media_type="text/event-stream")
```
Swap the call for `anthropic.AsyncAnthropic().messages.stream(...)` to use Claude; the SSE contract stays the same.

## §FRONTEND (stream reader)
```js
async function send(messages, onToken, signal) {
  const res = await fetch("/chat", {method:"POST", signal,
    headers:{"Content-Type":"application/json"}, body: JSON.stringify({messages})});
  const reader = res.body.getReader(), dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const {value, done} = await reader.read(); if (done) break;
    buf += dec.decode(value, {stream:true});
    const parts = buf.split("\n\n"); buf = parts.pop();
    for (const p of parts) {
      const d = p.replace(/^data: /, "");
      if (d === "[DONE]") return;
      onToken(JSON.parse(d).t);
    }
  }
}
```
Stop button = `AbortController.abort()`.

## §UI LAYOUT (the ChatGPT shape)
| Zone | Behavior |
|---|---|
| Sidebar | New chat, grouped history (Today / 7 days / Older), search, collapse on mobile |
| Thread | Centered column ~720px, user right/bubble, assistant left/plain text |
| Composer | Auto-grow textarea, Enter send, Shift+Enter newline, send becomes Stop while streaming |
| Header | Model picker, share/export, theme toggle |
| Empty state | Greeting + 4 suggestion chips that fill the composer |

## §MESSAGE RENDERING
- Markdown via `marked` + sanitize with DOMPurify (never inject raw model HTML).
- Code blocks: language label, Copy button, monospace, horizontal scroll inside block.
- Show a typing cursor while streaming; re-render markdown on a rAF throttle.
- Actions under each assistant reply: Copy, Regenerate, thumbs up/down.
- Keep scroll pinned to bottom only if the user is already near the bottom.

## §FEATURES CHECKLIST
- [ ] Streaming with Stop and Regenerate
- [ ] Conversation history persisted (DB or localStorage), rename, delete
- [ ] System prompt / custom instructions field
- [ ] Model + temperature controls
- [ ] File or image attach (multimodal) when the model supports it
- [ ] Tool calls shown as collapsible steps ("Searched the web", "Ran code")
- [ ] Token and cost estimate per conversation
- [ ] Keyboard: Ctrl+K new chat, Esc stop, Up arrow edit last message
- [ ] Export conversation as Markdown or JSON

## §TOOL CALLS
```python
tools=[{"type":"function","function":{"name":"get_weather","description":"Weather by city",
  "parameters":{"type":"object","properties":{"city":{"type":"string"}},"required":["city"]}}}]
```
Loop: model returns `tool_calls` -> run the function server-side -> append a `tool` message -> call the model again -> stream the final answer. Cap the loop at 5 iterations.

## §PRODUCTION
- Rate limit per user (Redis), request size cap, timeout on upstream call.
- Strip secrets and PII from logs; log token counts and latency.
- Moderate input when public (moderation endpoint or ai-agent-security skill).
- Retry 429/5xx with exponential backoff; surface a readable error in the thread.
- Pair with `/ui-design` for tokens, dark mode and accessibility.

## §RULES
- API key server-side only; validate every request with Pydantic.
- Sanitize rendered markdown; treat model output as untrusted.
- Every thread has stop, retry and error states.
- Stream by default; never block the UI on a full response.
