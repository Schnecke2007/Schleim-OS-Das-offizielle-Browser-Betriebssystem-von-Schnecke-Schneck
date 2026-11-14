# Cloudback-up met het Schleim-account

> **Opmerking over oudere versies:** De vorige lokale JSON-import- en exportfunctie is niet meer beschikbaar in de interface van Schleim OS 3.12.0. Deze pagina beschrijft de huidige cloudback-up en wat je met oudere bestanden kunt doen.

## Een nieuwe cloudback-up maken

1. Installeer zo nodig eerst de [GitHub-app Schleim OS Account](https://github.com/apps/schleim-os-account).
2. Open **Instellingen → Schleim-account**.
3. Kies **Verbinden met GitHub** en volg de stappen voor app-installatie en apparaatcode.
4. Kies na het aanmelden **Nu opslaan in de cloud**.

Schleim OS maakt het bestand `schleim-os-backup.json` aan in je privérepository `schleim-os-cloud` of werkt het bij.

## Wat wordt opgeslagen?

Back-upformaat 2 bevat de opgeslagen Schleim OS-instellingen en legt ook deze onderdelen apart vast:
- de volgorde van de apps op het startscherm,
- geïnstalleerde Store-apps,
- de gekozen systeemachtergrond,
- een eigen achtergrondafbeelding en de afbeeldingsgegevens of URL.

De back-up wordt handmatig gestart via **Instellingen → Schleim-account**. Er is geen automatische synchronisatie.

## Op een ander apparaat herstellen

Installeer Schleim OS en meld je onder **Instellingen → Schleim-account** aan met hetzelfde GitHub-account. Kies daarna **Cloudback-up herstellen**. De lokale Schleim OS-instellingen worden vervangen door de back-up.

## Oudere JSON-bestanden

JSON-bestanden uit de vorige lokale exportfunctie kunnen niet via de huidige interface worden geïmporteerd. Bewaar deze bestanden apart. Ze worden niet automatisch naar de cloud overgezet.

Oudere cloudback-ups in formaat 1 die met het Schleim-account zijn gemaakt, kunnen nog steeds worden hersteld.

**Beveiliging:** De cloudrepository moet privé blijven. GitHub-wachtwoorden en toegangstokens worden nooit in het back-upbestand opgeslagen.


**Opmerking over de standalone-demo:** Het aparte bestand `extension/standalone/schleim-os-standalone.html` heeft eigen lokale import-/exportfuncties voor demo-instellingen. Dit is niet de cloudback-up van de volledige extensie en neemt geen GitHub-accountsessie mee.
