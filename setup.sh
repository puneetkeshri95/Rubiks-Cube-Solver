#!/bin/bash

# Setup script for Rubik's Cube Solver

echo "Setting up Rubik's Cube Solver..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js version 16 or higher."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v)
echo "Node.js version: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm is not installed. Please install Node.js which includes npm."
    exit 1
fi

echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "Dependencies installed successfully!"
    echo ""
    echo "To start the development server, run:"
    echo "npm run dev"
    echo ""
    echo "Then open your browser to http://localhost:3000"
else
    echo "Failed to install dependencies. Please check the error messages above."
    exit 1
fi