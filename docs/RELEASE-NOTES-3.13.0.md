# Release Notes – Schleim OS 3.13.0

**Release date:** 14 November 2026

## New: Native Sonos app

- Sonos controller is now available in the Schleim-Store under **Media**.
- Sonos account authorization uses the official OAuth 2.0 authorization-code flow.
- A Cloudflare Worker bridge exchanges and refreshes Sonos tokens server-side.
- Private Cloudflare KV stores the Sonos access and refresh tokens.
- Schleim OS stores only the Worker URL, selected household/group and an opaque session key locally.
- Speaker and room-group selection, playback metadata, play/pause, previous/next, seek, volume, group mute, shuffle, repeat, repeat-one and crossfade are available.
- Sonos Favorites and Sonos Playlists can be played from the app.
- The interface is available in German, English and Dutch.

## Important setup requirement

The app is not pre-connected to a Sonos account. Before the first use, deploy the Cloudflare Worker, create a private KV namespace, configure the Sonos Control Integration Client ID/Secret and HTTPS redirect URL, then enter the Worker URL in the Sonos app. See [Sonos app setup](./SONOS-APP.md).

The Sonos Client Secret and Sonos OAuth tokens must remain server-side. They are not stored in the public GitHub repository or the Schleim Cloud backup.

## Text input limitation

The text field starts saved Sonos Favorites or Sonos Playlists by matching their names. The general Sonos Control API does not provide third-party integrations with a universal free-text search across every connected music service. Save items as Sonos Favorites or Playlists in the Sonos app first.

## Technical notes

- Added `extension/scripts/sonos-app.js`.
- Added `integrations/sonos-worker/` Cloudflare Worker project.
- Added Sonos to `extension/data/store-apps.json` and `Store/media/sonos-control.json`.
- Added Sonos setup documentation.
- No additional mandatory Chrome permissions were added; Schleim OS requests optional host access for the configured Worker origin when the user connects.
- Sonos playback state is refreshed periodically. Push/event subscriptions are not included in this initial implementation.
