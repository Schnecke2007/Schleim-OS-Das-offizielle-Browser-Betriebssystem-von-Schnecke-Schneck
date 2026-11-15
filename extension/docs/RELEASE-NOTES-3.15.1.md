# Release 3.15.1 – stärkere Medienkomprimierung

## Verbesserungen

- Statische Fotos werden lokal als WebP verarbeitet. Die Komprimierung durchläuft zusätzliche Qualitäts- und Auflösungsprofile und wählt eine kleinere Variante, wenn sie tatsächlich Speicher spart.
- Sehr große Fotos können stufenweise bis auf kleine Auflösungen reduziert werden, bevor sie verworfen werden.
- Jedes Video wird lokal als WebM neu kodiert. Reicht der erste Durchgang nicht aus, folgen weitere Versuche mit geringerer Auflösung, Bildrate und Bitrate.
- Der Zielbereich liegt unterhalb von 50 MiB. Die endgültige Upload-Prüfung blockiert jede Datei, die größer als 50 MiB ist.
- Fortschrittsmeldungen enthalten weiterhin Dateiname, Arbeitsschritt und Prozentwert. Die Benachrichtigung wird während Komprimierung und Übertragung aktualisiert.

## Hintergrundverarbeitung

- Die Upload-Warteschlange wird vor dem Start lokal in IndexedDB gespeichert.
- Ein Chrome-Offscreen-Dokument übernimmt Komprimierung und Übertragung unabhängig vom geöffneten Fotos-Tab.
- Der Fotos-Tab kann geschlossen und Chrome minimiert werden; Chrome muss dafür geöffnet bleiben.
- Die Abschlussbenachrichtigung öffnet beim Anklicken direkt Schleim OS in der Fotos-App.

## Grenzen und Hinweise

- Wird Chrome vollständig beendet, das Gerät ausgeschaltet oder neu gestartet, kann die laufende Verarbeitung nicht weiterarbeiten. Ein bereits laufender Upload wird dadurch unterbrochen.
- Animierte GIF-, APNG- und WebP-Dateien sowie SVG-Dateien bleiben unverändert, damit Animation beziehungsweise Vektorinhalt erhalten bleiben. Dateien dieser Formate über 50 MiB werden daher abgewiesen.
- Videos werden vollständig neu kodiert. Das kann ungefähr so lange wie die Videolaufzeit dauern und bei zu großen Ergebnissen mehrere Durchgänge benötigen.
- Die Videoausgabe ist WebM. Audioübernahme hängt von den verfügbaren Browser-Codecs und dem Quelldateiformat ab.
- Das Limit von 50 MiB gilt pro Datei. GitHub speichert frühere Dateiversionen weiter in der Repository-Historie; auch stark komprimierte Uploads machen das Repository daher nicht unbegrenzt.
- Die Komprimierung läuft lokal im Browser. Die Originaldatei wird erst nach erfolgreicher lokaler Verarbeitung an GitHub übertragen.

## Technische Änderungen

- Aktualisierte Datei scripts/media-upload-offscreen.js mit erweiterten Foto-Profilen und mehrstufiger Video-Neukodierung.
- Versionsnummer in manifest.json auf 3.15.1 erhöht.

## Fehlerbehebungen und Schutzmaßnahmen

- Die abschließende Größenprüfung verhindert, dass ein Komprimierungsergebnis über 50 MiB an das Medien-Repository übertragen wird.
- Die Originaldatei wird erst nach erfolgreicher lokaler Verarbeitung und Größenprüfung übertragen. Dateien, die die Grenze weiterhin überschreiten, werden abgewiesen.

## Bekannte Grenzen und mögliche nächste Verbesserungen

- Ein Upload kann nach dem vollständigen Beenden von Chrome nicht weiterlaufen. Eine Wiederaufnahme nach einem Browser-Neustart wäre eine mögliche zukünftige Erweiterung.
- Animierte GIF-, APNG- und WebP-Dateien sowie SVG bleiben unverändert. Eine spätere Optimierung müsste Animation und Vektorinhalt zuverlässig erhalten.
- Das Limit von 50 MiB gilt pro Datei. GitHub behält frühere Dateiversionen in der Repository-Historie; langfristiges Repository-Wachstum benötigt deshalb zusätzlich eine Speicher- und Aufbewahrungsstrategie.
- Die Video-Neukodierung hängt von Browser-Codecs ab. Zusätzliche Codec- und Geräteprüfungen könnten die Kompatibilität weiter verbessern.
