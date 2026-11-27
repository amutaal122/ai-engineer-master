---
name: Cloudflare Security Audit
description: Cloudflare's multi-phase security audit skill — six isolated-agent phases (recon, coverage-led hunting, validation, structured findings, independent verification, reporting) producing machine-readable findings.json plus REPORT.md. Use for a rigorous codebase audit or pen-test pass where every finding must be independently verified.
triggers: [cloudflare security audit, security audit this codebase, find security vulnerabilities, pen test, penetration test, vulnerability hunting, security review, findings.json, coverage ledger, attack classes]
version: "1.0"
source: https://github.com/cloudflare/security-audit-skill
---

# Cloudflare Security Audit Skill

## § RULES
- **Only confirm established boundary failures.** A lead that cannot be proven across a trust boundary stays `needs_validation` — never promote it to confirmed to make the report look better.
- Without an OS-enforced sandbox, target code is **not executed** and leads stay `needs_validation`. Do not fake the validation phase.
- Default output goes to `~/security-audit-skill/<repo-name>/run-<N>` — outside the repo. Only write inside the target repo if the user picks a directory version control ignores.
- Audit only what you are authorized to audit.
- Phases use isolated agents on purpose: a hunter that also validates its own leads grades its own homework.

---

## Install

```bash
npx skills add https://github.com/cloudflare/security-audit-skill --skill security-audit
```

Add `--global` for a user-level install. Requires Node.js.

---

## Invoke

Plain prompts trigger it:

```
security audit this codebase
find security vulnerabilities in ./src
do a security review, output to ~/audits/my-project
```

**Two modes:**

| Mode | When | Produces |
|---|---|---|
| Full audit | direct audit or pen-test request | report artifacts |
| Guidance | a security *question* | an answer, no artifacts |

---

## The six phases

1. **Reconnaissance** — map the attack surface
2. **Coverage-led hunting** — work the ledger, not hunches
3. **Candidate validation** — try to actually break it
4. **Structured output** — `findings.json`, each finding `confirmed` / `needs_validation` / `rejected`
5. **Independent verification** — a separate agent re-checks each record
6. **Reporting** — `REPORT.md`, `FINDINGS-DETAIL.md`, `NEEDS-VALIDATION.md`

The three-state classification is the point. Most scanners emit a flat list and leave triage to you; this one separates what was proven from what merely looks suspicious.

---

## What ships in the skill

| Piece | Purpose |
|---|---|
| `SKILL.md` | the phase workflow |
| ~15 reference docs | `RECONNAISSANCE.md`, `HUNTING.md`, `ATTACK-CLASSES.md`, `CLIENT-SIDE.md`, … |
| `report-schema.json` | the findings contract |
| `validate-findings.cjs` | schema-checks the output |
| `validate-coverage-ledger.cjs` | proves the surface was actually covered |

Run the validators before trusting a report — they are the difference between a findings file and a findings-shaped file.

---

## How it fits the other security skills

| Skill | Scope |
|---|---|
| `cloudflare-security-audit` | deep, verified audit of a codebase |
| `security-audit` | web app and API design review |
| `codex-security` | fast repo/diff scans, SARIF for CI |
| `dependency-auditor` | third-party CVEs and licences |
| `pyrit` | the model's own behaviour, not the code |

Use this one when the output has to stand up to scrutiny; use `codex-security` when you need it on every PR.

---

## Caveats
- ~79k stars, MIT. The README states this skill seeded Cloudflare's own vulnerability discovery harness.
- The sandbox requirement is real: skip it and phase 3 degrades to static reasoning.
- Long-running. This is not a pre-commit hook.
