#!/bin/bash

# Script to run the FastAPI backend server

echo "Starting Research Paper Dataset API..."
echo "Make sure Ollama is running at http://127.0.0.1:11434"
echo ""

# Check if Ollama is running
if curl -s http://127.0.0.1:11434/api/tags > /dev/null 2>&1; then
    echo "✓ Ollama server is running"
else
    echo "✗ Ollama server is not running. Please start Ollama first."
    echo "  Run: ollama serve"
    exit 1
fi

# Start the FastAPI server
python main.py
