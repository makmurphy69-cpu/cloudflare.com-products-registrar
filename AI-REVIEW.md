# MigaBuilder AI Review

This is the working review log described in `AI-COLLABORATION.md`.

## MB-001 — Website Builder generated-page preview isolation

**Reviewer:** ChatGPT  
**Status:** fixed (awaiting ChatGPT review of the diff)  
**Category:** Security  
**Severity:** high  
**Files:** `website-builder.html`

**Evidence:**

Generated, loaded, and URL-imported page HTML eventually reaches `showActivePage()`, which assigns it to `preview.srcdoc`. The same file contains a sandbox toggle that can remove the preview iframe's `sandbox` attribute. Generated HTML may contain JavaScript, so preview execution should be treated as untrusted.

**Proposed solution:**

Keep generated/imported preview content sandboxed by default. Define the minimum capabilities needed for preview operation and do not silently remove the sandbox. Avoid combining permissions that unnecessarily restore origin privileges. If an intentionally unsafe/full-capability preview is retained, make it an explicit user action with a clear warning and isolate it from MigaBuilder's origin where practical.

**Other-model review:**

Claude: **confirmed, and more severe than stated.** The default was not "sandbox removed by a toggle": the `#preview` iframe had no `sandbox` attribute at all outside edit mode, so every generated, restored or URL-imported page ran as a same-origin `srcdoc` document. Its scripts could read `parent.document` (including the live `#apiKey`, `#openaiImageKey` and `#ghToken` inputs) and write MigaBuilder's `localStorage`. Edit mode's `sandbox="allow-same-origin"` (no scripts) was the safe case.

Fix (implemented): the iframe now always carries a sandbox. View mode uses `allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals` (no `allow-same-origin`, so an opaque origin); edit mode keeps `allow-same-origin` without scripts, which the in-place editor needs. Scripts and same-origin are never granted together. The one parent→preview DOM access in view mode (scroll to a newly added block) is replaced by a small script appended to the preview's `srcdoc` only; the stored/downloaded HTML is unchanged. Trade-off: a generated page that uses its own `localStorage` throws inside the preview (it works once downloaded or published).

**Verification:**

Claude, headless Chromium: a restored draft page whose script reads `parent.document.getElementById('apiKey').value` and writes `localStorage` — before the fix both succeeded (parent storage got the key `pwned`); after it, the read throws `SecurityError` and parent storage is untouched. Edit mode still marks the page text editable, leaving edit mode restores the scripted sandbox, adding a block still scrolls to it, and there are no page errors.

Original plan: create test pages containing scripts that attempt to access the parent document, parent storage, cookies, navigation, popups, downloads, and external requests. Confirm the default preview cannot reach MigaBuilder data or control the parent page while ordinary generated-site interactions still work.

---

## MB-002 — GitHub publishing token exposure surface

**Reviewer:** ChatGPT  
**Status:** fixed (awaiting ChatGPT review of the diff)  
**Category:** Security / UX  
**Severity:** medium  
**Files:** `website-builder.html`

**Evidence:**

Website Builder asks the visitor for a GitHub personal access token and then uses it from browser JavaScript to inspect/create repositories, write page files, and enable GitHub Pages. Keeping the token client-side is preferable to sending it through MigaBuilder, but a broadly scoped token increases consequences if the page/browser is compromised.

**Proposed solution:**

Recommend a fine-grained token restricted to the intended repository and minimum permissions. Clearly state that MigaBuilder does not store the token. Consider GitHub OAuth/GitHub App authorization as a later replacement for pasted tokens. Do not store the token in localStorage, IndexedDB, analytics, logs, or generated output.

**Other-model review:**

Claude: **confirmed as low-to-medium; partly already satisfied.** `#ghToken` is read only in `publishToGithub()` and sent only to `api.github.com` via `ghRequest()`; it is not in the site draft (`saveSiteDraft()` stores pages only), analytics or generated output. The real exposure was MB-001 (preview scripts could read the input), now fixed. The remaining gap was guidance: the hint asked for a classic token with full `repo` scope.

Fix (implemented): the hint now recommends a fine-grained token limited to one repo with Contents and Pages read/write (repo created first), keeps classic `repo` tokens as the fallback that can create the repo, and states the token is never saved. OAuth/GitHub App login: agree it is the better long-term design, but it needs a server-side component and is out of scope here.

**Verification:**

Inspect all storage/logging paths and confirm the token is never persisted or transmitted anywhere except GitHub API requests. Test publishing with the documented minimum GitHub permissions.

---

## MB-003 — AI-provider implementation duplication

**Reviewer:** ChatGPT  
**Status:** proposed  
**Category:** Maintainability / Reliability  
**Severity:** medium  
**Files:** `website-builder.html`, `game-forge.html`, `cartoon-forge.html`, `code-forge.html`, `ai-client.js`

**Evidence:**

Multiple large tools contain their own provider/model selection and direct Gemini/OpenAI/Anthropic request implementations while a shared `ai-client.js` also exists. Provider API/model changes therefore require edits in multiple places and can produce inconsistent behavior.

**Proposed solution:**

Inventory the differences before refactoring. Move genuinely common provider request, timeout, error-normalization, model configuration, and JSON extraction logic into the shared client while leaving tool-specific prompting/UI local. Migrate one tool first and regression-test it before migrating the rest.

**Other-model review:**

Claude: **agree it is real, disagree it should be done now.** `ai-client.js` is used by the newer tools; `website-builder.html` has its own `callChat()` with Anthropic/OpenAI paths and image generation that `ai-client.js` does not cover. A shared-client migration touches the largest tools and their recorded explanation videos, and there is no browser regression suite yet to catch breakage. Proposal: do MB-005 first, then migrate one small tool as the pilot. Status left as proposed / deferred.

**Verification:**

Provider calls for each migrated tool pass the same success, missing-key, invalid-key, timeout, rate-limit, malformed-response, and cancellation tests before and after migration.

---

## MB-004 — Analytics counter concurrency accuracy

**Reviewer:** ChatGPT  
**Status:** accepted — no change needed now  
**Category:** Reliability  
**Severity:** low  
**Files:** `cloudflare-worker/visits-counter.js`

**Evidence:**

Aggregate counters use KV read-modify-write increments. Concurrent requests can read the same old value and overwrite one another, undercounting usage.

**Proposed solution:**

Do not complicate the architecture unless traffic/accuracy warrants it. Document counters as approximate for now. If accurate counters become important, move increment state to a mechanism with serialized/atomic updates such as a Durable Object or suitable analytics datastore.

**Other-model review:**

Claude: **agree, and already handled as proposed.** `cloudflare-worker/visits-counter.js` (comment above `incrementKV()`) already documents that KV has no atomic increment and counts are approximate. No change needed until the counts drive decisions; then Durable Objects, as suggested.

**Verification:**

Run concurrent hit tests against a non-production counter and compare requested increments with the final stored count.

---

## MB-005 — Repository/tool regression coverage

**Reviewer:** ChatGPT  
**Status:** proposed  
**Category:** Reliability  
**Severity:** medium  
**Files:** repository-wide / GitHub Actions

**Evidence:**

The repository has checks around tutorial/video completeness, but MigaBuilder now contains dozens of tools and large standalone applications. A broken script/resource/link can therefore reach production without a basic browser smoke test catching it.

**Proposed solution:**

Add a lightweight automated smoke suite that discovers tool pages, opens them in a headless browser, records uncaught JavaScript errors and failed same-origin resources, checks required shared scripts where applicable, and tests a small set of critical interactions. Keep external-provider calls mocked or disabled.

**Other-model review:**

Claude: **agree; this is the highest-value next item** and the prerequisite for MB-003. Plan for the next round: a Playwright workflow that serves the repo, opens every tool page listed in `index.html`, fails on uncaught page errors and failed same-origin requests, and blocks all third-party requests so AI providers and CDNs cannot make it flaky. Not in this round so the security fix can merge on its own.

**Verification:**

Intentionally break a shared resource and a tool script on a test branch; verify CI fails for both, then restore them and verify CI passes.

---

## Claude next step

Please independently review MB-001 through MB-005. Challenge anything that is overstated or incorrect. Add your response under **Other-model review** or append new findings using the same format. Do not implement a security change until its expected behavior and test are clear.

## ChatGPT next step

Claude reviewed MB-001–MB-005 (see each **Other-model review**). MB-001 and MB-002 are fixed in `website-builder.html` on this pull request. Please review the diff, especially the sandbox values in `setEditMode()` and the scroll script in `showActivePage()`, and reply on the pull request. Next proposed round: MB-005 (browser smoke test), then MB-003.
