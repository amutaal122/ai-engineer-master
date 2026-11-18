@echo off
rem Serves the exported site so its /_next and /images paths resolve; opening out\index.html directly cannot.
cd /d "%~dp0out"
if errorlevel 1 (
  echo The "out" folder is missing. Run: npx next build
  pause
  exit /b 1
)
where python >nul 2>nul
if errorlevel 1 (
  echo Python is not installed. Install it from python.org, then run this again.
  pause
  exit /b 1
)
start "" http://localhost:4000/
echo Watcheton is running at http://localhost:4000/
echo Close this window to stop it.
python -m http.server 4000
