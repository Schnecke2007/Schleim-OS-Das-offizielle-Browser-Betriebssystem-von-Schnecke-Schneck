# Cloudback-up met het Schleim-account

> **Opmerking over oudere versies:** De lokale JSON-import- en exportfunctie is in Schleim OS 3.10.0 vervangen door het Schleim-account. Deze pagina is nu alleen nog een melding voor JSON-back-ups uit oudere versies.

## Een nieuwe back-up maken

1. Stel eerst de GitHub-app in. Zie [Schleim-account instellen](../../extension/docs/SCHLEIM-KONTO.md).
2. Open de **Schleim Store** of **Instellingen**.
3. Kies bij **Schleim-account** de optie **Verbinden met GitHub**.
4. Bevestig de eenmalige apparaatcode rechtstreeks bij GitHub.
5. Kies **Nu opslaan in de cloud**.

Schleim OS maakt het bestand `schleim-os-backup.json` aan in je privérepository `schleim-os-cloud` of werkt het bij.

## Herstellen op een ander apparaat

Meld je op dat apparaat met hetzelfde GitHub-account aan bij het Schleim-account en kies **Cloudback-up herstellen**. De huidige instellingen van het apparaat worden vervangen door de opgeslagen back-up.

## Oudere JSON-bestanden

JSON-bestanden die met eerdere versies van Schleim OS zijn geëxporteerd, kunnen in versie 3.10.0 niet meer via de interface worden geïmporteerd. Bewaar bestaande bestanden apart. Oude bestanden worden niet automatisch naar de cloud gemigreerd.

**Beveiliging:** De cloudrepository moet privé blijven. Schleim OS slaat geen wachtwoorden of toegangstokens op in het back-upbestand.
