"use client";
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/primitives/Button";
import { Input } from "@/primitives/Input";
import { Chip } from "@/primitives/Chip";
import { cx } from "@/lib/cx";
import { content } from "@/content/content";
import { mailtoHref } from "@/content/links";
import { duration as D, ease as E } from "@/tokens/motion";
import { book, fetchAvailability, type BookingError } from "./api";
import { dayKey, formatLongDate, formatTime, groupByDay, isEmail, isPhone } from "./slots";

const STEPS = ["date", "time", "you", "phone", "interest", "review"] as const;
type Step = (typeof STEPS)[number];
type Form = { name: string; email: string; phone: string; interest: string; note: string; website: string };
type Errors = Partial<Record<keyof Form, string>>;

const t = content.landing.booking;
const EMPTY: Form = { name: "", email: "", phone: "", interest: "", note: "", website: "" };

function validate(step: Step, f: Form): Errors {
  const e: Errors = {};
  if (step === "you") {
    if (!f.name.trim()) e.name = t.errors.name;
    if (!isEmail(f.email)) e.email = t.errors.email;
  }
  if (step === "phone" && f.phone.trim() && !isPhone(f.phone)) e.phone = t.errors.phone;
  if (step === "interest" && !f.interest) e.interest = t.errors.interest;
  return e;
}

/**
 * Discovery-call booking in small steps: day, time, name and email, phone (optional), topic, review.
 * Free times come from Google Calendar through the Apps Script backend (./api.ts).
 */
export function BookingFlow() {
  const reduce = !!useReducedMotion();
  const [slots, setSlots] = React.useState<Map<string, string[]> | null>(null);
  const [loadError, setLoadError] = React.useState<BookingError | null>(null);
  const [step, setStep] = React.useState(0);
  const [date, setDate] = React.useState<Date | undefined>();
  const [slot, setSlot] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<Form>(EMPTY);
  const [errors, setErrors] = React.useState<Errors>({});
  const [sending, setSending] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<BookingError | null>(null);
  const [booked, setBooked] = React.useState(false);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const stepRef = React.useRef<HTMLDivElement>(null);
  const firstRender = React.useRef(true);
  const timeZone = React.useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  const load = React.useCallback(async () => {
    setSlots(null);
    setLoadError(null);
    const r = await fetchAvailability();
    if (r.ok) setSlots(groupByDay(r.data.slots));
    else setLoadError(r.error);
  }, []);
  React.useEffect(() => { load(); }, [load]);

  // On each new step, focus its first field, or its heading when it has none, so keyboard and screen reader users follow along.
  React.useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const field = stepRef.current?.querySelector<HTMLElement>("input:not([tabindex='-1']), textarea");
    (field ?? headingRef.current)?.focus();
  }, [step, booked]);

  const current = STEPS[step];
  const go = (to: Step) => { setErrors({}); setSubmitError(null); setStep(STEPS.indexOf(to)); };
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const next = async () => {
    if (current === "date" && !date) return;
    if (current === "time" && !slot) return;
    const e = validate(current, form);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (current !== "review") { go(STEPS[step + 1]); return; }
    setSending(true);
    setSubmitError(null);
    const r = await book({ ...form, start: slot!, timeZone });
    setSending(false);
    if (r.ok) { setBooked(true); return; }
    if (r.error === "slot_taken") { setSlot(null); await load(); go("time"); }
    setSubmitError(r.error);
  };

  const restart = () => { setBooked(false); setForm(EMPTY); setDate(undefined); setSlot(null); setStep(0); load(); };

  const days = slots ? [...slots.keys()] : [];
  const first = days[0] ? new Date(`${days[0]}T12:00`) : undefined;
  const last = days.length ? new Date(`${days[days.length - 1]}T12:00`) : undefined;
  const daySlots = date && slots ? slots.get(dayKey(date)) ?? [] : [];

  const heading = (text: string) => (
    <h3 ref={headingRef} tabIndex={-1} className="m-0 font-display font-regular text-heading-lg text-ink outline-none">{text}</h3>
  );

  const errorBox = (code: BookingError) => (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-lg bg-blush p-4 text-body text-ink">
      <p className="m-0">{t.errors[code]}</p>
      {(code === "server" || code === "network" || code === "not_configured" || code === "rate_limited") && (
        <a href={mailtoHref(content.site.email)} className="ac-focus font-medium text-ink underline underline-offset-4">{t.emailMe}</a>
      )}
    </div>
  );

  if (booked && slot) {
    return (
      <div className="flex flex-col items-start gap-5">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-mint text-ink" aria-hidden><Check size={28} /></span>
        {heading(t.done.title)}
        <p className="m-0 text-body-md text-ink">
          <strong className="font-semibold">{formatLongDate(slot)}, {formatTime(slot)}</strong> ({timeZone})
        </p>
        <p className="m-0 text-body-md text-ink-muted">{t.done.text(form.email)}</p>
        <Button variant="ghost" onClick={restart}>{t.done.again}</Button>
      </div>
    );
  }

  const body = (() => {
    switch (current) {
      case "date":
        if (loadError) return errorBox(loadError);
        if (!slots) return <p className="m-0 text-body text-ink-muted" aria-live="polite">{t.loading}</p>;
        return (
          <Calendar
            mode="single"
            weekStartsOn={1}
            selected={date}
            onSelect={(d) => { if (!d) return; setDate(d); setSlot(null); go("time"); }}
            defaultMonth={date ?? first}
            startMonth={first}
            endMonth={last}
            disabled={(d) => !slots.has(dayKey(d))}
            className="self-center"
          />
        );
      case "time":
        return (
          <div className="flex flex-col gap-4">
            {date && <p className="m-0 text-body-md text-ink">{formatLongDate(date)}</p>}
            {daySlots.length === 0 ? (
              <p className="m-0 text-body text-ink-muted">{t.noTimes}</p>
            ) : (
              <div role="radiogroup" aria-label={t.steps.time} className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {daySlots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={slot === s}
                    onClick={() => { setSlot(s); go("you"); }}
                    className={cx(
                      "ac-focus h-btn-sm rounded-pill border border-solid font-body text-button-sm cursor-pointer transition-colors duration-fast",
                      slot === s ? "bg-ink text-white border-ink" : "bg-white text-ink border-line hover:bg-yellow hover:border-yellow",
                    )}
                  >
                    {formatTime(s)}
                  </button>
                ))}
              </div>
            )}
            <p className="m-0 text-caption text-ink-muted">{t.timeZoneNote(timeZone)}</p>
          </div>
        );
      case "you":
        return (
          <div className="flex flex-col gap-5">
            <Input label={t.fields.name} value={form.name} onChange={set("name")} autoComplete="name" error={errors.name} />
            <Input label={t.fields.email} type="email" value={form.email} onChange={set("email")} autoComplete="email" hint={t.fields.emailHint} error={errors.email} />
            {/* Honeypot: hidden from people and screen readers, filled by bots. */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} /></label>
            </div>
          </div>
        );
      case "phone":
        return <Input label={t.fields.phone} type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" hint={t.fields.phoneHint} error={errors.phone} />;
      case "interest":
        return (
          <div className="flex flex-col gap-5">
            <div role="radiogroup" aria-label={t.steps.interest} className="flex flex-wrap gap-2">
              {t.interests.map((i) => (
                <Chip key={i} tone={form.interest === i ? "ink" : "white"} selected={form.interest === i} onClick={() => setForm((f) => ({ ...f, interest: i }))}>{i}</Chip>
              ))}
            </div>
            {errors.interest && <p role="alert" className="m-0 self-start rounded-pill bg-coral px-3 py-1 text-caption font-medium text-ink">{errors.interest}</p>}
            <label className="flex flex-col gap-2">
              <span className="font-body text-sm font-medium text-ink">{t.fields.note}</span>
              <textarea
                value={form.note}
                onChange={set("note")}
                rows={4}
                maxLength={2000}
                className="resize-y rounded-lg border border-solid border-line bg-white p-4 font-body text-body text-ink outline-none focus:border-ink"
              />
            </label>
          </div>
        );
      case "review":
        return (
          <dl className="m-0 flex flex-col">
            {([
              [t.review.when, slot ? `${formatLongDate(slot)}, ${formatTime(slot)} (${timeZone})` : "", "date"],
              [t.review.who, `${form.name} · ${form.email}`, "you"],
              [t.review.phone, form.phone.trim() || t.review.noPhone, "phone"],
              [t.review.topic, form.note ? `${form.interest} · ${form.note}` : form.interest, "interest"],
            ] as [string, string, Step][]).map(([k, v, s]) => (
              <div key={k} className="grid grid-cols-[6rem_1fr_auto] items-baseline gap-4 py-3 border-0 border-t border-solid border-line first:border-t-0">
                <dt className="text-caption font-medium uppercase tracking-[0.08em] text-ink-muted">{k}</dt>
                <dd className="m-0 text-body text-ink break-words">{v}</dd>
                <button type="button" onClick={() => go(s)} className="ac-focus appearance-none border-0 bg-transparent p-0 font-body text-sm text-ink underline underline-offset-4 cursor-pointer">{t.review.edit}</button>
              </div>
            ))}
          </dl>
        );
    }
  })();

  // Date and time advance on pick, so they show only Back; the other steps need Continue.
  const showNext = current !== "date" && current !== "time";

  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); if (showNext && !sending) next(); }} className="relative flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-caption font-medium uppercase tracking-[0.08em] text-ink-muted">{t.stepOf(step + 1, STEPS.length)}</span>
          <span className="flex flex-1 gap-1" aria-hidden>
            {STEPS.map((s, i) => <span key={s} className={cx("h-1 flex-1 rounded-pill transition-colors duration-base", i <= step ? "bg-ink" : "bg-line")} />)}
          </span>
        </div>
        {heading(t.steps[current])}
      </div>

      {/* Keyed so each step mounts fresh and fades in; no exit animation, so focus can move to it right away. */}
      <motion.div
        key={current}
        ref={stepRef}
        initial={reduce ? { opacity: 0 } : { opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: D.base, ease: E.out }}
        className="flex flex-col min-h-[12rem]"
      >
        {body}
      </motion.div>

      {submitError && errorBox(submitError)}

      {current === "review" && (
        <p className="m-0 text-caption text-ink-muted">
          {t.consent.before}
          <a href="/privacy" target="_blank" rel="noopener" className="ac-focus text-ink underline underline-offset-4">{t.consent.link}</a>
          {t.consent.after}
        </p>
      )}

      {(step > 0 || showNext) && (
        <div className="flex items-center justify-between gap-4">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => go(STEPS[step - 1])} iconLeft={<ArrowLeft size={18} aria-hidden />}>{t.back}</Button>
          ) : <span />}
          {showNext && (
            <Button type="submit" variant={current === "review" ? "primary" : "secondary"} disabled={sending}>
              {sending ? t.sending : current === "review" ? t.confirm : t.next}
            </Button>
          )}
        </div>
      )}
    </form>
  );
}
