#!/usr/bin/env node
// Run once on your own computer to get YOUTUBE_REFRESH_TOKEN:
//   YOUTUBE_CLIENT_ID=... YOUTUBE_CLIENT_SECRET=... node youtube-mcp/get-refresh-token.mjs
// Uses a "Desktop app" OAuth client and asks only for upload permission.
// Never commit the printed token: this repo is the public website.

import http from 'node:http';

const id = process.env.YOUTUBE_CLIENT_ID;
const secret = process.env.YOUTUBE_CLIENT_SECRET;
if (!id || !secret) {
  console.error('Set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET first.');
  process.exit(1);
}

const server = http.createServer(async function (req, res) {
  const url = new URL(req.url, 'http://127.0.0.1');
  const code = url.searchParams.get('code');
  if (!code) { res.end('Waiting for Google sign-in…'); return; }
  const redirect = 'http://127.0.0.1:' + server.address().port;
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code: code, client_id: id, client_secret: secret, redirect_uri: redirect, grant_type: 'authorization_code' })
  });
  const data = await resp.json();
  if (data.refresh_token) {
    res.end('Done. Go back to the terminal and copy the refresh token.');
    console.log('\nYOUTUBE_REFRESH_TOKEN=' + data.refresh_token + '\n');
  } else {
    res.end('Sign-in failed. See the terminal.');
    console.error(data);
  }
  server.close();
});

server.listen(0, '127.0.0.1', function () {
  const redirect = 'http://127.0.0.1:' + server.address().port;
  const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  auth.search = new URLSearchParams({
    client_id: id,
    redirect_uri: redirect,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/youtube.upload',
    access_type: 'offline',
    prompt: 'consent'
  });
  console.log('Open this link, sign in with the Google account that owns your channel, and allow access:\n\n' + auth + '\n');
});
