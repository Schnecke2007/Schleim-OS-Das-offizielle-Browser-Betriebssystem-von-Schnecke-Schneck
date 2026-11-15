# Version 3.2.0 – Suchfunktion & haptisches Feedback

- Eigene Apps aus dem App-Editor erscheinen jetzt ebenfalls in der Spotlight-Suche.
- Die Suche berücksichtigt den selbst vergebenen App-Namen, die vollständige URL und die Domain.
- Suchtreffer eigener Apps zeigen das gespeicherte Icon bzw. das Favicon und öffnen die Webseite in einem neuen Tab.
- Änderungen, neue Apps und gelöschte Apps werden sofort an die Suche gemeldet.
- Interaktive Bedienelemente lösen über `navigator.vibrate(10)` eine kurze Vibration aus, sofern der Browser und das Gerät die Vibration API unterstützen. Nicht unterstützte Umgebungen laufen ohne Fehler weiter.
- Die bestehenden Speicher-, Import-/Export- und Personalisierungsdaten bleiben im gleichen localStorage-Schlüssel erhalten.

## Hinweis zur Vibration

Die Vibration ist eine Browserfunktion und keine systemweite OS-Steuerung. Sie funktioniert nur auf Geräten und in Browsern, die `navigator.vibrate()` unterstützen und die Ausführung im jeweiligen Kontext zulassen. Auf Desktop-Geräten und nicht unterstützten Browsern bleibt die Bedienung normal nutzbar.
