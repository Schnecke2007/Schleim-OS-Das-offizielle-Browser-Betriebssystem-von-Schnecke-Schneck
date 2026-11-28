Schleim OS Cloud Backend

Payment processing is disabled. No bank account, card, Klarna account, Stripe account, or live payment method is connected. Checkout fails closed until a provider is configured. The initial Free plan is 1 GiB (1,073,741,824 bytes). Paid plans are catalog entries only and cannot be purchased.

Architecture: Schleim OS Extension and Android browser call Supabase Edge Functions. Supabase Auth identifies users; PostgreSQL stores plan and subscription state; Supabase Storage stores files. The backend enforces quotas.

Setup later, step by step:
1. Create a Supabase project.
2. Supply only the project URL and public anon key. Never put the service-role key in browser or Android code.
3. Apply the SQL migration in supabase/migrations.
4. Deploy account-summary and create-checkout.
5. Configure a secure identity bridge from the existing GitHub Device Flow to Supabase Auth.
6. Test the account and quota flow before configuring payments in test mode.
7. Live payments remain disabled until explicitly approved.

Payment: Stripe is the likely first subscription provider. Klarna can be evaluated as an additional method after recurring-payment eligibility is confirmed for the merchant account and region. Do not promise Klarna automatic monthly renewals until confirmed.

Plans: Free 1 GiB; Premium 10 GiB (price not set, disabled); Premium Plus 50 GiB (price not set, disabled). Storage is measured in bytes.