# Schleim OS 3.21.0 – Per-extension details and private browsing for Android

This release updates the standalone Schleim Browser Android app. The Chromium WebExtension's own interface is not changed.

## Android browser changes

- Every installed GeckoView WebExtension now has its own Details action in the native extension manager.
- The detail view is built from the actual GeckoView metadata provided by that add-on. It displays available name, version, enabled state, description, developer, homepage, options page, review metadata, required permissions, host origins and data-collection permissions.
- The browser opens an options page only when GeckoView reports one for that extension.
- Optional permissions, origins and data-collection permissions can be granted or revoked individually using the GeckoView WebExtensionController APIs.
- External extensions whose manifest does not explicitly forbid private use have a per-extension **Run in private windows** control, implemented with WebExtensionController.setAllowedInPrivateBrowsing.
- The extension's declared private-mode manifest value is displayed. A not_allowed declaration prevents the browser from offering the private-window toggle.
- The add-on's allowedInPrivateBrowsing state is included in the encrypted browser profile backup and restored with its enabled/disabled state.
- The proxy permission is shown as proxy control when declared. The private-window permission is not a VPN tunnel and does not provide system-wide Android VPN protection.

## Privacy and compatibility notes

GeckoView metadata may omit optional fields, so the UI does not invent values or generic settings pages. Some extensions do not provide their own options page. An extension must implement private-session support itself; granting private-window access does not guarantee that all its features will work in private sessions.

The existing dark brown UI, fixed NextDNS DNS-over-HTTPS configuration, bookmarks, history, password manager, Guest Mode, tabs and cloud backup encryption remain unchanged.
