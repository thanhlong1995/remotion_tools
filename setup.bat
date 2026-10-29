@echo off
rem Double-click to install everything the project needs and open Remotion Studio.
rem Options: setup.bat -SkipVoice   (no Python / VieNeu-TTS)
rem          setup.bat -NoStart     (do not open Studio at the end)
chcp 65001 >nul
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\setup.ps1" %*
if errorlevel 1 (
	echo.
	echo Setup did not finish. See the error above and docs\DEV_GUIDELINE_SETUP.md
	pause
	exit /b 1
)
pause
