@echo off
setlocal enabledelayedexpansion
title Git Push - RoyalSquare

echo ===========================================
echo            GitHub Push Tool
echo ===========================================
echo.

:: Verify git repository and get current branch
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set BRANCH=%%i
if "%BRANCH%"=="" (
    echo [ERROR] Not a git repository or Git is not installed in PATH.
    goto END
)

echo Active Branch: %BRANCH%
echo.

:: Show modified and untracked files
echo Current Changes:
git status -s
echo.

:: Prompt for commit message
set /p COMMIT_MSG="Enter commit message (Press Enter for default timestamp): "

if "%COMMIT_MSG%"=="" (
    set COMMIT_MSG=Update: %date% %time%
)

echo.
echo [1/3] Staging changes (git add .)...
git add .

echo [2/3] Committing changes...
git commit -m "%COMMIT_MSG%"

echo [3/3] Pushing to origin %BRANCH%...
git push origin %BRANCH%

if %ERRORLEVEL% equ 0 (
    echo.
    echo ===========================================
    echo  SUCCESS: Changes pushed to GitHub!
    echo ===========================================
) else (
    echo.
    echo ===========================================
    echo  NOTE: If nothing was changed or push failed,
    echo  please review the message above.
    echo ===========================================
)

:END
echo.
pause
