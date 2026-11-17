---
name: SkillSpector
description: NVIDIA's security scanner for agent skills (Claude Code, Codex, MCP servers). Combines static analysis, YARA rules, OSV.dev CVE lookups, and optional LLM review to flag prompt injection, data exfiltration, and supply-chain risk — without executing the skill.
triggers: [skillspector, skill security, agent skill scanner, skill audit, mcp security scanner, prompt injection scan, skill inspector, agent security audit, nvidia skillspector]
version: "1.0"
source: https://github.com/NVIDIA/SkillSpector
---

# SkillSpector Skill

## § RULES
- Always run `skillspector scan` before installing any third-party skill or MCP server.
- Use `--no-llm` in CI — it's faster and deterministic.
- Use `--format sarif` to integrate scan results with GitHub Code Scanning.
- Review baseline files regularly; a stale baseline masks new risks.
- Never suppress findings without understanding them.

---

## Install

```bash
# Recommended (uv, Python 3.13)
uv tool install --python 3.13 git+https://github.com/NVIDIA/skillspector.git

# With MCP server support
uv tool install --python 3.13 'skillspector[mcp] @ git+https://github.com/NVIDIA/skillspector.git'
```

Requires Python 3.12 or 3.13. Python 3.14+ may need YARA built from source.

---

## Scan a skill directory

```bash
# Basic scan (no LLM, fastest)
skillspector scan ./my-skill/ --no-llm

# With LLM review (set SKILLSPECTOR_PROVIDER + API key)
export SKILLSPECTOR_PROVIDER=openai
export OPENAI_API_KEY=sk-...
skillspector scan ./my-skill/

# Output formats
skillspector scan ./my-skill/ --format json     --output results.json
skillspector scan ./my-skill/ --format sarif    --output results.sarif
skillspector scan ./my-skill/ --format markdown --output report.md
```

### LLM provider options
| `SKILLSPECTOR_PROVIDER` | Key env var |
|---|---|
| `openai` | `OPENAI_API_KEY` |
| `anthropic` | `ANTHROPIC_API_KEY` |
| `nvidia` | `NVIDIA_API_KEY` |

---

## Baseline management

```bash
# Create a baseline (suppress known-acceptable findings)
skillspector baseline ./my-skill/ -o baseline.json

# Scan against baseline (only report new findings)
skillspector scan ./my-skill/ --baseline baseline.json --no-llm
```

---

## MCP server mode

```bash
# Start as a stdio MCP server
skillspector mcp

# HTTP transport
skillspector mcp --transport http --port 8080
```

MCP config:
```json
{
  "mcpServers": {
    "skillspector": {
      "command": "skillspector",
      "args": ["mcp"]
    }
  }
}
```

---

## Python API

```python
from skillspector import graph

result = graph.invoke({
    "skill_path": "./my-skill/",
    "use_llm": False,
    "output_format": "json",
})
print(result["findings"])
```

---

## CI/CD integration (GitHub Actions)

```yaml
- name: Scan skill
  run: |
    uv tool install --python 3.13 git+https://github.com/NVIDIA/skillspector.git
    skillspector scan ./.claude/skills/my-skill/ --format sarif --output skillspector.sarif --no-llm

- name: Upload SARIF
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: skillspector.sarif
```

---

## What it checks
- **Prompt injection** — instructions hidden in skill files that hijack agent behavior
- **Data exfiltration** — covert channels, unexpected network calls
- **Supply-chain risk** — dependency CVEs via OSV.dev
- **YARA rules** — custom signature matching for known malicious patterns
- **LLM review** — semantic analysis of skill intent (optional)

---

## Caveats
- 26k+ GitHub stars; Apache-2.0 license.
- Static analysis only — does not execute the skill.
- LLM review adds latency and API cost; use `--no-llm` in automated pipelines.
