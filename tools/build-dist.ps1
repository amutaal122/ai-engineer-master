# Build the distribution zips.
#
#   ./tools/build-dist.ps1
#
# Windows PowerShell's Compress-Archive writes backslash separators, which
# unzip on macOS/Linux treats as part of the filename instead of as a path.
# Entries are written by hand here so the archives extract correctly everywhere.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = Split-Path $PSScriptRoot -Parent
Push-Location $root

function New-Zip {
  param([string]$Destination, [string[]]$Include)

  if (Test-Path $Destination) { Remove-Item $Destination -Force }
  $dir = Split-Path $Destination -Parent
  if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

  $zip = [System.IO.Compression.ZipFile]::Open($Destination, 'Create')
  try {
    foreach ($item in $Include) {
      $full = Join-Path $root $item
      if (-not (Test-Path $full)) { Write-Warning "skipped missing: $item"; continue }

      $files = if (Test-Path $full -PathType Container) {
        Get-ChildItem $full -Recurse -File
      } else {
        Get-Item $full
      }

      foreach ($f in $files) {
        $rel = $f.FullName.Substring($root.Length).TrimStart('\', '/').Replace('\', '/')
        $e = $zip.CreateEntry($rel, [System.IO.Compression.CompressionLevel]::Optimal)
        $in = $f.OpenRead()
        $out = $e.Open()
        try { $in.CopyTo($out) } finally { $out.Dispose(); $in.Dispose() }
      }
    }
  } finally {
    $zip.Dispose()
  }

  $mb = [math]::Round((Get-Item $Destination).Length / 1MB, 2)
  $n = [System.IO.Compression.ZipFile]::OpenRead($Destination)
  $count = $n.Entries.Count
  $n.Dispose()
  Write-Host ("  {0}  {1} entries  {2} MB" -f (Split-Path $Destination -Leaf), $count, $mb)
}

Write-Host "Building distribution zips..."

New-Zip -Destination "dist/ai-engineer-master-skills.zip" -Include @(
  '.claude',
  'SKILLS.json'
)

New-Zip -Destination "dist/ai-engineer-master-complete.zip" -Include @(
  '.claude',
  'docs',
  'tools/assistant/assistant.template.html',
  'tools/assistant/build-assistant.js',
  'tools/assistant/gen-kb.js',
  'tools/build-dist.ps1',
  'README.md',
  'SKILLS.json',
  'install.sh',
  'install.ps1'
)

Pop-Location
Write-Host "Done."
