# Technology explained simply – Schleim OS

## Where does Schleim OS run?

Schleim OS runs inside a browser. The browser must support extensions.

Schleim OS uses Manifest V3. This is a technical standard for browser extensions.

## What happens when you open a new tab?

The browser opens the file `pages/newtab.html`. This file shows the Schleim OS home screen.

## What do the files do?

- `pages/newtab.html`: The page you see.
- `scripts/app.js`: Many of the interface features.
- `scripts/personalization.js`: Settings and personal changes.
- `styles/main.css`: The page design.
- `styles/personalization.css`: The design of personalization tools.
- `locales/legal-translations.js`: Translations of legal texts.
- `standalone/schleim-os-standalone.html`: One HTML demo file.

## Where are settings saved?

Settings are saved in your browser profile. This is the part of the browser that stores your data and settings.

You can save your settings with the JSON feature. Keep the backup file safe.

## Internet and permissions

Some content comes from other websites. You need an internet connection for it.
Some websites do not allow their pages to appear inside another page.

The browser may ask you for permission. Read these questions carefully.

[Technical notes in regular English](../../Englisch/TECHNICAL-NOTES.md)