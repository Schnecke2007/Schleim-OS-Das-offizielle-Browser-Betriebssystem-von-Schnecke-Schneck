import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "GET") return Response.json({ error: "Method not allowed" }, { status: 405, headers: cors });

  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const auth = req.headers.get("Authorization");
  if (!url || !anon || !service) return Response.json({ error: "Backend is not configured" }, { status: 503, headers: cors });
  if (!auth?.startsWith("Bearer ")) return Response.json({ error: "Authentication required" }, { status: 401, headers: cors });

  const userClient = createClient(url, anon, { global: { headers: { Authorization: auth } } });
  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) return Response.json({ error: "Invalid session" }, { status: 401, headers: cors });

  const admin = createClient(url, service);
  const [{ data: subscription, error: subError }, { data: usage, error: usageError }, { data: plans, error: plansError }] = await Promise.all([
    admin.from("schleim_subscriptions").select("plan_id,status,current_period_end").eq("user_id", user.id).maybeSingle(),
    admin.from("schleim_storage_usage").select("used_bytes").eq("user_id", user.id).maybeSingle(),
    admin.from("schleim_plans").select("id,display_name,storage_limit_bytes,price_amount_cents,currency,billing_interval,is_purchasable").order("storage_limit_bytes"),
  ]);
  if (subError || usageError || plansError) return Response.json({ error: "Could not load account summary" }, { status: 500, headers: cors });

  const plan = plans?.find((item) => item.id === (subscription?.plan_id ?? "free")) ?? plans?.find((item) => item.id === "free");
  return Response.json({
    account: { id: user.id, email: user.email ?? null },
    subscription: subscription ?? { plan_id: "free", status: "active", current_period_end: null },
    usage: { used_bytes: Number(usage?.used_bytes ?? 0), limit_bytes: Number(plan?.storage_limit_bytes ?? 1073741824) },
    plans: plans ?? [],
    payments_enabled: false,
  }, { headers: { ...cors, "Cache-Control": "no-store" } });
});
