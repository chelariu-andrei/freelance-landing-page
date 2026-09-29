import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

export const page = (name) => readFileSync(new URL(`../out/${name}.html`, import.meta.url), "utf8");
const PAGES = ["index", "about", "expertise"];

test("every page is exported with lang=en and the Ac. root", () => {
  for (const p of PAGES) {
    const html = page(p);
    assert.match(html, /<html lang="en"/, p);
    assert.match(html, /class="ac-root/, p);
  }
});

const count = (html, re) => (html.match(re) || []).length;

test("every page has exactly one h1, the main nav, and the footer", () => {
  for (const p of PAGES) {
    const html = page(p);
    assert.equal(count(html, /<h1[\s>]/g), 1, `${p}: h1 count`);
    assert.match(html, /<nav aria-label="Main"/, p);
    assert.match(html, /<footer/, p);
    assert.match(html, new RegExp(`© ${new Date().getFullYear()} Andrei Chelariu`), p);
    assert.match(html, /This site uses no cookies and no tracking\./, p);
  }
});

test("current page link is marked aria-current", () => {
  assert.match(page("index"), /href="\/" aria-current="page"/);
  assert.match(page("about"), /href="\/about" aria-current="page"/);
  assert.match(page("expertise"), /href="\/expertise" aria-current="page"/);
});

test("Book a call is pinned outside the mobile menu", () => {
  const html = page("expertise");
  assert.match(html, /lg:hidden flex items-center gap-2"[^]*?>Book a call</);
});

test("expertise placeholder copy", () => {
  const html = page("expertise");
  assert.match(html, /Coming soon\./);
  assert.match(html, /href="\/about"/);
});

test("landing hero: headline, trust line, CTAs and pipeline in order", () => {
  const html = page("index");
  assert.match(html, /Without a rewrite\./);
  assert.match(html, /\{\{YEARS\}\}\+ years · Java \/ Spring \/ Quarkus/);
  assert.match(html, />Book a 30-min call</);
  assert.match(html, /href="#services"[^>]*>See how I work</);
  assert.match(html, /<ol aria-label="How AI plugs into your existing system"/);
  const steps = ["Existing backend", "APIs", "Data", "AI agent", "Tools", "Production"];
  let at = 0;
  for (const s of steps) {
    const i = html.indexOf(`>${s}<`, at);
    assert.ok(i > at, `pipeline step ${s} in order`);
    at = i;
  }
});
