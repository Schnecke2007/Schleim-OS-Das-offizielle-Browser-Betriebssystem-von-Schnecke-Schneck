# Release Notes 3.14.1

## KI-Suche in der Fotos-App

- Optionale lokale Bildanalyse mit der Chrome Prompt API und Gemini Nano.
- Neue Fotos können nach ausdrücklicher Aktivierung auf dem Gerät beschrieben und mit KI-Stichwörtern versehen werden.
- KI-Suche erweitert Suchanfragen um Synonyme, Übersetzungen und visuell passende Begriffe.
- Kein externer KI-API-Schlüssel und kein Upload von Bildern an einen KI-Inferenzserver erforderlich.
- Bei nicht unterstützter Chrome-Version oder Hardware bleibt die normale Metadatensuche verfügbar.
- Videos werden weiterhin anhand von Dateinamen, Datum, Beschreibung und Stichwörtern durchsucht; die KI-Bildbeschreibung arbeitet derzeit mit Fotos.
- Die Kamera, die dateibasierte Ordnerstruktur, die separate private Medien-Repository-Anbindung sowie Speicherstatistik bleiben erhalten.

## Hinweise und Grenzen

- Das lokale KI-Modell muss beim ersten Gebrauch von Chrome heruntergeladen werden.
- Die KI-Verfügbarkeit ist abhängig von Chrome-Version, Betriebssystem und Gerätehardware.
- Die KI analysiert nur neue Fotos, die nach dem Aktivieren der lokalen KI hochgeladen werden. Vorhandene Medien werden nicht automatisch rückwirkend analysiert.
- Das Medien-Repository wird beim Klick auf **Privaten Cloud-Speicher jetzt verknüpfen** im angemeldeten GitHub-Konto erstellt, sofern es noch nicht vorhanden ist.
- Upload-Limit: 50 MiB je Datei. GitHub ist kein unbegrenzter oder für große Mediensammlungen optimierter Foto-Cloud-Speicher.
