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

## Schritt 5 – Klarna Playground vorbereiten

1. Playground-Konto für Europe im Klarna-Partnerportal erstellen bzw. anmelden.
2. Dort Playground API Username/Key ID und API Password/Secret erzeugen.
3. Prüfen lassen, ob Klarna Payments und Customer Tokens für wiederkehrende Abos im Händlerkonto und für Deutschland freigeschaltet sind.
4. Die beiden Playground-Zugangsdaten später ausschließlich als Supabase Edge Function Secrets setzen: `KLARNA_ENVIRONMENT=playground`, `KLARNA_REGION=eu`, `KLARNA_API_USERNAME`, `KLARNA_API_PASSWORD`.
5. Niemals Klarna-Secrets in GitHub, Browser/Android oder Chat eintragen.

Die vollständige technische Testplanung steht in [KLARNA-SANDBOX.md](./KLARNA-SANDBOX.md). Klarna Playground-Testkäufe lösen keine echten Zahlungen aus. Nur synthetische Testdaten verwenden.

## Schritt 6 – Zahlungsintegration

Backend-seitig Klarna Checkout-Session, Autorisierung, Customer Token, Verlängerungs-Scheduler, Idempotenz, Webhook-/Statusverarbeitung, Kündigung und fehlgeschlagene Zahlungen implementieren. Ein bestätigter Zahlungsvorgang muss serverseitig den Tarif aktualisieren. Bis alle Tests bestanden sind, bleibt der Checkout deaktiviert.

## Sicherheitsgrenze

Es werden keine Bankdaten benötigt und keine Live-Zahlungen aktiviert. Eine spätere Freigabe für den Produktivbetrieb erfolgt nur nach ausdrücklicher Zustimmung. Die Klarna-Verfügbarkeit für wiederkehrende Zahlungen muss vor einer Zusage von Klarna bestätigt werden.
