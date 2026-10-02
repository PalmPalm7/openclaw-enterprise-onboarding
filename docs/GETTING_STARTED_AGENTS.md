# OpenClaw Enterprise: detailed local runbook

**Execute the preflight in Section 2, then follow the sections in order.** Use the [human guide](GETTING_STARTED.md) for the five-step overview.

Prepared October 2, 2026. This recipe is source-reviewed against the pinned upstream revision. The October 1 Apple Silicon platform and embedded hosted-GLM task passed locally; this public recipe has not been freshly executed on a second machine. Historical sensitive receipts are not published. Qualify each new installation independently.

## 1. Select the baseline

```text
Apple Silicon Mac → isolated Colima Linux VM → Docker → k3d/K3s
  → PostgreSQL + OCE API/worker + Envoy Gateway/cert-manager → Agent Pods
```

OCE means **OpenClaw Enterprise**; OCC means **OpenClaw Control Plane**. The Mac runs the platform and tools; provider models run remotely.

| Input | Historical working selection |
| --- | --- |
| OCE source | `affac2bfc1370e590e6da570bcaaad4a207c9f09` |
| Runtime OpenClaw source, selected by its Dockerfile | `9d9c8568c51e340540f634f71bd7c7582a70debc` |
| Runtime Codex engine | `0.158.0` |
| Toolchain | Node >=24; pnpm `11.15.1`; Go `1.27` (observed `1.27.1`) |
| Kubernetes | k3d `5.9.0`; K3s `v1.36.4+k3s1`; containerd `2.3.4`; kubectl `1.36.4` |
| Container tools | Docker daemon `29.5.2`; Docker CLI `29.8.1` |
| Dedicated VM | Colima VZ/aarch64; 6 CPUs; 14 GiB RAM; 45 GiB sparse disk |
| Observed guest | Ubuntu `24.04.4`; kernel `6.8.0-117-generic` |
| Platform dependencies | PostgreSQL `18.6`; cert-manager `1.18.4`; Envoy Gateway `1.6.7` |

Select Kubernetes compute and control plane with **`Sandbox Driver=none`**. This profile does not install or qualify OpenShell enforcement/credential brokering. Native Codex workspace sandboxing is a separate boundary. Default startup selects a Compose preview that cannot deploy Agents; the Compose/Kubernetes hybrid also differs from this recipe.

Do not substitute `main`, `latest`, a new guest kernel or standalone OpenShell and reuse the historical acceptance claim. See [upstream profile contract](https://github.com/openclaw/openclaw-enterprise/blob/affac2bfc1370e590e6da570bcaaad4a207c9f09/docs/guides/deploy/local-kubernetes-development.md). Kubernetes-only startup uses its pinned K3s image; the K3s channel override at this revision applies to a different profile.

## 2. Prepare the tools and source

Install Git, Node >=24, pnpm `11.15.1`, Go `1.27`, Docker CLI, native Colima, k3d, kubectl and Helm. Use native arm64 tools on Apple Silicon. Docker CLI must support `docker image save --platform`; the observed CLI 29 worked, whereas CLI 27 did not. Kubernetes-only startup does not need Docker Compose.

Plan **45–90 minutes**, including first downloads, builds and Agent startup; this is an estimate. The 6 CPU / 14 GiB / 45 GiB VM allocation worked; these are not minimums. A 4 GiB engine allocation failed the runtime build. Allow roughly **60 GiB free host storage** for build headroom. Each generated Agent workload has a 2 GiB memory limit.

Inspect installed tool versions, existing Colima profiles, Docker contexts and ports **3300, 8444, 6444**. Choose distinct names/ports if occupied. Preserve existing default Docker/kubectl contexts and unrelated services.

### Clone the tested source

Run in Bash; choose an unused work directory. Private state will live beside, outside, the source checkout.

```bash
set -euo pipefail
umask 077
export OCE_WORK="$HOME/oce-onboarding-dev"
mkdir -p "$OCE_WORK"
git clone https://github.com/openclaw/openclaw-enterprise.git \
  "$OCE_WORK/openclaw-enterprise"
cd "$OCE_WORK/openclaw-enterprise"
git checkout --detach affac2bfc1370e590e6da570bcaaad4a207c9f09
git rev-parse HEAD
git status --short
pnpm install --frozen-lockfile
pnpm cli:build
```

Require the exact SHA and clean source. Read [upstream AGENTS.md](https://github.com/openclaw/openclaw-enterprise/blob/affac2bfc1370e590e6da570bcaaad4a207c9f09/AGENTS.md) before source changes. This guide requires none. Use a working installed pinned pnpm; do not edit the lockfile to fix a host toolchain failure.

## 3. Start one isolated VM

```bash
export OCE_PROFILE='oce-onboarding'
colima --profile "$OCE_PROFILE" start \
  --arch aarch64 --vm-type vz --runtime docker \
  --cpus 6 --memory 14 --disk 45 \
  --activate=false --ssh-config=false

unset DOCKER_CONTEXT DOCKER_TLS_VERIFY DOCKER_CERT_PATH DOCKER_HOST
export DOCKER_HOST="unix://$HOME/.colima/$OCE_PROFILE/docker.sock"
docker version
docker info
colima --profile "$OCE_PROFILE" ssh -- df -h /var
```

Require the selected daemon to respond. The socket assumes Colima's default home; customized `COLIMA_HOME` requires its actual host-reachable socket. Do not copy a guest-only socket path. `--activate=false --ssh-config=false` preserves default context/SSH settings. Do not enable Colima Kubernetes: OCE creates k3d in the VM's Docker Engine.

Intel Mac and Linux variants are not qualified by this reproduction.

## 4. Install the Kubernetes profile

Create only the private parent. **The state directory itself must be absent** for fresh startup. Cluster names must start with `occ-dev-`.

```bash
mkdir -p "$OCE_WORK/private"
chmod 700 "$OCE_WORK/private"
export OCC_DEVELOPMENT_STATE_DIRECTORY="$OCE_WORK/private/onboarding-state"
export OCC_DEVELOPMENT_KUBERNETES_CLUSTER='occ-dev-oce-onboarding'
export OCC_DEVELOPMENT_COMPUTE_DRIVER=kubernetes
export OCC_DEVELOPMENT_CONTROL_PLANE=kubernetes
export OCC_DEVELOPMENT_SANDBOX_DRIVER=none
export OCC_DEVELOPMENT_CONTAINER_ENGINE=docker
export OPENCLAW_DEV_PORT=3300
export OCC_DEVELOPMENT_BROWSER_PORT=8444
export OCC_DEVELOPMENT_KUBERNETES_API_PORT=6444
export OCC_DEVELOPMENT_STARTUP_TIMEOUT_SECONDS=600
unset OCC_DEVELOPMENT_CONTROLLER_IMAGE OCC_KUBERNETES_RUNTIME_IMAGE
./bin/occ dev up
```

Require **`OpenClaw Enterprise development stack is ready.`** The launcher builds/imports matched source images, installs the platform and generates private state. It performs NetworkPolicy acceptance and checks the dedicated Codex sandbox against the imported runtime before declaring success.

The source build avoids assuming published registry access. For an intentional published-image alternative, follow [upstream image selection](https://github.com/openclaw/openclaw-enterprise/blob/affac2bfc1370e590e6da570bcaaad4a207c9f09/docs/guides/deploy/published-images.md): select controller/runtime together, compare source revision labels and record immutable digests. Local build digests are not promised as downloadable images.

Keep passwords, service keys, kubeconfig and TLS private keys private. Do not publish state/Helm values/Installation YAML, full Secret objects, Pod environments or native auth files. The state directory is `0700`; keep it outside Git. A startup failure may roll back the owned cluster; use the printed cleanup instruction for retained failed state, then resolve the cause before retrying.

## 5. Check readiness and sign in

```bash
export OCC_URL="http://127.0.0.1:$OPENCLAW_DEV_PORT"
export OCC_SERVICE_KEY_FILE="$OCC_DEVELOPMENT_STATE_DIRECTORY/initial-admin-service-key.json"
export OCE_KUBECONFIG="$OCC_DEVELOPMENT_STATE_DIRECTORY/kubeconfig"
export OCE_CONTEXT="k3d-$OCC_DEVELOPMENT_KUBERNETES_CLUSTER"
./bin/occ installation get
./bin/occ namespace list
curl --fail "$OCC_URL/readyz"
kubectl --kubeconfig "$OCE_KUBECONFIG" --context "$OCE_CONTEXT" get pods -A
```

Require authenticated Installation access, platform Namespace `default` status `ready`, `/readyz` HTTP 200 and Ready platform Pods. The platform Namespace is distinct from Kubernetes' built-in `default` namespace. Retain its returned `ns_...` ID privately; do not invent IDs.

Open the printed **Browser console** URL. With these examples it is:

```text
https://console.occ-dev-oce-onboarding.oce.localhost:8444/console/
```

Follow [upstream browser trust instructions](https://github.com/openclaw/openclaw-enterprise/blob/affac2bfc1370e590e6da570bcaaad4a207c9f09/docs/guides/quickstart.md#open-the-platform-console) for the printed public `browser-ca.crt`. Import only that certificate, never private keys or the state directory; remove trust when discarding the installation. The historical run instead verified the exact hostname's certificate chain and used a per-site development exception.

Sign in as `admin@development.openclaw.invalid` using the generated **Administrator password file**, ordinarily `initial-admin-password` in private state. Read it locally without logged output. Password login uses HTTPS; port 3300 is the separate service-key API. HTTP password sign-in can correctly fail with origin/CSRF 403; do not weaken that policy.

## 6. Deploy the upstream first Agent

Use a valid **direct OpenAI credential** and explicitly select an available, budget-approved model by its plain ID. This is [upstream's documented prompt-only workflow](https://github.com/openclaw/openclaw-enterprise/blob/affac2bfc1370e590e6da570bcaaad4a207c9f09/docs/guides/first-agent.md), not the historical hosted-GLM task used locally.

```bash
export OPENCLAW_FIRST_AGENT_MODEL='<approved direct OpenAI model ID>'
node scripts/first-agent.mjs onboarding-agent --prompt 'What is 2 + 2?'
```

Replace the placeholder first. The helper privately prompts if no key is supplied. For automation, use `OPENAI_API_KEY_FILE` pointing to a protected private file, or approved environment injection through `OPENAI_API_KEY`; supplying both fails. Never put a key in the command, Configuration JSON or chat. A stale exported key is used as is. This helper does not turn an arbitrary gateway credential into a direct OpenAI credential.

The helper creates the Secret and embedded Agent, grants Secret access, prepares transport, deploys and verifies a model turn. Keep it running until **`Model response verified:`** and **`Agent response:`** appear; record the returned active revision. Initial startup may take several minutes. Open its console URL and verify the same Agent. It remains after the helper exits.

Tools/native admin UI are disabled by this starter. A prompt response does not prove filesystem tools. Rerun the same helper-created Agent name for further prompts; use a new name for a console-created Agent. Follow upstream's replacement-key procedure if authentication fails.

### Optional hosted GLM example

The historically successful embedded model was **GLM 5.3**, `rits/zai-org/glm-5-3`, via an operator-approved Anthropic-Messages-compatible endpoint. Native model reference: `anthropic/rits/zai-org/glm-5-3`. “Anthropic” names the protocol, not a Claude model. This example requires an independently available authorized endpoint and its own credential; this public repository supplies neither. Refresh provider availability, capabilities and price before inference.

Set `OCE_MODEL_BASE_URL` to that approved **HTTPS origin**, with no credentials or `/v1/messages` suffix. The following writes non-secret configuration only:

```bash
export OCE_MODEL_BASE_URL='<approved compatible HTTPS origin>'
export OCE_CONFIGURATION_FILE="$OCE_WORK/private/embedded-glm.json"
node --input-type=module <<'NODE'
import { writeFileSync } from 'node:fs';
const destination = process.env.OCE_CONFIGURATION_FILE;
const url = new URL(process.env.OCE_MODEL_BASE_URL);
if (!destination || url.protocol !== 'https:' || url.username || url.password ||
    url.search || url.hash || !['', '/'].includes(url.pathname)) {
  throw new Error('Use a private file path and approved HTTPS origin.');
}
const model = 'anthropic/rits/zai-org/glm-5-3';
const configuration = { kind: 'agent', values: {
  gateway: {
    mode: 'local', bind: 'lan', controlUi: { enabled: false },
    auth: { password: {
      source: 'env', provider: 'default', id: 'OPENCLAW_GATEWAY_PASSWORD',
    } },
    http: { endpoints: { chatCompletions: { enabled: true } } },
  },
  agents: { defaults: {
    model, skipBootstrap: true, thinkingDefault: 'off',
    models: { [model]: { agentRuntime: { id: 'openclaw' } } },
  } },
  tools: { allow: ['read', 'write'] },
  secrets: { providers: { model: {
    source: 'env', allowlist: ['ANTHROPIC_API_KEY'],
  } } },
  models: { providers: { anthropic: {
    baseUrl: url.origin, api: 'anthropic-messages',
    apiKey: { source: 'env', provider: 'model', id: 'ANTHROPIC_API_KEY' },
    models: [{ id: model, name: 'Hosted GLM', input: ['text'],
      reasoning: true, contextWindow: 128000, maxTokens: 1024 }],
  } } },
} };
writeFileSync(destination, JSON.stringify(configuration, null, 2) + '\n', {
  mode: 0o600, flag: 'wx',
});
console.log('Non-secret configuration written; no inference performed.');
NODE
```

At this pin, preserve the full provider-prefixed nested model reference to avoid truncation of a slash-containing ID. Preserve `reasoning:true` plus `thinkingDefault:"off"`: the pinned SDK needs the capability metadata to send explicit thinking-disabled. Do not enlarge or bypass the stock 16-token startup probe to hide an authentication/configuration failure.

In a Ready Namespace choose **Create Agent → Start without Preset → Anthropic → OpenClaw → Embedded**. Store the model credential in a Namespace Secret, select it as `harnessAuth`, enter the model ID and use the generated native **`values` object** under Advanced settings. `kind` is OCC resource metadata, not native configuration. Follow [upstream console creation](https://github.com/openclaw/openclaw-enterprise/blob/affac2bfc1370e590e6da570bcaaad4a207c9f09/docs/reference/console/create-and-deploy.md), review the saved Secret/configuration and choose **Deploy new version**.

For API automation, use the real resource sequence: Secret → Configuration → Agent → exact Secret IAM grant → runtime credentials → deployment. Both caller and consuming Agent need `operate` on that Secret. Follow [Secret input](https://github.com/openclaw/openclaw-enterprise/blob/affac2bfc1370e590e6da570bcaaad4a207c9f09/docs/reference/drivers/kubernetes-secret.md#create-a-namespace-owned-secret) and [exact IAM/deployment contracts](https://github.com/openclaw/openclaw-enterprise/blob/affac2bfc1370e590e6da570bcaaad4a207c9f09/docs/guides/deploy/production-agents.md#grant-the-agent-access-to-its-model-secret). Use server-returned IDs; inspect unknown request outcomes before retrying creates. Kubernetes RBAC is separate from OCC IAM.

### Dedicated Codex is a separate integration

Codex is an execution engine, not a model choice. Custom provider adapters are outside this public starter; none is shipped here. Do not inject a gateway key into the stock direct-provider path and assume compatibility. Qualify provider routing, discovery, credentials, native sandbox and genuine tasks separately before publishing a dedicated recipe.

## 7. Verify and record the result

For the default prompt-only route, require the helper's verified response, active revision and same console Agent. Report **“prompt response passed; filesystem tools not exercised.”**

For an optional tool-enabled Agent, check the exact admitted revision, successful deployment and active revision identity. Use the explicit kubeconfig/context; discover its backing namespace through `openclaw.dev/namespace=<returned Namespace ID>` and gateway Pod through `openclaw.dev/agent=<returned Agent ID>` plus `openclaw.dev/workload-role=gateway`. Match the revision/configuration and actual image digest; overlapping old/new Pods require more than name similarity.

Run the smoke task through the matching gateway's authenticated native endpoint. The optional configuration exposes `/v1/chat/completions` at `http://127.0.0.1:8080` **inside the gateway container**. Read `OPENCLAW_GATEWAY_PASSWORD` privately in process memory; send it as bearer authentication without command-argument/log exposure. Require unauthenticated access to return 401/403. Bound each request; the historical model call used a 160-second timeout.

Generate a fresh nonce such as `OCE_SMOKE_` plus a UUID. Ask the Agent to write `/home/node/workspace/oce-smoke-<nonce>.txt` containing exactly that nonce without newline, read it back and calculate **19 × 23**, with **437** on the final line. The verifier must never create or repair that file.

Require these checks:

1. Exact deployment succeeded; intended Pod Ready; actual image digest recorded.
2. Unauthenticated transport denied; authenticated task HTTP 200.
3. Direct workspace readback matches the nonce byte-for-byte.
4. Native `write`/`read` calls and matching successful result IDs refer to the exact path and nonce.
5. Final arithmetic answer is 437; exact model/protocol recorded.

The pinned runtime uses SQLite-backed history; recover the original task through authenticated native `sessions.list` / `chat.history`, not a guessed JSONL path. Recovery must not make another inference call or write the expected file. A model's claim alone is insufficient. See [upstream model verification](https://github.com/openclaw/openclaw-enterprise/blob/affac2bfc1370e590e6da570bcaaad4a207c9f09/docs/guides/operate/model-verification.md).

Keep a private non-secret receipt with source/tool/kernel versions, actual image digests, selected model/protocol, timestamp, exact revision checks and gaps. Keep internal IDs/endpoints out of public reports. Historical GLM acceptance establishes this small execution workflow, not broad quality or production qualification.

## 8. Pause, resume or discard

Retain the exact profile/socket/state exports. In a new shell, reestablish them before lifecycle commands.

```bash
# Retain the cluster and VM disk; release active memory.
k3d cluster stop "$OCC_DEVELOPMENT_KUBERNETES_CLUSTER"
colima --profile "$OCE_PROFILE" stop
```

Resume:

```bash
colima --profile "$OCE_PROFILE" start --activate=false --ssh-config=false
unset DOCKER_CONTEXT DOCKER_TLS_VERIFY DOCKER_CERT_PATH DOCKER_HOST
export DOCKER_HOST="unix://$HOME/.colima/$OCE_PROFILE/docker.sock"
k3d cluster start "$OCC_DEVELOPMENT_KUBERNETES_CLUSTER"
```

Repeat readiness and exact active-Agent checks. **`occ dev up` creates/recreates; it is not resume.**

Only to intentionally discard this owned installation, from its matching checkout/environment:

```bash
./bin/occ dev down
```

This deletes cluster, database, credentials, Agent state/workspaces and audit history. Stop/start retains storage; deletion does not. Remove any imported development CA trust. Stop unwanted Agents through their authorized lifecycle API; saving configuration does not update a running revision. Do not delete PVCs to repair normal scheduling or displayed sparse capacity.

## 9. Diagnose bounded failures

| Failure | Check and repair |
| --- | --- |
| Registry unauthorized | Use the source-build baseline; never dump registry auth. |
| Build memory admission | Size the dedicated VM; preserve the upstream heap guard. |
| Unsupported `image save --platform` | Select a compatible Docker CLI; preserve unrelated daemons. |
| Guest/node DNS | Verify resolver reachability in the owned VM; do not copy another machine's DNS or change host VPN/DNS. |
| HTTP password login 403 | Use the printed HTTPS browser origin; preserve CSRF policy. |
| Namespace not Ready | Inspect exact provisioning, worker and platform/RBAC state before creating Agents. |
| Provider startup failure | Verify authorized endpoint/model, private credential, Secret grants and exact configuration; preserve startup checks. |
| History collector failure | Recover original native task read-only; never synthesize tool evidence. |

### Conditional guest user-namespace prerequisite

The historical Ubuntu guest had `kernel.apparmor_restrict_unprivileged_userns=1`, blocking bubblewrap namespace creation even after reviewed seccomp preparation. Diagnose your actual guest first:

```bash
colima --profile "$OCE_PROFILE" ssh -- uname -a
colima --profile "$OCE_PROFILE" ssh -- sysctl \
  kernel.unprivileged_userns_clone kernel.apparmor_restrict_unprivileged_userns
```

Only if that same cause is established, record the original value/file and apply this prerequisite **inside your dedicated disposable VM**, within your environment's policy:

```bash
colima --profile "$OCE_PROFILE" ssh -- sudo sh -c \
  'umask 077; printf "%s\n" "kernel.apparmor_restrict_unprivileged_userns=0" > /etc/sysctl.d/70-oce-local-userns.conf; sysctl -w kernel.apparmor_restrict_unprivileged_userns=0'
```

This changes that VM's AppArmor restriction; it is not a shared-cluster workaround or Mac host setting. Rerun unchanged official startup and require workspace-write, outside-write-denied, effective-profile and missing-profile-fails-closed acceptance. Do not use `Unconfined`, disable native sandboxing or bypass checks. See [upstream sandbox preparation](https://github.com/openclaw/openclaw-enterprise/blob/affac2bfc1370e590e6da570bcaaad4a207c9f09/docs/guides/deploy/codex-sandbox.md).

To restore the observed original value of **1**, pause the owned cluster while the VM remains running, then:

```bash
colima --profile "$OCE_PROFILE" ssh -- sudo sh -c \
  'rm -f /etc/sysctl.d/70-oce-local-userns.conf; sysctl -w kernel.apparmor_restrict_unprivileged_userns=1'
```

If your baseline differs or that file preexisted, restore the actual original value/file instead. Future Codex runs require compatible host prerequisites. Shared/production node changes belong to the cluster operator's reviewed provisioning process.

## Completion boundary

Report the checks actually passed: **platform ready**, **prompt response verified**, or **native tool task verified**. Keep failures and unexercised paths explicit. This starter does not qualify full OpenShell integration, repository/messaging integrations, production OpenShift or other host architectures. Keep this detailed runbook and the concise human guide synchronized when changing any contract.
