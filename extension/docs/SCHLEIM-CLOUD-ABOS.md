# Schleim Cloud, Speicher und Abos

Das Abo-Modul erscheint in den Einstellungen direkt im Bereich Schleim-Konto. Die Android-App verwendet dieselbe Extension-Datei: Der Android-Release-Workflow kopiert den Inhalt von extension/ nach android/app/src/main/assets/extension/.

## Eingebauter Stand
- Tarifmodell vorbereitet: Free 1 GiB, Premium 10 GiB, Premium Plus 50 GiB.
- SQL-Grundschema für Tarife, Abos und Speicherverbrauch hinzugefügt.
- Edge Function account-summary liest den Kontostand ausschließlich mit einer gültigen Supabase-Auth-Sitzung.
- create-checkout ist absichtlich gesperrt und gibt PAYMENTS_NOT_CONFIGURED zurück.
- Im Client sind keine Zahlungsgeheimnisse hinterlegt.

## Noch nicht aktiv
Das bestehende Schleim-Konto verwendet GitHub Device Flow. Ein GitHub Access Token ist kein Supabase Auth JWT. Deshalb wird dieser Token nicht einfach an Supabase weitergereicht. Die serverseitige Identitätsverknüpfung und die echte Speicher-Upload-Prüfung müssen vor dem Live-Betrieb ergänzt werden. Die 1-GiB-Anzeige ist derzeit ein vorgesehener Tarifwert und noch keine technisch durchgesetzte Speichergrenze.

## Zahlungssicherheit
Es wird kein Bankkonto verbunden und es kann keine Zahlung ausgelöst werden. Klarna wird als gewünschte Option vorgemerkt; automatische wiederkehrende Zahlungen müssen vorab mit dem Zahlungsanbieter geprüft werden. Stripe kann zunächst ausschließlich im Testmodus eingerichtet werden.
