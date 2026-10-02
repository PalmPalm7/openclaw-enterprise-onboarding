# Set up OpenClaw Enterprise with a coding agent

> Execution brief for Claude Code, Codex, Cursor or another coding agent with local terminal access. Read this file, then follow the detailed runbook. Fetching it alone performs no installation.

Goal: an isolated local OCE development platform, HTTPS sign-in and one verified model reply. The October 1, 2026 Apple Silicon platform and hosted-GLM task passed; this portable recipe has not been reproduced on a second machine.

## 1. Read and inspect

Read [the detailed runbook](https://redhat-et.github.io/openclaw-enterprise-onboarding/GETTING_STARTED_AGENTS.md), especially Sections 1–2 and 9. Read applicable local `AGENTS.md` instructions before acting. Documentation builds alone do not request infrastructure setup.

Inspect OS/architecture, installed tools, memory/storage, existing Colima profiles and ports 3300/8444/6444. Read [the preflight script](https://redhat-et.github.io/openclaw-enterprise-onboarding/setup-check.sh) before running it, or perform its checks directly. It installs nothing, creates no VM/cluster and reads no credential. Still compare full tool versions against the runbook.

The qualified host is Apple Silicon with native Colima VZ, Docker and k3d/K3s. Record unsupported hosts/missing tools as gaps; do not silently switch platform. Working allocation: 6 CPUs, 14 GiB VM RAM, 45 GiB VM disk. The 60 GiB free-host-storage recommendation is planning headroom, not a tested minimum.

## 2. Prepare an owned environment

Choose unused work/profile/cluster/state names and free ports. Preserve existing Docker/kubectl contexts, services and files. Follow the source/VM blocks; pin OCE to `affac2bfc1370e590e6da570bcaaad4a207c9f09`. Read upstream `AGENTS.md` before product edits. No product edits are required.

Use the explicit owned Colima Docker socket. Keep generated state outside Git with restrictive permissions. The state directory itself must be absent at first startup; the cluster name must start with `occ-dev-`. Existing installations resume with `k3d cluster start`; `occ dev up` creates a fresh installation.

## 3. Install and verify the platform

Follow runbook Sections 3–5 with Kubernetes compute/control plane and `Sandbox Driver=none`. Run the official source-built launcher unchanged, including NetworkPolicy and native Codex sandbox checks. OpenShell is absent from this profile. Diagnose failures before retrying; apply the guest user-namespace prerequisite only for its established cause in the dedicated VM.

Require the official ready message, authenticated Installation access, platform `default` Namespace `ready`, `/readyz` HTTP 200, Ready Pods and HTTPS console sign-in. Report the console URL and private credential-file paths without reading passwords into tool output. Handle browser trust locally as documented. A ready console does not establish model acceptance.

## 4. Configure one approved model and Agent

Use the operator's explicit provider/model and budget. Ask only for missing inputs; request a protected local key-file path or approved runtime injection, never a key pasted into chat. Do not invent credentials or silently select a paid model.

The upstream `first-agent.mjs` route needs a direct OpenAI credential and an approved plain model ID. Follow Section 6; an arbitrary gateway key is incompatible with that route. The optional hosted-GLM example requires an independently available approved Anthropic-Messages-compatible origin and Secret/IAM setup. That is the historical tested model path, not a distributed gateway service.

Keep credential values out of commands, logs, configuration JSON, prompts and Git. Preserve Secret references and exact IAM grants. Tools/native admin UI are disabled in the direct OpenAI starter; enable and test tools only when separately requested.

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
