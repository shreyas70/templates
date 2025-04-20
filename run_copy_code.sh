#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Change to the backend directory to use its Poetry environment
cd "$PROJECT_ROOT/backend"

# Activate the Poetry virtual environment and run the script
source .venv/bin/activate

# Run the script with the full path to the target directory
if [[ "$1" == /* ]]; then
    # If the path is absolute, use it as is
    python "$SCRIPT_DIR/copy_code.py" "$@"
else
    # If the path is relative, make it relative to the project root
    python "$SCRIPT_DIR/copy_code.py" "$PROJECT_ROOT/$1" "${@:2}"
fi

# Deactivate the virtual environment when done
deactivate
