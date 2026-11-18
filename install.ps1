# AI Engineer Master — one-line installer for Windows / PowerShell
# Usage: irm https://github.com/amutaal122/ai-engineer-master/raw/main/install.ps1 | iex
$ErrorActionPreference = 'Stop'
$repo = "https://github.com/amutaal122/ai-engineer-master/raw/main"
$zip  = "$env:TEMP\ai-engineer-master-skills.zip"

Write-Host "Downloading AI Engineer Master skills..."
Invoke-WebRequest -Uri "$repo/dist/ai-engineer-master-skills.zip" -OutFile $zip -UseBasicParsing

Write-Host "Installing into .claude/ ..."
Expand-Archive -Path $zip -DestinationPath . -Force
Remove-Item $zip

Write-Host "Done. .claude\ is ready in $(Get-Location)"
Write-Host "Restart Claude Code (or your AI tool) to load the skills."
