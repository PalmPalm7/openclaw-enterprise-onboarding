# Documentation contributor instructions

This repository publishes public onboarding for OpenClaw Enterprise. It contains documentation and a static site; it does not deploy infrastructure as part of documentation builds.

## Keep two versions

- `docs/GETTING_STARTED.md` is the concise human guide: next action first, five onboarding steps, commands linked to the runbook, explicit expected results.
- `docs/GETTING_STARTED_AGENTS.md` is the detailed operator/agent runbook: exact inputs, source pins, private credential handling, acceptance, failure diagnosis and lifecycle.
- Update both when prerequisites, commands, models or capability boundaries change. Markdown is the authored source; keep any generated site synchronized through its build.

## Preserve evidence boundaries

Distinguish historical local verification, source-reviewed recipe and fresh reproduction. A login, Ready platform, successful resource creation or model's claimed tool action does not establish genuine Agent task acceptance. Do not label this development profile production-ready or claim full OpenShell integration.

Use pinned public upstream source links for baseline contracts. Keep upstream source checkout instructions separate from instructions for editing this onboarding repository. Read upstream `AGENTS.md` before modifying that product.

## Publish only public-safe material

Do not add internal meeting notes, Slack links, private research, account identities, internal hostnames, real Agent IDs, kubeconfigs, keys, passwords, raw installation state, Pod environments or sensitive diagnostic receipts. Generic examples must use placeholders and owned resource names.

Credential inputs belong in private protected files or approved runtime injection, then platform Secrets. Never put secrets in Git, command arguments, logs, static site assets or agent prompts. Do not copy private repository history or ignored operator scripts into this repository.

## Check documentation changes

Use the repository's documented site build and link checks; inspect the rendered human and agent views. Do not add tests that only restate prose or run model inference/deploy infrastructure merely to verify a static presentation change. Record when a fresh deployment was not exercised.

Before publication, review the complete staged diff and built site for private material, broken paths, misleading provider compatibility, unsafe lifecycle commands and drift between the guide versions.
