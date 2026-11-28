# Was als Nächstes benötigt wird

## Schritt 1 – Supabase-Projekt
Die Projektadresse und der öffentliche Publishable Key wurden in den GitHub-Änderungszweig eingetragen:
- Project URL: https://hrtunnupqcpklejpfsvq.supabase.co
- Publishable Key: in der Erweiterungs-Konfiguration hinterlegt

Der Publishable Key ist für Client-Anwendungen vorgesehen. Den **Service-Role-Key niemals** in den Chat, ins Repository, in die Browser-Erweiterung oder in die Android-App eintragen. Er gehört ausschließlich als geschütztes Secret in die Supabase-Edge-Function-Umgebung.

## Schritt 2 – Datenbank und Funktionen bereitstellen
Die SQL-Migration muss im Supabase-Projekt ausgeführt und die Edge Functions `account-summary` sowie `create-checkout` müssen deployed werden. Dafür werden die serverseitigen Secrets `SUPABASE_URL`, `SUPABASE_ANON_KEY` und `SUPABASE_SERVICE_ROLE_KEY` benötigt. Der Service-Role-Key bleibt ausschließlich in Supabase.

## Schritt 3 – Schleim-Konto verbinden
Die vorhandene Anmeldung verwendet GitHub Device Flow. Sie stellt noch kein Supabase-Auth-JWT aus. Wir müssen eine serverseitige Verknüpfung einrichten, die das GitHub-Token bei GitHub validiert und die Schleim-Konto-ID sicher einer Supabase-Identität zuordnet. Bis dahin werden keine Kontodaten erfunden und keine Quota-Entscheidungen clientseitig getroffen.

## Schritt 4 – Speicher
Supabase Storage Bucket und Upload-Edge-Function einrichten. Jeder Upload muss serverseitig Identität, Dateigröße, Verbrauch und Tariflimit prüfen. Derzeit sind die Tariflimits noch nicht technisch auf Uploads durchgesetzt.

## Schritt 5 – Zahlung
Checkout bleibt deaktiviert. Zuerst Stripe im Testmodus prüfen. Klarna wird separat auf wiederkehrende Zahlungen geprüft. Live-Zahlungen bleiben bis zur ausdrücklichen Freigabe ausgeschaltet.
