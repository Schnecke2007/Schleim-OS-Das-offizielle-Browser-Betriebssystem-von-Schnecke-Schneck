# Schleim-account, GitHub-app en cloudback-up

Het Schleim-account gebruikt je GitHub-account om je aan te melden. Schleim OS vraagt nooit om je GitHub-wachtwoord en slaat het ook niet op. Aanmelden gebeurt via de officiële apparaatmachtiging van GitHub.

## 1. GitHub-app instellen

De GitHub-app **Schleim OS Account** is al aangemaakt:

- [Schleim OS Account openen](https://github.com/apps/schleim-os-account)
- [GitHub-app-instellingen openen](https://github.com/settings/apps)

De app moet **Public** zijn, zodat andere gebruikers van Schleim OS de app kunnen installeren. Schakel **Enable Device Flow** in.

Benodigde machtigingen voor de GitHub-app:

| Onderdeel | Machtiging | Toegang |
|---|---|---|
| Account permissions | Email addresses | Read-only |
| Repository permissions | Repository creation | Read and write |
| Repository permissions | Contents | Read and write |

De e-mailmachtiging controleert het geverifieerde primaire e-mailadres van GitHub. Repository creation laat Schleim OS de privécloudrepository maken. Contents geeft toegang tot het lezen en schrijven van het back-upbestand.

## 2. Client-ID en geheimen

De openbare Client-ID staat als `GITHUB_APP_CLIENT_ID` in `extension/scripts/schleim-account.js`.

De Client-ID is geen wachtwoord en geen geheim. Zet nooit een GitHub App Client Secret of privésleutel in de browserextensie.

## 3. Aanmelden en de app installeren

Het aanmeldscherm staat in de Schleim-Store en onder **Instellingen → Schleim-account**.

1. Kies **Verbinden met GitHub**.
2. Schleim OS opent eerst de [GitHub-pagina van Schleim OS Account](https://github.com/apps/schleim-os-account).
3. Installeer de app voor je GitHub-account. Ga terug naar Schleim OS en kies **Ik heb de app geïnstalleerd – verder**.
4. Schleim OS vraagt een eenmalige apparaatcode aan en toont deze.
5. Na korte tijd probeert Schleim OS de code naar het klembord te kopiëren. Je kunt ook **Code kopiëren** gebruiken.
6. Een paar seconden later opent de pagina voor GitHub-apparaatmachtiging. De link **GitHub-apparaatmachtiging openen** blijft beschikbaar.
7. Voer de code in op de echte GitHub-pagina en geef toestemming voor **Schleim OS Account**.
8. Na de machtiging controleert Schleim OS via de GitHub-API of de app-installatie bij het aangemelde account hoort. Als GitHub de installatie nog niet toont, controleert Schleim OS dit opnieuw, maximaal vijf minuten lang.
9. Daarna zoekt Schleim OS de privérepository `schleim-os-cloud` of maakt deze aan.

**Technische beperking:** Vóór de eerste apparaatmachtiging heeft Schleim OS nog geen GitHub App-gebruikerstoegangstoken. Daarom kan het programma de installatielijst niet vóór de aanmelding via de API opvragen. Eerst wordt de app-pagina geopend en bevestig je zelf dat je de app hebt geïnstalleerd. De API-controle vindt plaats na de apparaatmachtiging. GitHub beschrijft dit eindpunt als [List app installations accessible to the user access token](https://docs.github.com/en/rest/apps/installations?apiVersion=2026-03-10).

Als toegang tot het klembord niet beschikbaar is, blijft de code zichtbaar en kun je deze zelf kopiëren. De links om de GitHub-app en de apparaatmachtiging opnieuw te openen blijven beschikbaar.

## 4. Toegang tot de Store

De Schleim-Store is alleen beschikbaar zolang je bent aangemeld met een Schleim-account. Zonder geldige sessie blijven de catalogus, zoekfunctie, beoordelingen, installatie, verwijdering en voorstellen vergrendeld. Na afmelden wordt de Store opnieuw vergrendeld.

Dit beschermt de Store-interface binnen Schleim OS. De catalogus- en beoordelingsbestanden in de openbare GitHub-repository blijven openbaar leesbaar.

## 5. Cloudback-up en herstellen

De cloudback-up is alleen beschikbaar via **Instellingen → Schleim-account**. In de Store staan geen knoppen voor back-up of herstel.

- **Nu opslaan in de cloud:** Maakt `schleim-os-backup.json` aan of werkt het bij in de privérepository `schleim-os-cloud`.
- **Cloudback-up herstellen:** Downloadt de back-up en vervangt daarmee de lokale Schleim OS-instellingen. Eerst wordt om bevestiging gevraagd.

De huidige back-up gebruikt **formaatversie 2**. Deze bevat de opgeslagen Schleim OS-instellingen met het voorvoegsel `ssos-` en slaat daarnaast uitdrukkelijk op:

- De volgorde van de apptegels op het startscherm
- De geïnstalleerde Store-apps
- De gekozen systeemachtergrond
- De afbeeldingsgegevens en/of URL van een eigen achtergrond

De back-up wordt handmatig gestart. Wijzigingen worden niet automatisch gesynchroniseerd.

Oudere cloudback-ups in formaat 1 kunnen nog steeds worden hersteld. De vorige lokale JSON-import-/exportfunctie maakt geen deel meer uit van de huidige extensie.

## 6. Beveiliging en afmelden

- De repository `schleim-os-cloud` moet privé blijven. Schleim OS weigert op te slaan als de repository openbaar is.
- GitHub-wachtwoorden en toegangstokens worden niet in het back-upbestand opgeslagen.
- Toegangstokens worden lokaal in de extensiegegevens bewaard, zodat de accountaanmelding na een browserstart kan blijven bestaan en zo nodig kan worden vernieuwd.
- **Afmelden** verwijdert de lokaal opgeslagen Schleim-accountaanmelding. De machtiging voor de GitHub-app wordt daardoor niet automatisch ingetrokken.
- Wil je de toegang volledig intrekken? Verwijder dan ook de appmachtiging in GitHub onder **Settings → Applications**.

Meer informatie: [Hoofddocumentatie](../../README.nl.md) · [Store-handleiding](../../Store/Niederländisch/README.md) · [Installatiehandleiding](INSTALLATIE.md) · [Technische opmerkingen](TECHNISCHE-OPMERKINGEN.md)
