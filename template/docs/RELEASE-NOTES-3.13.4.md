# Release Notes – Schleim OS 3.13.4

**Release date:** 14 November 2026

## Simplified Sonos connection

- Replaced the Sonos Control API / Cloudflare Worker setup screen with a direct link to the official Sonos browser control at https://play.sonos.com/.
- Users sign in directly with Sonos. Schleim OS does not ask for or store Sonos credentials.
- No Sonos developer application, API key, Cloudflare Worker or KV namespace is required for the standard Sonos launch flow.
- Kept the older Worker integration in the repository as legacy code; the current Sonos app no longer calls it.
- Updated the Sonos Store entry and German, English and Dutch documentation.

## Future in-app option

Home Assistant remains a possible route for direct in-app controls. It requires a running Home Assistant server, the Sonos integration and a Long-Lived Access Token. This is optional and is not needed for the official Sonos web control.

Sonos 27mcp is documented as an MCP endpoint for compatible AI clients. Sonos states that its tool inventory and schemas may change without notice and that it is not intended as a fixed API for hard-coded applications.

## Validation

- JavaScript syntax and repository JSON checks are part of GitHub Actions.
- The simple Sonos launcher does not read, store or transmit Sonos credentials.
