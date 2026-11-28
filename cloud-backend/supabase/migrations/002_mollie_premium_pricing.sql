-- Schleim Cloud pricing: exactly one paid tier, billed monthly.
-- Existing Premium Plus subscriptions are normalized to Premium before the legacy plan is removed.
update public.schleim_subscriptions
set plan_id = 'premium', updated_at = now()
where plan_id = 'premium_plus';

update public.schleim_plans
set display_name = 'Premium',
    storage_limit_bytes = 10737418240,
    price_amount_cents = 299,
    currency = 'EUR',
    billing_interval = 'month',
    is_purchasable = true
where id = 'premium';

delete from public.schleim_plans where id = 'premium_plus';

alter table public.schleim_subscriptions
  add column if not exists provider_mandate_id text;

create table if not exists public.schleim_billing_events (
  id bigint generated always as identity primary key,
  provider text not null,
  provider_event_id text not null,
  event_type text not null,
  status text not null default 'received'
    check (status in ('received','processed','failed')),
  error_message text,
  created_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (provider, provider_event_id)
);

alter table public.schleim_billing_events enable row level security;
-- No client policies: only the trusted service-role webhook may read/write events.
