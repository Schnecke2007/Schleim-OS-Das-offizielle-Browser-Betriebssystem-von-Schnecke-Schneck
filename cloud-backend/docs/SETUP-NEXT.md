# Nächste Schritte zur produktiven Verbindung

## Tarif und Zahlung
- Free: 1 GiB kostenlos
- Premium: 10 GiB für 2,99 EUR pro Monat
- Zahlungsdienst: Stripe Checkout + Billing mit SEPA-Lastschrift

## Im Feature-Branch vorbereitet
- Stripe Checkout Session im Subscription-Modus
- Monatlicher Betrag von 2,99 EUR wird serverseitig festgelegt
- Stripe Webhook-Signaturprüfung
- Aktivierung nach `invoice.paid`, Statusbehandlung für fehlgeschlagene und beendete Abos
- Stripe statt Mollie in Konfiguration und Dokumentation

## Einrichtung in Stripe
1. Ein Stripe-Konto eröffnen und Unternehmens-/Händlerprüfung abschließen.
2. SEPA Direct Debit im Stripe Dashboard aktivieren bzw. prüfen.
3. Zunächst einen Test-Secret-Key (`sk_test_...`) erzeugen.
4. Supabase Edge Function Secrets setzen: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SCHLEIM_CLOUD_RETURN_URL` und `SUPABASE_SERVICE_ROLE_KEY`.
5. Die Edge Functions `create-checkout` und `stripe-webhook` deployen.
6. Im Stripe Dashboard einen Webhook auf `https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook` einrichten und die Ereignisse `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated` und `customer.subscription.deleted` abonnieren.
7. Das angezeigte Webhook-Signatur-Secret (`whsec_...`) als `STRIPE_WEBHOOK_SECRET` in Supabase hinterlegen.
8. Den Checkout im Testmodus mit SEPA-Testdaten durchtesten.
9. GitHub Device Flow sicher mit Supabase Auth verbinden. GitHub Access Tokens sind keine Supabase JWTs.

## Vor echten Abbuchungen zwingend erforderlich
- Sichere GitHub-/Supabase-Identitätsbrücke fertigstellen.
- Kündigungsfunktion und Behandlung von Rücklastschriften, Erstattungen und Zahlungsfehlern ergänzen.
- Webhook-Idempotenz und Statusabgleich vollständig testen.
- Serverseitige Speicherquota erzwingen.
- Rechtliche Anbieterangaben, AGB, Datenschutz, Preis-/Kündigungsinformationen und SEPA-Mandatstexte prüfen.
- Erst nach erfolgreichem Testbetrieb Live-Key (`sk_live_...`) und Live-Webhook-Secret einsetzen.

**Wichtig:** Die Integration ist nicht auf Supabase deployed. Es sind keine Live-Schlüssel vorhanden und keine echten Abbuchungen aktiviert. Ein Code-Commit allein aktiviert keine Abbuchungen.
