#!/bin/bash
set -e
echo "Starting server..."
uvicorn app.main:app --host 0.0.0.0 --port 7860
