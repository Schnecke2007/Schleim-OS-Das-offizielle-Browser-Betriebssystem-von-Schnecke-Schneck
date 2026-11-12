# JSON backup for Schleim OS

Schleim OS stores your personalization locally in the browser. It does not perform automatic cloud or browser synchronization. Use the JSON file to back up your settings manually and restore them on the same or another device.

## Export a backup

1. Open **Settings** in Schleim OS.
2. Scroll to **Configuration file (JSON)**.
3. Select **Export home screen**.
4. The file `schnecke-schneck-homescreen-YYYY-MM-DD.json` is downloaded. Keep it somewhere safe.

The export contains saved Schleim OS settings with the `ssos-` prefix, including custom website tiles, tile order, design, accent color, wallpaper, lock-screen settings and installed Store apps. Locally stored wallpaper images can make the JSON file larger.

## Import a backup

1. Open Schleim OS on the target device and go to **Settings**.
2. Scroll to **Configuration file (JSON)**.
3. Select **Import home screen**.
4. Choose the JSON file you exported earlier.
5. Confirm the import. Schleim OS then reloads the interface.

Importing replaces the settings contained in the backup on the target device. Export the target device's current settings first if you need to keep them.

## Important

- The backup is not uploaded or transferred automatically.
- To move to another device, transfer the JSON file yourself.
- The JSON file may contain personal website shortcuts and custom settings. Share it only with people you trust.
- The Schleim-Store remains available without sign-in.
