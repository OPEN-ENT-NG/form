#!/bin/bash

# Get main script path and current directory
MAIN_SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/build.sh"
CURRENT_DIR="$(pwd)"

# Check if main script exists
if [ ! -f "$MAIN_SCRIPT_PATH" ]; then
    echo "Error: Main script not found at $MAIN_SCRIPT_PATH"
    exit 1
fi

# Get module name from directory path
MODULE_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODULE_NAME="$(basename "$MODULE_PATH")"

# Help function
show_help() {
    echo "Usage: ./build.sh [options]"
    echo "Options:"
    echo "  installDeps   - Install frontend dependencies"
    echo "  runDev        - Start development server"
    echo "  build         - Build frontend for production"
    echo "  lint          - Run lint tools"
    echo "  test          - Run tests"
    echo "  --no-docker   - Run without Docker"
    echo ""
    echo "Examples:"
    echo "  ./build.sh install       - Install dependencies"
    echo "  ./build.sh runDev           - Start development server"
    echo "  ./build.sh --no-docker runDev - Run dev mode without Docker"
}

# Check arguments
if [ $# -eq 0 ]; then
    show_help
    exit 1
fi

# Process arguments
NO_DOCKER_ARG=""
COMMAND=""

for arg in "$@"; do
    case $arg in
    --no-docker)
        NO_DOCKER_ARG="--no-docker"
        ;;
    installDeps)
        COMMAND="installDeps"
        ;;
    runDev)
        COMMAND="runDev"
        ;;
    build)
        COMMAND="buildFront"
        ;;
    lint)
        COMMAND="lint"
        ;;
    test)
        COMMAND="test"
        ;;
    -h | --help)
        show_help
        exit 0
        ;;
    *)
        echo "Unrecognized option: $arg"
        show_help
        exit 1
        ;;
    esac
done

# Execute command via main script
if [ -n "$COMMAND" ]; then
    echo "Executing $COMMAND for module $MODULE_NAME"
    # Change to the root directory before executing the main script
    cd "$(dirname "$MAIN_SCRIPT_PATH")"
    ./build.sh $NO_DOCKER_ARG $COMMAND "$MODULE_NAME"
    # Return to the original directory
    cd "$CURRENT_DIR"
else
    echo "No valid command specified"
    show_help
    exit 1
fi
