import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PREMIUM_PRICE = "2.99";
const PREMIUM_PLAN_ID = "premium";
const MOLLIE_API = "https://api.mollie.com/v2";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers: cors });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const mollieKey = Deno.env.get("MOLLIE_API_KEY");
  const auth = req.headers.get("Authorization");

  if (!supabaseUrl || !anonKey || !serviceKey || !mollieKey) {
    return Response.json({ error: "PAYMENTS_NOT_CONFIGURED", message: "Supabase or Mollie server secrets are missing." }, { status: 503, headers: cors });
  }
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

  const siteUrl = Deno.env.get("SCHLEIM_CLOUD_RETURN_URL");
  const webhookUrl = Deno.env.get("MOLLIE_WEBHOOK_URL");
  if (!siteUrl || !webhookUrl || !webhookUrl.startsWith("https://")) {
    return Response.json({ error: "PAYMENT_URLS_NOT_CONFIGURED" }, { status: 503, headers: cors });
  }

  const headers = {
    "Authorization": `Bearer ${mollieKey}`,
    "Content-Type": "application/json",
  };
  const mollieRequest = async (path: string, body?: unknown) => {
    const response = await fetch(`${MOLLIE_API}${path}`, {
      method: body ? "POST" : "GET",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`Mollie API ${response.status}: ${JSON.stringify(payload)}`);
    return payload;
  };

  try {
    const customer = await mollieRequest("/customers", {
      name: user.user_metadata?.full_name || user.email,
      email: user.email,
      metadata: { schleim_user_id: user.id },
    });

    const payment = await mollieRequest("/payments", {
      amount: { currency: "EUR", value: PREMIUM_PRICE },
      description: "Schleim Cloud Premium – erste SEPA-Autorisierung",
      sequenceType: "first",
      customerId: customer.id,
      redirectUrl: siteUrl,
      webhookUrl,
      metadata: {
        schleim_user_id: user.id,
        plan_id: PREMIUM_PLAN_ID,
        purpose: "premium_subscription_first_payment",
      },
    });

    const checkoutUrl = payment?._links?.checkout?.href;
    if (!checkoutUrl || typeof checkoutUrl !== "string") {
      return Response.json({ error: "MOLLIE_CHECKOUT_URL_MISSING" }, { status: 502, headers: cors });
    }

    return Response.json({
      checkout_url: checkoutUrl,
      payment_id: payment.id,
      amount: PREMIUM_PRICE,
      currency: "EUR",
      interval: "month",
      plan_id: PREMIUM_PLAN_ID,
      message: "Continue to Mollie to authorize the first SEPA payment and recurring mandate.",
    }, { headers: { ...cors, "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Mollie checkout initialization failed:", error);
    return Response.json({ error: "MOLLIE_CHECKOUT_FAILED" }, { status: 502, headers: cors });
  }
});
