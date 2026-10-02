#!/usr/bin/env bash
# Read-only first preflight. No installs, downloads, VM changes or credential reads.
set -uo pipefail
failures=0
check_command() {
  if command -v "$1" >/dev/null 2>&1; then
    printf 'OK    %s is installed\n' "$1"
  else
    printf 'GAP   %s is missing\n' "$1"
    failures=$((failures + 1))
  fi
}
printf 'OCE local setup: read-only preflight\n'
if [ "$(uname -s)" = Darwin ] && [ "$(sysctl -n hw.optional.arm64 2>/dev/null || printf 0)" = 1 ]; then
  printf 'OK    Apple Silicon Mac\n'
  if [ "$(uname -m)" != arm64 ]; then
    printf 'NOTE  Shell is translated; use native arm64 tools for this recipe.\n'
  fi
else
  printf 'GAP   This recipe qualifies an Apple Silicon Mac; other hosts need a separate recipe.\n'
  failures=$((failures + 1))
fi
for tool in git node pnpm go docker colima k3d kubectl helm; do
  check_command "$tool"
done
if command -v node >/dev/null 2>&1; then
  node_major=$(node --version | sed -E 's/^v([0-9]+).*/\1/')
  case "$node_major" in
    ''|*[!0-9]*) printf 'GAP   Cannot determine Node version\n'; failures=$((failures + 1));;
    *) if [ "$node_major" -lt 24 ]; then
         printf 'GAP   OCE needs Node >=24\n'; failures=$((failures + 1))
       fi;;
  esac
fi
if command -v pnpm >/dev/null 2>&1; then
  # Corepack shims can otherwise pin a project or download a package manager.
  if ! pnpm_version=$(COREPACK_ENABLE_AUTO_PIN=0 COREPACK_ENABLE_NETWORK=0 pnpm --version 2>/dev/null); then
    printf 'GAP   pnpm version check failed; use a working installed pnpm (Corepack downloads/auto-pin disabled).\n'
    failures=$((failures + 1))
  elif [ "$pnpm_version" != 11.15.1 ]; then
    printf 'GAP   Use pnpm 11.15.1 for the pinned source\n'
    failures=$((failures + 1))
  fi
fi
if command -v go >/dev/null 2>&1; then
  case "$(GOTOOLCHAIN=local go version 2>/dev/null)" in
    *' go1.27.'*|*' go1.27 '*) :;;
    *) printf 'GAP   Use the runbook Go 1.27 toolchain\n'; failures=$((failures + 1));;
  esac
fi
free_kib=$(df -Pk "$HOME" | awk 'END {print $4}')
case "$free_kib" in
  ''|*[!0-9]*) printf 'NOTE  Inspect free host storage manually\n';;
  *) printf 'INFO  Free host storage: %s GiB (60 GiB is planning headroom)\n' "$((free_kib / 1024 / 1024))";;
esac
if command -v lsof >/dev/null 2>&1; then
  for port in 3300 8444 6444; do
    if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
      printf 'NOTE  Port %s is occupied; select an unused port. Do not stop its service.\n' "$port"
    else
      printf 'OK    No listener observed on port %s (recheck before startup)\n' "$port"
    fi
  done
fi
printf 'Next: compare full tool versions, VM capacity and existing profiles with the agent runbook.\n'
printf 'This check did not validate a Docker daemon, provision OCE or exercise a model.\n'
if [ "$failures" -gt 0 ]; then
  printf 'Result: %s prerequisite gaps\n' "$failures"
  exit 1
fi
printf 'Result: basic prerequisites present; installation acceptance still pending\n'
