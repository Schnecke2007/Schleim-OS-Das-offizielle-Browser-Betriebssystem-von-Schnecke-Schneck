# Schleim OS Cloud Backend

**Tarifmodell:** Free mit 1 GiB sowie genau ein kostenpflichtiger Tarif: Premium mit 10 GiB für **2,99 € pro Monat**.

**Zahlungsdienst:** Stripe Checkout + Stripe Billing mit Kartenzahlung und automatischer monatlicher Verlängerung.

Supabase bleibt das Cloud-Backend für Konten, Abos und Speicher. Stripe verarbeitet ausschließlich Zahlungen. Die Stripe-API-Adresse lautet `https://api.stripe.com/v1`. Der geheime Stripe-Schlüssel darf nur serverseitig in Supabase Edge Function Secrets liegen. Niemals einen Secret Key oder Supabase Service Role Key in Browser-/Android-Code, GitHub oder Chat eintragen.

## Tarifmodell
- Free: 1 GiB, kostenlos
- Premium: 10 GiB, 2,99 EUR pro Monat

Der Betrag wird serverseitig aus der Tarifkonfiguration geprüft. Der Client kann keinen Betrag vorgeben.

## Stripe-Integration im Branch
- Stripe Checkout Session im Abonnementmodus mit Kartenzahlung und dynamischen Zahlungsmethoden.
- Monatlicher Preis wird serverseitig mit 299 EUR-Cent festgelegt.
- Stripe-Webhooks werden anhand der `Stripe-Signature` mit HMAC-SHA256 und Zeitfenster geprüft.
- `checkout.session.completed` legt den Vertrag zunächst als `pending` an.
- `invoice.paid` aktiviert Premium; fehlgeschlagene Rechnungen setzen den Status auf `past_due`.
- Abonnementstatus und Periodenende werden anhand der Stripe Subscription API aktualisiert.
- UI und Dokumentation nennen Stripe statt Mollie.

## Supabase-Datenbank
Die Migrationen 001 bis 003 wurden im verbundenen Supabase-Projekt angewendet:
- Tarifkonfiguration (Free: 1 GiB, Premium: 10 GiB / 2,99 EUR monatlich)
- Nutzer-Abonnements und Speicherverbrauch
- Webhook-Ereignisprotokoll
- Row Level Security und eingeschränkte Berechtigungen
- Index- und RLS-Policy-Optimierungen

## Benötigte Supabase Edge Function Secrets
- `STRIPE_SECRET_KEY`: zunächst Testschlüssel, später Live-Schlüssel
- `STRIPE_WEBHOOK_SECRET`: Signatur-Secret des Stripe-Webhooks
- `SCHLEIM_CLOUD_RETURN_URL`: HTTPS-Rücksprungadresse der Schleim Cloud
- `SUPABASE_SERVICE_ROLE_KEY`: ausschließlich serverseitig
- Supabase stellt `SUPABASE_URL` und `SUPABASE_ANON_KEY` im Function-Kontext bereit

Webhook-Endpunkt nach Deployment: `https://hrtunnupqcpklejpfsvq.supabase.co/functions/v1/stripe-webhook`

Im Stripe Dashboard mindestens diese Ereignisse abonnieren:
- `checkout.session.completed`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Steuerkonfiguration (aktueller Betreiberstand)
Der Betreiber hat angegeben, derzeit keine Umsatzsteuer zu erheben. Der Checkout setzt deshalb aktuell `automatic_tax[enabled]=false`; es wird keine automatische Steuerberechnung oder ein zusätzlicher Steuerbetrag aktiviert. Das ist keine steuerrechtliche Einstufung und ersetzt nicht die Prüfung, ob Kleinunternehmerregelung, Rechnungsangaben oder andere Pflichten gelten. Bei einer späteren Änderung muss diese Einstellung vor dem Verkauf angepasst werden.

## Noch nicht produktionsbereit
Die Datenbankmigrationen sind auf Supabase angewendet, die Edge Functions aber noch nicht deployed. Es wurden keine Stripe-Produkte, Preise oder Webhook-Endpunkte angelegt. Stripe Tax Settings sind noch unvollständig (Hauptgeschäftsadresse fehlt); Steuerstatus und inklusive/exklusive Steuerdarstellung sind ungeklärt. Die Supabase Edge Function Secrets sind noch nicht gesetzt.

Der GitHub Device Flow ist kein Supabase Auth JWT; die sichere Identitätsbrücke muss vor dem Checkout fertiggestellt werden. Die UI hält den Checkout deshalb deaktiviert. Kündigungsablauf, robuste atomare Webhook-Idempotenz, vollständige Refund-/Zahlungsstatus-Behandlung und serverseitige Speicherquota müssen vor echtem Betrieb fertiggestellt und getestet werden.

**Keine Live-Abbuchungen sind aktiviert.** Livebetrieb erst nach Händler-/Steuerkonfiguration, Hinterlegen der Live-Secrets, Deployment, End-to-End-Test und ausdrücklicher Freigabe.

## Weiterführende Dokumentation
Siehe [Stripe-Kartenzahlung Setup](docs/STRIPE-SEPA-SETUP.md).

Offizielle Dokumentation:
- https://docs.stripe.com/api
- https://docs.stripe.com/billing/subscriptions/overview
- https://docs.stripe.com/payments/cards
- https://docs.stripe.com/webhooks
