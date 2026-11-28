# Nächste Schritte zur produktiven Verbindung

## Tarif und Zahlung
- Free: 1 GiB kostenlos
- Premium: 10 GiB für 2,99 EUR pro Monat
- Zahlungsweg: Mollie SEPA-Lastschrift mit automatischer monatlicher Abbuchung nach gültiger Mandatserteilung

## Bereits im Branch vorbereitet
- Supabase-Projektadresse und öffentlicher Publishable Key in der Extension
- Datenbankmigration für den einzelnen Premium-Tarif
- Mollie Checkout Edge Function für die erste Zahlung/Mandatserteilung
- Mollie Webhook Edge Function für die Prüfung bei Mollie und die Erstellung des monatlichen Abonnements
- UI zeigt nur noch Free und Premium
- Checkout bleibt deaktiviert, bis Backend-Identität und Secrets eingerichtet sind

## Vor dem Testbetrieb
1. Migrationen in Supabase prüfen und deployen.
2. Supabase Edge Functions `create-checkout` und `mollie-webhook` deployen.
3. Mollie Test-API-Key als `MOLLIE_API_KEY` in Supabase Secrets hinterlegen.
4. `MOLLIE_WEBHOOK_URL` auf die öffentliche HTTPS-Adresse der deployten Webhook-Funktion setzen.
5. `SCHLEIM_CLOUD_RETURN_URL` auf die HTTPS-Rücksprungseite der Schleim Cloud setzen.
6. Mollie-Testprofil und SEPA-Lastschrift-Testmöglichkeiten prüfen.
7. GitHub Device Flow sicher mit Supabase Auth verbinden. GitHub Access Tokens sind keine Supabase JWTs.
8. Kündigung, Rücklastschrift, fehlgeschlagene Zahlungen, Webhook-Duplikate und Speicherquota ergänzen und testen.

## Wichtige Grenzen
Die API-Funktionen sind im Repository vorbereitet, aber nicht im Supabase-Projekt deployed und nicht live verifiziert. Ohne Identitätsbrücke kann ein Schleim-OS-GitHub-Login keinen Checkout authentifizieren. Keine echten Zahlungen auslösen, bevor Testbetrieb und ausdrückliche Produktionsfreigabe abgeschlossen sind.
