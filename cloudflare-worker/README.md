# Gemini proxy — deploy steps

This Worker holds your real Gemini API key so it never ships to visitors'
browsers. Do this once, from any browser (a Chromebook is fine — no
installs needed).

1. Go to https://dash.cloudflare.com and sign in (or create a free account).
2. In the sidebar, go to **Workers & Pages** → **Create** → **Create Worker**.
3. Give it a name (e.g. `migabuilder-gemini`) and click **Deploy** to create
   the placeholder Worker.
4. Click **Edit code**. Delete the sample code and paste in the contents of
   `gemini-proxy.js` from this folder. Click **Deploy**.
5. Go to the Worker's **Settings → Variables and Secrets**. Add a secret:
   - Name: `GEMINI_API_KEY`
   - Value: your real key from https://aistudio.google.com/apikey
   - Click **Encrypt/Save**.
6. Copy the Worker's URL (shown at the top of its page, looks like
   `https://migabuilder-gemini.<your-subdomain>.workers.dev`).
7. Paste that URL into `index.html` as the value of `GEMINI_PROXY_URL`
   (near the top of the `<script>` block — currently a placeholder).
8. Commit and push. Visitors now get the free Gemini tier without your key
   ever appearing in the page source.

If you ever need to rotate the key: generate a new one at
aistudio.google.com/apikey, update the Worker secret in step 5, and delete
the old key from Google AI Studio. No code changes needed.

## Getting more free-tier headroom (multiple keys)

Free-tier Gemini keys have a fairly low requests-per-minute cap. If the free
tier is hitting that limit under real traffic, you can pool several keys
(e.g. from separate Google accounts) instead of just one:

- In step 5 above, set the `GEMINI_API_KEY` secret's value to a
  **comma-separated list**, e.g. `key-one,key-two,key-three`.
- The Worker picks a random key per request and automatically retries the
  next one if the first comes back rate-limited — so a request only fails
  once *every* key is exhausted at the same moment. Three keys roughly
  triples your effective throughput.
- This is fully backward-compatible: a single key with no commas behaves
  exactly as before, no other changes needed.

# Screen share signaling relay — deploy steps

Screen Share Forge (`screen-forge.html`) lets one person watch another
person's screen live to help them, without either of them installing
anything. The video itself travels directly between the two browsers
(peer-to-peer, via WebRTC) — this Worker's only job is to briefly relay the
one-time "connection handshake" (an offer and an answer) between them, since
two browsers on different networks otherwise have no way to find each
other. It never sees the video, audio, or chat.

1. Go to https://dash.cloudflare.com and sign in (or create a free account).
2. In the sidebar, go to **Workers & Pages** → **Create** → **Create Worker**.
3. Give it a name (e.g. `migabuilder-screenshare`) and click **Deploy** to
   create the placeholder Worker.
4. Click **Edit code**. Delete the sample code and paste in the contents of
   `screenshare-signal.js` from this folder. Click **Deploy**.
5. Go to the Worker's **Settings → Bindings** → **Add binding** →
   **KV Namespace**. Create a new namespace (e.g. `SIGNAL_KV`) and bind it
   to the variable name `SIGNAL_KV`. Save.
6. Copy the Worker's URL (shown at the top of its page, looks like
   `https://migabuilder-screenshare.<your-subdomain>.workers.dev`).
7. Paste that URL into `screen-forge.html` as the value of `SIGNAL_URL`
   (near the top of the `<script>` block — currently a placeholder).
8. Commit and push.

This all runs on Cloudflare's free plan — each session only needs two tiny
writes (the offer and the answer), well within the free tier's daily KV
write limit. Codes expire after 10 minutes whether or not anyone connects.

Note: peer-to-peer connections can fail to establish directly on some
restrictive corporate or public Wi-Fi networks (this needs a TURN relay
server to work around, which isn't included here). If a connection seems
stuck, try a different network on one side.
