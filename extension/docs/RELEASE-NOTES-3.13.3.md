# Release Notes – Schleim OS 3.13.3

**Release date:** 14 November 2026

## Fix for built-in system apps

- Fixed the app launch routine: the language-control lookup now uses the all-elements selector helper. The previous single-element query returned an Element or null, but the code called `.forEach()` on that result. This stopped every built-in app before the app window could be shown.
- Fixed the same selector misuse in the standalone demo's custom app tile cleanup.
- Added automated regression tests for both the extension and standalone demo.
- Updated GitHub Actions to run the navigation regression tests when the workflow, extension app code, standalone page or tests change.

## Validation

- JavaScript syntax and JSON validation remain part of the workflow.
- The navigation regression tests verify that a single-element query is never used as an array for `.forEach()`.
- A live interaction test in the target browser is still required after updating the installed extension.
