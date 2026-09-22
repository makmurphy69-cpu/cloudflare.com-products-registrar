#!/usr/bin/env node
// MigaBuilder YouTube uploader: a zero-dependency MCP server (stdio).
// Credentials come only from environment variables, never from files in
// this repo, because the repo is published as the public website:
//   YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN
// Get the refresh token once with get-refresh-token.mjs on your own computer.

import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROMO_PACK = path.join(HERE, '..', 'youtube', 'promo-videos.json');

const TOOLS = [
  {
    name: 'list_promo_tools',
    description: 'List every MigaBuilder tool that has a ready-made YouTube title, description and tags in the promo pack.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'upload_tool_promo',
    description: 'Upload a promo video for one MigaBuilder tool, filling in the title, description (with the link to the tool page) and tags from the promo pack.',
    inputSchema: {
      type: 'object',
      properties: {
        tool: { type: 'string', description: 'Tool name or page, e.g. "Clip Forge" or "clip-forge.html".' },
        file: { type: 'string', description: 'Video to upload: a path in the repo/session, or an https:// URL.' },
        privacyStatus: { type: 'string', enum: ['public', 'unlisted', 'private'], description: 'Defaults to the pack value (public).' }
      },
      required: ['tool', 'file']
    }
  },
  {
    name: 'upload_youtube_video',
    description: 'Upload any video to the connected YouTube channel with a custom title and description.',
    inputSchema: {
      type: 'object',
      properties: {
        file: { type: 'string', description: 'A path in the repo/session, or an https:// URL.' },
        title: { type: 'string' },
        description: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        privacyStatus: { type: 'string', enum: ['public', 'unlisted', 'private'], default: 'private' },
        categoryId: { type: 'string', default: '28', description: '28 = Science & Technology.' }
      },
      required: ['file', 'title']
    }
  }
];

async function loadPack() {
  return JSON.parse(await fs.readFile(PROMO_PACK, 'utf8'));
}

function findPromo(pack, tool) {
  const q = tool.trim().toLowerCase().replace(/\.html$/, '');
  return pack.find(function (p) {
    const page = p.page.split('/').pop().replace(/\.html$/, '');
    return p.tool.toLowerCase() === q || page === q;
  });
}

async function accessToken() {
  const { YOUTUBE_CLIENT_ID: id, YOUTUBE_CLIENT_SECRET: secret, YOUTUBE_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) {
    throw new Error('YouTube is not connected: set YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET and YOUTUBE_REFRESH_TOKEN in the environment settings.');
  }
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: id, client_secret: secret, refresh_token: refresh, grant_type: 'refresh_token' })
  });
  const data = await resp.json().catch(function () { return {}; });
  if (!resp.ok) throw new Error('Google sign-in failed: ' + (data.error_description || data.error || resp.status));
  return data.access_token;
}

async function readVideo(file) {
  if (/^https:\/\//i.test(file)) {
    const resp = await fetch(file);
    if (!resp.ok) throw new Error('Could not download ' + file + ' (' + resp.status + ')');
    return { bytes: Buffer.from(await resp.arrayBuffer()), type: resp.headers.get('content-type') || 'video/*' };
  }
  const full = path.resolve(process.cwd(), file);
  const ext = path.extname(full).toLowerCase();
  const type = { '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime' }[ext] || 'video/*';
  return { bytes: await fs.readFile(full), type: type };
}

async function upload({ file, title, description, tags, privacyStatus, categoryId }) {
  const video = await readVideo(file);
  const token = await accessToken();
  const init = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': video.type,
      'X-Upload-Content-Length': String(video.bytes.length)
    },
    body: JSON.stringify({
      snippet: { title: title.slice(0, 100), description: description || '', tags: tags || [], categoryId: categoryId || '28' },
      status: { privacyStatus: privacyStatus || 'private' }
    })
  });
  if (!init.ok) {
    const err = await init.json().catch(function () { return null; });
    throw new Error('YouTube refused the upload: ' + ((err && err.error && err.error.message) || init.status));
  }
  const put = await fetch(init.headers.get('Location'), {
    method: 'PUT',
    headers: { 'Content-Type': video.type },
    body: video.bytes
  });
  const data = await put.json().catch(function () { return {}; });
  if (!put.ok) throw new Error('Upload failed: ' + ((data.error && data.error.message) || put.status));
  const status = data.status && data.status.privacyStatus;
  let note = 'Uploaded "' + data.snippet.title + '": https://youtu.be/' + data.id + ' (' + status + ').';
  if (privacyStatus === 'public' && status !== 'public') {
    note += ' YouTube kept it ' + status + ': uploads from API projects that have not passed the YouTube API audit stay private. Make it public in YouTube Studio.';
  }
  return note;
}

async function callTool(name, args) {
  if (name === 'list_promo_tools') {
    const pack = await loadPack();
    return pack.map(function (p) { return p.tool + ' — ' + p.page; }).join('\n');
  }
  if (name === 'upload_tool_promo') {
    const pack = await loadPack();
    const promo = findPromo(pack, args.tool || '');
    if (!promo) throw new Error('No promo text for "' + args.tool + '". Use list_promo_tools to see the names.');
    return upload({
      file: args.file,
      title: promo.title,
      description: promo.description,
      tags: promo.tags,
      categoryId: promo.categoryId,
      privacyStatus: args.privacyStatus || promo.privacyStatus
    });
  }
  if (name === 'upload_youtube_video') return upload(args);
  throw new Error('Unknown tool: ' + name);
}

function send(msg) {
  process.stdout.write(JSON.stringify(Object.assign({ jsonrpc: '2.0' }, msg)) + '\n');
}

async function handle(msg) {
  const { id, method, params } = msg;
  if (id === undefined) return; // notifications need no reply
  try {
    if (method === 'initialize') {
      send({ id, result: {
        protocolVersion: (params && params.protocolVersion) || '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'migabuilder-youtube', version: '1.0.0' }
      } });
    } else if (method === 'ping') {
      send({ id, result: {} });
    } else if (method === 'tools/list') {
      send({ id, result: { tools: TOOLS } });
    } else if (method === 'tools/call') {
      try {
        const text = await callTool(params.name, params.arguments || {});
        send({ id, result: { content: [{ type: 'text', text: text }] } });
      } catch (err) {
        send({ id, result: { content: [{ type: 'text', text: err.message }], isError: true } });
      }
    } else {
      send({ id, error: { code: -32601, message: 'Method not found: ' + method } });
    }
  } catch (err) {
    send({ id, error: { code: -32603, message: err.message } });
  }
}

readline.createInterface({ input: process.stdin }).on('line', function (line) {
  if (!line.trim()) return;
  let msg;
  try { msg = JSON.parse(line); } catch (e) { return; }
  handle(msg);
});
