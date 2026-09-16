/**
 * Signaling relay for Screen Share Forge (screen-forge.html).
 *
 * WebRTC needs the two browsers to exchange a one-time "offer" and "answer"
 * (SDP blobs) before they can connect directly to each other. Browsers on
 * different networks have no way to find each other on their own, so this
 * tiny Worker holds a mailbox for each session code: the helper drops off an
 * offer, the client picks it up and drops off an answer, the helper picks
 * that up, and from then on video/audio/chat all flow directly between the
 * two browsers, peer-to-peer — this Worker never sees any of it again.
 *
 * Deploy steps are in cloudflare-worker/README.md. Needs a KV namespace
 * binding named SIGNAL_KV.
 */

const TTL_SECONDS = 600; // a code and its offer/answer expire after 10 minutes

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: Object.assign({ 'Content-Type': 'application/json' }, CORS_HEADERS)
  });
}

function isValidCode(code) {
  return typeof code === 'string' && /^[A-Za-z0-9]{4,16}$/.test(code);
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });

    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean); // [code, "offer"|"answer"]
    const code = parts[0];
    const kind = parts[1];

    if (!isValidCode(code) || (kind !== 'offer' && kind !== 'answer')) {
      return json({ error: 'Not found' }, 404);
    }
    if (!env.SIGNAL_KV) {
      return json({ error: 'Worker is missing the SIGNAL_KV binding.' }, 500);
    }
    const key = kind + ':' + code;

    if (request.method === 'PUT') {
      let body;
      try { body = await request.json(); } catch (e) { return json({ error: 'Invalid JSON body' }, 400); }
      if (!body || typeof body.sdp !== 'string' || typeof body.type !== 'string') {
        return json({ error: 'Body must include sdp and type' }, 400);
      }
      await env.SIGNAL_KV.put(key, JSON.stringify({ sdp: body.sdp, type: body.type }), { expirationTtl: TTL_SECONDS });
      return json({ ok: true });
    }

    if (request.method === 'GET') {
      const stored = await env.SIGNAL_KV.get(key);
      if (!stored) return json({ error: 'Not ready yet' }, 404);
      return json(JSON.parse(stored));
    }

    if (request.method === 'DELETE') {
      await env.SIGNAL_KV.delete('offer:' + code);
      await env.SIGNAL_KV.delete('answer:' + code);
      return json({ ok: true });
    }

    return json({ error: 'Method not allowed' }, 405);
  }
};
