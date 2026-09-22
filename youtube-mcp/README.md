# YouTube uploader for Claude Code

A small MCP server that lets Claude Code upload videos to the MigaBuilder YouTube
channel. The repo's `.mcp.json` loads it automatically in every Claude Code session,
including cloud sessions started from the phone app. It has no npm dependencies.

It adds three tools:

- `list_promo_tools` lists the tools that have promo text in `youtube/promo-videos.json`
- `upload_tool_promo` uploads a video for one tool, with the title, description (including the page link) and tags filled in from the pack
- `upload_youtube_video` uploads any video with your own title and description

## One-time setup

1. In Google Cloud Console, create a project and enable **YouTube Data API v3**.
2. Set up the OAuth consent screen, add yourself as a user, then **publish** the app.
   If it stays in "Testing", the refresh token expires after 7 days.
3. Create an OAuth client ID of type **Desktop app**.
4. On your own computer, run:
   ```
   YOUTUBE_CLIENT_ID=... YOUTUBE_CLIENT_SECRET=... node youtube-mcp/get-refresh-token.mjs
   ```
   Open the link, sign in with the account that owns the channel, and copy the printed
   `YOUTUBE_REFRESH_TOKEN`. The token only has permission to upload.
5. In your Claude Code environment settings, add the environment variables
   `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET` and `YOUTUBE_REFRESH_TOKEN`, and allow network access to
   `oauth2.googleapis.com` and `www.googleapis.com`.
   See https://code.claude.com/docs/en/claude-code-on-the-web

**Never commit these values.** This repo is the public website.

## Using it

Ask Claude, for example: "Upload `videos/clip-forge.mp4` as the Clip Forge promo."
The video must be in the repo or at an https:// link.

Note: Google keeps videos uploaded through a new API project private until the project passes
the YouTube API audit (https://support.google.com/youtube/contact/yt_api_form). Until then,
switch each video to public in YouTube Studio.

To disconnect, remove access at https://myaccount.google.com/connections.
