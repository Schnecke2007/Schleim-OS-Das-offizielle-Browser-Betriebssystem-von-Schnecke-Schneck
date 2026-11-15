# Release 3.15.0 – Hintergrund-Upload und Medienkomprimierung

## Neue Funktionen

- Ausgewählte Medien werden vor dem Upload in einer lokalen IndexedDB-Warteschlange gespeichert.
- Ein Chrome-Offscreen-Dokument übernimmt die Komprimierung und Übertragung unabhängig vom Fotos-Tab.
- Der Upload läuft weiter, wenn der Fotos-Tab geschlossen oder Chrome minimiert wird, solange der Browserprozess aktiv bleibt.
- Eine Fortschrittsbenachrichtigung zeigt den prozentualen Status. Nach Abschluss erscheint eine Benachrichtigung, die beim Antippen Schleim OS direkt in der Fotos-App öffnet.
- Statische Bilder werden lokal als WebP komprimiert. Videos werden lokal als WebM neu kodiert und auf eine Zielgröße unter 50 MiB ausgelegt.
- Die Komprimierung und Upload-Übertragung geschehen auf dem Gerät. Die Bild-/Videodateien werden an GitHub erst nach der lokalen Verarbeitung übertragen.

## Grenzen und Hinweise

- Chrome muss geöffnet bleiben. Wird der Browser vollständig beendet, der Computer ausgeschaltet oder das Gerät neu gestartet, kann ein aktiver Netzwerk-Upload nicht weiterlaufen.
- Die Video-Neukodierung benötigt Zeit ungefähr entsprechend der Videolaufzeit und kann das Gerät belasten. Sehr lange Videos können auch nach der Neukodierung zu groß bleiben und werden dann nicht hochgeladen.
- Animierte GIF-, APNG- und WebP-Dateien werden nicht in Einzelbilder umgewandelt, damit ihre Animation erhalten bleibt. Sie müssen bereits unter 50 MiB liegen.
- Die Videoausgabe ist WebM. Wiedergabe und Audioübernahme hängen von den unterstützten Browser-Codecs und dem Quellformat ab.
- Das 50-MiB-Limit gilt pro Datei, nicht für das gesamte Repository. GitHub speichert frühere Dateiversionen in der Repository-Historie. Komprimierung begrenzt daher nicht automatisch das Gesamtwachstum des Repositories.
- Die Fotos-App setzt Chrome 109 oder neuer voraus, da der Offscreen-API-Hintergrundprozess verwendet wird.

## Technische Änderungen

- Manifest-Version auf 3.15.0 erhöht.
- Neue Berechtigungen: `offscreen` und `notifications`.
- Neuer Manifest-V3-Service-Worker: `scripts/media-upload-worker.js`.
- Neuer Hintergrundprozessor: `scripts/media-upload-offscreen.js`.
- Neue Offscreen-Seite: `pages/media-upload.html`.
