# Schleim OS 3.15.7 – Kamerabereiche getrennt

## Deutsch

### Original-Extension
- Die normale JavaScript-Webkamera bleibt Bestandteil der Browser-Extension.
- Live-Vorschau, Kamera starten, Kamera deaktivieren, Front-/Rückkamera wechseln, Foto aufnehmen und Video aufnehmen bleiben verfügbar.
- Die Aufnahmen verwenden die Web Camera API (`getUserMedia` und `MediaRecorder`) des jeweiligen Browsers und dessen Berechtigungsdialoge.

### Android-Anwendung
- Die native Android-Kamera-Integration wurde vollständig entfernt.
- Die Android-App fordert keine Kamera- oder Mikrofonberechtigungen an und lehnt Medienaufnahme-Anfragen ab.
- Die Kamera-Seite zeigt in der Android-App ausschließlich einen eigenen Hinweisbereich: Foto- und Videoaufnahmen werden dort nicht unterstützt.
- Der Hinweisbereich und der Webkamera-Bereich der Original-Extension sind in der Oberfläche klar voneinander getrennt.

### Android-Paket
- Android-Anwendung auf Alpha 14 aktualisiert.
- GitHub Actions prüft die getrennte Anzeige der beiden Kamerabereiche und baut das Android-APK.

## English

### Original browser extension
- The normal JavaScript webcam remains part of the browser extension.
- Live preview, start camera, turn camera off, switch front/rear camera, take photo and record video remain available.
- Captures use the browser's Web Camera API (`getUserMedia` and `MediaRecorder`) and its permission prompts.

### Android application
- The native Android camera integration has been fully removed.
- The Android app does not request camera or microphone permissions and rejects media-capture requests.
- The camera page shows only a dedicated notice in the Android app: photo and video capture are not supported there.
- The Android notice and the original extension's webcam panel are clearly separated in the interface.

### Android package
- Updated the Android application to Alpha 14.
- GitHub Actions validates the separation of both camera sections and builds the Android APK.

## Nederlands

### Oorspronkelijke browserextensie
- De normale JavaScript-webcamera blijft onderdeel van de browserextensie.
- Livevoorbeeld, camera starten, camera uitschakelen, wisselen tussen voor- en achtercamera, foto maken en video opnemen blijven beschikbaar.
- Opnamen gebruiken de Web Camera API (`getUserMedia` en `MediaRecorder`) van de browser en de bijbehorende toestemmingsvensters.

### Android-app
- De native Android-camera-integratie is volledig verwijderd.
- De Android-app vraagt geen camera- of microfoonmachtigingen aan en weigert verzoeken om media op te nemen.
- De camerapagina toont in de Android-app uitsluitend een apart informatievak: foto- en video-opnamen worden daar niet ondersteund.
- De Android-melding en het webcamgedeelte van de oorspronkelijke extensie zijn duidelijk van elkaar gescheiden.

### Android-pakket
- De Android-app is bijgewerkt naar Alpha 14.
- GitHub Actions controleert de scheiding van beide cameragedeelten en bouwt de Android-APK.
