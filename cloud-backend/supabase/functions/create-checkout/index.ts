import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const STRIPE_API = "https://api.stripe.com/v1";
const PREMIUM_PLAN_ID = "premium";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers: cors });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const returnUrl = Deno.env.get("SCHLEIM_CLOUD_RETURN_URL");

  if (!supabaseUrl || !anonKey || !serviceKey || !stripeKey || !returnUrl) {
    return Response.json({ error: "PAYMENTS_NOT_CONFIGURED" }, { status: 503, headers: cors });
  }
  if (!stripeKey.startsWith("sk_test_") && !stripeKey.startsWith("sk_live_")) {
    return Response.json({ error: "INVALID_STRIPE_SECRET_KEY" }, { status: 503, headers: cors });
  }
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return Response.json({ error: "AUTHENTICATION_REQUIRED" }, { status: 401, headers: cors });
  }

  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: auth } } });
  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user || !user.email) {
    return Response.json({ error: "VALID_SUPABASE_SESSION_REQUIRED" }, { status: 401, headers: cors });
  }

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: plan, error: planError } = await admin
    .from("schleim_plans")
    .select("id,display_name,storage_limit_bytes,price_amount_cents,currency,billing_interval,is_purchasable")
    .eq("id", PREMIUM_PLAN_ID)
    .single();

  if (planError || !plan || !plan.is_purchasable ||
      plan.price_amount_cents !== 299 || plan.currency !== "EUR" ||
      plan.billing_interval !== "month") {
    return Response.json({ error: "PREMIUM_PLAN_NOT_CONFIGURED" }, { status: 503, headers: cors });
  }

  const successUrl = new URL(returnUrl);
  successUrl.searchParams.set("checkout", "success");
  successUrl.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
  const cancelUrl = new URL(returnUrl);
  cancelUrl.searchParams.set("checkout", "cancel");

  const form = new URLSearchParams();
  form.set("mode", "subscription");
  form.set("payment_method_types[0]", "card");
  form.set("line_items[0][price_data][currency]", "eur");
  form.set("line_items[0][price_data][unit_amount]", "299");
  form.set("line_items[0][price_data][recurring][interval]", "month");
  form.set("line_items[0][price_data][product_data][name]", "Schleim Cloud Premium – 10 GB");
  form.set("line_items[0][quantity]", "1");
  form.set("client_reference_id", user.id);
  form.set("customer_email", user.email);
  form.set("success_url", successUrl.toString());
  form.set("cancel_url", cancelUrl.toString());
  form.set("metadata[schleim_user_id]", user.id);
  form.set("metadata[plan_id]", PREMIUM_PLAN_ID);
  form.set("subscription_data[metadata][schleim_user_id]", user.id);
  form.set("subscription_data[metadata][plan_id]", PREMIUM_PLAN_ID);
  form.set("subscription_data[description]", "Schleim Cloud Premium – 10 GB");

  try {
    const response = await fetch(`${STRIPE_API}/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });
    const session = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("Stripe Checkout API error:", response.status, session?.error?.type);
      return Response.json({ error: "STRIPE_CHECKOUT_FAILED" }, { status: 502, headers: cors });
    }
    if (typeof session.url !== "string") {
      return Response.json({ error: "STRIPE_CHECKOUT_URL_MISSING" }, { status: 502, headers: cors });
    }
    return Response.json({
      checkout_url: session.url,
      session_id: session.id,
      amount: "2.99",
      currency: "EUR",
      interval: "month",
      plan_id: PREMIUM_PLAN_ID,
      provider: "stripe",
    }, { headers: { ...cors, "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Stripe checkout initialization failed:", error);
    return Response.json({ error: "STRIPE_CHECKOUT_FAILED" }, { status: 502, headers: cors });
  }
});
