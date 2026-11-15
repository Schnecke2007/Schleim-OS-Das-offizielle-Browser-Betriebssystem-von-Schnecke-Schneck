# Language files and translations

The template includes German, English and Dutch UI text.

- `scripts/app.js` contains labels for the main interface, apps and navigation.
- `scripts/personalization.js` contains translations for personalization, the Browser Store, ratings, app suggestions and Store access notices.
- `scripts/schleim-account.js` contains translations for GitHub App sign-in, device authorization, cloud backup and restore.
- `scripts/slime-store-admin.js` contains the Store admin portal text.
- `scripts/update-center.js` contains version-check and ZIP-download text.
- `locales/legal-translations.js` contains translations for the demo legal placeholders.

The UI dictionaries are stored in the JavaScript modules, not only in this directory. When adding features, update the dictionaries for `de`, `en` and `nl`.

External provider content may not be translatable by the extension because it is rendered by a third-party service. Review the provider's current terms and privacy policy before embedding external content.
