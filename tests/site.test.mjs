import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

export const page = (name) => readFileSync(new URL(`../out/${name}.html`, import.meta.url), "utf8");
const PAGES = ["index", "about", "privacy"];

test("every page is exported with lang=en and the Ac. root", () => {
  for (const p of PAGES) {
    const html = page(p);
    assert.match(html, /<html lang="en"/, p);
    assert.match(html, /class="ac-root/, p);
  }
});

test("noscript fallback makes ac-root content visible without JS", () => {
  const html = page("index");
  assert.match(html, /<noscript>/);
  assert.match(html, /opacity:1!important/);
});

const count = (html, re) => (html.match(re) || []).length;

test("every page has exactly one h1, the main nav, and the footer", () => {
  for (const p of PAGES) {
    const html = page(p);
    assert.equal(count(html, /<h1[\s>]/g), 1, `${p}: h1 count`);
    assert.match(html, /<nav aria-label="Main"/, p);
    assert.match(html, /<footer/, p);
    assert.match(html, new RegExp(`© ${new Date().getFullYear()} Andrei Chelariu`), p);
    assert.match(html, /No cookies\. Privacy-friendly analytics\./, p);
    assert.match(html, /href="\/privacy"/, p);
  }
});

test("current page link is marked aria-current", () => {
  assert.match(page("index"), /href="\/" aria-current="page"/);
  assert.match(page("about"), /href="\/about" aria-current="page"/);
});

test("Book a call is pinned outside the mobile menu", () => {
  const html = page("about");
  assert.match(html, /lg:hidden flex items-center gap-2"[^]*?>Book a call</);
});

test("404 page: site chrome, joke headline, way home, never indexed", () => {
  const html = page("404");
  assert.equal(count(html, /<h1[\s>]/g), 1);
  assert.match(html, /never shipped\./);
  assert.match(html, /<nav aria-label="Main"/);
  assert.match(html, /<footer/);
  assert.match(html, /href="\/"[^>]*aria-label="Back to home"|aria-label="Back to home"[^>]*href="\/"/);
  assert.match(html, /<meta name="robots" content="noindex/);
});

test("expertise page is gone", () => {
  for (const p of PAGES) assert.doesNotMatch(page(p), /href="\/expertise"/, p);
});

test("landing sections in order: services, stats, contact", () => {
  const html = page("index");
  const iServices = html.indexOf('id="services"');
  const iStats = html.indexOf("not rewrites.");
  const iContact = html.indexOf('id="contact"');
  assert.ok(iServices > 0 && iStats > iServices && iContact > iStats, "order");
  for (const s of ["AI Automation", "Custom Software", "Legacy Modernization"]) {
    assert.match(html, new RegExp(s.replace(/[/]/g, "\\/")), s);
  }
  // ArrowCta renders its label 3 times per instance: 2 invisible grid positioning spans + 1 animated visible span.
  assert.equal(count(html, />Discuss this</g), 9);
  assert.match(html, /never notices\./);
  assert.doesNotMatch(html, /of the code is yours/);
  assert.match(html, /Bring the problem\. Leave with a plan\./);
  assert.match(html, />Book a discovery call</);
});

test("process is shown once; each service has its own labelled diagram", () => {
  const html = page("index");
  assert.equal(count(html, />How it runs</g), 1);
  assert.doesNotMatch(html, /follows the same path/);
  assert.equal(count(html, /role="img" aria-label="Diagram:/g), 3);
});

test("prices hidden while pricingMode is hidden", () => {
  assert.doesNotMatch(page("index"), /PRICE_/);
});

test("about sections in order", () => {
  const html = page("about");
  const order = ["for fun.", "get tools, not the keys.", "The work behind the promise.", "projects shipped to production", "Two disciplines, one engineer.", "Tools I ship with.", "AI without a rewrite?"];
  let at = 0;
  for (const s of order) {
    const i = html.indexOf(s, at);
    assert.ok(i >= at && i !== -1, `order: ${s}`);
    at = i + 1;
  }
});

test("experience figures render their final values in the static HTML", () => {
  const html = page("about");
  for (const v of [">10<", ">30<", ">25+<"]) assert.ok(html.includes(v), v);
});

test("closing section is in the static HTML (works without JS/WebGL)", () => {
  const html = page("about");
  assert.match(html, /Have a system that needs/);
  assert.match(html, /AI without a rewrite\?/);
  const i = html.indexOf("AI without a rewrite?");
  const slice = html.slice(i);
  assert.match(slice, />(?:<span[^>]*>)?Book a call</);
});

test("about renders the real photo (/me.png), never a broken {{PHOTO}} img", () => {
  const html = page("about");
  assert.match(html, /<img src="\/me\.png" alt="Andrei Chelariu"/);
  assert.doesNotMatch(html, /src="\{\{PHOTO\}\}"/);
});

test("stack carousel lists tech, no client logos", () => {
  const html = page("about");
  for (const n of ["Spring Boot", "Quarkus", "PostgreSQL", "LangChain4j", "n8n"]) assert.match(html, new RegExp(n), n);
});

test("per-page title, description, canonical and OG", () => {
  const cases = [["index", "/", "AI automation, custom software"], ["about", "/about", "About · Andrei Chelariu"], ["privacy", "/privacy", "Privacy · Andrei Chelariu"]];
  for (const [p, path, title] of cases) {
    const html = page(p);
    assert.match(html, new RegExp(`<title>[^<]*${title}`), p);
    assert.match(html, /<meta name="description" content="[^"]+"/, p);
    assert.match(html, new RegExp(`<link rel="canonical" href="https?://[^"]+${path === "/" ? "/?" : path}"`), p);
    assert.match(html, /<meta property="og:title"/, p);
    assert.match(html, /<meta name="twitter:card" content="summary"/, p);
  }
});

test("every page is indexable", () => {
  for (const p of PAGES) assert.doesNotMatch(page(p), /noindex/, p);
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

test("sitemap lists /, /about and /privacy only; robots points to it", () => {
  const sitemap = readFileSync(new URL("../out/sitemap.xml", import.meta.url), "utf8");
  assert.equal(count(sitemap, /<loc>/g), 3);
  assert.match(sitemap, /\/privacy<\/loc>/);
  assert.doesNotMatch(sitemap, /expertise/);
  const robots = readFileSync(new URL("../out/robots.txt", import.meta.url), "utf8");
  assert.match(robots, /Sitemap: https?:\/\/.+\/sitemap\.xml/);
});

test("privacy page covers booking data, Vercel Analytics, rights and contact", () => {
  const html = page("privacy");
  for (const s of ["Booking a call", "Google Calendar", "Vercel Web Analytics", "no cookies", "Your rights", "ANSPDCP", "Last updated"]) {
    assert.ok(html.includes(s), s);
  }
  assert.match(html, /href="mailto:chelariu\.andrew@gmail\.com"/);
});

test("landing hero keeps the scales / ships / lasts headline", () => {
  const html = page("index");
  assert.match(html, /Software that scales\./);
  assert.match(html, /Systems that last\./);
  assert.match(html, /restaurant-ai/);
});

test("footer social icons render (lucide v1 dropped brand icons)", () => {
  const html = page("index");
  assert.match(html, /lucide-linkedin/);
  assert.match(html, /lucide-github/);
});
