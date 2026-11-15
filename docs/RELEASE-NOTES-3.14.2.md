# Release Notes 3.14.2

## Lokale Bildoptimierung in der Foto-Cloud

- Neue Fotos werden bereits vor dem Upload lokal im Browser optimiert.
- Statische Bilder werden nach Möglichkeit in das platzsparende WebP-Format mit 90 % Qualität konvertiert.
- Bilder mit mehr als 2.560 Pixeln an der längsten Seite werden verkleinert.
- Die Optimierung wird nur verwendet, wenn die resultierende Datei tatsächlich kleiner als das Original ist.
- Animierte GIF-, APNG- und WebP-Dateien bleiben unverändert, damit keine Animation verloren geht.
- Videos werden nicht verändert.
- Die Galerie zeigt weiterhin normale Bilddateien an; der Download verwendet die passende WebP-Dateiendung.
- Das Original wird nicht zusätzlich gespeichert. Die in den Cloud-Metadaten angegebene Dateigröße entspricht der gespeicherten, optimierten Datei.
- Aufnahmezeit und Datumsordner werden vor der Optimierung ermittelt. Beim Canvas-Export werden übrige EXIF-Metadaten entfernt; die ermittelte Aufnahmezeit bleibt im Medienindex erhalten.

## Hinweise

- Die Verarbeitung läuft lokal im Browser und benötigt keinen zusätzlichen Dienst oder API-Schlüssel.
- Wenn der Browser das Bild nicht decodieren kann oder WebP nicht unterstützt, bleibt die Originaldatei unverändert.
- Das Upload-Limit bleibt bei 50 MiB pro Datei.
- Diese Änderung gilt für neue Uploads; bereits gespeicherte Fotos werden nicht automatisch neu komprimiert.
