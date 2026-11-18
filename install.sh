#!/usr/bin/env bash
# AI Engineer Master - installer for macOS / Linux
#
#   curl -fsSL https://github.com/amutaal122/ai-engineer-master/raw/main/install.sh | bash
#   curl -fsSL .../install.sh | bash -s -- --only fastapi,docker --tool cursor
#
set -euo pipefail

REPO="https://github.com/amutaal122/ai-engineer-master/raw/main"
ZIP="ai-engineer-master-skills.zip"
ONLY=""
TOOL=""
UPDATE=0
LIST=0

while [ $# -gt 0 ]; do
  case "$1" in
    --only)   ONLY="$2"; shift 2 ;;
    --only=*) ONLY="${1#*=}"; shift ;;
    --tool)   TOOL="$2"; shift 2 ;;
    --tool=*) TOOL="${1#*=}"; shift ;;
    --update) UPDATE=1; shift ;;
    --list)   LIST=1; shift ;;
    -h|--help)
      cat <<'USAGE'
AI Engineer Master installer

  --only a,b,c   install only these skills (default: all)
  --tool NAME    wire a rules file: claude cursor windsurf copilot
                 cline continue zed codex all
  --update       refresh skills, keep local .claude customisation
  --list         list available skills and exit
  --help         show this message
USAGE
      exit 0 ;;
    *) echo "Unknown option: $1 (try --help)" >&2; exit 1 ;;
  esac
done

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

fetch() {
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$1" -o "$2"
  elif command -v wget >/dev/null 2>&1; then
    wget -q "$1" -O "$2"
  else
    echo "Error: curl or wget is required." >&2; exit 1
  fi
}

extract() {
  if command -v unzip >/dev/null 2>&1; then
    unzip -q -o "$1" -d "$2"
  elif command -v python3 >/dev/null 2>&1; then
    python3 -I -c "import zipfile,sys; zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])" "$1" "$2"
  else
    echo "Error: unzip or python3 is required." >&2; exit 1
  fi
}

echo "Downloading AI Engineer Master..."
fetch "$REPO/dist/$ZIP" "$TMP/$ZIP"
extract "$TMP/$ZIP" "$TMP/pkg"

SRC="$TMP/pkg/.claude"
[ -d "$SRC" ] || { echo "Error: unexpected package layout." >&2; exit 1; }

if [ "$LIST" -eq 1 ]; then
  echo "Available skills:"
  ls "$SRC/skills" | sed 's/^/  /'
  exit 0
fi

mkdir -p .claude

# agents, commands and the doctor scripts always come along; CLAUDE.md is
# treated as yours once it exists so local customisation survives an update.
copy_support() {
  cp -R "$SRC/agents" "$SRC/commands" .claude/ 2>/dev/null || true
  cp "$SRC"/doctor.* .claude/ 2>/dev/null || true
  [ -f .claude/CLAUDE.md ] || cp "$SRC/CLAUDE.md" .claude/ 2>/dev/null || true
}

if [ -n "$ONLY" ]; then
  mkdir -p .claude/skills
  IFS=',' read -ra WANT <<< "$ONLY"
  for s in "${WANT[@]}"; do
    s="$(echo "$s" | tr -d '[:space:]')"
    if [ -d "$SRC/skills/$s" ]; then
      rm -rf ".claude/skills/$s"
      cp -R "$SRC/skills/$s" ".claude/skills/$s"
      echo "  + $s"
    else
      echo "  ! no such skill: $s" >&2
    fi
  done
  copy_support
elif [ "$UPDATE" -eq 1 ]; then
  rm -rf .claude/skills
  cp -R "$SRC/skills" .claude/skills
  copy_support
  echo "  skills refreshed; local .claude files kept"
else
  cp -R "$SRC/." .claude/
fi

chmod +x .claude/doctor.sh 2>/dev/null || true

write_rules() {
  mkdir -p "$(dirname "$1")"
  cat > "$1" <<'RULES'
# AI Engineer Master skills

This project ships an engineering skill library at `.claude/skills/`.

Each skill is one Markdown file: `.claude/skills/<name>/SKILL.md`, with a
description, hard rules, and worked examples for that technology.

Before writing code for a technology, read the matching skill and follow its
RULES section. `SKILLS.json` at the repo root is the machine-readable index
(id, description, triggers, domain) if you need to search the catalog.
RULES
  echo "  wired $1"
}

case "$TOOL" in
  ""|claude) ;;
  cursor)    write_rules ".cursor/rules/skills.mdc" ;;
  windsurf)  write_rules ".windsurf/rules/skills.md" ;;
  copilot)   write_rules ".github/copilot-instructions.md" ;;
  cline)     write_rules ".clinerules" ;;
  continue)  write_rules ".continue/rules/skills.md" ;;
  zed)       write_rules ".rules" ;;
  codex)     write_rules "AGENTS.md" ;;
  all)
    for f in .cursor/rules/skills.mdc .windsurf/rules/skills.md \
             .github/copilot-instructions.md .clinerules \
             .continue/rules/skills.md .rules AGENTS.md; do
      write_rules "$f"
    done ;;
  *) echo "  ! unknown --tool: $TOOL (skipped)" >&2 ;;
esac

[ -f "$TMP/pkg/SKILLS.json" ] && cp "$TMP/pkg/SKILLS.json" . 2>/dev/null || true

N=$(ls .claude/skills 2>/dev/null | wc -l | tr -d ' ')
echo "Done. $N skills installed in $(pwd)/.claude"
echo "Verify with: bash .claude/doctor.sh"
echo "Restart your editor to load them."
