# Set up OpenClaw Enterprise with a coding agent

> Execution brief for Claude Code, Codex, Cursor or another coding agent with local terminal access. Read this file, then follow the detailed runbook. Fetching it alone performs no installation.

Goal: an owned local OCE development platform, HTTPS sign-in and one verified model reply. An October 7, 2026 CSB Mac run passed platform/database checks, HTTPS sign-in and a GPT-6 Luna nonce/arithmetic response with maximum effort configured; the console showed the same Agent/revision. Tools were not exercised. Browser access used an approved exact local certificate exception, without claiming a CA import/system trust change. The October 1 hosted-GLM tool task remains historical evidence. New installations use current upstream `main`, with an exact SHA recorded for each run.

## 1. Read and inspect

Read [the detailed runbook](https://redhat-et.github.io/openclaw-enterprise-onboarding/GETTING_STARTED_AGENTS.md), especially Sections 1–2 and 9. Read applicable local `AGENTS.md` instructions before acting. Documentation builds alone do not request infrastructure setup.

Inspect OS/architecture, installed tools, memory/storage, existing VM/engine profiles and ports 3300/8444/6444. Read [the preflight script](https://redhat-et.github.io/openclaw-enterprise-onboarding/setup-check.sh) before running it, or perform its checks directly. It installs nothing, creates no VM/cluster and reads no credential. Use `--source` after cloning for toolchain requirements; default engine is Docker, with `--docker-host` only for the selected local Unix socket. Add `--require-colima` only for a chosen new Colima VM, or `--engine podman` for Podman CLI inventory followed by manual rootful/cgroup/socket acceptance. For Docker require `docker buildx version`, not just a standalone `docker-buildx` binary.

The working host is Apple Silicon with Colima VZ, Docker and k3d/K3s. Colima/Lima supplies a Linux VM; Docker or Podman supplies the engine; k3d manages K3s inside engine containers. Inspect an existing approved runtime before creating another. Record other runtime/host paths as unqualified until tested. October 7 working allocation: 6 CPUs, 14 GiB VM RAM, 60 GiB VM disk. Separately, the 60 GiB free-host-storage recommendation is planning headroom, not a tested minimum.

On company-managed/CSB devices preserve endpoint protection, host security policy, VPN/DNS and trust settings. If a required VM prerequisite is prohibited, report that blocker and use an approved environment. A local loopback route or VM does not exempt workloads from company policy.

## 2. Prepare an owned environment

Choose unused work/profile/cluster/state names and free ports. Preserve existing Docker/kubectl contexts, services and files. Follow the source block for current `main`, record `git rev-parse HEAD`, and derive Node/pnpm/Go from that checkout. Hold the selected checkout fixed while installing. Read upstream `AGENTS.md` before product edits. No product edits are required by this recipe.

For Docker use an explicit host-reachable approved socket and process-local environment exports, without changing the default Docker context. Rootful Podman is an upstream-supported alternative with additional cgroup/socket requirements; changing an existing machine's rootful mode affects its storage and must be an intentional operator choice. Keep generated state outside Git with restrictive permissions. The state directory itself must be absent at first startup; the cluster name must start with `occ-dev-`. Existing installations resume with `k3d cluster start`; `occ dev up` creates a fresh installation.

## 3. Install and verify the platform

Follow runbook Sections 3–5 with Kubernetes compute/control plane and `Sandbox Driver=none`. Run the official source-built launcher unchanged, including NetworkPolicy and native Codex sandbox checks. OpenShell is absent from this profile. Diagnose failures before retrying; apply the guest user-namespace prerequisite only for its established cause in the dedicated VM.

Require the official ready message, authenticated Installation access, platform `default` Namespace `ready`, `/readyz` HTTP 200, PostgreSQL StatefulSet rollout, bound database PVC, database query and Ready Pods, plus HTTPS console sign-in. Check the guest/daemon's DNS first, then diagnose node DNS separately from successful VM/engine image pulls; use only an approved reachable resolver when a repair/override is needed. Inspect Docker's actual guest storage mount rather than `/var` alone. Report the console URL and private credential-file paths without reading passwords into tool output. Handle browser trust locally within company policy. A ready console does not establish model acceptance.

## 4. Configure one approved model and Agent

Use the operator's explicit provider/model and budget. Ask only for missing inputs; request a protected local key-file path or approved runtime injection, never a key pasted into chat. Do not invent credentials or silently select a paid model.

The reviewed upstream `first-agent.mjs` route uses direct OpenAI Responses, a plain model ID and no reasoning-effort option. An AI gateway key needs a separate console/API-managed Configuration with its approved URL, model ID, protocol and authentication. Section 6 includes an `openai/gpt-6-luna` / maximum-effort Configuration and complete linked resource flow. Its fresh CSB revision/nonce/arithmetic model check passed; effort mapping was source-reviewed, with no wire or billing measurement. Follow its compatibility checks; do not send a gateway key to the direct-provider helper. The hosted-GLM example is historical evidence for one Anthropic-Messages-compatible path, not a distributed gateway service or a current guarantee for another model.

Keep credential values out of commands, logs, configuration JSON, prompts and Git. Preserve Secret references and exact IAM grants. Tools/native admin UI are disabled in the direct OpenAI starter; enable and test tools only when separately requested. Current upstream emits a bounded `first-agent:` error on failure; diagnose selected resources instead of patching it to print raw command output.

## 5. Prove the outcome and hand off

Require `Model response verified:` and a real `Agent response:` for the intended active revision. Report **platform ready**, **prompt response verified**, or **native tool task verified** according to evidence. For prompt-only success, state that filesystem tools were not exercised. For tool claims, follow Section 7's native calls/results and independent file-byte checks; never write the expected file yourself.

Return a concise human result and detailed non-secret operator receipt: source/tools/model/protocol, owned profile/cluster/state paths, readiness/revision checks, browser URL, pause/resume commands and gaps. Leave the owned installation available unless asked to pause it. `occ dev down` is destructive teardown, not normal cleanup.

Full OpenShell, production/shared-cluster deployment, other architectures and broad model quality remain separate qualification tasks.

## Related files

- [Human guide](https://redhat-et.github.io/openclaw-enterprise-onboarding/GETTING_STARTED.md): concise overview.
- [Agent runbook](https://redhat-et.github.io/openclaw-enterprise-onboarding/GETTING_STARTED_AGENTS.md): exact commands and acceptance.
- [Discovery index](https://redhat-et.github.io/openclaw-enterprise-onboarding/llms.txt): small documentation map.
- [Complete agent packet](https://redhat-et.github.io/openclaw-enterprise-onboarding/llms-full.txt): generated brief plus runbook.
- [2026 reference research](https://redhat-et.github.io/openclaw-enterprise-onboarding/AGENT_SETUP_REFERENCES.md): primary-source examples and limits.
