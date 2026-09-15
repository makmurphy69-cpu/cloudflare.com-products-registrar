/**
 * MigaBuilder's Gemini proxy.
 *
 * Holds the real Gemini API key as a Worker secret (env.GEMINI_API_KEY) so it
 * never reaches the browser. The site's free tier calls this Worker instead
 * of generativelanguage.googleapis.com directly.
 *
 * Deploy steps are in cloudflare-worker/README.md.
 */

const ALLOWED_ORIGINS = [
  'https://migabuilder.com',
  'https://www.migabuilder.com'
];

const ALLOWED_MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-3.5-flash'
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status: status,
    headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders(origin))
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, origin);
    }
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return json({ error: 'Origin not allowed' }, 403, origin);
    }
    if (!env.GEMINI_API_KEY) {
      return json({ error: 'Worker is missing the GEMINI_API_KEY secret.' }, 500, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch (e) {
      return json({ error: 'Invalid JSON body' }, 400, origin);
    }

    const model = payload && payload.model;
    const systemPrompt = (payload && payload.systemPrompt) || '';
    const userPrompt = payload && payload.userPrompt;

    if (!ALLOWED_MODELS.includes(model)) {
      return json({ error: 'Unsupported or missing model' }, 400, origin);
    }
    if (typeof userPrompt !== 'string' || !userPrompt.trim()) {
      return json({ error: 'Missing userPrompt' }, 400, origin);
    }

    const upstream = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: userPrompt }] }]
        })
      }
    );

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders(origin))
    });
  }
};
