# Schleim OS 3.15.4 – aktualisierte Standalone-Demo und mehrsprachiges Template

## Deutsch

- Die Standalone-Demo enthält jetzt ein Beispiel-Konto, eine lokale Foto- und Video-Cloud-Demo sowie eine Kamera-Demo mit Browserfreigabe.
- Lokale Bilder und Videos können in der Demo ausgewählt und als Vorschau angezeigt werden. Sie werden nicht an einen Server übertragen.
- Die Haupt-Extension enthält weiterhin die Hintergrundverarbeitung für Foto- und Video-Uploads.
- Das neutrale Template erhält die gleiche Hintergrund-Upload-Verarbeitung mit Service Worker, Offscreen-Dokument, Fortschritt und Benachrichtigungen.
- Template-Dateien und Dokumentation sind neutral benannt und in Deutsch, Englisch, Niederländisch sowie Leichter Sprache in allen drei Sprachen organisiert.
- Die Release-Pakete bleiben getrennt: Original-Extension und neutrales Template.

## English

- The standalone demo now includes a sample account, a local photo/video cloud demo and a camera demo using browser permissions.
- Local images and videos can be selected and previewed in the demo. They are not uploaded to a server.
- The main extension retains background processing for photo and video uploads.
- The neutral template now includes the same background upload flow with a service worker, offscreen document, progress and notifications.
- Template files and documentation use neutral names and are organized in German, English, Dutch and Easy Language in all three languages.
- The release packages remain separate: original extension and neutral template.

## Nederlands

- De zelfstandige demo bevat nu een voorbeeldaccount, een lokale foto-/videoclouddemo en een camerademo met browsermachtigingen.
- Lokale foto's en video's kunnen in de demo worden geselecteerd en als voorbeeld worden bekeken. Ze worden niet naar een server geüpload.
- De hoofdextensie behoudt de achtergrondverwerking voor foto- en video-uploads.
- Het neutrale template bevat nu dezelfde achtergrond-uploadverwerking met serviceworker, offscreen-document, voortgang en meldingen.
- Templatebestanden en documentatie hebben neutrale namen en zijn geordend in Duits, Engels, Nederlands en eenvoudige taal in alle drie de talen.
- De releasepakketten blijven gescheiden: de oorspronkelijke extensie en het neutrale template.

## Browser compatibility

The camera demo requires browser permission and a secure context (HTTPS or localhost). Direct ZIP import is only available in browsers that explicitly support it. Standard Chrome for Android does not support extensions; desktop Chrome's Developer mode loads a folder rather than a ZIP. Do not extract a ZIP when using a browser's ZIP-import function.
