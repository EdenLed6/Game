#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -x "./gradlew" ]]; then
  chmod +x ./gradlew
fi

echo "Building debug APK..."
if ! ./gradlew --no-daemon clean :app:assembleDebug :app:packageDebug; then
  echo "APK build failed. Open the Gradle output above and fix the first reported error." >&2
  exit 1
fi

APK_PATH="$ROOT_DIR/app/build/outputs/apk/debug/app-debug.apk"
if [[ ! -f "$APK_PATH" ]]; then
  echo "Build finished, but APK was not found at: $APK_PATH" >&2
  exit 1
fi

echo "APK ready: $APK_PATH"
