# Schleim OS 3.21.0 – Erweiterungsdetails und private Browserfenster

## Schleim Browser für Android

- **Details für jedes Add-on:** Im Erweiterungsmanager gibt es jetzt für jede installierte Erweiterung einen eigenen Button **Details**. Die Ansicht wird mit den tatsächlichen GeckoView-Metadaten dieses Add-ons gefüllt.
- **Add-on-Informationen:** Angezeigt werden – soweit vom Add-on bereitgestellt – Name, Version, Status, Beschreibung, Entwickler, Homepage, Mozilla-Add-ons-Link, Optionsseite, Bewertung sowie erforderliche Berechtigungen, Webseitenzugriffe und Datennutzungsangaben. Nicht vorhandene Angaben werden nicht erfunden.
- **Eigene Einstellungen:** Wenn GeckoView eine Optionsseite meldet, kann diese direkt aus den Details geöffnet werden. Gibt es keine Optionsseite, zeigt der Browser einen entsprechenden Hinweis.
- **Optionale Berechtigungen:** Optionale API-Berechtigungen, Webseitenzugriffe und Datennutzungsfreigaben werden einzeln angezeigt. Du kannst sie im Detailbereich gezielt erteilen oder widerrufen.
- **Private Fenster:** Für externe Add-ons, deren Manifest private Nutzung nicht ausdrücklich verbietet, gibt es die Einstellung **In privaten Fenstern ausführen**. Sie verwendet die GeckoView-Funktion setAllowedInPrivateBrowsing. Wenn das Manifest not_allowed angibt, bleibt die Freigabe gesperrt.
- **VPN- und Proxy-Add-ons:** Fordert eine Erweiterung die Berechtigung proxy an, wird sie als Proxy-Steuerung bezeichnet. Die Freigabe für private Fenster sorgt allein jedoch nicht für einen VPN-Tunnel. Die Erweiterung muss private Sitzungen selbst unterstützen und korrekt eingerichtet sein. Ein systemweiter VPN-Schutz wird dadurch nicht aktiviert.
- **Profil-Synchronisierung:** Der Zustand **In privaten Fenstern ausführen** wird zusammen mit dem Add-on-Aktivierungszustand in das verschlüsselte Browser-Profil-Backup aufgenommen und beim Wiederherstellen auf einem anderen Gerät erneut gesetzt.

## Datenschutz, Design und bestehende Funktionen

- Der dunkelbraune Stil **#251205**, Tabs, lokaler Browserverlauf, Lesezeichen, Passwort-Manager, Gastmodus und Add-on-Unterstützung bleiben bestehen.
- Die bestehende DNS-over-HTTPS-/NextDNS-Konfiguration bleibt exakt unverändert.
- Der Gastmodus bleibt vom regulären Profil und der Konto-Synchronisierung getrennt.

## Hinweise und Grenzen

- GeckoView kann nur Angaben anzeigen, die es für das installierte Add-on tatsächlich bereitstellt. Manche Erweiterungen haben keine Optionsseite oder liefern keine Entwickler- bzw. Bewertungsdaten.
- Nicht jede Firefox-Erweiterung ist mit GeckoView kompatibel. Auch eine erteilte private Freigabe garantiert nicht, dass jede Erweiterung in privaten Sitzungen alle Funktionen ausführt.
- Die Einstellung für private Fenster ist eine Browser-/Add-on-Berechtigung und kein Ersatz für eine separate VPN-App oder einen systemweiten Android-VPN-Tunnel.

## Versionen

- Browser-Extension: **3.21.0**
- Schleim Browser für Android: **0.1.0-alpha31**
- Mozilla GeckoView · Android 8.0+ · ARM64

Die Android-APK verwendet die normale Android-Debug-Signierung. Je nach Build kann eine Deinstallation der vorherigen App erforderlich sein. Sichere wichtige lokale Daten und erstelle bei Bedarf vorher ein verschlüsseltes Profil-Backup.
