# Schleim OS Cloud Backend

Payment processing is disabled. No bank account, card, Klarna account, Stripe account, or live payment method is connected. Checkout fails closed until a provider is configured. The initial Free plan is 1 GiB (1,073,741,824 bytes). Paid plans are catalog entries only and cannot be purchased.

## Supabase project configuration

The project URL and public Supabase Publishable Key have been supplied and are configured in the extension client. A publishable key is intended for client-side use; it is not a secret and does not grant administrative access by itself. Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser or Android code, GitHub source, or chat. Store it only as a protected Supabase Edge Function secret.

Architecture: Schleim OS Extension and Android browser call Supabase Edge Functions. Supabase Auth identifies users; PostgreSQL stores plan and subscription state; Supabase Storage stores files. The backend must enforce quotas.

## Remaining setup

1. Apply the SQL migration in `supabase/migrations`.
2. Configure Edge Function secrets in Supabase, including the service-role key.
3. Deploy `account-summary` and `create-checkout`.
4. Configure a secure identity bridge from the existing GitHub Device Flow to Supabase Auth. GitHub Device Flow access tokens are not Supabase Auth JWTs and must not be forwarded as such.
5. Implement and test server-side upload quota enforcement.
6. Test the account and quota flow before configuring payments in test mode.
7. Implement Klarna Playground checkout and subscription token flow server-side; follow `docs/KLARNA-SANDBOX.md`.
8. Live payments remain disabled until explicitly approved.

## Klarna

Klarna is the preferred candidate for the requested payment test. The intended route is Klarna Payments in Playground, with Customer Tokens for recurring subscription renewals. This requires merchant eligibility/contract confirmation and a Klarna Playground API credential pair. A normal one-time Klarna payment is not sufficient for recurring billing.

Klarna test credentials must be stored only as Supabase Edge Function secrets. No Klarna credential is currently configured. No checkout, tokenization, webhook, scheduler, or renewal charge is active. The Playground does not process real payments or create invoices/fees.

## Plans

- Free: 1 GiB
- Premium: 10 GiB (price not set, disabled)
- Premium Plus: 50 GiB (price not set, disabled)

Storage is measured in bytes. The limits are currently plan definitions only and are not yet enforced by an upload endpoint.
