#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ENV_FILE="$SCRIPT_DIR/.env"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found in $SCRIPT_DIR"
    exit 1
fi

# Load environment variables from .env file
set -a
source "$ENV_FILE"
set +a

echo "Environment variables loaded from .env"