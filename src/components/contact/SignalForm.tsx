"use client";

import { useRef, useState, type FormEvent } from "react";
import { contactSchema } from "@/lib/schemas";
import { siteConfig } from "@/content/site";
import { track } from "@/lib/analytics";
import { Spotlight } from "@/components/contact/Spotlight";

type Status = "idle" | "sending" | "sent" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export function SignalForm() {
  const mountedAt = useRef(Date.now());
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = (key: keyof typeof values) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const company =
      (e.currentTarget.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "";

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, company, t: mountedAt.current }),
      });
      setStatus(res.ok ? "sent" : "error");
      track("contact_submit", { ok: res.ok });
    } catch {
      setStatus("error");
      track("contact_submit", { ok: false });
    }
  };

  if (status === "sent") {
    return (
      <div className="signal-form-wrap">
        <Spotlight />
        <p className="signal-status signal-sent" role="status">
          SIGNAL RECEIVED. RESPONSE WITHIN 48 HOURS.
        </p>
      </div>
    );
  }

  return (
    <div className="signal-form-wrap">
      <Spotlight />
      <form className="signal-form" onSubmit={onSubmit} noValidate>
        {/* honeypot — off-screen (not display:none, which bots skip). Labelled
            (no aria-hidden) so it stays axe-clean; screen readers are told to
            leave it empty, bots fill it. */}
        <div className="signal-honeypot">
          <label htmlFor="company">Leave this field empty</label>
          <input
            id="company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="signal-field">
          <label htmlFor="signal-name">NAME</label>
          <input
            id="signal-name"
            name="name"
            type="text"
            maxLength={100}
            value={values.name}
            onChange={set("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "err-name" : undefined}
          />
          {errors.name && (
            <p id="err-name" className="signal-error">
              {errors.name}
            </p>
          )}
        </div>

        <div className="signal-field">
          <label htmlFor="signal-email">EMAIL</label>
          <input
            id="signal-email"
            name="email"
            type="email"
            value={values.email}
            onChange={set("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "err-email" : undefined}
          />
          {errors.email && (
            <p id="err-email" className="signal-error">
              {errors.email}
            </p>
          )}
        </div>

        <div className="signal-field">
          <label htmlFor="signal-message">MESSAGE</label>
          <textarea
            id="signal-message"
            name="message"
            rows={5}
            maxLength={2000}
            value={values.message}
            onChange={set("message")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "err-message" : undefined}
          />
          {errors.message && (
            <p id="err-message" className="signal-error">
              {errors.message}
            </p>
          )}
        </div>

        {status === "error" && (
          <p className="signal-status signal-lost" role="alert">
            SIGNAL LOST. USE THE DIRECT LINE BELOW —{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </p>
        )}

        <button type="submit" className="signal-submit" disabled={status === "sending"}>
          {status === "sending" ? "TRANSMITTING…" : "SEND THE SIGNAL"}
        </button>
      </form>
    </div>
  );
}
