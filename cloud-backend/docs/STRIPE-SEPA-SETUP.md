# Schleim Cloud – Stripe Kartenzahlung

## Tarif
- Free: 1 GiB, kostenlos
- Premium: 10 GiB, **2,99 EUR pro Monat**
- Genau ein kostenpflichtiger Tarif.

## Ablauf
1. Der angemeldete Kunde wählt Premium.
2. Der Server liest den Premium-Tarif und prüft 299 Cent, EUR und monatliches Intervall.
3. Die Edge Function erstellt eine Stripe Checkout Session im Subscription-Modus.
4. Der Kunde wird zu Stripe Checkout weitergeleitet und gibt seine Kartendaten ein. Stripe sammelt die Kartenzahlung im Checkout.
5. Stripe sendet signierte Webhook-Ereignisse. Die Edge Function prüft die Signatur mit `STRIPE_WEBHOOK_SECRET`.
6. `checkout.session.completed` speichert das Abonnement zunächst als `pending`.
7. Erst `invoice.paid` aktiviert Premium. `invoice.payment_failed` setzt den Status auf `past_due`; Kündigungen werden als `canceled` markiert.

## API und Schlüssel
- API-Basisadresse: `https://api.stripe.com/v1`
- Test Secret Key: `sk_test_...`
- Live Secret Key: `sk_live_...`
- Webhook Signing Secret: `whsec_...`
- Supabase Edge Function Secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SCHLEIM_CLOUD_RETURN_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

Der Secret Key gehört ausschließlich auf den Server. Der Browser bzw. die Android-App darf ihn niemals erhalten.

## Stripe Webhook
Endpunkt nach Deployment:
`https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`

Ereignisse:
- `checkout.session.completed`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Händlerkonto und Live-Betrieb
Das Stripe-Konto muss vollständig eingerichtet und verifiziert sein. Kartenzahlung muss für das Konto verfügbar sein. Für Tests zuerst Testschlüssel verwenden. Live-Zahlungen sind erst nach erfolgreichem Test, sicherer Authentifizierung, Deployment und Hinterlegen der Live-Secrets möglich.

## Offene Produktionsarbeiten
- Supabase-Migrationen und Edge Functions deployen und testen.
- GitHub Device Flow sicher mit Supabase Auth verbinden; GitHub-Tokens sind keine Supabase JWTs.
- Kündigungs-Endpunkt und UI-Button implementieren.
- Rücklastschriften, Erstattungen und vollständige Webhook-Idempotenz ergänzen.
- Serverseitige Speicherquota erzwingen.
- Perioden-/Zahlungsstatus regelmäßig mit Stripe abgleichen.
- Rechtliche Anbieterangaben, AGB, Datenschutz, Kündigungsregeln und Supportinformationen vervollständigen.

Es werden keine echten Abbuchungen vorgenommen, solange keine Live-Zugangsdaten hinterlegt und der Produktivbetrieb ausdrücklich freigegeben wurde.
