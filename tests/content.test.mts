import { test } from "node:test";
import assert from "node:assert/strict";
import { isPlaceholder, isSet, resolveHref, mailtoHref, CONTACT_FALLBACK } from "../src/content/links.ts";
import { content } from "../src/content/content.ts";

test("placeholder detection", () => {
  assert.equal(isPlaceholder("{{CAL_LINK}}"), true);
  assert.equal(isPlaceholder(" {{EMAIL}} "), true);
  assert.equal(isPlaceholder("https://cal.com/andrei"), false);
  assert.equal(isSet(""), false);
  assert.equal(isSet(undefined), false);
  assert.equal(isSet("{{GITHUB}}"), false);
  assert.equal(isSet("https://github.com/x"), true);
});

test("unset links never produce a placeholder href", () => {
  assert.equal(resolveHref("{{CAL_LINK}}"), CONTACT_FALLBACK);
  assert.equal(resolveHref(""), CONTACT_FALLBACK);
  assert.equal(resolveHref("{{X}}", "/about"), "/about");
  assert.equal(resolveHref("https://cal.com/a"), "https://cal.com/a");
  assert.equal(mailtoHref("{{EMAIL}}"), CONTACT_FALLBACK);
  assert.equal(mailtoHref("a@b.dev"), "mailto:a@b.dev");
});

test("content shape matches the spec", () => {
  assert.deepEqual(content.nav.links.map((l) => l.href), ["/", "/about"]);
  assert.equal(content.nav.cta, "Book a call");
  assert.equal(content.landing.services.length, 3);
  assert.deepEqual(content.landing.services.map((s) => s.number), ["01", "02", "03"]);
  assert.equal(content.landing.stats.length, 2);
  assert.equal(content.about.orbit.items.length, 8);
  assert.equal(content.about.matrix.modules.length, 2);
  assert.equal(content.site.pricingMode, "hidden");
});

test("no hype words in copy", () => {
  const all = JSON.stringify(content).toLowerCase();
  for (const w of ["revolutioni", "cutting-edge", "game-chang", "synergy"]) assert.ok(!all.includes(w), w);
});
