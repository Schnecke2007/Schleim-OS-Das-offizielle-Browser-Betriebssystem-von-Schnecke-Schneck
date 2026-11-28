create index if not exists schleim_subscriptions_plan_id_idx
  on public.schleim_subscriptions(plan_id);

drop policy if exists "Users can read their own subscription" on public.schleim_subscriptions;
create policy "Users can read their own subscription"
  on public.schleim_subscriptions for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can read their own storage usage" on public.schleim_storage_usage;
create policy "Users can read their own storage usage"
  on public.schleim_storage_usage for select to authenticated
  using ((select auth.uid()) = user_id);

revoke all on function public.rls_auto_enable() from public, anon, authenticated;
