---
name: pr-submission-loop
description: Implement and submit a focused pull request, then address review and CI feedback through merge. Use for an end-to-end contribution or continued PR follow-up; schedule future runs only when requested.
---

# PR submission loop

## Establish the task

Read repository instructions and the current PR, if any. Resolve the target repository, fork/base branch, allowed scope, observable acceptance, and existing publication permissions. Preserve unrelated work. For scheduled follow-up, also record cadence, deadline or budget, authorized actions and stop conditions. Reuse approvals already supplied; ask only for missing inputs or authorization before dependent actions.

## Implement and submit

Start from current source in an isolated branch or suitable checkout. Make the smallest change, run relevant repository checks, and review the complete diff. Use independent review when it adds confidence. Keep static checks, runtime proof and historical evidence distinct; never claim unexecuted acceptance.

Publish the authorized fork branch and PR. Explain the problem, resulting behavior, verification and remaining gaps. Read back the published head and diff. Preserve the same PR and published history; follow repository policy when updating from upstream.

If a publication result is uncertain, inspect remote state before retrying to avoid duplicate PRs, commits or replies.

## Repeat on meaningful change

1. Read fresh PR state, head SHA, upstream base, new or edited feedback, unresolved review threads and required checks. Check merge, closure, stop requests and deadline/budget before any mutation; route terminal states to cleanup below. Otherwise compare with the checkpoint.
2. If unchanged, update the checkpoint and end this run. Reuse checks, proof and reviews that remain valid; avoid duplicate delegates, builds, authentication retries and maintainer pings.
3. For actionable feedback, fix within scope, rerun affected checks, and refresh invalidated proof or review. If the base moved, assess compatibility before changing the branch. Publish authorized updates, verify the actual head and reply with evidence in authorized PR threads.
4. If blocked on runtime access, host trust, publication or formal approval, name the specific gate. Continue independent authorized work. Automated review acceptance and green CI do not establish real behavior or formal approval. Use a permitted merge path only when authorized and all repository gates pass; otherwise await a maintainer.

Keep a durable checkpoint: PR URL, scope, branch/checkout, head/base SHAs, checks and proof provenance, processed feedback, remaining gates, permissions, schedule and last check time. Keep credentials and private diagnostics out of public evidence.

## Schedule and finish

Create or update a follow-up only after an explicit request, using available scheduling controls in the same chat. Each run resumes this workflow with the checkpoint; the schedule grants no new permissions. Notify only on meaningful progress, failure, completion or required user action.

After GitHub confirms merge, record the merge commit and remove the follow-up. Also stop and remove it on closure without merge, an explicit stop request, or the agreed deadline/budget. Report an unmerged stop accurately; do not reopen or replace the PR without direction.
