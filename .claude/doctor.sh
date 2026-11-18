#!/usr/bin/env bash
# AI Engineer Master - verify the install
#   bash .claude/doctor.sh
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CL="$ROOT/.claude"
fail=0

echo "AI Engineer Master - doctor"
echo "root: $ROOT"
echo

if [ ! -d "$CL/skills" ]; then
  echo "FAIL  .claude/skills is missing - reinstall from the project root"
  exit 1
fi

skills=$(find "$CL/skills" -maxdepth 1 -mindepth 1 -type d | wc -l | tr -d ' ')
agents=$(ls "$CL/agents"/*.md 2>/dev/null | wc -l | tr -d ' ')
cmds=$(ls "$CL/commands"/*.md 2>/dev/null | wc -l | tr -d ' ')
echo "OK    $skills skills, $agents agents, $cmds commands"

missing=0
bad=0
for d in "$CL/skills"/*/; do
  name="$(basename "$d")"
  f="$d/SKILL.md"
  if [ ! -f "$f" ]; then
    echo "WARN  $name has no SKILL.md"; missing=$((missing+1)); continue
  fi
  head -1 "$f" | grep -q '^---' || { echo "WARN  $name: missing frontmatter"; bad=$((bad+1)); continue; }
  grep -q '^description:' "$f" || { echo "WARN  $name: no description"; bad=$((bad+1)); }
done
[ "$missing" -eq 0 ] && [ "$bad" -eq 0 ] && echo "OK    all skill files have valid frontmatter"
[ "$bad" -gt 0 ] && fail=1

echo
echo "tool wiring:"
check() { if [ -f "$ROOT/$1" ]; then echo "  OK    $2 -> $1"; else echo "  --    $2 not wired ($1)"; fi; }
echo "  OK    Claude Code -> native .claude/"
check ".cursor/rules/skills.mdc"          "Cursor"
check ".windsurf/rules/skills.md"         "Windsurf"
check ".github/copilot-instructions.md"   "Copilot"
check ".clinerules"                       "Cline"
check ".continue/rules/skills.md"         "Continue"
check ".rules"                            "Zed"
check "AGENTS.md"                         "Codex/Aider"

echo
if [ "$fail" -eq 0 ]; then
  echo "All good. Restart your editor if skills are not showing up yet."
else
  echo "Finished with warnings above."
fi
exit $fail
