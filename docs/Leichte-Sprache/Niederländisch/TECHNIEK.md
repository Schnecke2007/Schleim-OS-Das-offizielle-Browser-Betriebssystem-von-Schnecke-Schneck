# Techniek eenvoudig uitgelegd – Schleim OS

## Waar werkt Schleim OS?

Schleim OS werkt in een browser. De browser moet uitbreidingen ondersteunen.

Schleim OS gebruikt Manifest V3. Dat is een technische standaard voor browseruitbreidingen.

## Wat gebeurt er bij een nieuw tabblad?

De browser opent het bestand `pages/newtab.html`. Dit bestand toont het startscherm van Schleim OS.

## Wat doen de bestanden?

- `pages/newtab.html`: De pagina die je ziet.
- `scripts/app.js`: Veel functies van de interface.
- `scripts/personalization.js`: Instellingen en persoonlijke aanpassingen.
- `scripts/schleim-account.js`: GitHub-aanmelding en cloudback-up.
- `scripts/slime-store-admin.js`: Beheer van Store-voorstellen.
- `styles/main.css`: Het ontwerp van de pagina.
- `styles/personalization.css`: Het ontwerp van de persoonlijke instellingen.
- `locales/legal-translations.js`: Vertalingen van juridische teksten.
- `standalone/schleim-os-standalone.html`: Eén HTML-demobestand.

## Waar worden instellingen bewaard?

Instellingen worden bewaard in het browserprofiel. Daar bewaart de browser jouw gegevens en instellingen.

Je kunt je instellingen met je Schleim-account opslaan in een privécloud op GitHub. Start de back-up via **Instellingen → Schleim-account**.

De back-up bevat ook de volgorde van de apps, geïnstalleerde Store-apps en je achtergrond.

Je start de back-up handmatig. Deze wordt niet na elke wijziging automatisch opgeslagen.

Het huidige back-upformaat is versie 2. Oudere back-ups in formaat 1 kunnen nog worden hersteld.

Je moet je aanmelden met je Schleim-account om de Schleim-Store te gebruiken.

## Internet en toestemmingen

Sommige inhoud komt van andere websites. Daarvoor heb je internet nodig.
Sommige websites staan niet toe dat hun pagina in een andere pagina wordt getoond.

De browser kan om toestemming vragen. Lees zulke vragen goed.

[Technische opmerkingen in gewone taal](../../Niederländisch/TECHNISCHE-OPMERKINGEN.md) · [Eenvoudige uitleg over de Schleim-Store](SCHLEIM-STORE.md) · [Account en cloudback-up](ACCOUNT-CLOUD.md)