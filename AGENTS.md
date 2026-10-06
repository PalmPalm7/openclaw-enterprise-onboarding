# Documentation contributor instructions

This repository publishes public onboarding for OpenClaw Enterprise. It contains documentation and a static site; it does not deploy infrastructure as part of documentation builds.

## When asked to set up OCE

Read `setup.md`, then `docs/GETTING_STARTED_AGENTS.md`, and carry out only the operator's requested local installation. `scripts/check-setup.sh` is a read-only first preflight. Documentation edits/site builds do not initiate deployment. Preserve local instructions, owned-resource isolation, explicit model/budget and private credentials. `llms.txt` is discovery; `llms-full.txt` is generated from the brief and runbook. `CLAUDE.md` imports this file rather than duplicating it.

Inventory existing VM/engine setups before runtime selection. Reuse the operator's selected approved environment; if that selection is missing, ask after inspection rather than inferring Docker/Colima from test history. Colima/Docker is an optional tested example, not a preferred runtime. Do not create a VM or switch an existing machine's mode without the operator's selection/authorization. Preserve a runtime choice already supplied in the session.

## Keep two versions

- `docs/GETTING_STARTED.md` is the concise human guide: next action first, five onboarding steps, commands linked to the runbook, explicit expected results.
- `docs/GETTING_STARTED_AGENTS.md` is the detailed operator/agent runbook: exact inputs, current source selection, private credential handling, acceptance, failure diagnosis and lifecycle.
- Update both when prerequisites, commands, models or capability boundaries change. Markdown is the authored source; keep any generated site synchronized through its build.
- Keep execution/discovery links synchronized. Graphs are self-contained SVGs in `docs/assets/`; do not add remote scripts/fonts or executable SVG content.

## Preserve evidence boundaries

Distinguish historical local verification, source-reviewed recipe and fresh reproduction. A login, Ready platform, successful resource creation or model's claimed tool action does not establish genuine Agent task acceptance. Do not label this development profile production-ready or claim full OpenShell integration.

Use current upstream `main` for new exploration and record its resolved SHA per installation. Pinned public source links document the reviewed contract and historical evidence; they do not require a stale checkout. Recheck manifests and changed commands when `main` advances. Keep upstream source checkout instructions separate from instructions for editing this onboarding repository. Read upstream `AGENTS.md` before modifying that product.

## Publish only public-safe material

Do not add internal meeting notes, Slack links, private research, account identities, internal hostnames, real Agent IDs, kubeconfigs, keys, passwords, raw installation state, Pod environments or sensitive diagnostic receipts. Generic examples must use placeholders and owned resource names.

Credential inputs belong in private protected files or approved runtime injection, then platform Secrets. Never put secrets in Git, command arguments, logs, static site assets or agent prompts. Do not copy private repository history or ignored operator scripts into this repository.

## Check documentation changes

Use the repository's documented site build and link checks; inspect the rendered human and agent views. Do not add tests that only restate prose or run model inference/deploy infrastructure merely to verify a static presentation change. Record when a fresh deployment was not exercised.

Before publication, review the complete staged diff and built site for private material, broken paths, misleading provider compatibility, unsafe lifecycle commands and drift between the guide versions.
