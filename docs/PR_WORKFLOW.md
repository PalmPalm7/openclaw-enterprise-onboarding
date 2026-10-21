# Automated PR submission with Codex

Turn a real contribution into a repeatable skill: **scope → implement → verify → submit → review loop → maintainer merge → stop**. Codex handles implementation and follow-up; the contributor supplies direction and approvals, and the repository controls merge authority.

## What happened in PR #1537

[PR #1537](https://github.com/openclaw/openclaw-enterprise/pull/1537) made local console certificate-trust setup explicit. This distills the contributor's Codex chat and the public PR record.

| Contributor action | Codex action and result |
| --- | --- |
| Reported the browser certificate problem and requested an upstream PR through a fork. | Created a focused draft: three documentation files and one launcher message. |
| Requested review fixes, readiness, a local proof page, and certificate-only scope. | Fixed the [copied-CA path](https://github.com/openclaw/openclaw-enterprise/pull/1537#discussion_r4210880451), merged current main normally, and repaired a [documentation word-limit regression](https://github.com/openclaw/openclaw-enterprise/pull/1537#issuecomment-6045318835). |
| Asked for a two-hour loop until merge, then challenged stalled progress and token use. | Switched to compact change checks and a progress ledger; reused unchanged tests and reviews. |
| Approved the exact running CA for SSL trust, handled the OS prompt and browser restart, and requested final proof. | Verified warning-free navigation, password sign-in and authenticated reload. Published sanitized evidence, qualified as recovery of an existing installation. Historical startup evidence separately covered the launcher message. |
| Requested a corresponding issue and authorized a maintainer follow-up. | Linked issue #1735 and updated the [evidence and follow-up](https://github.com/openclaw/openclaw-enterprise/pull/1537#issuecomment-6059534539). |
| Left formal approval and merge to the maintainer. | Confirmed the merge and deleted the scheduled follow-up. |

The maintainer [approved](https://github.com/openclaw/openclaw-enterprise/pull/1537#pullrequestreview-5463239958) and merged on **October 9, 2026 at 05:49 Shanghai time** (October 8 at 21:49 UTC), merge commit `ddc5c804`. Green CI, automated review acceptance, demonstrated browser behavior, formal approval and merge were separate gates.

## Use the skill

Copy the [pr-submission-loop skill](../.agents/skills/pr-submission-loop/SKILL.md) folder into `.agents/skills/` in the target repository. Keep its `SKILL.md` name and frontmatter. Codex discovers repository skills there; see [official skill documentation](https://learn.chatgpt.com/docs/build-skills).

Start in the target repository with a concrete request:

```text
Use $pr-submission-loop to fix <problem> in <repository>.
Scope: <allowed changes>. Acceptance: <observable result>.
Publish a fork PR and address feedback in that PR's threads.
Keep a checkpoint with the head SHA, checks, proof and remaining gates.
Schedule a follow-up every two hours until merged; stay quiet if unchanged.
Reuse completed verification unless changes invalidate it.
Preserve existing approvals; ask only for missing authorization or inputs.
Leave merge to the maintainer. Stop and remove the follow-up after merge,
closure without merge, my stop request, or the agreed deadline/budget.
```

## Create the loop

1. **Write the skill.** Capture inputs, acceptance, the review cycle and stop conditions in `SKILL.md`; keep project-specific commands in the repository's instructions.
2. **Run the first contribution.** Inspect current source, implement the smallest change, validate it, review the diff, then publish the fork PR with evidence and remaining gaps.
3. **Schedule continuation.** After an explicit scheduling request, use Codex's scheduling control to continue the same chat. A skill stores instructions; the schedule supplies future runs. Record the PR, cadence, deadline or budget, authorized actions and cleanup rule.
4. **Check changes first.** Each run reads the current head, new or edited feedback, unresolved threads, required checks and merge state. No change means a checkpoint and the end of that run. New feedback means a focused fix, relevant verification, publication and readback.
5. **Close the loop.** Confirm GitHub reports a merge and its commit, then remove the schedule. If only approval is missing, report that gate when it changes; avoid repeated reviews, builds or pings.

Maintain this guide and its skill together. The Google Docs copy mirrors this published version; update it when the canonical Markdown changes.
