# JSON-Backup für Schleim OS

Schleim OS speichert deine Personalisierung lokal im Browser. Es findet keine automatische Cloud- oder Browser-Synchronisierung statt. Mit der JSON-Datei kannst du deine Einstellungen selbst sichern und bei Bedarf auf demselben oder einem anderen Gerät wiederherstellen.

## Backup exportieren

1. Öffne in Schleim OS den Bereich **Einstellungen**.
2. Scrolle zum Abschnitt **Konfigurationsdatei (JSON)**.
3. Wähle **Homescreen exportieren**.
4. Die Datei `schnecke-schneck-homescreen-JJJJ-MM-TT.json` wird heruntergeladen. Bewahre sie an einem sicheren Ort auf.

Der Export enthält die gespeicherten Schleim-OS-Einstellungen mit dem Präfix `ssos-`, darunter eigene Website-Kacheln, deren Reihenfolge, Design, Akzentfarbe, Hintergrund, Sperrbildschirm-Einstellungen und installierte Store-Apps. Lokal gespeicherte Hintergrundbilder können die JSON-Datei entsprechend vergrößern.

## Backup importieren

1. Öffne auf dem Zielgerät Schleim OS und gehe zu **Einstellungen**.
2. Scrolle zu **Konfigurationsdatei (JSON)**.
3. Wähle **Homescreen importieren**.
4. Wähle die zuvor exportierte JSON-Datei aus.
5. Bestätige den Import. Schleim OS lädt die Oberfläche anschließend neu.

Der Import ersetzt die in der Sicherungsdatei enthaltenen Einstellungen auf dem Zielgerät. Exportiere daher vorher den dortigen Stand, falls du ihn behalten möchtest.

## Wichtig

- Die Sicherung wird nicht automatisch hochgeladen oder übertragen.
- Für einen Gerätewechsel musst du die JSON-Datei selbst auf das andere Gerät übertragen.
- Die JSON-Datei kann persönliche Webseiten-Verknüpfungen und eigene Einstellungen enthalten. Teile sie deshalb nur mit Personen, denen du vertraust.
- Der Schleim-Store bleibt unabhängig davon ohne Anmeldung nutzbar.
