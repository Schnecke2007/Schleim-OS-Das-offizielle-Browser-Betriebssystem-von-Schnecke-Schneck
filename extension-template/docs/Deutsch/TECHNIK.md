# Funktionen und Technik

Die Vorlage enthält eine mehrsprachige Startseite, App-Suche, Schnell-Einstellungen und einen Browser Store.

## Konto und Cloud
Das Beispiel-Konto nutzt GitHub Device Flow. Nach Einrichtung einer eigenen GitHub App kann es Einstellungen in einem privaten Repository sichern.

## Foto- und Video-Cloud
Die Medien-App enthält Galerie, Dateisuche, Kamera und Videoaufnahme. Sie ist für ein eigenes privates GitHub-Medien-Repository vorgesehen. Die Kamera benötigt die Freigabe des Browsers.

## Kamera
Die Kamera-App kann – abhängig vom Browser und Gerät – die Front- oder Rückkamera verwenden. Mikrofon- und Kamerazugriff müssen ausdrücklich erlaubt werden.

## Demo
Die Datei `standalone/browser-os-standalone.html` ist eine eigenständige Web-Demo. Sie ist nicht die installierbare Erweiterung. Prüfe die Demo-Funktionen separat; Browser-APIs und GitHub-Anmeldung können sich in einer normalen Webseite anders verhalten als in einer Erweiterung.