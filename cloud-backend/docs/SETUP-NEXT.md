# Nächste Schritte zur produktiven Verbindung

Die technische Produktions-Checkliste mit den Verbindungswegen steht in [KLARNA-PRODUCTION-SETUP.md](./KLARNA-PRODUCTION-SETUP.md).

## Bereits vorhanden
- Supabase-Projektadresse und öffentlicher Publishable Key in der Extension
- Datenbank-Grundschema für Free 1 GiB, Premium 10 GiB und Premium Plus 50 GiB
- Kontoübersicht als Edge Function
- Checkout-Endpunkt, der bis zur vollständigen Einrichtung sicher deaktiviert bleibt
- Abo-Bereich im Schleim-Konto
- Klarna als einziger vorgesehener Zahlungsdienst

## Noch zwingend umzusetzen
1. GitHub Device Flow sicher mit einer internen Schleim-Konto-Identität verbinden. GitHub-Tokens sind keine Supabase Auth JWTs.
2. SQL-Migrationen und Edge Functions im tatsächlichen Supabase-Projekt deployen.
3. Supabase Storage so konfigurieren, dass direkte Client-Uploads die Quota-Prüfung nicht umgehen können.
4. Serverseitigen Upload-Endpunkt mit transaktionssicherer Quota-Prüfung implementieren.
5. Klarna-Händlerkonto für Deutschland/EUR und Customer Tokens für wiederkehrende Händlerbelastungen freischalten lassen.
6. Das konkrete Klarna-API-Produkt samt API-Version, Authentifizierung und Webhook-Vertrag festlegen.
7. Serverseitigen Klarna-Checkout, Tokenisierung, Verlängerungs-Scheduler, Idempotenz, Zahlungsstatusabgleich, Webhook-Empfang und Kündigung implementieren.
8. Verbindliche Verkaufspreise und rechtliche Checkout-Angaben festlegen.
9. Browser-Erweiterung und Android-App gegen dasselbe Backend testen und erst danach produktiv freigeben.

## Geheimnisse
Produktions-API-Schlüssel, Webhook-Signaturschlüssel und Supabase Service-Role-Key ausschließlich in Supabase Edge Function Secrets speichern. Niemals in GitHub, Client-Code oder Chat eintragen.

## Status
Es ist derzeit keine Klarna-Verbindung aktiv. Der Checkout kann nicht genutzt werden. Speicherlimits werden noch nicht serverseitig erzwungen. Die Dokumentation behauptet ausdrücklich keine bereits erfolgte Aktivierung. Live-Zahlungen bleiben bis zur ausdrücklichen Produktionsfreigabe gesperrt.
