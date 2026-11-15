# Schleim OS 3.15.5 – Demo, Template-Bereinigung und Release-Pakete

## Deutsch

### Standalone-Demo
- Fehler im App-Katalog behoben, der durch ein fehlendes Komma nach dem Kamera-Demo-Eintrag verursacht wurde.
- Kamera-Demo erweitert: Front- und Rückkamera wechseln, Fotos aufnehmen und Videos direkt im Browser aufzeichnen.
- Demo-Fotos und -Videos werden nur lokal angezeigt. Die Standalone-Demo führt keine echte GitHub-Anmeldung durch und lädt keine Medien auf einen Server hoch.
- Beispiel-Konto, Foto-/Video-Cloud, Galerie und Kamera sind als klar gekennzeichnete Demo-Bereiche enthalten.

### Neutrales Extension-Template
- Original-spezifische Demo-IDs und Store-Bezeichnungen durch neutrale Browser-OS-Bezeichnungen ersetzt.
- Konto-Sitzung erhält einen neutralen Speicherschlüssel; vorhandene Template-Sitzungen werden einmalig migriert.
- Medien-Upload prüft jetzt den konfigurierten Medien-Repository-Namen statt eines fest eingebauten Projekt-Repositorys.
- Neue Medienindizes verwenden ein neutrales Format; vorhandene ältere Template-Indizes bleiben lesbar.
- Browser-Store-Admin akzeptiert nur noch das neutrale Schlüssel- und Issue-Format.
- Konto-, Cloud-, Installations- und Technik-Dokumentation in Deutsch, Englisch, Niederländisch und Leichter Sprache ergänzt und die Sprach-README-Links korrigiert.
- Die veraltete Sonos-spezifische Template-Dokumentation wurde durch allgemeine Hinweise zu externen Web-Apps ersetzt.

### Release-Pakete
- Original-Extension bleibt als `Schleim-OS-Extension.zip` verfügbar.
- Das neutrale Template wird als `Browser-OS-Extension-Template.zip` veröffentlicht.
- Die SHA-256-Prüfsummen werden für beide Pakete neu erzeugt.

## English

### Standalone demo
- Fixed an app catalogue syntax error caused by a missing comma after the camera demo entry.
- Extended the camera demo with front/rear camera switching, photo capture and local video recording in the browser.
- Demo photos and videos remain local. The standalone demo does not perform real GitHub sign-in or upload media to a server.
- Sample account, photo/video cloud, gallery and camera areas are included as clearly labelled demo features.

### Neutral extension template
- Replaced original-project demo IDs and Store labels with neutral Browser OS identifiers.
- The account session now uses a neutral storage key; existing template sessions are migrated once.
- Media uploads now validate the configured media repository name instead of a hard-coded project repository.
- New media indexes use a neutral format while older template indexes remain readable.
- Browser Store administration now accepts only the neutral key and issue format.
- Added account, cloud, installation and technical guides in German, English, Dutch and Easy Language; fixed links in the language READMEs.
- Replaced the outdated Sonos-specific template document with general external web-app guidance.

### Release packages
- The original extension remains available as `Schleim-OS-Extension.zip`.
- The neutral template is published as `Browser-OS-Extension-Template.zip`.
- SHA-256 checksums are regenerated for both packages.

## Nederlands

### Standalone-demo
- Een syntaxisfout in de appcatalogus opgelost die werd veroorzaakt door een ontbrekende komma na de camera-demo.
- De camerademo uitgebreid met wisselen tussen voor- en achtercamera, foto’s maken en lokaal video opnemen in de browser.
- Demo-foto’s en -video’s blijven lokaal. De standalone demo voert geen echte GitHub-aanmelding uit en uploadt geen media naar een server.
- Voorbeeldaccount, foto-/videocloud, galerij en camera zijn opgenomen als duidelijk gemarkeerde demofuncties.

### Neutraal extensietemplate
- Oorspronkelijke project-ID’s en Store-labels vervangen door neutrale Browser OS-aanduidingen.
- De accountsessie gebruikt nu een neutrale opslagsleutel; bestaande templatesessies worden eenmalig gemigreerd.
- Media-uploads controleren nu de ingestelde mediarepository in plaats van een vast ingestelde projectrepository.
- Nieuwe media-indexen gebruiken een neutraal formaat; oudere template-indexen blijven leesbaar.
- Browser Store-beheer accepteert voortaan alleen het neutrale sleutel- en issueformaat.
- Account-, cloud-, installatie- en technische handleidingen toegevoegd in het Duits, Engels, Nederlands en eenvoudige taal; links in de taal-README’s gecorrigeerd.
- De verouderde Sonos-specifieke templatehandleiding vervangen door algemene uitleg over externe webapps.

### Releasepakketten
- De oorspronkelijke extensie blijft beschikbaar als `Schleim-OS-Extension.zip`.
- Het neutrale template wordt gepubliceerd als `Browser-OS-Extension-Template.zip`.
- SHA-256-controlesommen worden voor beide pakketten opnieuw aangemaakt.

## Browser- und Installationshinweise

Die Original-Extension und das neutrale Template werden als getrennte ZIP-Dateien veröffentlicht. Bei Browsern mit lokalem ZIP-Import bleibt die ZIP-Datei unverändert; Import und Bestätigung werden manuell im Browser gestartet. Normales Google Chrome für Android unterstützt keine Erweiterungen. Desktop-Chrome lädt im Entwicklermodus entpackte Ordner und unterstützt keinen direkten ZIP-Import.

The original extension and neutral template are published as separate ZIP files. In browsers that support local ZIP import, keep the ZIP unchanged; start the import and confirmation manually in the browser. Standard Google Chrome for Android does not support extensions. Desktop Chrome's Developer mode loads extracted folders and does not support direct ZIP import.

De oorspronkelijke extensie en het neutrale template worden als aparte ZIP-bestanden gepubliceerd. In browsers met lokale ZIP-import blijft het ZIP-bestand ongewijzigd; het importeren en bevestigen start je handmatig in de browser. De gewone Google Chrome voor Android ondersteunt geen extensies. Desktop-Chrome laadt uitgepakte mappen in de ontwikkelaarsmodus en ondersteunt geen rechtstreekse ZIP-import.
