# Schleim OS 3.20.0 – Android browser onboarding, Guest Mode and encrypted profile sync

This release adds a browser-specific profile workflow to the standalone Android app. The Chromium WebExtension remains a separate product and keeps its existing account and cloud backup behaviour.

## Android browser changes

- First-run onboarding with skippable feature slides and direct browser start.
- Private Guest Mode backed by GeckoView private sessions, separated from the regular profile and with account/cloud actions blocked.
- Native bookmarks with add, edit, open and delete actions.
- GeckoView login save prompts require user confirmation before credentials enter the Android-Keystore-protected encrypted password vault.
- Schleim account is accessed from Android Settings and follows the existing Schleim OS Account GitHub App + device authorization flow.
- Encrypted browser profile backup in the private schleim-os-cloud repository, using AES-256-GCM encryption before upload.
- Profile backup includes local settings, history, saved tabs, bookmarks, encrypted password entries, add-on metadata, enabled/disabled state and locally available XPI packages.
- Restore reconciles third-party add-ons, reinstalls backed-up XPI files when available, and restores their enabled/disabled state.
- Automatic backup is optional. Updates made while an upload is running are queued for a subsequent backup.

## Privacy and limitations

Guest browsing data is not written to the regular local profile or uploaded. The profile backup does not include website cookies, current website login sessions, form submissions, private storage belonging to individual add-ons or ordinary downloads. It cannot recreate the full Back/Forward navigation state of each page. Add-ons without a locally available XPI installer can be recorded as metadata but cannot be automatically installed on another device.

The existing Android DNS-over-HTTPS/NextDNS resolver and dark brown UI theme remain unchanged.
