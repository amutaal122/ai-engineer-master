# AI Engineer Master - installer for Windows / PowerShell
#
#   irm https://github.com/amutaal122/ai-engineer-master/raw/main/install.ps1 | iex
#
#   irm https://github.com/amutaal122/ai-engineer-master/raw/main/install.ps1 -OutFile install.ps1
#   ./install.ps1 -Only fastapi,docker -Tool cursor
#
param(
  [string[]]$Only,
  [string]$Tool,
  [switch]$Update,
  [switch]$List,
  [switch]$Help
)

$ErrorActionPreference = 'Stop'

if ($Help) {
@'
AI Engineer Master installer

  -Only a,b,c   install only these skills (default: all)
  -Tool NAME    wire a rules file: claude cursor windsurf copilot
                cline continue zed codex all
  -Update       refresh skills, keep local .claude customisation
  -List         list available skills and exit
  -Help         show this message
'@ | Write-Host
  return
}

$repo = "https://github.com/amutaal122/ai-engineer-master/raw/main"
$tmp  = Join-Path $env:TEMP ("aiem-" + [guid]::NewGuid().ToString("N").Substring(0,8))
$zip  = Join-Path $tmp "skills.zip"
New-Item -ItemType Directory -Path $tmp -Force | Out-Null

try {
  Write-Host "Downloading AI Engineer Master..."
  Invoke-WebRequest -Uri "$repo/dist/ai-engineer-master-skills.zip" -OutFile $zip -UseBasicParsing
  Expand-Archive -Path $zip -DestinationPath (Join-Path $tmp "pkg") -Force

  $src = Join-Path $tmp "pkg\.claude"
  if (-not (Test-Path $src)) { throw "Unexpected package layout." }

  if ($List) {
    Write-Host "Available skills:"
    Get-ChildItem (Join-Path $src "skills") -Directory | ForEach-Object { Write-Host "  $($_.Name)" }
    return
  }

  New-Item -ItemType Directory -Path ".claude" -Force | Out-Null

  # agents, commands and the doctor scripts always come along; CLAUDE.md is
  # treated as yours once it exists so local customisation survives an update.
  function Copy-Support {
    foreach ($d in @("agents", "commands")) {
      $p = Join-Path $src $d
      if (Test-Path $p) { Copy-Item $p ".claude\" -Recurse -Force }
    }
    Get-ChildItem $src -Filter "doctor.*" -File -ErrorAction SilentlyContinue |
      ForEach-Object { Copy-Item $_.FullName ".claude\" -Force }
    $cm = Join-Path $src "CLAUDE.md"
    if ((Test-Path $cm) -and -not (Test-Path ".claude\CLAUDE.md")) { Copy-Item $cm ".claude\" -Force }
  }

  if ($Only) {
    New-Item -ItemType Directory -Path ".claude\skills" -Force | Out-Null
    foreach ($s in ($Only -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ })) {
      $from = Join-Path $src "skills\$s"
      if (Test-Path $from) {
        $to = ".claude\skills\$s"
        if (Test-Path $to) { Remove-Item -Recurse -Force $to }
        Copy-Item $from $to -Recurse
        Write-Host "  + $s"
      } else {
        Write-Warning "no such skill: $s"
      }
    }
    Copy-Support
  }
  elseif ($Update) {
    if (Test-Path ".claude\skills") { Remove-Item -Recurse -Force ".claude\skills" }
    Copy-Item (Join-Path $src "skills") ".claude\skills" -Recurse
    Copy-Support
    Write-Host "  skills refreshed; local .claude files kept"
  }
  else {
    Copy-Item (Join-Path $src "*") ".claude\" -Recurse -Force
  }

  $rules = @'
# AI Engineer Master skills

This project ships an engineering skill library at `.claude/skills/`.

Each skill is one Markdown file: `.claude/skills/<name>/SKILL.md`, with a
description, hard rules, and worked examples for that technology.

Before writing code for a technology, read the matching skill and follow its
RULES section. `SKILLS.json` at the repo root is the machine-readable index
(id, description, triggers, domain) if you need to search the catalog.
'@

  function Write-Rules([string]$Path) {
    $dir = Split-Path $Path -Parent
    if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    Set-Content -Path $Path -Value $rules -Encoding utf8
    Write-Host "  wired $Path"
  }

  $targets = @{
    'cursor'   = '.cursor\rules\skills.mdc'
    'windsurf' = '.windsurf\rules\skills.md'
    'copilot'  = '.github\copilot-instructions.md'
    'cline'    = '.clinerules'
    'continue' = '.continue\rules\skills.md'
    'zed'      = '.rules'
    'codex'    = 'AGENTS.md'
  }

  if ($Tool) {
    $t = $Tool.ToLower()
    if ($t -eq 'all') { $targets.Values | ForEach-Object { Write-Rules $_ } }
    elseif ($t -eq 'claude') { }
    elseif ($targets.ContainsKey($t)) { Write-Rules $targets[$t] }
    else { Write-Warning "unknown -Tool: $Tool (skipped)" }
  }

  $cat = Join-Path $tmp "pkg\SKILLS.json"
  if (Test-Path $cat) { Copy-Item $cat "." -Force }

  $n = (Get-ChildItem ".claude\skills" -Directory -ErrorAction SilentlyContinue | Measure-Object).Count
  Write-Host "Done. $n skills installed in $((Get-Location).Path)\.claude"
  Write-Host "Verify with: ./.claude/doctor.ps1"
  Write-Host "Restart your editor to load them."
}
finally {
  if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue }
}
