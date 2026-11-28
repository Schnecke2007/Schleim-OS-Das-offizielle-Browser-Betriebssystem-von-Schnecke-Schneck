# Schleim OS Cloud Backend

**Tarifmodell:** Free mit 1 GiB sowie genau ein kostenpflichtiger Tarif: Premium mit 10 GiB für **2,99 € pro Monat**.

**Zahlungsdienst:** Mollie SEPA-Lastschrift mit automatischer monatlicher Abbuchung nach ausdrücklicher Mandatserteilung. Der Kunde autorisiert die erste Zahlung; der Server prüft anschließend das gültige SEPA-Mandat und richtet das monatliche Mollie-Abonnement ein.

Die bestehende Supabase-Projektadresse und der öffentliche Publishable Key bleiben Bestandteil der Architektur. Supabase verwaltet Konten, Abos und Speicher; Mollie verarbeitet Zahlungen. Ein Publishable Key ist für Client-Anwendungen vorgesehen und kein Administrationsschlüssel. Den `SUPABASE_SERVICE_ROLE_KEY` und den `MOLLIE_API_KEY` niemals in Browser-/Android-Code, GitHub oder Chat eintragen.

## Tarifmodell

- Free: 1 GiB, kostenlos
- Premium: 10 GiB, 2,99 EUR pro Monat

Der Betrag wird serverseitig aus der Tarifkonfiguration gelesen. Der Client darf keinen Betrag vorgeben.

## Implementierter Integrationsstand im Branch

- Datenbankmigration für Premium 10 GiB / 299 Cent pro Monat und Entfernung von Premium Plus.
- Mollie Checkout Edge Function: erstellt Kundenprofil und erste Zahlung mit `sequenceType: first`.
- Mollie Webhook Edge Function: ruft den Zahlungsstatus direkt bei Mollie ab, prüft das gültige SEPA-Mandat und legt das monatliche Abonnement an; weitere bezahlte Abozahlungen aktualisieren den Abostatus.
- UI zeigt nur Free und Premium 10 GB / 2,99 € monatlich.
- Checkout bleibt praktisch nicht nutzbar, solange die Supabase-Identitätsbrücke, Secrets, Rücksprung-URL und Mollie-Freischaltung fehlen.

## Noch nicht produktionsbereit

Die Implementierung ist noch nicht auf dem echten Supabase-Projekt deployed oder mit einem Mollie-Händlerkonto end-to-end getestet. Der GitHub Device Flow ist kein Supabase Auth JWT. Vor dem Livebetrieb müssen Identitätsbrücke, Kündigungs-Endpunkt, Rücklastschrift-/Erstattungsbehandlung, robuste Webhook-Idempotenz, periodengenaue Statusabgleiche und serverseitige Speicherquota vollständig getestet werden.

## Benötigte Supabase Edge Function Secrets

- `MOLLIE_API_KEY`: Mollie Test-Key für Tests; später Live-Key nach Freigabe
- `MOLLIE_WEBHOOK_URL`: öffentliche HTTPS-URL der deployten `mollie-webhook` Function
- `SCHLEIM_CLOUD_RETURN_URL`: HTTPS-Rücksprungadresse der Cloud-Kontooberfläche
- `SUPABASE_SERVICE_ROLE_KEY`: ausschließlich serverseitig
- Supabase stellt `SUPABASE_URL` und `SUPABASE_ANON_KEY` im Function-Kontext bereit

Keine Schlüssel in das Repository schreiben.

## Weiterführende Dokumentation

Siehe [Mollie SEPA Setup](docs/MOLLIE-SEPA-SETUP.md).

Offizielle API-Referenzen:
- [Mollie Recurring Payments](https://docs.mollie.com/docs/recurring-payments)
- [Create subscription](https://docs.mollie.com/reference/create-subscription)
- [Mandates API](https://docs.mollie.com/reference/mandates-api)
- [Webhooks](https://docs.mollie.com/reference/webhooks)
