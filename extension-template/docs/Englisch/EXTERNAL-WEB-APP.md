# External web apps

The Browser Store can list external web apps as ordinary website shortcuts. An external app opens in a new browser tab and does not need its own API integration.

## Add an entry

1. Open `data/store-apps.json`.
2. Add a unique `id`, visible name, HTTPS URL and category.
3. Add short descriptions in German, English and Dutch.
4. Check that the website works on mobile devices.
5. Run the Store and navigation tests.

## Privacy and security

Use official HTTPS addresses only. Do not put passwords, access tokens or private credentials in the catalogue. External websites may use their own cookies and trackers. Iframe embedding is not guaranteed; open external services in a new tab by default.
