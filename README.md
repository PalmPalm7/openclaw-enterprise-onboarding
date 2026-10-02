# OpenClaw Enterprise onboarding

**Open [the five-step guide](docs/GETTING_STARTED.md).** It takes about two minutes to read.

Public onboarding maintained by [redhat-et](https://github.com/redhat-et) for [OpenClaw Enterprise](https://github.com/openclaw/openclaw-enterprise). This is a companion guide, not the upstream product repository or its official documentation.

**Website:** [redhat-et.github.io/openclaw-enterprise-onboarding](https://redhat-et.github.io/openclaw-enterprise-onboarding/)

| Read this | When you need it |
| --- | --- |
| [Human guide](docs/GETTING_STARTED.md) | A short path from prerequisites to one working Agent |
| [Agent runbook](docs/GETTING_STARTED_AGENTS.md) | Exact commands, configuration, acceptance and recovery |
| [Upstream local setup](https://github.com/openclaw/openclaw-enterprise/blob/affac2bfc1370e590e6da570bcaaad4a207c9f09/docs/guides/quickstart.md) | The source project's instructions at this guide's baseline |

## What was verified

An October 1, 2026 local setup used an Apple Silicon Mac, an isolated Colima Linux VM, Docker, k3d/K3s and the official source-built OCE development launcher. HTTPS console sign-in, platform readiness, Agent deployment and a genuine embedded OpenClaw file write/read task with remotely hosted **GLM 5.3** passed.

The source baseline is `affac2bfc1370e590e6da570bcaaad4a207c9f09`. This public recipe was reviewed against that source; it was not freshly executed on a second machine. Historical runtime receipts remain private. Each operator must verify their own installation.

The profile uses **`Sandbox Driver=none`**. Full OpenShell integration, other host architectures and production/shared-cluster deployment require separate qualification. No private provider endpoint or credential is distributed here.

## Reproduction checklist

1. Record the exact source, tool versions, VM resources and runtime image digest.
2. Confirm platform readiness and HTTPS sign-in.
3. Deploy one Agent and verify a reply with an authorized, explicitly selected model.
4. Optionally verify tools through an actual workspace file and matched native results.
5. Report the outcome and remaining gaps without publishing secrets or internal infrastructure.

Use [CONTRIBUTING.md](CONTRIBUTING.md) for improvements. Keep both guide versions synchronized.

## Build the documentation site

Use **Node 24** in this onboarding repository:

```bash
npm ci --ignore-scripts
npm run check
python3 -m http.server 8000 --directory _site
```

Open `http://localhost:8000` and inspect both guide views. The static build reads only the two public Markdown guides; it does not contact a model provider or deploy OCE. GitHub Pages publishes the same generated site.
