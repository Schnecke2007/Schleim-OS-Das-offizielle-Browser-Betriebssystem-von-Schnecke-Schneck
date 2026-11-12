# JSON-back-up voor Schleim OS

Schleim OS slaat je personalisatie lokaal op in de browser. Er vindt geen automatische cloud- of browsersynchronisatie plaats. Met het JSON-bestand kun je je instellingen handmatig back-uppen en op hetzelfde of een ander apparaat herstellen.

## Een back-up exporteren

1. Open **Instellingen** in Schleim OS.
2. Scrol naar **Configuratiebestand (JSON)**.
3. Kies **Startscherm exporteren**.
4. Het bestand `schnecke-schneck-homescreen-JJJJ-MM-DD.json` wordt gedownload. Bewaar het op een veilige plek.

De export bevat de opgeslagen Schleim OS-instellingen met het voorvoegsel `ssos-`, waaronder eigen websitetegels, de volgorde van tegels, ontwerp, accentkleur, achtergrond, vergrendelscherminstellingen en geïnstalleerde Store-apps. Lokaal opgeslagen achtergrondafbeeldingen kunnen het JSON-bestand groter maken.

## Een back-up importeren

1. Open Schleim OS op het doelapparaat en ga naar **Instellingen**.
2. Scrol naar **Configuratiebestand (JSON)**.
3. Kies **Startscherm importeren**.
4. Selecteer het JSON-bestand dat je eerder hebt geëxporteerd.
5. Bevestig de import. Schleim OS laadt de interface daarna opnieuw.

Het importeren vervangt de instellingen uit het back-upbestand op het doelapparaat. Exporteer eerst de huidige instellingen van dat apparaat als je deze wilt bewaren.

## Belangrijk

- De back-up wordt niet automatisch geüpload of overgedragen.
- Voor een apparaatwissel moet je het JSON-bestand zelf naar het andere apparaat overbrengen.
- Het JSON-bestand kan persoonlijke websitelinks en eigen instellingen bevatten. Deel het daarom alleen met personen die je vertrouwt.
- De Schleim-Store blijft zonder aanmelding beschikbaar.
