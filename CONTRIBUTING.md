# Contribute to the onboarding guide

**Edit the human guide and its agent runbook together.** Keep the reader's next action obvious.

## Make a change

1. Fork this repository and create a focused branch.
2. Update the Markdown source and any affected navigation.
3. Build the site with the commands documented in [README.md](README.md), then check links and inspect both rendered guide versions.
4. Review the complete diff and generated assets for private information.
5. Open a pull request with the problem, resulting instructions and exact verification performed.

Small prose or presentation changes need documentation checks, not a new deployment. Changes to deployment commands or configuration need source review against the selected upstream revision; explicitly record whether they were reproduced with a real runtime.

## Report a reproduction

Include source SHA, non-sensitive tool/kernel versions, architecture, allocated resources, selected model/protocol and each completed acceptance check. State remaining gaps. Keep credentials, internal endpoints, account identities and detailed runtime receipts private; redact screenshots before upload.

Basic onboarding succeeds when platform readiness, HTTPS sign-in, the exact Agent revision's deployment and a real verified model reply pass. Native tool traces and matching file bytes are additional acceptance when claiming tool support; they are optional for the prompt-only starter. If only the platform is ready, report **“platform ready; Agent/model proof pending.”**

## Upstream product changes

This companion repository does not own OCE's architecture or implementation. Send product fixes to [openclaw/openclaw-enterprise](https://github.com/openclaw/openclaw-enterprise) using its contribution policy. Link the relevant public source revision when updating this guide; do not silently replace a tested pin with `main` or `latest`.
