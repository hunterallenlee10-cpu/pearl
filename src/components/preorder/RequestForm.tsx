"use client";
import { useActionState, useEffect, useId, type ReactNode } from "react";
import { sendRequest, type SendResult } from "@/app/actions/send-request";
import { business } from "@/content/business";

export function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  error,
  hint,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  hint?: string;
  textarea?: boolean;
}) {
  const id = useId();
  const cls =
    "mt-1.5 w-full rounded-xl border-0 bg-flour px-4 py-3 text-base text-crust shadow-[inset_0_0_0_1.5px_rgb(91_58_36/0.25)] placeholder:text-crust/40 focus:shadow-[inset_0_0_0_2px_var(--color-crust)] focus:outline-none aria-invalid:shadow-[inset_0_0_0_2px_#a3402a]";
  return (
    <div>
      <label htmlFor={id} className="font-semibold">
        {label}
        {required ? (
          <span aria-hidden className="text-wheat-ink">
            {" "}
            *
          </span>
        ) : (
          <span className="text-crust-soft font-normal"> (optional)</span>
        )}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          required={required}
          className={cls}
          aria-invalid={!!error || undefined}
          aria-describedby={error || hint ? `${id}-d` : undefined}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          className={cls}
          aria-invalid={!!error || undefined}
          aria-describedby={error || hint ? `${id}-d` : undefined}
        />
      )}
      {(error || hint) && (
        <p
          id={`${id}-d`}
          className={`mt-1.5 text-sm ${error ? "font-semibold text-[#a3402a]" : "text-crust-soft"}`}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

/**
 * Wraps a request form: contact fields, honeypot, submit, and the result states. `children`
 * renders the form-specific fields (items, cake options…), which must include hidden inputs
 * named items/details as needed.
 */
export function RequestForm({
  kind,
  campaign,
  submitLabel,
  children,
  successNote,
  notesLabel = "Anything else?",
  notesRequired = false,
}: {
  notesLabel?: string;
  notesRequired?: boolean;
  kind: "preorder" | "cake" | "custom";
  campaign?: string;
  submitLabel: string;
  children?: ReactNode;
  successNote?: ReactNode;
}) {
  const [state, action, pending] = useActionState<SendResult | null, FormData>(sendRequest, null);
  const errors = state && state.via === "error" ? (state.fieldErrors ?? {}) : {};

  useEffect(() => {
    if (state?.via === "mailto") window.location.href = state.mailto;
  }, [state]);

  if (state?.ok) {
    return (
      <div
        role="status"
        className="bg-flour shadow-soft ring-crust/10 rounded-[var(--radius-card)] p-8 ring-1"
      >
        <p className="font-display text-3xl">Thank you! Request sent.</p>
        <p className="mt-3 text-lg">
          {successNote ??
            "I'll get back to you by email. Your order is reserved once you get my confirmation email."}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6" noValidate>
      <input type="hidden" name="kind" value={kind} />
      {campaign && <input type="hidden" name="campaign" value={campaign} />}
      {children}
      {errors.items && (
        <p className="font-semibold text-[#a3402a]" role="alert">
          {errors.items}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" error={errors.name} />
        <Field label="Email" name="email" type="email" required autoComplete="email" error={errors.email} />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <Field label={notesLabel} name="notes" textarea required={notesRequired} error={errors.notes} />
      {/* honeypot */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? "Sending…" : submitLabel}
        </button>
        <a
          href={`mailto:${business.email}`}
          className="decoration-wheat inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
        >
          or email {business.email}
        </a>
      </div>
      <div aria-live="polite">
        {state && !state.ok && (
          <p
            className={`rounded-xl p-4 ${state.via === "error" ? "bg-[#f6e3dc] text-[#7d2f1f]" : "bg-parchment"}`}
          >
            {state.message}{" "}
            {state.via === "mailto" && (
              <a href={state.mailto} className="font-semibold underline">
                Open the email
              </a>
            )}
          </p>
        )}
      </div>
    </form>
  );
}
