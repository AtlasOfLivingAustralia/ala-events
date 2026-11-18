#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$ROOT_DIR/.run"
PID_FILE="$RUN_DIR/packages.pids"

if [[ ! -f "$PID_FILE" ]]; then
  echo "No PID file found at $PID_FILE"
  exit 0
fi

while IFS='|' read -r package_name pid _; do
  if [[ -z "${pid:-}" ]]; then
    continue
  fi

  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" 2>/dev/null || true
    echo "Stopped $package_name (PID $pid)"
  else
    echo "$package_name is not running (PID $pid)"
  fi
done < "$PID_FILE"

rm -f "$PID_FILE"
echo "Done."
