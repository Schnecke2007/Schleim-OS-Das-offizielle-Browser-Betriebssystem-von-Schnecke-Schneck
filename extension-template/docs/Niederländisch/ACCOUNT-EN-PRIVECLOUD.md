# Account en privécloud

## Voorbeeldaccount

Het template gebruikt aanmelding via een GitHub App met Device Flow. Iedere projecteigenaar moet een eigen GitHub App maken en installeren.

1. Maak een GitHub App voor je Browser OS-project.
2. Schakel Device Flow in.
3. Vul de openbare Client-ID en de app-link in bij `scripts/browser-account.js`.
4. Geef de benodigde machtigingen: Repository creation (write), Contents (read/write) en – indien gebruikt – Email addresses (read).
5. Installeer de app in je GitHub-account en meld je aan met de apparaatcode.

De accountmodule bewaart een back-up van instellingen in een privérepository. Stel de naam van die repository in via `REPO_NAME` in `scripts/browser-account.js`.

## Foto- en videocloud

De media-app gebruikt een tweede privérepository. Vul dezelfde repositorynaam op vier plaatsen in:

- `scripts/browser-account.js`: `PHOTOS_REPO_NAME`
- `scripts/browser-media-cloud.js`: `REPO_NAME`
- `scripts/media-upload-worker.js`: `MEDIA_REPO_NAME`
- `scripts/media-upload-offscreen.js`: `REPO_NAME`

Alle vier waarden moeten exact overeenkomen. Vervang `YOUR_MEDIA_REPOSITORY_NAME` overal door je eigen repositorynaam.

Foto’s en video’s worden gesorteerd op mediatype, jaar en maand. De media-index bevat metadata en verwijzingen naar geüploade bestanden. De uploadlimiet van het template is 50 MiB per bestand.

## Privacy en veiligheid

- De mediarepository moet privé zijn.
- Zet nooit GitHub App-clientgeheimen, privésleutels of persoonlijke toegangstokens in de extensiecode.
- Browser OS vraagt niet om je GitHub-wachtwoord. Aanmelden en toestemming geven gebeurt rechtstreeks bij GitHub.
- GitHub-repositories hebben versiegeschiedenis. Verwijderde of vervangen bestanden kunnen daarin blijven staan.
- Test de configuratie eerst met je eigen testaccount.

De standalone demo voert geen echte GitHub-aanmelding uit en uploadt geen lokale media naar een server.
