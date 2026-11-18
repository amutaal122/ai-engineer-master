#!/usr/bin/env bash
# AI Engineer Master — one-line installer
# Usage: curl -fsSL https://github.com/amutaal122/ai-engineer-master/raw/main/install.sh | bash
set -e

REPO="https://github.com/amutaal122/ai-engineer-master/raw/main"
ZIP="ai-engineer-master-skills.zip"
TMP=$(mktemp -d)

echo "Downloading AI Engineer Master skills..."
if command -v curl &>/dev/null; then
  curl -fsSL "$REPO/dist/$ZIP" -o "$TMP/$ZIP"
elif command -v wget &>/dev/null; then
  wget -q "$REPO/dist/$ZIP" -O "$TMP/$ZIP"
else
  echo "Error: curl or wget is required." && exit 1
fi

echo "Installing into .claude/ ..."
if command -v unzip &>/dev/null; then
  unzip -q -o "$TMP/$ZIP" -d .
elif command -v python3 &>/dev/null; then
  python3 -c "import zipfile,sys; zipfile.ZipFile('$TMP/$ZIP').extractall('.')"
else
  echo "Error: unzip or python3 is required." && exit 1
fi

rm -rf "$TMP"
echo "Done. .claude/ is ready in $(pwd)"
echo "Restart Claude Code (or your AI tool) to load the skills."
