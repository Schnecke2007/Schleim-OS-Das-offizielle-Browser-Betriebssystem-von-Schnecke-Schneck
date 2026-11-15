# Release Notes – Schleim OS 3.13.1

**Release date:** 14 November 2026

## Sonos integration repair

- Repaired the Cloudflare Sonos Worker module, removing duplicated module declarations and duplicated route handlers.
- Updated the Sonos app to use the Worker’s `POST /oauth/start` endpoint.
- Separated the one-time OAuth `state` from the opaque bearer-session key to prevent the callback state from becoming the long-lived session credential.
- Kept Sonos access and refresh tokens in the private Cloudflare KV namespace; the extension stores only the opaque session key locally.
- Restricted cross-origin browser access to supported extension origins and constrained the Worker to the Sonos Control API routes used by the app.
- Preserved the existing speaker/group chooser, now-playing display, transport controls, seek, volume, mute, shuffle, repeat, repeat-one, crossfade, Sonos Favorites and Sonos Playlists.

## Spotify integration plan

Spotify catalog search is not enabled in this release. A separate Spotify Web API connection will be added after the Spotify app Client ID and the deployed Worker callback URL are available. The planned connection uses Authorization Code with PKCE and does not require a Spotify Client Secret in Schleim OS.

## Setup

The Sonos feature still requires a separately deployed Cloudflare Worker, a private KV namespace and Sonos Control Integration credentials. Follow [Sonos app setup](./SONOS-APP.md). The app has not yet been tested against the owner's live Sonos household; a successful GitHub Actions validation only confirms JavaScript syntax and JSON structure.
