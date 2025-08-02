@echo off
REM Setup script for Rubik's Cube Solver

echo Setting up Rubik's Cube Solver...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js version 16 or higher.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Get Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Node.js version: %NODE_VERSION%

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo npm is not installed. Please install Node.js which includes npm.
    pause
    exit /b 1
)

echo Installing dependencies...
npm install

if %errorlevel% equ 0 (
    echo Dependencies installed successfully!
    echo.
    echo To start the development server, run:
    echo npm run dev
    echo.
    echo Then open your browser to http://localhost:3000
) else (
    echo Failed to install dependencies. Please check the error messages above.
    pause
    exit /b 1
)

pause