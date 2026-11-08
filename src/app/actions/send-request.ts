"use server";
import { headers } from "next/headers";
import { z } from "zod";
import { business } from "@/content/business";

// One server action for every request form (pre-order, cinnamon roll cake, custom order).
// Sends to the bakery via Resend when RESEND_API_KEY is set; otherwise hands back a prefilled
// mailto: link so the visitor can send it from their own email app.

const base = {
  kind: z.enum(["preorder", "cake", "custom"]),
  name: z.string().trim().min(1, "Please add your name").max(100),
  email: z.string().trim().email("That email doesn't look right").max(200),
  phone: z.string().trim().max(40).optional().default(""),
  notes: z.string().trim().max(2000).optional().default(""),
  // honeypot: real people never see or fill this
  company: z.string().max(0).optional().default(""),
};
const schema = z.object({
  ...base,
  items: z.string().max(4000).optional().default(""),
  details: z.string().max(2000).optional().default(""),
  campaign: z.string().max(100).optional().default(""),
});

export type SendResult =
  | { ok: true; via: "email" }
  | { ok: false; via: "mailto"; mailto: string; message: string }
  | { ok: false; via: "error"; message: string; fieldErrors?: Record<string, string> };

// Best-effort rate limit (per server instance): 5 requests per IP per 10 minutes.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

const titles = {
  preorder: "Pre-order request",
  cake: "Cinnamon roll cake request",
  custom: "Custom order request",
};

function compose(d: z.infer<typeof schema>) {
  const lines = [
    `${titles[d.kind]}${d.campaign ? ` (${d.campaign})` : ""}`,
    "",
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    d.phone && `Phone: ${d.phone}`,
    d.items && `\nItems:\n${d.items}`,
    d.details && `\nDetails:\n${d.details}`,
    d.notes && `\nNotes:\n${d.notes}`,
    "",
    "Sent from the Pearl Bakery website.",
  ].filter(Boolean);
  return { subject: `${titles[d.kind]} from ${d.name}`, text: lines.join("\n") };
}

export async function sendRequest(_prev: SendResult | null, form: FormData): Promise<SendResult> {
  const parsed = schema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    if (fieldErrors.company) return { ok: true, via: "email" }; // bot: pretend it worked
    return { ok: false, via: "error", message: "A couple of things need fixing.", fieldErrors };
  }
  const d = parsed.data;
  if (d.kind === "custom" && !d.notes) {
    return {
      ok: false,
      via: "error",
      message: "Tell me a little about what you have in mind.",
      fieldErrors: { notes: "Tell me a little about what you have in mind" },
    };
  }
  if (d.kind !== "custom" && !d.items && !d.details) {
    return {
      ok: false,
      via: "error",
      message: "Pick at least one item.",
      fieldErrors: { items: "Pick at least one item" },
    };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (limited(ip)) {
    return {
      ok: false,
      via: "error",
      message: "That's a lot of requests in a row. Please try again in a few minutes, or email me directly.",
    };
  }

  const { subject, text } = compose(d);
  const mailto = `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return {
      ok: false,
      via: "mailto",
      mailto,
      message: "Your email app will open with everything filled in. Just hit send.",
    };
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || "Pearl Bakery website <onboarding@resend.dev>",
      to: [business.email],
      replyTo: d.email,
      subject,
      text,
    });
    if (error) throw new Error(error.message);
    return { ok: true, via: "email" };
  } catch {
    return {
      ok: false,
      via: "mailto",
      mailto,
      message:
        "The website couldn't send it just now. Your email app will open with everything filled in instead.",
    };
  }
}
