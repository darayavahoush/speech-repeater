#!/bin/bash
set -e
echo "Downloading models..."
python download_models.py
echo "Starting server..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
