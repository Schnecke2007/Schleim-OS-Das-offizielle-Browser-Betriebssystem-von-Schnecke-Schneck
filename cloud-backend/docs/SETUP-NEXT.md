# Nächste Schritte zur produktiven Verbindung

Die technische Checkliste für Mollie SEPA-Lastschrift und automatische monatliche Abos steht in [MOLLIE-SEPA-SETUP.md](./MOLLIE-SEPA-SETUP.md).

## Bereits vorhanden
- Supabase-Projektadresse und öffentlicher Publishable Key in der Extension
- Datenbank-Grundschema für Free 1 GiB, Premium 10 GiB und Premium Plus 50 GiB
- Kontoübersicht als Edge Function
- Checkout-Endpunkt, der bis zur vollständigen Einrichtung sicher deaktiviert bleibt
- Abo-Bereich im Schleim-Konto
- Festgelegte Zahlungsentscheidung: Mollie SEPA-Lastschrift mit automatischer monatlicher Abbuchung nach ausdrücklicher Mandatserteilung

## Noch zwingend umzusetzen
1. GitHub Device Flow sicher mit einer internen Schleim-Konto-Identität verbinden. GitHub-Tokens sind keine Supabase Auth JWTs.
2. SQL-Migrationen und Edge Functions im tatsächlichen Supabase-Projekt deployen.
3. Supabase Storage so konfigurieren, dass direkte Client-Uploads die Quota-Prüfung nicht umgehen können.
4. Serverseitigen Upload-Endpunkt mit transaktionssicherer Quota-Prüfung implementieren.
5. Mollie-Händlerkonto einrichten und SEPA-Lastschrift sowie wiederkehrende Zahlungen freischalten lassen.
6. Verbindliche monatliche Verkaufspreise für Premium und Premium Plus festlegen.
7. Mollie-Kundenprofile, Erstzahlung/Mandat, monatliche Subscription API, Webhook-Verarbeitung, Idempotenz, Statusabgleich, Scheduler und Kündigung implementieren.
8. Rechtliche Checkout-Angaben, SEPA-Mandatstext, AGB, Datenschutz, Kündigungs- und Rückerstattungsregeln vervollständigen.
9. Browser-Erweiterung und Android-App gegen dasselbe Backend testen und erst danach produktiv freigeben.

## Geheimnisse
Mollie Live-/Test-API-Schlüssel und Supabase Service-Role-Key ausschließlich in Supabase Edge Function Secrets speichern. Niemals in GitHub, Client-Code oder Chat eintragen.

## Status
Die Zahlungsentscheidung ist auf Mollie SEPA-Lastschrift mit automatischer monatlicher Abbuchung festgelegt. Die Mollie-API-Verbindung ist noch nicht implementiert oder aktiviert. Der Checkout bleibt gesperrt; es werden keine Abbuchungen ausgelöst. Speicherlimits werden noch nicht vollständig serverseitig erzwungen.
