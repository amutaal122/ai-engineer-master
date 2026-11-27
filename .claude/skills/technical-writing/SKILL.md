---
name: Technical Writing
description: Write documentation developers actually use — READMEs, API references, runbooks, ADRs, migration guides, changelogs, and PR descriptions. Covers the four documentation types and why mixing them fails. Use when writing or reviewing any developer-facing document.
triggers: [documentation, write docs, readme, runbook, migration guide, changelog, adr, release notes, pr description, api docs, technical writing, how to document]
version: "1.0"
source: community
---

# Technical Writing Skill

## § RULES
- Decide which of the four document types you are writing before the first line. Most bad docs are two types fighting.
- Lead with what the reader came for. Background goes below the install command, not above it.
- Every example must be complete and runnable. Test them — docs rot faster than code because nothing fails when they break.
- Never write "simply", "just", or "obviously". If it were obvious they would not be reading.
- Document the *why* and the gotchas. The code already says what it does.

---

## The four types

| Type | Reader's state | Shape |
|---|---|---|
| **Tutorial** | new, learning | ordered steps, one path, guaranteed to work |
| **How-to** | knows basics, has a task | recipe, assumes context |
| **Reference** | needs a fact | exhaustive, consistent, skimmable |
| **Explanation** | wants understanding | prose, trade-offs, background |

A tutorial that stops to explain architecture loses the beginner. A reference with narrative asides is unskimmable. Pick one per page.

---

## README

First screen, in order:

1. One sentence: what this is and who it is for
2. The command that makes it run
3. A minimal working example with its output

Everything else — badges, philosophy, contribution guide, roadmap — below the fold. If someone must scroll to find the install command, the page failed.

---

## Runbook: written for 3am

```markdown
## Symptom
What the page said, verbatim.

## Impact
Who is affected, how badly.

## Diagnosis
1. `kubectl get pods -n prod | grep api`
2. If CrashLoopBackOff → cause A. If Running but 503 → cause B.

## Fix
1. `kubectl rollout undo deployment/api -n prod`
2. Confirm: `curl -sf https://api.example.com/health`

## Rollback
How to undo the fix.

## Escalate
Who to wake, and when to stop trying.
```

No prose paragraphs. Every step copy-pasteable. The reader is tired and under pressure; describing a command is not giving one.

---

## Migration guide: write it as a diff

```markdown
### `client.send()` → `client.messages.create()`

Before:
    client.send(prompt="hi", max_len=100)

After:
    client.messages.create(messages=[{"role": "user", "content": "hi"}], max_tokens=100)

Mechanical rule: `prompt=X` becomes a single user message; `max_len` → `max_tokens`.
```

A list of renamed functions is not a migration guide. Give before, after, and a rule the reader can apply across a codebase.

---

## Changelog

Group by audience impact, not by commit:

```markdown
## 2.0.0 — 2026-11-27

### Breaking
- `send()` removed. Use `messages.create()` — see the migration guide.

### Added
- Streaming via `stream=True`.

### Fixed
- Retries no longer double-charge on timeout (#412).
```

"Various bug fixes and improvements" tells the reader nothing and forces them to read the diff.

---

## PR description

```markdown
## What
One or two sentences.

## Why
The problem, or a link to the issue.

## How
Only the non-obvious decisions — the reviewer can read the diff.

## Testing
What you ran. What you did not verify.
```

The **Why** is what reviewers need and authors most often omit.

---

## Prose that works

- Active voice, present tense: "the client retries", not "retries will be performed"
- Second person: "you", not "the user" or "one"
- Short sentences. One idea each.
- Concrete over abstract: "fails after 30 seconds" beats "may experience timeouts"
- Cut hedging. "This might potentially cause issues in some cases" → "This fails when X."

---

## Caveats
- Documentation next to the code it describes stays current longer than a wiki.
- Generated API reference is necessary but not sufficient — it cannot explain why or when.
- If you cannot run an example yourself, mark it untested rather than implying it works.
- See the `tech-writer` agent for producing these as part of the ship phase.
