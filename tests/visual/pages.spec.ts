import { test, expect } from "@playwright/test";

const PAGES = [["home", "/"], ["about", "/about"], ["privacy", "/privacy"], ["404", "/does-not-exist"]] as const;

for (const [name, path] of PAGES) {
  test(`${name} looks the same`, async ({ page }) => {
    // Reveals use whileInView with once=false, so they hide again when scrolled out. Report every
    // observed element as fully visible so the full-page shot shows the final state deterministically.
    await page.addInitScript(() => {
      window.IntersectionObserver = class {
        constructor(private cb: IntersectionObserverCallback) {}
        observe(el: Element) {
          const r = el.getBoundingClientRect();
          const entry = { target: el, isIntersecting: true, intersectionRatio: 1, boundingClientRect: r, intersectionRect: r, rootBounds: null, time: 0 } as IntersectionObserverEntry;
          setTimeout(() => this.cb([entry], this as unknown as IntersectionObserver), 0);
        }
        unobserve() {}
        disconnect() {}
        takeRecords() { return []; }
        root = null; rootMargin = ""; thresholds = [0];
      } as unknown as typeof IntersectionObserver;
    });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    // Scroll through once so whileInView reveals fire, then return to the top.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1000); // let reveal transitions finish
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [page.locator("canvas")], // three.js dotted surface is non-deterministic
    });
  });
}
