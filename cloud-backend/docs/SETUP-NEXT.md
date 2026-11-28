# Was als Nächstes benötigt wird

## Schritt 1 – Supabase
Später benötigen wir die Supabase Project URL und den öffentlichen anon/public key. Der Service-Role-Key bleibt ausschließlich als Supabase Edge Function Secret auf dem Server. Bitte niemals hier im Chat oder im App-Code teilen.

## Schritt 2 – Schleim-Konto verbinden
Die vorhandene Anmeldung verwendet GitHub Device Flow. Sie stellt noch kein Supabase-Auth-JWT aus. Wir müssen eine serverseitige Verknüpfung einrichten, die das GitHub-Token bei GitHub validiert und die Schleim-Konto-ID sicher einer Supabase-Identität zuordnet. Bis dahin werden keine Kontodaten erfunden und keine Quota-Entscheidungen clientseitig getroffen.

## Schritt 3 – Speicher
Supabase Storage Bucket und Upload-Edge-Function einrichten. Jeder Upload muss serverseitig Identität, Dateigröße, Verbrauch und Tariflimit prüfen.

## Schritt 4 – Zahlung
Zuerst Stripe im Testmodus prüfen. Klarna wird separat auf wiederkehrende Zahlungen geprüft. Live-Zahlungen bleiben bis zur ausdrücklichen Freigabe ausgeschaltet.
