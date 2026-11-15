# Release Notes 3.14.0

## Private photo and video cloud

- Added a separate private media repository: `schleim-os-cloud-photos-and-videos`.
- Added Photos library with uploads, previews, downloads and removal from the active index.
- Added Camera app using browser media APIs for front/rear camera, still photos and video recording.
- Added yearly/monthly folders and a metadata index.
- JPEG EXIF `DateTimeOriginal` is used when available; file modification time is the fallback.
- Added local, API-key-free metadata search with synonym expansion.
- Added photo/video counts and storage-size information to Settings under the Schleim account.
- Existing GitHub Device Flow account and session are reused.
- Per-file upload limit: 50 MiB. GitHub is version-controlled repository storage, not an unlimited media service.
- JavaScript syntax checks and regression tests cover the new feature.
