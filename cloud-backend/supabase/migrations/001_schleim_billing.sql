create table if not exists public.schleim_plans (
  id text primary key,
  display_name text not null,
  storage_limit_bytes bigint not null check (storage_limit_bytes > 0),
  price_amount_cents integer,
  currency text not null default 'EUR',
  billing_interval text,
  is_purchasable boolean not null default false,
  created_at timestamptz not null default now()
);

insert into public.schleim_plans
  (id, display_name, storage_limit_bytes, price_amount_cents, billing_interval, is_purchasable)
values
  ('free', 'Free', 1073741824, 0, null, true),
  ('premium', 'Premium', 10737418240, null, 'month', false),
  ('premium_plus', 'Premium Plus', 53687091200, null, 'month', false)
on conflict (id) do update set
  display_name = excluded.display_name,
  storage_limit_bytes = excluded.storage_limit_bytes;

create table if not exists public.schleim_subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_id text not null default 'free' references public.schleim_plans(id),
  status text not null default 'active'
    check (status in ('active','trialing','past_due','canceled','incomplete','pending')),
  provider text,
  provider_customer_id text,
  provider_subscription_id text unique,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.schleim_storage_usage (
  user_id uuid primary key references auth.users(id) on delete cascade,
  used_bytes bigint not null default 0 check (used_bytes >= 0),
  updated_at timestamptz not null default now()
);

alter table public.schleim_plans enable row level security;
alter table public.schleim_subscriptions enable row level security;
alter table public.schleim_storage_usage enable row level security;

create policy "Plans are readable by everyone"
  on public.schleim_plans for select using (true);
create policy "Users can read their own subscription"
  on public.schleim_subscriptions for select to authenticated
  using (auth.uid() = user_id);
create policy "Users can read their own storage usage"
  on public.schleim_storage_usage for select to authenticated
  using (auth.uid() = user_id);

-- No client write policies: trusted server functions alone may mutate billing or usage.
create or replace function public.schleim_ensure_free_subscription()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.schleim_subscriptions(user_id, plan_id, status)
  values (new.id, 'free', 'active') on conflict (user_id) do nothing;
  insert into public.schleim_storage_usage(user_id, used_bytes)
  values (new.id, 0) on conflict (user_id) do nothing;
  return new;
end;
$$;

-- This function is only invoked by the auth.users trigger, never directly by API roles.
revoke all on function public.schleim_ensure_free_subscription() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_schleim on auth.users;
create trigger on_auth_user_created_schleim
  after insert on auth.users
  for each row execute procedure public.schleim_ensure_free_subscription();
