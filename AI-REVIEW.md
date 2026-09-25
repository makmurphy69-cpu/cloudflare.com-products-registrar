# MigaBuilder AI Review

This is the working review log described in `AI-COLLABORATION.md`.

## MB-001 — Website Builder generated-page preview isolation

**Reviewer:** ChatGPT  
**Status:** proposed  
**Category:** Security  
**Severity:** high  
**Files:** `website-builder.html`

**Evidence:**

Generated, loaded, and URL-imported page HTML eventually reaches `showActivePage()`, which assigns it to `preview.srcdoc`. The same file contains a sandbox toggle that can remove the preview iframe's `sandbox` attribute. Generated HTML may contain JavaScript, so preview execution should be treated as untrusted.

**Proposed solution:**

Keep generated/imported preview content sandboxed by default. Define the minimum capabilities needed for preview operation and do not silently remove the sandbox. Avoid combining permissions that unnecessarily restore origin privileges. If an intentionally unsafe/full-capability preview is retained, make it an explicit user action with a clear warning and isolate it from MigaBuilder's origin where practical.

**Other-model review:**

Claude: pending.

**Verification:**

Create test pages containing scripts that attempt to access the parent document, parent storage, cookies, navigation, popups, downloads, and external requests. Confirm the default preview cannot reach MigaBuilder data or control the parent page while ordinary generated-site interactions still work.

---

## MB-002 — GitHub publishing token exposure surface

**Reviewer:** ChatGPT  
**Status:** proposed  
**Category:** Security / UX  
**Severity:** medium  
**Files:** `website-builder.html`

**Evidence:**

Website Builder asks the visitor for a GitHub personal access token and then uses it from browser JavaScript to inspect/create repositories, write page files, and enable GitHub Pages. Keeping the token client-side is preferable to sending it through MigaBuilder, but a broadly scoped token increases consequences if the page/browser is compromised.

**Proposed solution:**

Recommend a fine-grained token restricted to the intended repository and minimum permissions. Clearly state that MigaBuilder does not store the token. Consider GitHub OAuth/GitHub App authorization as a later replacement for pasted tokens. Do not store the token in localStorage, IndexedDB, analytics, logs, or generated output.

**Other-model review:**

Claude: pending.

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

Claude: pending.

**Verification:**

Provider calls for each migrated tool pass the same success, missing-key, invalid-key, timeout, rate-limit, malformed-response, and cancellation tests before and after migration.

---

## MB-004 — Analytics counter concurrency accuracy

**Reviewer:** ChatGPT  
**Status:** proposed  
**Category:** Reliability  
**Severity:** low  
**Files:** `cloudflare-worker/visits-counter.js`

**Evidence:**

Aggregate counters use KV read-modify-write increments. Concurrent requests can read the same old value and overwrite one another, undercounting usage.

**Proposed solution:**

Do not complicate the architecture unless traffic/accuracy warrants it. Document counters as approximate for now. If accurate counters become important, move increment state to a mechanism with serialized/atomic updates such as a Durable Object or suitable analytics datastore.

**Other-model review:**

Claude: pending.

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

Claude: pending.

**Verification:**

Intentionally break a shared resource and a tool script on a test branch; verify CI fails for both, then restore them and verify CI passes.

---

## Claude next step

Please independently review MB-001 through MB-005. Challenge anything that is overstated or incorrect. Add your response under **Other-model review** or append new findings using the same format. Do not implement a security change until its expected behavior and test are clear.
