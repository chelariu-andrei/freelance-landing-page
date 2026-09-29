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
  assert.match(html, />(?:<span[^>]*>)?Book a 30-min call</);
  assert.match(html, /href="#services"[^>]*>(?:<span[^>]*>)?See how I work</);
  assert.match(html, /<ol aria-label="How AI plugs into your existing system"/);
  const steps = ["Existing backend", "APIs", "Data", "AI agent", "Tools", "Production"];
  let at = 0;
  for (const s of steps) {
    const i = html.indexOf(`>${s}<`, at);
    assert.ok(i > at, `pipeline step ${s} in order`);
    at = i;
  }
});

test("landing sections in order: services, stats, contact", () => {
  const html = page("index");
  const iServices = html.indexOf('id="services"');
  const iStats = html.indexOf("rewrites required.");
  const iContact = html.indexOf('id="contact"');
  assert.ok(iServices > 0 && iStats > iServices && iContact > iStats, "order");
  for (const s of ["AI Automation Audit", "Automation Implementation", "Custom AI Platform / Internal Tools", "Legacy Modernization Acceleration"]) {
    assert.match(html, new RegExp(s.replace(/[/]/g, "\\/")), s);
  }
  // ArrowCta renders its label 3 times per instance: 2 invisible grid positioning spans + 1 animated visible span.
  assert.equal(count(html, />Discuss this</g), 12);
  assert.match(html, /small, fixed-scope first step\./);
  assert.match(html, /needs to reach production\?/);
  assert.match(html, />Book a discovery call</);
});

test("prices hidden while pricingMode is hidden", () => {
  assert.doesNotMatch(page("index"), /PRICE_/);
});

test("about sections in order", () => {
  const html = page("about");
  const order = ["survive production.", "years inside large Java systems", "Two disciplines, one engineer.", "Tools I ship with.", "survives production."];
  let at = 0;
  for (const s of order) {
    const i = html.indexOf(s, at);
    assert.ok(i >= at && i !== -1, `order: ${s}`);
    at = i + 1;
  }
});

test("closing section is in the static HTML (works without JS/WebGL)", () => {
  const html = page("about");
  assert.match(html, /AI is only valuable if it/);
  assert.match(html, /survives production\./);
  const i = html.indexOf("survives production.");
  const slice = html.slice(i);
  assert.match(slice, />(?:<span[^>]*>)?Book a call</);
});

test("unset photo falls back to the AC monogram, never a broken img", () => {
  const html = page("about");
  assert.match(html, />AC</);
  assert.doesNotMatch(html, /src="\{\{PHOTO\}\}"/);
});

test("stack carousel lists tech, no client logos", () => {
  const html = page("about");
  for (const n of ["Spring Boot", "Quarkus", "PostgreSQL", "LangChain4j", "n8n"]) assert.match(html, new RegExp(n), n);
});

test("per-page title, description, canonical and OG", () => {
  const cases = [["index", "/", "AI for existing Java systems"], ["about", "/about", "About · Andrei Chelariu"], ["expertise", "/expertise", "Expertise · Andrei Chelariu"]];
  for (const [p, path, title] of cases) {
    const html = page(p);
    assert.match(html, new RegExp(`<title>[^<]*${title}`), p);
    assert.match(html, /<meta name="description" content="[^"]+"/, p);
    assert.match(html, new RegExp(`<link rel="canonical" href="https?://[^"]+${path === "/" ? "/?" : path}"`), p);
    assert.match(html, /<meta property="og:title"/, p);
    assert.match(html, /<meta name="twitter:card" content="summary"/, p);
  }
});

test("expertise is noindex, the others are indexable", () => {
  assert.match(page("expertise"), /<meta name="robots" content="noindex/);
  assert.doesNotMatch(page("index"), /noindex/);
  assert.doesNotMatch(page("about"), /noindex/);
});

test("JSON-LD Person + ProfessionalService", () => {
  const m = page("index").match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
  assert.ok(m, "json-ld present");
  const types = JSON.parse(m[1])["@graph"].map((n) => n["@type"]);
  assert.deepEqual(types, ["Person", "ProfessionalService"]);
});

test("no page ships an unfilled placeholder in an href", () => {
  for (const p of PAGES) assert.doesNotMatch(page(p), /href="[^"]*\{\{/, p);
});

test("sitemap lists / and /about only; robots points to it", () => {
  const sitemap = readFileSync(new URL("../out/sitemap.xml", import.meta.url), "utf8");
  assert.equal(count(sitemap, /<loc>/g), 2);
  assert.doesNotMatch(sitemap, /expertise/);
  const robots = readFileSync(new URL("../out/robots.txt", import.meta.url), "utf8");
  assert.match(robots, /Sitemap: https?:\/\/.+\/sitemap\.xml/);
});
