---
name: Codex Security
description: OpenAI's Codex Security CLI and TypeScript SDK for finding, validating, and fixing security vulnerabilities in a codebase — repo and diff scans, deep mode, SARIF/JSON/CSV export, threat models, SECURITY.md drafting, and a GitHub Action for CI. Use for security review of a repo or a pull request.
triggers: [codex security, codex-security, cs scan, security scan, vulnerability scan, find vulnerabilities, sast, threat model, security.md, sarif, security ci, scan pull request]
version: "1.0"
source: https://github.com/openai/codex-security
---

# Codex Security Skill

## § RULES
- Scan the **diff** on pull requests (`--diff origin/main`) and the full repo on a schedule. Full scans on every PR waste money and bury signal.
- Findings are candidates until validated. Triage before filing — a raw scan is not a vulnerability report.
- Never commit an API key. In CI use the `CODEX_SECURITY_API_KEY` secret; locally use `cs login`.
- Cost is real and the cap is advisory: the sample Action estimates $5 per scan and the README warns requests already in flight can exceed the limit. Set `--max-time` and scope with `--path`.
- Report without failing the build at first. Turn on blocking only once the false-positive rate is known.

---

## Install

```bash
npm install --global @openai/codex-security
cs login
```

Requirements: Node.js 22.13.0+ within 22.x, or 24.x or 26.x, plus Python 3.10+. Python 3.10 also needs `tomli`.

No global install, or an npm `EEXIST` conflict:

```bash
npx @openai/codex-security scan .
```

`cs` and `codex-security` are the same CLI.

---

## Scanning

```bash
cs scan .                              # whole repo
cs scan . --path src --path tests      # only these paths
cs scan . --exclude-path examples/     # skip these
cs scan . --diff origin/main           # committed changes from base to HEAD
cs scan . --mode deep                  # repeats standard, returns deduplicated findings
cs scan . --max-time 15                # advisory 15-minute allowance
```

Output is a Markdown report at the printed REPORT path.

```bash
cs scan --help        # includes patching after a scan
cs scans show         # the latest completed scan
```

---

## Policies and threat models

```bash
cs policy .
cs policy . --path services/api --knowledge-base architecture.md

cs export --scan SCAN_ID --artifact threat-model --output threatmodel.md
```

Omit `--scan` to export from the latest completed scan.

---

## TypeScript SDK

```bash
npm install @openai/codex-security
```

```ts
import { CodexSecurity } from "@openai/codex-security";

const security = new CodexSecurity();

try {
  const result = await security.run("/path/to/repository");
  console.log(result.reportPath);
} finally {
  await security.close();
}
```

Always `close()` in a `finally` — the client holds a process.

The SDK guide covers deep-scan configuration, validation, severity classification, owner suggestions, and result handling.

---

## CI

Store an OpenAI key as the repo secret `CODEX_SECURITY_API_KEY`, then:

```bash
cp github-action/examples/repository.yml .github/workflows/codex-security.yml
```

Replace `REPLACE_WITH_REVIEWED_COMMIT` with a commit SHA you have actually reviewed — the Action pins to it so a compromised upstream tag cannot silently change what runs.

The example reports findings without failing the job. Docker Compose is documented for bulk scans.

Exports: SARIF, JSON, and CSV. SARIF is the one CI code-scanning dashboards ingest; the exact flags live in the CLI export guide.

---

## Model providers

OpenAI by default. Also Amazon Bedrock (AWS credentials), OpenRouter, Fireworks AI, and Cheaper Inference — each needs its own API key.

For CI auth, set `OPENAI_API_KEY` or `CODEX_API_KEY` in the scan process environment.

---

## Where it fits

| Tool | Answers |
|---|---|
| `codex-security` | "what vulnerabilities are in this code?" |
| `security-audit` | web app and API design-level review |
| `dependency-auditor` | CVEs and licenses in third-party packages |
| `pyrit` | "can the model itself be made to misbehave?" |

They overlap little — run more than one.

---

## Caveats
- ~14.1k stars, Apache-2.0.
- The local `serve` command and browser dashboard have been **removed** — do not look for them.
- Deep mode repeats standard scans, so it costs multiples of a standard run.
- `--diff` covers committed changes only; uncommitted work in the tree is not scanned.
