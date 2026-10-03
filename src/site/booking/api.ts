import { content } from "@/content/content";
import { isSet } from "@/content/links";
import { demoSlots } from "./slots";

/** The deployed Google Apps Script web app (see integrations/google-calendar/README.md). */
const ENDPOINT = process.env.NEXT_PUBLIC_BOOKING_URL || content.site.bookingUrl;
/** Without an endpoint, `next dev` runs on demo slots so the flow can be tried; a production build says it is not connected. */
const DEMO = !isSet(ENDPOINT) && process.env.NODE_ENV !== "production";

export type BookingError = "slot_taken" | "invalid" | "rate_limited" | "server" | "network" | "not_configured";
export interface Availability { slots: string[] }
export interface BookingRequest {
  start: string; name: string; email: string; phone: string; interest: string; note: string;
  /** The visitor's IANA time zone, so the notification shows their local time too. */
  timeZone: string;
  /** Honeypot: real people never fill it. */
  website: string;
}
export type BookingResult = { ok: true; start: string; meetLink?: string } | { ok: false; error: BookingError };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchAvailability(): Promise<{ ok: true; data: Availability } | { ok: false; error: BookingError }> {
  if (DEMO) { await wait(400); return { ok: true, data: { slots: demoSlots() } }; }
  if (!isSet(ENDPOINT)) return { ok: false, error: "not_configured" };
  try {
    const res = await fetch(`${ENDPOINT}?action=slots`, { cache: "no-store" });
    const body = await res.json();
    return body.ok ? { ok: true, data: { slots: body.slots } } : { ok: false, error: body.error ?? "server" };
  } catch {
    return { ok: false, error: "network" };
  }
}

export async function book(req: BookingRequest): Promise<BookingResult> {
  if (DEMO) { await wait(700); return { ok: true, start: req.start }; }
  if (!isSet(ENDPOINT)) return { ok: false, error: "not_configured" };
  try {
    // text/plain keeps this a "simple" request: Apps Script web apps cannot answer a CORS preflight.
    const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(req) });
    return await res.json();
  } catch {
    return { ok: false, error: "network" };
  }
}
