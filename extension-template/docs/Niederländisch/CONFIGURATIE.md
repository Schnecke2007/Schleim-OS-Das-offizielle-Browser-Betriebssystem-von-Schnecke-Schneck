# Configuratie

1. Open `manifest.json`. Wijzig de naam, korte naam, beschrijving en versie.
2. Pas de voorbeeldnaam, profieltekst en links aan in `scripts/app.js`.
3. Vervang de afbeeldingen in `assets/demo/` en `assets/icons/`.
4. Vul je GitHub-gebruikersnaam en repositorynaam in bij `scripts/update-center.js`.
5. Stel je GitHub App-ID, app-link en namen van privéback-up-repositories in bij `scripts/browser-account.js`.
6. Gebruik dezelfde naam voor de mediarepository in `scripts/browser-media-cloud.js`, `scripts/media-upload-worker.js` en `scripts/media-upload-offscreen.js`. Alle vier waarden moeten overeenkomen.
7. Controleer de vermeldingen in `data/store-apps.json` en de Store-links.

Gebruik eigen privé-repositories voor persoonlijke back-ups en media. Zet nooit GitHub App-geheimen, privésleutels of toegangstokens in de extensiecode. Test de functies met een testaccount.