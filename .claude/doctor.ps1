# AI Engineer Master - verify the install
#   ./.claude/doctor.ps1
$ErrorActionPreference = 'Continue'

$root = Split-Path $PSScriptRoot -Parent
$cl   = Join-Path $root ".claude"
$fail = 0

Write-Host "AI Engineer Master - doctor"
Write-Host "root: $root"
Write-Host ""

if (-not (Test-Path (Join-Path $cl "skills"))) {
  Write-Host "FAIL  .claude\skills is missing - reinstall from the project root"
  exit 1
}

$skills = @(Get-ChildItem (Join-Path $cl "skills") -Directory)
$agents = @(Get-ChildItem (Join-Path $cl "agents") -Filter *.md -ErrorAction SilentlyContinue)
$cmds   = @(Get-ChildItem (Join-Path $cl "commands") -Filter *.md -ErrorAction SilentlyContinue)
Write-Host "OK    $($skills.Count) skills, $($agents.Count) agents, $($cmds.Count) commands"

$bad = 0
foreach ($d in $skills) {
  $f = Join-Path $d.FullName "SKILL.md"
  if (-not (Test-Path $f)) { Write-Host "WARN  $($d.Name) has no SKILL.md"; $bad++; continue }
  $lines = Get-Content $f -TotalCount 20
  if ($lines.Count -eq 0 -or $lines[0] -notmatch '^---') {
    Write-Host "WARN  $($d.Name): missing frontmatter"; $bad++; continue
  }
  if (-not ($lines -match '^description:')) { Write-Host "WARN  $($d.Name): no description"; $bad++ }
}
if ($bad -eq 0) { Write-Host "OK    all skill files have valid frontmatter" } else { $fail = 1 }

Write-Host ""
Write-Host "tool wiring:"
function Test-Wiring([string]$rel, [string]$label) {
  if (Test-Path (Join-Path $root $rel)) { Write-Host "  OK    $label -> $rel" }
  else { Write-Host "  --    $label not wired ($rel)" }
}
Write-Host "  OK    Claude Code -> native .claude\"
Test-Wiring ".cursor\rules\skills.mdc"        "Cursor"
Test-Wiring ".windsurf\rules\skills.md"       "Windsurf"
Test-Wiring ".github\copilot-instructions.md" "Copilot"
Test-Wiring ".clinerules"                     "Cline"
Test-Wiring ".continue\rules\skills.md"       "Continue"
Test-Wiring ".rules"                          "Zed"
Test-Wiring "AGENTS.md"                       "Codex/Aider"

Write-Host ""
if ($fail -eq 0) { Write-Host "All good. Restart your editor if skills are not showing up yet." }
else { Write-Host "Finished with warnings above." }
exit $fail
