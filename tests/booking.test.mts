import { test } from "node:test";
import assert from "node:assert/strict";
import { dayKey, demoSlots, groupByDay, isEmail, isPhone } from "../src/site/booking/slots.ts";

test("slots are grouped by local day, in time order", () => {
  const a = new Date(2026, 9, 14, 15, 0).toISOString();
  const b = new Date(2026, 9, 14, 10, 30).toISOString();
  const c = new Date(2026, 9, 15, 11, 0).toISOString();
  const days = groupByDay([a, c, b]);
  assert.deepEqual([...days.keys()], ["2026-10-14", "2026-10-15"]);
  assert.deepEqual(days.get("2026-10-14"), [b, a]);
  assert.equal(dayKey(new Date(2026, 0, 5)), "2026-01-05");
});

test("email and phone checks", () => {
  assert.ok(isEmail("ana@firma.ro"));
  assert.ok(!isEmail("ana@firma"));
  assert.ok(!isEmail("ana firma.ro"));
  assert.ok(isPhone("+40 712 345 678"));
  assert.ok(isPhone("(0712) 345-678"));
  assert.ok(!isPhone("12345"));
  assert.ok(!isPhone("call me"));
});

test("Apps Script accepts an empty phone but still rejects a malformed one", async () => {
  const { readFileSync } = await import("node:fs");
  const gs = readFileSync(new URL("../integrations/google-calendar/Code.gs", import.meta.url), "utf8");
  assert.match(gs, /const badPhone = phone && \(/);
  assert.match(gs, /\|\| badPhone/);
});

test("demo slots skip weekends and stay inside 10:00-17:00", () => {
  const slots = demoSlots(new Date(2026, 9, 2));
  assert.ok(slots.length > 50);
  for (const s of slots) {
    const d = new Date(s);
    assert.ok(d.getDay() !== 0 && d.getDay() !== 6, s);
    assert.ok(d.getHours() >= 10 && d.getHours() < 17, s);
  }
});
