#!/usr/bin/env bash

set -euo pipefail

null_sha='0000000000000000000000000000000000000000'
event_name="${EVENT_NAME:-}"
head_sha="${PR_HEAD_SHA:-${HEAD_SHA:-}}"
base_sha="${BASE_SHA:-}"
before_sha="${BEFORE_SHA:-}"
default_branch="${DEFAULT_BRANCH:-main}"
pr_merged="${PR_MERGED:-false}"
pr_head_ref="${PR_HEAD_REF:-}"

fetch_commit() {
  local sha="$1"
  if [[ -z "$sha" || "$sha" == "$null_sha" ]]; then
    return 0
  fi
  if git cat-file -e "${sha}^{commit}" 2>/dev/null; then
    return 0
  fi
  git fetch --no-tags --depth=1 origin "$sha"
}

fetch_branch() {
  local branch="$1"
  if git show-ref --verify --quiet "refs/remotes/origin/${branch}"; then
    return 0
  fi
  git fetch --no-tags --depth=1 origin "${branch}:refs/remotes/origin/${branch}"
}

set_output() {
  printf '%s=%s\n' "$1" "$2" >> "$GITHUB_OUTPUT"
}

extract_packages() {
  python3 - "$@" <<'PY'
import pathlib
import re
import sys

packages = []
for path in sys.argv[1:]:
    text = pathlib.Path(path).read_text(encoding="utf-8")
    if not text.startswith("---"):
        continue
    parts = text.split("---", 2)
    if len(parts) < 3:
        continue
    header = parts[1]
    for match in re.finditer(r"['\"](@vannadii/[^'\"]+)['\"]\s*:\s*(major|minor|patch)", header):
        packages.append(match.group(1))

print(",".join(sorted(set(packages))))
PY
}

diff_base=''
case "$event_name" in
  pull_request)
    fetch_commit "$base_sha"
    fetch_commit "$head_sha"
    diff_base="$base_sha"
    ;;
  push)
    fetch_commit "$head_sha"
    if [[ -n "$before_sha" && "$before_sha" != "$null_sha" ]]; then
      fetch_commit "$before_sha"
      diff_base="$before_sha"
    else
      fetch_branch "$default_branch"
      diff_base="$(git merge-base "refs/remotes/origin/${default_branch}" "$head_sha")"
    fi
    ;;
  *)
    set_output has-changeset false
    set_output is-release-pr false
    set_output should-publish-dev-build false
    set_output package-list ''
    exit 0
    ;;
esac

mapfile -t changed_files < <(git diff --name-only "$diff_base" "$head_sha")

changesets=()
for file in "${changed_files[@]}"; do
  if [[ "$file" == .changeset/* && "$file" != ".changeset/README.md" ]]; then
    changesets+=("$file")
  fi
done

has_changeset=false
if ((${#changesets[@]} > 0)); then
  has_changeset=true
fi

is_release_pr=false
if [[ "$event_name" == "pull_request" && "$pr_head_ref" == changeset-release/* ]]; then
  is_release_pr=true
fi

should_publish_dev_build=false
if [[ "$event_name" == "pull_request" && "$pr_merged" == "true" && "$has_changeset" == "true" && "$is_release_pr" == "false" ]]; then
  should_publish_dev_build=true
fi

package_list=''
if ((${#changesets[@]} > 0)); then
  package_list="$(extract_packages "${changesets[@]}")"
fi

set_output has-changeset "$has_changeset"
set_output is-release-pr "$is_release_pr"
set_output should-publish-dev-build "$should_publish_dev_build"
set_output package-list "$package_list"
