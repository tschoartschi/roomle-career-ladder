#!/usr/bin/env bash
# Publish docs/ to Confluence Cloud via @markdown-confluence/cli.
#
# Reads credentials and instance config from environment variables (locally via
# .env, in CI via GitHub Secrets + Variables) and merges them with the static
# defaults in .markdown-confluence.json into a runtime config that is passed to
# the CLI. The runtime config is written to a temp file and removed on exit so
# credentials never touch the repo.
#
# Required env vars:
#   CONFLUENCE_BASE_URL     e.g. https://roomle.atlassian.net/wiki
#   CONFLUENCE_PARENT_ID    numeric page ID
#   CONFLUENCE_SPACE_KEY    e.g. careerladder
#   ATLASSIAN_USER_NAME     Atlassian account email
#   ATLASSIAN_API_TOKEN     API token from id.atlassian.com
#
# Usage:
#   ./scripts/publish-confluence.sh             # publish, filtered output (SUCCESS lines only)
#   ./scripts/publish-confluence.sh --verbose   # publish, full CLI output (raw ADF dumps incl.)
#   ./scripts/publish-confluence.sh --dry       # print resolved config (token redacted) and exit

set -euo pipefail

DRY=false
VERBOSE=false
for arg in "$@"; do
  case "$arg" in
    --dry)           DRY=true ;;
    --verbose|-v)    VERBOSE=true ;;
    -h|--help)
      sed -n '2,/^$/p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      echo "Run with --help for usage." >&2
      exit 2
      ;;
  esac
done

: "${CONFLUENCE_BASE_URL:?must be set (bare domain, no /wiki)}"
: "${CONFLUENCE_PARENT_ID:?must be set}"
: "${ATLASSIAN_USER_NAME:?must be set}"
: "${ATLASSIAN_API_TOKEN:?must be set}"

if [[ "$CONFLUENCE_BASE_URL" == */wiki ]] || [[ "$CONFLUENCE_BASE_URL" == */wiki/ ]]; then
  echo "Error: CONFLUENCE_BASE_URL must not include /wiki — the CLI adds it." >&2
  echo "Got: $CONFLUENCE_BASE_URL" >&2
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATIC_CONFIG="$REPO_ROOT/.markdown-confluence.json"

if [[ ! -f "$STATIC_CONFIG" ]]; then
  echo "Missing $STATIC_CONFIG" >&2
  exit 1
fi

RUNTIME_CONFIG="$(mktemp -t mdconfluence.XXXXXX.json)"
trap 'rm -f "$RUNTIME_CONFIG"' EXIT

jq \
  --arg url   "$CONFLUENCE_BASE_URL" \
  --arg pid   "$CONFLUENCE_PARENT_ID" \
  --arg user  "$ATLASSIAN_USER_NAME" \
  --arg token "$ATLASSIAN_API_TOKEN" \
  '. + {
    confluenceBaseUrl:   $url,
    confluenceParentId:  $pid,
    atlassianUserName:   $user,
    atlassianApiToken:   $token
  }' \
  "$STATIC_CONFIG" > "$RUNTIME_CONFIG"

if [[ "$DRY" == "true" ]]; then
  echo "Resolved config (token redacted):"
  jq '.atlassianApiToken = "***REDACTED***"' "$RUNTIME_CONFIG"
  exit 0
fi

cd "$REPO_ROOT"
if [[ "$VERBOSE" == "true" ]]; then
  npx --yes @markdown-confluence/cli@latest --config "$RUNTIME_CONFIG"
else
  # Filter noisy CLI debug output: raw ADF JSON dumps and "TESTING DIFF" headers.
  # SUCCESS/ERROR/warning lines and anything that isn't obviously a JSON dump are kept.
  # Exit code propagates via pipefail (sed always exits 0).
  npx --yes @markdown-confluence/cli@latest --config "$RUNTIME_CONFIG" \
    | sed -E '/^(TESTING DIFF|[{[])/d'
fi
