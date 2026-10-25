#!/bin/bash
cd "$CLAUDE_PROJECT_DIR" || exit 0

# 1. Auto-fix what's fixable
npm run lint:fix >/dev/null 2>&1

# 2. Report remaining lint issues
LINT_OUTPUT=$(npm run lint 2>&1)
LINT_STATUS=$?

# 3. Run tsc to catch generated-code type issues
TSC_OUTPUT=$(npm run tsc 2>&1)
TSC_STATUS=$?

if [ $LINT_STATUS -ne 0 ] || [ $TSC_STATUS -ne 0 ]; then
  echo "=== lint issues ===" >&2
  echo "$LINT_OUTPUT" >&2
  echo "=== tsc issues ===" >&2
  echo "$TSC_OUTPUT" >&2
  exit 2
fi
