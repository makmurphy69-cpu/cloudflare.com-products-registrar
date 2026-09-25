# MigaBuilder AI Collaboration Protocol

This file is the shared handoff point for Claude and ChatGPT when reviewing MigaBuilder.

## Goal

Use independent reviews to improve the code without letting one model merely reinforce the other model's assumptions.

## Rules

1. Inspect the current repository code before proposing a change.
2. Separate findings into: Critical bug, Security, Privacy, Reliability, Performance, Maintainability, UX.
3. For every finding include:
   - affected file/function
   - concrete evidence
   - realistic impact
   - proposed fix
   - test that would prove the fix works
4. Do not change unrelated behavior while fixing a finding.
5. Do not weaken MigaBuilder's privacy model.
6. Never put API keys, tokens, passwords, customer data, or secrets in this file, issues, commits, or prompts.
7. Prefer small reviewable commits.
8. If Claude and ChatGPT disagree, record both positions and resolve the disagreement with code/tests rather than model confidence.
9. Before merging: run existing checks and add a regression test when practical.
10. Human approval remains the final merge decision.

## Handoff format

### Finding ID
**Reviewer:** Claude / ChatGPT  
**Status:** proposed / challenged / accepted / fixed / verified  
**Category:**  
**Severity:** critical / high / medium / low  
**Files:**  

**Evidence:**  
...

**Proposed solution:**  
...

**Other-model review:**  
...

**Verification:**  
...

## When this runs: only when the owner asks

Nothing here runs on a schedule or automatically. A round starts only when the repo owner tells one of us in chat something like "ChatGPT left you a message, check it and implement it if you agree".

When asked, the model:

1. Pulls the latest `main` and reads `AI-REVIEW.md` for findings or replies addressed to it (its **next step** section, and any finding with status `proposed` or `challenged` that it has not answered yet). It also reads new comments on open pull requests.
2. Checks each point against the actual code and records agree, disagree or a better alternative under **Other-model review**.
3. Implements what it agrees with, runs the checks, and opens a pull request with the fix and the updated `AI-REVIEW.md`.
4. Merges it when the checks pass, unless it is large or security-sensitive and the other model has not reviewed it yet. In that case it leaves the pull request open for the other model's review.
5. Writes a short **next step** section addressed to the other model, and tells the owner in plain language what it did and what it is handing back.

## Workflow

1. Claude or ChatGPT adds a finding to `AI-REVIEW.md`.
2. The other model independently inspects the cited code.
3. The second model records agreement, disagreement, or a better alternative.
4. Implement only after the solution is concrete enough to test.
5. The other model reviews the diff.
6. Run tests/checks.
7. Mark the finding verified only when evidence supports it.

## Prompt for Claude

> Read `AI-COLLABORATION.md` and `AI-REVIEW.md` first. Independently inspect the cited source code. Do not automatically agree with ChatGPT. For each open finding, record whether you confirm it, challenge it, or propose a safer/simpler solution. Include exact files/functions and a verification method. Do not expose secrets or broaden the change beyond the finding.

## Prompt for ChatGPT

> Read `AI-COLLABORATION.md` and `AI-REVIEW.md` first. Independently inspect Claude's latest findings or changes. Verify claims against current repository code. Record disagreements and testable alternatives. Prefer the smallest safe fix and verify the resulting diff before recommending merge.
