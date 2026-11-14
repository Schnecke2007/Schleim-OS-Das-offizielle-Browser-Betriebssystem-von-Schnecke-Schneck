# Release Notes – Schleim OS 3.13.2

**Release date:** 14 November 2026

## App navigation and touch handling

- Fixed home-screen app tiles not opening after longer taps on touchscreens.
- The drag-to-reorder feature now treats a long press without actual pointer movement as a normal tap.
- App clicks are suppressed only when the user has actually moved a tile to reorder the home screen.
- The existing mouse and touch reordering behavior remains available.

## Validation

- The updated personalization script passes JavaScript syntax validation.
- GitHub Actions validates the app navigation, personalization and Sonos scripts, the Sonos Worker and the relevant JSON files.
- Automated checks do not replace a live tap test in the target browser; reload the updated extension and try opening several home-screen apps.
