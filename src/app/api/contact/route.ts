import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/schemas";

// §7.4 — best-effort in-memory per-IP throttle: 5 / hour (resets on cold start).
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function throttled(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((ts) => now - ts < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Anti-spam — return 200 silently so bots don't learn they were caught (§7.4).
  const company = typeof body.company === "string" ? body.company : "";
  const t = typeof body.t === "number" ? body.t : 0;
  if (company.trim() !== "" || Date.now() - t < 3000) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        errors: parsed.error.issues.map((i) => ({
          field: String(i.path[0] ?? ""),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (throttled(ip)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    // Not configured yet — fail closed; the form shows the mailto fallback.
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const { name, email, message } = parsed.data;
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "moksite <onboarding@resend.dev>", // sandbox sender (verified domain later)
      to: [to],
      replyTo: email,
      subject: `New signal from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    if (error) {
      // log the error name only — never the message content (§7.4)
      console.error("[contact] resend error:", error.name);
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
