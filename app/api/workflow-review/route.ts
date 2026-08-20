import { NextResponse } from "next/server";

const clean = (value: unknown, limit = 2000) => String(value || "").trim().slice(0, limit);

async function sha256(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value.trim().toLowerCase()));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  const data = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!data || clean(data.phone_number)) return NextResponse.json({ ok: true });
  const name = clean(data.name, 120);
  const company = clean(data.company, 160);
  const phone = clean(data.phone, 80);
  const problem = clean(data.problem);
  if (!name || !company || !phone || !problem) return NextResponse.json({ error: "Invalid form" }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Email delivery is not configured" }, { status: 503 });
  const lines = [
    `Name: ${name}`, `Company: ${company}`, `Phone: ${phone}`,
    `Tools: ${clean(data.tools, 300) || "Not provided"}`, "", "Operational problem:", problem, "",
    `Campaign: ${clean(data.utm_campaign, 300) || "Direct / unknown"}`,
    `Source: ${clean(data.utm_source, 120) || "Unknown"} / ${clean(data.utm_medium, 120) || "Unknown"}`,
    `Landing URL: ${clean(data.pageUrl, 1000)}`,
  ];
  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.WORKFLOW_REVIEW_FROM_EMAIL || "OPSYNQ Website <website@opsynq.net>",
      to: [process.env.WORKFLOW_REVIEW_TO_EMAIL || "opsynqos@gmail.com"],
      subject: `Free Workflow Review — ${company}`,
      text: lines.join("\n"),
    }),
  });
  if (!sent.ok) return NextResponse.json({ error: "Delivery failed" }, { status: 502 });

  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (pixelId && accessToken) {
    const eventId = crypto.randomUUID();
    await fetch(`https://graph.facebook.com/v25.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [{
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: clean(data.pageUrl, 1000),
        user_data: {
          ph: [await sha256(phone.replace(/\D/g, ""))],
          fn: [await sha256(name.split(/\s+/)[0] || name)],
          client_ip_address: request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
          client_user_agent: request.headers.get("user-agent"),
        },
        custom_data: { content_name: "Free Workflow Review", company, utm_campaign: clean(data.utm_campaign, 300) },
      }] }),
    }).catch(() => null);
  }
  return NextResponse.json({ ok: true });
}
