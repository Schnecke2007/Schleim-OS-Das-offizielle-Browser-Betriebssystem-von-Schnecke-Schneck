# Template-instellingen – Eenvoudige taal

Het template bevat voorbeeldgegevens. Vul je eigen gegevens in.

## 1. Naam en profiel

- Open `manifest.json`.
- Wijzig de naam en beschrijving.
- Pas de voorbeeldtekst aan in `scripts/app.js`.
- Vervang de afbeeldingen in `assets/demo/`.

## 2. GitHub instellen

Je hebt je eigen GitHub App nodig.

- Vul de openbare App-ID in bij `scripts/browser-account.js`.
- Vul de link naar je app in.
- Vul de naam van je privéback-uprepository in.
- Vul je GitHub-gebruikersnaam en repositorynaam in bij het updatecentrum.

## 3. Foto- en videocloud

Je hebt een tweede privérepository nodig voor foto's en video's.

Gebruik dezelfde repositorynaam in vier bestanden:

- `browser-account.js`
- `browser-media-cloud.js`
- `media-upload-worker.js`
- `media-upload-offscreen.js`

Vervang `YOUR_MEDIA_REPOSITORY_NAME` in alle vier de bestanden.

## 4. Store

Controleer de apps in `data/store-apps.json`. Wijzig de voorbeeldlinks en teksten.

## Veiligheid

Zet nooit een GitHub App-geheim, privésleutel of toegangstoken in de extensiecode. Zet daar ook geen wachtwoord in.

De demo meldt zich niet aan bij GitHub. De demo uploadt geen foto's of video's naar een server.
