/**
 * MigaBuilder's visit counter.
 *
 * A privacy-friendly, cookie-free page-view and visitor counter. Pages send
 * a tiny fire-and-forget beacon here on load; this Worker tallies it in KV
 * and exposes a /stats endpoint the visits.html dashboard reads.
 *
 * "Unique visitors" are approximated without cookies or fingerprinting: each
 * hit hashes the visitor's IP together with the current day (and a fixed
 * salt) via SHA-256, and only counts a visitor once per day per that hash.
 * The raw IP is never stored — only the opaque hash, and only for ~25 hours
 * (just long enough to dedupe same-day repeat visits), after which it
 * expires from KV on its own.
 *
 * Deploy steps are in cloudflare-worker/README.md.
 */

const ALLOWED_ORIGINS = [
  'https://migabuilder.com',
  'https://www.migabuilder.com'
];

// A fixed (non-secret) salt is enough here — the goal is just to avoid
// storing raw IPs, not to defeat a determined attacker with rainbow tables.
const HASH_SALT = 'migabuilder-visits-v1';

const DAY_TTL_SECONDS = 60 * 60 * 26; // a little over a day, to safely cover the full UTC day plus clock skew
const MAX_PAGE_NAME_LENGTH = 80;
const RECENT_DAYS = 14;

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

function todayKey(date) {
  return (date || new Date()).toISOString().slice(0, 10); // YYYY-MM-DD, UTC
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function sanitizePageName(raw) {
  const name = (typeof raw === 'string' ? raw : '').trim() || 'unknown';
  return name.slice(0, MAX_PAGE_NAME_LENGTH).replace(/[^a-zA-Z0-9._/-]/g, '_');
}

// KV has no atomic increment, so a read-modify-write can occasionally lose a
// concurrent write under heavy simultaneous traffic. That's an acceptable
// trade-off for an approximate visit counter (not a billing meter).
async function incrementKV(kv, key, by) {
  const current = parseInt((await kv.get(key)) || '0', 10) || 0;
  const next = current + (by || 1);
  await kv.put(key, String(next));
  return next;
}

async function handleHit(request, env, origin) {
  let payload;
  try {
    payload = await request.json();
  } catch (e) {
    payload = {};
  }
  const page = sanitizePageName(payload && payload.page);
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const day = todayKey();

  await incrementKV(env.VISITS_KV, 'views:total', 1);
  await incrementKV(env.VISITS_KV, 'views:day:' + day, 1);
  await incrementKV(env.VISITS_KV, 'views:page:' + page, 1);

  const visitorHash = await sha256Hex(HASH_SALT + '|' + day + '|' + ip);
  const seenKey = 'seen:' + day + ':' + visitorHash;
  const alreadySeen = await env.VISITS_KV.get(seenKey);
  if (!alreadySeen) {
    await env.VISITS_KV.put(seenKey, '1', { expirationTtl: DAY_TTL_SECONDS });
    await incrementKV(env.VISITS_KV, 'uniques:total', 1);
    await incrementKV(env.VISITS_KV, 'uniques:day:' + day, 1);
  }

  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

function recentDayStrings(count) {
  const days = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    days.push(todayKey(d));
  }
  return days;
}

async function handleStats(request, env, origin) {
  const url = new URL(request.url);
  if (env.STATS_KEY && url.searchParams.get('key') !== env.STATS_KEY) {
    return json({ error: 'Missing or incorrect key.' }, 403, origin);
  }

  const kv = env.VISITS_KV;
  const days = recentDayStrings(RECENT_DAYS);

  const [totalViewsRaw, totalUniquesRaw, ...dayCounts] = await Promise.all([
    kv.get('views:total'),
    kv.get('uniques:total'),
    ...days.map(d => kv.get('views:day:' + d)),
    ...days.map(d => kv.get('uniques:day:' + d))
  ]);
  const viewsByDay = days.map((d, i) => ({ day: d, views: parseInt(dayCounts[i] || '0', 10) || 0 }));
  const uniquesByDay = days.map((d, i) => ({ day: d, visitors: parseInt(dayCounts[days.length + i] || '0', 10) || 0 }));

  const pageList = await kv.list({ prefix: 'views:page:' });
  const pageEntries = await Promise.all(
    pageList.keys.map(async (k) => ({ page: k.name.slice('views:page:'.length), views: parseInt((await kv.get(k.name)) || '0', 10) || 0 }))
  );
  pageEntries.sort((a, b) => b.views - a.views);

  return json({
    totalViews: parseInt(totalViewsRaw || '0', 10) || 0,
    totalUniqueVisitors: parseInt(totalUniquesRaw || '0', 10) || 0,
    viewsByDay,
    uniquesByDay,
    topPages: pageEntries
  }, 200, origin);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }
    if (!env.VISITS_KV) {
      return json({ error: 'Worker is missing the VISITS_KV binding.' }, 500, origin);
    }

    if (url.pathname === '/hit' && request.method === 'POST') {
      if (!ALLOWED_ORIGINS.includes(origin)) return json({ error: 'Origin not allowed' }, 403, origin);
      return handleHit(request, env, origin);
    }
    if (url.pathname === '/stats' && request.method === 'GET') {
      return handleStats(request, env, origin);
    }
    return json({ error: 'Not found' }, 404, origin);
  }
};
