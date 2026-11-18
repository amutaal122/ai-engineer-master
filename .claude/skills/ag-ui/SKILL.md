---
name: AG-UI Protocol
description: The Agent-User Interaction Protocol — an open event-based protocol that standardizes how AI agents stream to user-facing apps. Covers RunAgentInput, the 31 event types, SSE and Protobuf transports, the TypeScript/Python/.NET SDKs, and which agent frameworks speak it. Use when building a chat or agent UI that must render streaming tokens, tool calls, shared state, and human-in-the-loop pauses.
triggers: [ag-ui, agui, agent user interaction protocol, agent ui protocol, streaming agent events, copilotkit, agent frontend, run agent input, text_message_content, state_delta, generative ui, agent streaming protocol]
version: "1.0"
source: https://github.com/ag-ui-protocol/ag-ui
---

# AG-UI Protocol Skill

## § RULES
- Only the run lifecycle events are required. Treat every other event family as optional and render defensively — an agent may never emit `REASONING_*` or `ACTIVITY_*`.
- Handle `TEXT_MESSAGE_CHUNK` and `TOOL_CALL_CHUNK` as well as the explicit start/content/end triples; agents choose which form to send.
- `STATE_DELTA` carries a JSON Patch, not a whole object. Apply it to the last `STATE_SNAPSHOT`, and re-sync from a snapshot if a patch fails to apply.
- Never assume event ordering across families beyond `RUN_STARTED` first and `RUN_FINISHED`/`RUN_ERROR` last.
- AG-UI is the runtime protocol, not a tool protocol. Tools and context belong to MCP; agent-to-agent handoff belongs to A2A.

---

## The problem it solves

Agents stream tokens, call tools mid-response, update shared state, pause for a human, and spawn subagents. Every framework does this differently, so every frontend ends up with bespoke wiring per agent. AG-UI replaces that with one bi-directional event stream any client can render, whatever built the agent.

---

## The shape of a run

```
app  ──  RunAgentInput  ──▶  agent
         (conversation, frontend tools, shared state, context)

app  ◀──  event stream  ──   agent
         RUN_STARTED … TEXT_MESSAGE_CONTENT … TOOL_CALL_* … RUN_FINISHED
```

One `RunAgentInput` in, a typed event stream out.

---

## Event families (31 types in 1.0)

| Family | Events |
|---|---|
| Runs & steps | `RUN_STARTED`, `RUN_FINISHED`, `RUN_ERROR`, `STEP_STARTED`, `STEP_FINISHED` |
| Text | `TEXT_MESSAGE_START`, `TEXT_MESSAGE_CONTENT`, `TEXT_MESSAGE_END`, `TEXT_MESSAGE_CHUNK` |
| Tool calls | `TOOL_CALL_START`, `TOOL_CALL_ARGS`, `TOOL_CALL_END`, `TOOL_CALL_RESULT`, `TOOL_CALL_CHUNK` |
| State | `STATE_SNAPSHOT`, `STATE_DELTA` (JSON Patch), `MESSAGES_SNAPSHOT` |
| Reasoning | `REASONING_START`, `REASONING_MESSAGE_*`, `REASONING_ENCRYPTED_VALUE`, `REASONING_END` |
| Activity | `ACTIVITY_SNAPSHOT`, `ACTIVITY_DELTA` |
| Subagents | `SUBAGENT_STARTED`, `SUBAGENT_FINISHED`, `SUBAGENT_ERROR` |
| Passthrough | `RAW`, `CUSTOM` |

---

## Transports

- **HTTP + SSE** — the common binding
- **HTTP + Protobuf** — binary, for throughput

The protocol is transport-agnostic; those two are what the spec defines. There is no formal WebSocket binding.

---

## SDKs

```bash
npm install @ag-ui/client          # TypeScript
pip install ag-ui-protocol         # Python
dotnet add package AGUI.Client     # .NET
```

Community SDKs exist for Kotlin, Go, Java, Dart, Rust, Ruby, C++, and Swift.

Scaffold an app:

```bash
npx create-ag-ui-app@latest
```

---

## Minimal client

```ts
import { HttpAgent } from "@ag-ui/client";

const agent = new HttpAgent({ url: "http://localhost:8000/" });

await agent.runAgent({}, {
  onTextMessageContentEvent: ({ event }) => {
    process.stdout.write(event.delta);
  },
});
```

The Python side uses FastAPI with an `EventEncoder` emitting `RunStartedEvent`, `TextMessageStartEvent`, `TextMessageContentEvent` deltas, `TextMessageEndEvent`, `RunFinishedEvent`, served with `uvicorn server:app --port 8000`.

---

## Frameworks that speak it

LangChain (LangGraph), CrewAI, Microsoft Agent Framework, Google ADK, AWS Strands Agents, Mastra, Pydantic AI, LlamaIndex, Agno, AG2, Claude Agent SDK, Claude Managed Agents, IBM watsonx Orchestrate, Langroid, Spring AI, Cloudflare Agents, Genkit (Go), OpenAI Agents.

Clients: CopilotKit (React, Angular, Vue, React Native), Slack, Teams, terminal, OpenBot.

---

## How it relates to its neighbours

| Protocol | Owns |
|---|---|
| **AG-UI** | agent ↔ user-facing app, at runtime |
| MCP | tools and context for the agent |
| A2A | agent-to-agent communication |
| A2UI / MCP Apps / Open-JSON-UI | generative UI payloads — AG-UI carries them |

---

## Caveats
- ~20.4k stars, MIT, created by CopilotKit.
- 1.0 has a frozen spec backed by a JSON Schema; the TS, Python, and .NET SDKs are generated from it, and 1.0 is backwards compatible with 0.x in both directions.
- Field-level event schemas are in the spec, not the README: https://docs.ag-ui.com/spec/1.0
- Live examples: https://dojo.ag-ui.com
