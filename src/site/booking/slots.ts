/** Booking helpers with no framework or alias imports, so node --test can load them directly. */

/** "2026-10-14" for a Date, in the visitor's local time zone (the zone the calendar shows). */
export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Slot starts (ISO strings) grouped by local day, each day sorted by time. */
export function groupByDay(slots: string[]): Map<string, string[]> {
  const days = new Map<string, string[]>();
  for (const s of [...slots].sort((a, b) => Date.parse(a) - Date.parse(b))) {
    const k = dayKey(new Date(s));
    days.set(k, [...(days.get(k) ?? []), s]);
  }
  return days;
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Loose international check: digits with spaces, dots, dashes, brackets and a leading +; 7 to 15 digits. */
export function isPhone(v: string) {
  const t = v.trim();
  const digits = t.replace(/\D/g, "").length;
  return /^\+?[\d\s().-]+$/.test(t) && digits >= 7 && digits <= 15;
}

export const formatTime = (iso: string) => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

export const formatLongDate = (d: Date | string) =>
  new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(new Date(d));

/** Demo availability for local development: weekdays 10:00–17:00, every 30 minutes, for three weeks. */
export function demoSlots(now = new Date()): string[] {
  const out: string[] = [];
  for (let i = 1; i <= 21; i++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    if (day.getDay() === 0 || day.getDay() === 6) continue;
    for (let m = 10 * 60; m < 17 * 60; m += 30) {
      if ((i + m) % 7 === 0) continue; // a few taken slots, so the demo looks real
      out.push(new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(m / 60), m % 60).toISOString());
    }
  }
  return out;
}
