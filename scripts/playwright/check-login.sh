#!/usr/bin/env bash
set -euo pipefail

export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export PWCLI="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"
export PLAYWRIGHT_CLI_SESSION="snapin-login"

URL="https://snapin.ru"
EMAIL="${SNAPIN_EMAIL:-alex.alexandrov.1988@gmail.com}"
PASSWORD="${SNAPIN_PASSWORD:1234Qq!}"

# Element refs (set after first snapshot)
EMAIL_REF="${SNAPIN_EMAIL_REF:-eX}"
PASSWORD_REF="${SNAPIN_PASSWORD_REF:-eY}"
SUBMIT_REF="${SNAPIN_SUBMIT_REF:-eZ}"

mkdir -p output/playwright

"$PWCLI" open "$URL" --headed
"$PWCLI" snapshot

# Update *_REF variables after inspecting the snapshot output.
"$PWCLI" fill "$EMAIL_REF" "$EMAIL"
"$PWCLI" fill "$PASSWORD_REF" "$PASSWORD"
"$PWCLI" click "$SUBMIT_REF"

"$PWCLI" snapshot
"$PWCLI" screenshot
