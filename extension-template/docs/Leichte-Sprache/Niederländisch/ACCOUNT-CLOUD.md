# Account en cloud

## Voorbeeldaccount

Je hebt je eigen GitHub App nodig.

- Maak een GitHub App voor je project.
- Schakel Device Flow in.
- Vul de Client-ID en de app-link in bij `scripts/browser-account.js`.
- Installeer de app in je GitHub-account.
- Meld je aan met de apparaatcode.

Het template bewaart instellingen in een privé GitHub-repository.

## Foto- en videocloud

Foto’s en video’s gebruiken een tweede privérepository.

Gebruik dezelfde repositorynaam op vier plaatsen:

- `scripts/browser-account.js` bij `PHOTOS_REPO_NAME`
- `scripts/browser-media-cloud.js` bij `REPO_NAME`
- `scripts/media-upload-worker.js` bij `MEDIA_REPO_NAME`
- `scripts/media-upload-offscreen.js` bij `REPO_NAME`

Alle vier namen moeten hetzelfde zijn.
Vervang `YOUR_MEDIA_REPOSITORY_NAME` in alle bestanden.

Foto’s en video’s worden op jaar en maand gesorteerd.
Elk bestand mag maximaal 50 MiB groot zijn.

## Belangrijk

- De mediarepository moet privé zijn.
- Deel geen geheime sleutels.
- Zet geen wachtwoorden in de code.
- GitHub kan oude bestandsversies bewaren.
- Test alles eerst met een testaccount.

De demo uploadt geen lokale foto’s of video’s naar een server.
