@echo off
REM Change directory to script folder
cd /d "%~dp0"

REM Run the server.js with Node.js
"C:\Program Files\nodejs\node.exe" generator.js

REM Optional: Pause to see errors if run manually
REM pause
git add .
git commit -m "data updated"
git push origin main
REM End of script