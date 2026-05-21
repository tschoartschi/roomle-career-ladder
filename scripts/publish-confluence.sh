#!/usr/bin/env bash
# Publish docs/ to Confluence Cloud via @markdown-confluence/cli.
#
# Pipeline:
#   1. Preprocess  docs/  →  build/docs/  (converts standard markdown links
#      to Obsidian wikilinks so the CLI can resolve them).
#   2. Run the CLI against build/docs/.
#   3. Sync any new connie-page-id the CLI wrote into build/docs/ back into
#      the corresponding source files in docs/, so subsequent runs update
#      existing pages instead of creating duplicates.
#
# build/ is gitignored. The source markdown in docs/ stays GitHub-friendly.
# Credentials and instance config come from environment variables (locally
# via .env, in CI via GitHub Secrets).
#
# Required env vars:
#   CONFLUENCE_BASE_URL     bare domain, no /wiki suffix
#   CONFLUENCE_PARENT_ID    numeric page ID
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
    --dry)        DRY=true ;;
    --verbose|-v) VERBOSE=true ;;
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
cd "$REPO_ROOT"

STATIC_CONFIG="$REPO_ROOT/.markdown-confluence.json"
[[ -f "$STATIC_CONFIG" ]] || { echo "Missing $STATIC_CONFIG" >&2; exit 1; }

RUNTIME_CONFIG="$(mktemp -t mdconfluence.XXXXXX.json)"
trap 'rm -f "$RUNTIME_CONFIG"' EXIT

# Build runtime config: static defaults + env-supplied credentials.
# folderToPublish/contentRoot point at build/docs (the preprocessed copy).
jq \
  --arg url   "$CONFLUENCE_BASE_URL" \
  --arg pid   "$CONFLUENCE_PARENT_ID" \
  --arg user  "$ATLASSIAN_USER_NAME" \
  --arg token "$ATLASSIAN_API_TOKEN" \
  '. + {
    folderToPublish:    "build/docs",
    contentRoot:        "build/docs",
    confluenceBaseUrl:  $url,
    confluenceParentId: $pid,
    atlassianUserName:  $user,
    atlassianApiToken:  $token
  }' \
  "$STATIC_CONFIG" > "$RUNTIME_CONFIG"

if [[ "$DRY" == "true" ]]; then
  echo "Resolved config (token redacted):"
  jq '.atlassianApiToken = "***REDACTED***"' "$RUNTIME_CONFIG"
  exit 0
fi

# 1. Preprocess
node scripts/preprocess-for-confluence.mjs

# 2. Publish
if [[ "$VERBOSE" == "true" ]]; then
  npx --yes @markdown-confluence/cli@latest --config "$RUNTIME_CONFIG"
else
  # Filter noisy CLI debug output (raw ADF JSON dumps + "TESTING DIFF" headers).
  # SUCCESS/ERROR/warning lines and anything that isn't an obvious JSON dump are kept.
  # Exit code propagates via pipefail (sed always exits 0).
  npx --yes @markdown-confluence/cli@latest --config "$RUNTIME_CONFIG" \
    | sed -E '/^(TESTING DIFF|[{[])/d'
fi

# 3. Sync any new page IDs back to source docs/
node scripts/sync-page-ids.mjs
