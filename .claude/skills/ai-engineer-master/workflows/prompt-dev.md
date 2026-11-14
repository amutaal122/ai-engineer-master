# Workflow: Prompt Development

**When to use:** Building, iterating, or fixing any LLM prompt — from system prompts to RAG query templates to eval rubrics.

**Agents:** researcher → prompt-engineer → ml-evaluator → developer

---

## Phase 1 — Research (researcher)

**TASK:** Research the task domain and existing prompt patterns.

**OBJECTIVE:** Understand what output quality looks like before writing the prompt.

**EXPECTED OUTPUT:** `research/prompt-research-[task].md`

**KEY QUESTIONS:**
1. What is the exact task? (classification / extraction / generation / reasoning)
2. What is a "good" output? Can you define it precisely?
3. What are known failure modes for this task type?
4. What models have been benchmarked on similar tasks?
5. Are there public prompt templates for this domain?

---

## Phase 2 — Prompt Design (prompt-engineer)

**TASK:** Write v1 prompt following the system prompt template.

**OBJECTIVE:** First working prompt with explicit output format.

**EXPECTED OUTPUT:**
- `prompts/[task]-v1.md` — prompt with metadata
- `prompts/[task]-examples.json` — 5+ few-shot examples

**PROMPT FILE FORMAT:**
```markdown
# Prompt: [Task Name]
**Version:** 1.0  **Model:** claude-sonnet-4-5  **Date:** YYYY-MM-DD
**Author:** prompt-engineer

## System prompt
[The actual system prompt]

## Few-shot examples
See: examples.json

## Parameters
- temperature: 0.0 (deterministic tasks) / 0.7 (creative)
- max_tokens: [N]

## Known edge cases
- [Edge case 1]: [how prompt handles it]
```

**ACCEPTANCE CRITERIA:**
- [ ] Role is specific
- [ ] Output format is exact (schema or filled example)
- [ ] At least 3 negative constraints written
- [ ] Few-shot examples cover the hardest known cases

---

## Phase 3 — Evaluation (ml-evaluator)

**TASK:** Measure prompt quality on golden test set.

**OBJECTIVE:** Quantified pass rate + failure analysis.

**INPUT FILES:**
- `prompts/[task]-v1.md`
- `evals/golden-set-[task].jsonl` — labeled examples

**EXPECTED OUTPUT:**
- `evals/results/[task]-v1-report.md`

**EVAL REPORT FORMAT:**
```markdown
# Eval Report: [Task] v1
**Date:** YYYY-MM-DD  **Model:** ...  **N:** [count]

## Overall: XX% pass rate  (target: 90%)

## Failure analysis
| Failure type | Count | Example |
|---|---|---|
| Wrong format | 3 | "..." |
| Hallucination | 2 | "..." |
| Edge case miss | 5 | "..." |

## Recommendations
1. [Specific prompt change to fix top failure]
2. ...
```

**ACCEPTANCE CRITERIA:**
- [ ] ≥20 test cases (5 adversarial)
- [ ] Failure categories identified (not just "wrong")
- [ ] Specific prompt improvements listed

---

## Phase 4 — Iteration (prompt-engineer)

**TASK:** Fix prompt based on eval failures. Increment version.

**PROCESS:**
1. Address top failure category first
2. Update prompt → `prompts/[task]-v2.md`
3. Add new few-shot examples for failed cases
4. Re-run eval (Phase 3)
5. Repeat until pass rate ≥ target

**VERSION LOG (in prompt file):**
```markdown
## Changelog
v1 → v2: Added "If [edge case], respond with 'N/A'" (fixed 5 format failures)
v2 → v3: Moved format instructions to end of prompt (fixed 3 format failures)
```

---

## Phase 5 — Integration (developer)

**TASK:** Integrate final prompt into application code.

**EXPECTED OUTPUT:**
- Prompt loaded from file (not hardcoded in code)
- Prompt version logged in observability
- Regression eval in CI pipeline

```python
# Pattern: load from file, log version
PROMPT_VERSION = "3.0"
with open(f"prompts/{task}-v{PROMPT_VERSION}.md") as f:
    system_prompt = parse_prompt_md(f.read())

logger.info("prompt.used", task=task, version=PROMPT_VERSION, model=model)
```

**ACCEPTANCE CRITERIA:**
- [ ] Eval CI job runs on every PR that touches `prompts/`
- [ ] Prompt version tracked in logs
- [ ] Rollback procedure documented (switch version in config)
