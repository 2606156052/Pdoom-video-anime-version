#!/bin/zsh
# Helper runner that sets up local node & ffmpeg binaries in PATH
DIR="$(cd "$(dirname "$0")" && pwd)"
export PATH="$DIR/tools/node/bin:$DIR/tools:$PATH"
if [ $# -eq 0 ]; then
  echo "Usage: ./run.sh <command...>"
  echo "Examples:"
  echo "  ./run.sh node server.mjs"
  echo "  ./run.sh node render.mjs --stills=1.5,23.5"
  echo "  ./run.sh ./encode.sh"
  exit 1
fi
exec "$@"
