import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers: cors });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const returnUrl = Deno.env.get("SCHLEIM_CLOUD_RETURN_URL");

  if (!supabaseUrl || !anonKey || !serviceKey || !stripeKey || !returnUrl) {
    return Response.json({ error: "BILLING_NOT_CONFIGURED" }, { status: 503, headers: cors });
  }
  if (!/^(sk|rk)_(test|live)_/.test(stripeKey)) {
    return Response.json({ error: "INVALID_STRIPE_CONFIGURATION" }, { status: 503, headers: cors });
  }

  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return Response.json({ error: "AUTHENTICATION_REQUIRED" }, { status: 401, headers: cors });
  }

  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: auth } } });
  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) {
    return Response.json({ error: "VALID_SUPABASE_SESSION_REQUIRED" }, { status: 401, headers: cors });
  }

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: subscription, error } = await admin
    .from("schleim_subscriptions")
    .select("provider,provider_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Could not load billing customer:", error);
    return Response.json({ error: "BILLING_CUSTOMER_LOOKUP_FAILED" }, { status: 500, headers: cors });
  }
  if (subscription?.provider !== "stripe" ||
      typeof subscription.provider_customer_id !== "string" ||
      !subscription.provider_customer_id.startsWith("cus_")) {
    return Response.json({ error: "NO_STRIPE_CUSTOMER" }, { status: 404, headers: cors });
  }

  try {
    const form = new URLSearchParams();
    form.set("customer", subscription.provider_customer_id);
    form.set("return_url", returnUrl);

    const response = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || typeof data.url !== "string") {
      console.error("Stripe Customer Portal error:", response.status, data?.error?.type);
      return Response.json({ error: "CUSTOMER_PORTAL_FAILED" }, { status: 502, headers: cors });
    }
    return Response.json({ portal_url: data.url }, {
      headers: { ...cors, "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Customer Portal initialization failed:", error);
    return Response.json({ error: "CUSTOMER_PORTAL_FAILED" }, { status: 502, headers: cors });
  }
});
