# OpenClaw Enterprise: start locally

**Start with [the tool checklist](GETTING_STARTED_AGENTS.md#2-prepare-the-tools-and-source).** Use an owned Apple Silicon Mac.

**Goal:** sign in, deploy one Agent and get a real model reply. Allow **45–90 minutes** with prerequisites installed; this is a planning estimate. The platform baseline passed on October 1, 2026. A second-machine reproduction remains pending.

```text
Mac → Colima Linux VM → Docker → k3d/K3s → OCE + Agent Pods
```

Use **6 CPUs, 14 GiB RAM and a 45 GiB VM disk**. Allow **60 GiB free Mac storage** for build headroom. These are working/planning values, not tested minimums.

## 1. Check your tools

You need Git, Node 24+, pnpm **11.15.1**, Go **1.27**, Docker CLI **29+**, Colima, k3d, kubectl and Helm. Complete [the preflight](GETTING_STARTED_AGENTS.md#2-prepare-the-tools-and-source) before installing OCE.

## 2. Get the source and VM

Follow [the pinned source block](GETTING_STARTED_AGENTS.md#clone-the-tested-source), then [the isolated VM block](GETTING_STARTED_AGENTS.md#3-start-one-isolated-vm). The full tested source SHA is in those commands.

**Expected:** a clean checkout and Docker responding from your new `oce-onboarding` VM.

## 3. Install OCE

Run [the installation block](GETTING_STARTED_AGENTS.md#4-install-the-kubernetes-profile) in the same terminal.

Wait for **“OpenClaw Enterprise development stack is ready.”** Keep generated credential files private. This explicitly selects Kubernetes compute/control plane and **`Sandbox Driver=none`**. The default Compose preview cannot deploy Agents; full OpenShell integration is a separate qualification.

## 4. Sign in

Open the **HTTPS console URL printed by startup**. Follow [the browser CA and readiness instructions](GETTING_STARTED_AGENTS.md#5-check-readiness-and-sign-in). Sign in as `admin@development.openclaw.invalid` with the generated private password.

**Expected:** the platform Namespace **`default`** says **`ready`**. Port 3300 is a separate service-key API; password sign-in uses HTTPS.

## 5. Deploy and test one Agent

From the same source checkout, choose a model available to your direct OpenAI account:

```bash
export OPENCLAW_FIRST_AGENT_MODEL='<approved direct OpenAI model ID>'
node scripts/first-agent.mjs onboarding-agent --prompt 'What is 2 + 2?'
```

Replace the placeholder before running. Enter your **direct OpenAI API key** at the private prompt, or use [a protected key file](GETTING_STARTED_AGENTS.md#6-deploy-the-upstream-first-agent). Never put the key in a command or chat.

**Done:** the helper prints **`Model response verified:`**, an **Agent response**, and the active revision. Find that Agent in the console. A working console alone is not a model test.

This is upstream's documented **prompt-only** workflow; it was not the hosted GLM route used in the historical local run. The detailed runbook includes an [optional GLM example](GETTING_STARTED_AGENTS.md#optional-hosted-glm-example) and [genuine tool verification](GETTING_STARTED_AGENTS.md#7-verify-and-record-the-result).

## Pause without deleting your work

In the same terminal:

```bash
k3d cluster stop "$OCC_DEVELOPMENT_KUBERNETES_CLUSTER"
colima --profile "$OCE_PROFILE" stop
```

[Resume instructions](GETTING_STARTED_AGENTS.md#8-pause-resume-or-discard). **`occ dev down` deletes the installation and its data.**

**Next:** complete Step 1's tool checklist.
