# Release Notes – Schleim OS 3.13.7

**Release date:** 14 November 2026

## Remove the obsolete Sonos Worker

- Deleted the complete `integrations/sonos-worker/` directory, including its Worker source and Wrangler configuration.
- Removed current documentation references that described the directory as retained legacy code.
- Added a regression test to ensure the obsolete directory does not return.
- The Sonos Store web app remains unchanged: it opens the official Sonos website in a new browser tab.
- No Sonos credentials, API keys or self-hosted services are required by the current Store launch flow.

## Validation

- JavaScript syntax and app-navigation regression tests.
- JSON validation for the manifest and Store catalogues.
