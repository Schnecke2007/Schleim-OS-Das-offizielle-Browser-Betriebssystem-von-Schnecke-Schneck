# Browser-Cloud-Synchronisierung für Schleim OS

Schleim OS verwendet ab Version 3.8.0 den integrierten Synchronisierungsspeicher des Browsers: `chrome.storage.sync`.

Es ist keine GitHub-App, keine Client-ID, kein GitHub-Repository und keine separate Anmeldung in Schleim OS erforderlich. Schleim OS überträgt Personalisierungsdaten in den Sync-Speicher. Der Browser synchronisiert diesen Speicher über das Browserprofil, sofern seine eigene Synchronisierung aktiviert ist.

## Voraussetzungen

- Der verwendete Browser unterstützt Erweiterungen und die API `chrome.storage.sync`.
- Du bist mit demselben Browserkonto angemeldet, das die Erweiterungsdaten synchronisieren soll.
- In den Einstellungen des Browsers ist die Synchronisierung einschließlich Erweiterungsdaten eingeschaltet.
- Auf mehreren Geräten muss Schleim OS unter derselben Erweiterungs-ID installiert sein. Nur derselbe Browsername oder dasselbe Konto allein reicht nicht aus, wenn die Erweiterungs-ID verschieden ist.

Die Browser-Erweiterung kann nicht selbst die Kontosynchronisierung aktivieren und kann nicht zuverlässig feststellen, ob der Anbieter die Daten tatsächlich in die Cloud überträgt. Ist die Browser-Synchronisierung deaktiviert, verhält sich der Sync-Speicher wie lokaler Speicher.

## Was wird synchronisiert?

Schleim OS synchronisiert die normalen Personalisierungsdaten mit dem Präfix `ssos-`, unter anderem:

- Startbildschirm-Kacheln und ihre Reihenfolge
- eigene Website-Apps und Verknüpfungen
- installierte Store-Apps
- Akzentfarbe und weitere Designwerte
- Sperrbildschirm-Einstellungen und Wetter-Ort

Die lokale Browserkopie bleibt bestehen, damit Schleim OS auch ohne Cloud-Verbindung funktioniert.

## Speichergrenzen

Der Sync-Speicher von Chrome stellt für eine Erweiterung ungefähr 100 KB Gesamtspeicher bereit; ein einzelner Eintrag darf höchstens 8 KB groß sein. Schleim OS teilt größere Einstellungen deshalb technisch auf mehrere kleinere Einträge auf. Das ändert jedoch nichts an der Gesamtgrenze des Browsers.

Hochgeladene Hintergrundbilder und eingebettete Bilddaten für App-Symbole werden nicht in die Cloud übertragen. Sie bleiben auf dem jeweiligen Gerät. Hintergrundbilder, die als normale Webadresse hinterlegt sind, können dagegen synchronisiert werden.

Wenn das Speicherkontingent überschritten wird oder der Browser die Synchronisierung nicht unterstützt, bleiben die lokalen Einstellungen erhalten; der Sync-Status zeigt dann einen Fehler an.

## Wann wird synchronisiert?

Schleim OS schreibt Änderungen automatisch in den Browser-Sync-Speicher. Der Browser bestimmt selbst, wann diese Änderungen mit dem Browserkonto und anderen Geräten abgeglichen werden. Es gibt daher keine garantierte Fünf-Minuten-Frist und keinen separaten Cloud-Hintergrunddienst von Schleim OS.

## Datenschutz

Die Daten werden über den Synchronisierungsdienst des Browseranbieters übertragen und unterliegen dessen Konto- und Datenschutzeinstellungen. Der Sync-Speicher ist kein Tresor für Passwörter, Zugangstoken oder andere Geheimnisse. Speichere solche Daten nicht in persönlichen Website-Apps oder Einstellungen.

Die eigenständige HTML-Demo von Schleim OS besitzt keine Erweiterungs-API und synchronisiert deshalb nicht über `chrome.storage.sync`; sie bleibt lokal.

## Technische Grundlage

- Browser-API: [Chrome Extensions – Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage)
- Sync-Objekt: `chrome.storage.sync`
- Implementierung: `extension/scripts/browser-sync.js`
- Lokale Datenquelle: `localStorage` mit dem Präfix `ssos-`
