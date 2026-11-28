# Schleim OS Cloud Backend

**Tarifmodell:** Free mit 1 GiB sowie genau ein kostenpflichtiger Tarif: Premium mit 10 GiB für **2,99 € pro Monat**.

**Zahlungsdienst:** Stripe Checkout + Stripe Billing mit SEPA-Lastschrift und automatischer monatlicher Abrechnung nach ausdrücklicher Mandatserteilung im Checkout.

Supabase bleibt das Cloud-Backend für Konten, Abos und Speicher. Stripe verarbeitet ausschließlich Zahlungen. Die Stripe-API-Adresse lautet `https://api.stripe.com/v1`. Der geheime Stripe-Schlüssel darf nur serverseitig in Supabase Edge Function Secrets liegen. Niemals einen Secret Key oder Supabase Service Role Key in Browser-/Android-Code, GitHub oder Chat eintragen.

## Tarifmodell
- Free: 1 GiB, kostenlos
- Premium: 10 GiB, 2,99 EUR pro Monat

Der Betrag wird serverseitig aus der Tarifkonfiguration geprüft. Der Client kann keinen Betrag vorgeben.

## Stripe-Integration im Branch
- Stripe Checkout Session im Abonnementmodus mit SEPA Direct Debit.
- Monatlicher Preis wird serverseitig mit 299 EUR-Cent festgelegt.
- Stripe-Webhooks werden anhand der `Stripe-Signature` mit HMAC-SHA256 und Zeitfenster geprüft.
- `checkout.session.completed` legt den Vertrag zunächst als `pending` an.
- `invoice.paid` aktiviert Premium; fehlgeschlagene Rechnungen setzen den Status auf `past_due`.
- Abonnementstatus und Periodenende werden anhand der Stripe Subscription API aktualisiert.
- UI und Dokumentation nennen Stripe statt Mollie.

## Benötigte Supabase Edge Function Secrets
- `STRIPE_SECRET_KEY`: zuerst `sk_test_...`, später Live-Schlüssel `sk_live_...`
- `STRIPE_WEBHOOK_SECRET`: Signatur-Secret des Stripe-Webhooks (`whsec_...`)
- `SCHLEIM_CLOUD_RETURN_URL`: HTTPS-Rücksprungadresse der Schleim Cloud
- `SUPABASE_SERVICE_ROLE_KEY`: ausschließlich serverseitig
- Supabase stellt `SUPABASE_URL` und `SUPABASE_ANON_KEY` im Function-Kontext bereit

Webhook-Endpunkt nach Deployment: `https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`

Im Stripe Dashboard mindestens diese Ereignisse abonnieren:
- `checkout.session.completed`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Noch nicht produktionsbereit
Die Änderungen liegen zunächst nur im GitHub-Feature-Branch. Sie wurden nicht auf Supabase deployed und nicht mit einem Stripe-Händlerkonto end-to-end getestet. Der GitHub Device Flow ist kein Supabase Auth JWT; die sichere Identitätsbrücke muss vor dem Checkout fertiggestellt werden. Die UI hält den Checkout deshalb deaktiviert. Kündigungsablauf, Rücklastschriften/Erstattungen, vollständige atomare Webhook-Idempotenz, Speicherquota und Live-Freigabe müssen vor echtem Betrieb vollständig umgesetzt und getestet werden.

**Keine Live-Abbuchungen sind aktiviert.** Das kann erst nach Händler-Onboarding, Hinterlegen der Live-Secrets, Webhook-Konfiguration, erfolgreichem Test und Deployment erfolgen.

## Weiterführende Dokumentation
Siehe [Stripe SEPA Setup](docs/STRIPE-SEPA-SETUP.md).

Offizielle Dokumentation:
- https://docs.stripe.com/api
- https://docs.stripe.com/billing/subscriptions/overview
- https://docs.stripe.com/payments/sepa-debit
- https://docs.stripe.com/webhooks
