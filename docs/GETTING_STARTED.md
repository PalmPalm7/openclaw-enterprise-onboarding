# OpenClaw Enterprise: start locally

**Start with [the tool checklist](GETTING_STARTED_AGENTS.md#2-prepare-the-tools-and-source).** Check the approved runtime on your Apple Silicon Mac before creating a VM.

**Goal:** sign in, deploy one Agent and get a real model reply. Allow **45–90 minutes** with prerequisites installed; this is a planning estimate. An October 7, 2026 CSB Mac run passed platform/database checks, HTTPS sign-in and a GPT-6 Luna nonce/arithmetic response with maximum effort configured. Filesystem tools were not exercised.

```text
Mac → Colima Linux VM → Docker → k3d/K3s → OCE + Agent Pods
```

Colima manages a Lima VM; Docker is its container engine; k3d creates the K3s cluster inside containers. They are different layers. The October 7 working allocation is **6 CPUs, 14 GiB RAM and a 60 GiB VM disk**. Separately allow **60 GiB free Mac storage** for build headroom. These are working/planning values, not tested minimums. On company-managed/CSB devices preserve security controls and use approved runtime, DNS and browser-trust settings.

## 1. Check your tools

You need Git, Bash, Python 3, Node, pnpm, Go, a container engine, k3d, kubectl and Helm. Derive Node/pnpm/Go versions from the selected OCE checkout. For the Docker path require a reachable engine, **`docker buildx version`** and `docker image save --platform` support. Complete [the preflight](GETTING_STARTED_AGENTS.md#2-prepare-the-tools-and-source) before installing OCE.

## 2. Get the source and VM

Follow [the current source block](GETTING_STARTED_AGENTS.md#clone-current-source), then [choose or reuse the VM/engine](GETTING_STARTED_AGENTS.md#3-choose-the-vm-and-container-engine). New exploration uses upstream **`main`**; record its resolved SHA for the run. Docker is the documented Mac path. Existing Lima/Docker and rootful Podman alternatives are explained in the runbook.

**Expected:** a clean checkout and the selected engine responding through its explicit host socket. Existing services and default contexts stay intact.

### Prefer your coding agent to do the setup?

Paste into Claude Code, Codex or Cursor with terminal access:

```text
Read https://redhat-et.github.io/openclaw-enterprise-onboarding/setup.md
and set up OCE on this Mac using the linked runbook. Inspect prerequisites,
reuse an approved runtime or use an isolated owned VM/cluster, preserve existing services, and verify
HTTPS login and a real model reply. Use my approved model/budget and private
key-file input. Ask only for missing inputs; never request a key in chat.
```

[Agent discovery](https://redhat-et.github.io/openclaw-enterprise-onboarding/llms.txt) · [Complete packet](https://redhat-et.github.io/openclaw-enterprise-onboarding/llms-full.txt). The agent follows this same five-step guide. Click a diagram to open it at full size.

[![Agent-led setup from instructions to a verified model reply](assets/setup-flow.svg)](assets/setup-flow.svg)

[![Owned local OCE architecture and remote model inference](assets/architecture.svg)](assets/architecture.svg)

## 3. Install OCE

Run [the installation block](GETTING_STARTED_AGENTS.md#4-install-the-kubernetes-profile) in the same terminal.

Wait for **“OpenClaw Enterprise development stack is ready.”** Keep generated credential files private. This explicitly selects Kubernetes compute/control plane and **`Sandbox Driver=none`**. The default Compose preview cannot deploy Agents; full OpenShell integration is a separate qualification. If startup fails, check [Buildx, guest/node DNS and guest sandbox prerequisites](GETTING_STARTED_AGENTS.md#9-diagnose-bounded-failures) before retrying.

## 4. Sign in

Open the **HTTPS console URL printed by startup**. Follow [the browser CA and readiness instructions](GETTING_STARTED_AGENTS.md#5-check-readiness-and-sign-in), using your approved CSB trust method or an approved exception for the verified exact local hostname. Sign in as `admin@development.openclaw.invalid` with the generated private password. The fresh run used a local browser exception, without claiming a CA import/system trust change.

**Expected:** PostgreSQL rollout, its bound PVC and a database query pass; the platform Namespace **`default`** says **`ready`**. Port 3300 is a separate service-key API; password sign-in uses HTTPS.

## 5. Deploy and test one Agent

Choose your approved provider, exact model and budget. For a **direct OpenAI key**, use the same source checkout:

```bash
export OPENCLAW_FIRST_AGENT_MODEL='<approved direct OpenAI model ID>'
node scripts/first-agent.mjs onboarding-agent --prompt 'What is 2 + 2?'
```

Replace the placeholder before running. Enter your **direct OpenAI API key** at the private prompt, or use [a protected key file](GETTING_STARTED_AGENTS.md#6-deploy-the-upstream-first-agent). Never put the key in a command or chat.

For an **AI gateway key**, use a separate console/API-managed Agent. The runbook includes a [GPT-6 Luna maximum-effort configuration](GETTING_STARTED_AGENTS.md#openai-compatible-gateway-configuration-gpt-6-luna-maximum-effort) with an approved endpoint placeholder and private model Secret. Its CSB nonce/arithmetic model check passed; tools were not exercised and effort mapping was source-reviewed. The reviewed direct helper has no gateway URL or effort flag. Check [gateway compatibility](GETTING_STARTED_AGENTS.md#approved-gateway-models) before deployment.

**Done:** the direct helper prints **`Model response verified:`**, an **Agent response**, and the active revision. For a gateway-managed Agent require the same real model/revision evidence through its authenticated endpoint. Find that Agent in the console. A working console alone is not a model test. A bounded **`first-agent:`** error means proof has not passed; use the runbook's targeted checks.

This is upstream's documented **prompt-only** workflow; it was not the hosted GLM route used in the historical local run. The detailed runbook includes an [optional GLM example](GETTING_STARTED_AGENTS.md#optional-hosted-glm-example) and [genuine tool verification](GETTING_STARTED_AGENTS.md#7-verify-and-record-the-result).

## Pause without deleting your work

In the same terminal:

```bash
k3d cluster stop "$OCC_DEVELOPMENT_KUBERNETES_CLUSTER"
# Only for the dedicated Colima profile created for OCE:
colima --profile "$OCE_PROFILE" stop
```

[Resume instructions](GETTING_STARTED_AGENTS.md#8-pause-resume-or-discard). Keep a reused/shared VM running for unrelated workloads. **`occ dev down` deletes the installation and its data.**

**Next:** complete Step 1's tool checklist.
