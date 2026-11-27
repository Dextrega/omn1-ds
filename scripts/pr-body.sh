#!/usr/bin/env bash
# Prints the CHANGELOG.md entry of a version (e.g. `scripts/pr-body.sh 1.3.1`), verbatim, to use as the PR body.
set -euo pipefail
version="${1:?usage: scripts/pr-body.sh <x.y.z>}"
awk -v v="## v${version} " 'index($0, v) == 1 { on = 1; print; next } on && /^## / { exit } on { print }' "$(dirname "$0")/../CHANGELOG.md" | sed -e :a -e '/^\n*$/{$d;N;ba' -e '}'
