# OpenClaw Enterprise onboarding

**Open [the five-step guide](docs/GETTING_STARTED.md).** It gives the next action and expected result at each step.

Public onboarding maintained by [redhat-et](https://github.com/redhat-et) for [OpenClaw Enterprise](https://github.com/openclaw/openclaw-enterprise). This is a companion guide, not the upstream product repository or its official documentation.

**Website:** [redhat-et.github.io/openclaw-enterprise-onboarding](https://redhat-et.github.io/openclaw-enterprise-onboarding/)

| Read this | When you need it |
| --- | --- |
| [Human guide](docs/GETTING_STARTED.md) | A short path from prerequisites to one working Agent |
| [Agent runbook](docs/GETTING_STARTED_AGENTS.md) | Exact commands, configuration, acceptance and recovery |
| [Upstream local setup](https://github.com/openclaw/openclaw-enterprise/blob/main/docs/guides/quickstart.md) | The source project's current instructions |

## What was verified

An October 1, 2026 local setup used an Apple Silicon Mac, an isolated Colima Linux VM, Docker, k3d/K3s and the official source-built OCE development launcher. HTTPS console sign-in, platform readiness, Agent deployment and a genuine embedded OpenClaw file write/read task with remotely hosted **GLM 5.3** passed.

That historical run used `affac2bfc1370e590e6da570bcaaad4a207c9f09`. New exploration uses current upstream `main` and records the resolved SHA. An October 7 CSB Mac run at `8023db20d5a7cfa84dbfe734d43898fc8cc354ce` passed official platform/network/sandbox checks, PostgreSQL readiness, **HTTPS administrator sign-in** and an authenticated **GPT-6 Luna** gateway nonce/arithmetic response with maximum effort configured in the exact active revision. The console showed the same Agent/revision and successful deployment; actual model serving was established by the separate model check. Tools were not exercised. Effort mapping was source-reviewed; the request wire and billed spend were not measured. Browser access used an operator-approved exception for the verified local certificate/hostname; no CA import or system trust change is claimed. Detailed runtime receipts remain private. Each operator must verify their own installation.

The profile uses **`Sandbox Driver=none`**. Full OpenShell integration, other host architectures and production/shared-cluster deployment require separate qualification. No private provider endpoint or credential is distributed here.

## Reproduction checklist

### Give the setup to your coding agent

Paste this into **Claude Code, Codex or Cursor** with local terminal access:

```text
Read https://redhat-et.github.io/openclaw-enterprise-onboarding/setup.md
and follow its linked runbook to set up OCE on this Mac. Inspect prerequisites and
existing runtimes; use my selected approved VM/engine, or ask if that choice is missing.
Preserve existing services, create an owned OCE cluster, and verify
HTTPS sign-in plus a real Agent model reply. Use my approved model and budget;
ask only for missing inputs, never for a credential pasted into chat.
```

Agent discovery: [llms.txt](https://redhat-et.github.io/openclaw-enterprise-onboarding/llms.txt). One-file packet: [llms-full.txt](https://redhat-et.github.io/openclaw-enterprise-onboarding/llms-full.txt). The [read-only preflight](scripts/check-setup.sh) checks prerequisites; installation commands remain in the runbook. Fetching a file does not run setup.

![Agent setup flow: instructions, inspection, owned installation, private model configuration and verification](docs/assets/setup-flow.svg)

### Record what passed

1. Record the exact source, tool versions, VM resources and runtime image digest.
2. Confirm platform readiness and HTTPS sign-in.
3. Deploy one Agent and verify a reply with an authorized, explicitly selected model.
4. Optionally verify tools through an actual workspace file and matched native results.
5. Report the outcome and remaining gaps without publishing secrets or internal infrastructure.

Use [CONTRIBUTING.md](CONTRIBUTING.md) for improvements. Keep both guide versions synchronized.

### Architecture

![Tested Colima/Docker example: owned Linux VM, k3d/K3s platform and Agent Pods, and remote model inference](docs/assets/architecture.svg)

Start by inspecting and reusing an approved existing VM/engine. The selected Linux VM supplies the guest OS, the selected engine runs containers, and k3d manages K3s node containers. The runbook covers Docker and supported rootful Podman without selecting a preferred VM/engine. The diagram shows the **October 1/7 tested Colima/Docker example**; its explicit new-profile recipe is optional. The platform and Agent tools run locally; inference runs at the approved provider. `Sandbox Driver=none` leaves OpenShell outside this profile. On a company-managed device, use approved runtime, DNS and browser-trust settings and preserve endpoint protection. The [credential diagram](docs/assets/credential-flow.svg) separates model access from administrator and Agent transport authentication.

### Why these files

The 2026 pattern is **`llms.txt` for discovery → `setup.md` for the requested task → `AGENTS.md` for repository instructions**, with readable scripts for bounded automation. It is not one universal executable setup standard. Current 100k-star examples include Next.js, shadcn/ui and Supabase; dated sources and the star snapshot are in [the reference research](docs/AGENT_SETUP_REFERENCES.md).

## Build the documentation site

Use **Node 24** in this onboarding repository:

```bash
npm ci --ignore-scripts
npm run check
python3 -m http.server 8000 --directory _site
```

Open `http://localhost:8000` and inspect both guide views. The static build publishes an explicit allowlist of public guides, agent setup files, the read-only preflight and static diagrams. It does not contact a model provider or deploy OCE. GitHub Pages publishes the same generated site.
