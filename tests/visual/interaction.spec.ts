import { test, expect, type Page } from "@playwright/test";

// Interaction coverage for the static export: assertions only, no screenshots. Runs under the config's
// reducedMotion: "reduce", so Motion transitions finish instantly and the carousel does not auto-drift.

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL;

const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

async function openBookingDialog(page: Page) {
  await page.goto("/");
  await page.locator('a[href="/#book"]:visible').first().click();
  const dialog = page.getByRole("dialog", { name: "Book a discovery call" });
  await expect(dialog).toBeVisible();
  return dialog;
}

test.describe("booking", () => {
  // The flow reads its slots from NEXT_PUBLIC_BOOKING_URL, inlined at build time (src/site/booking/api.ts).
  // A production build without it never fetches: it shows "not connected" instead of the calendar, so there is
  // nothing to mock. The default `npm run test:visual` build has no env, so that state is what gets tested.
  // To cover the calendar, build and test with the same env, e.g. NEXT_PUBLIC_BOOKING_URL=http://localhost:4173/booking-api
  // (any URL: the spec answers the slot request itself).
  test("without a booking URL the dialog says booking is not connected", async ({ page }) => {
    test.skip(!!BOOKING_URL, "built with NEXT_PUBLIC_BOOKING_URL: the calendar flow test covers this build");
    const dialog = await openBookingDialog(page);
    await expect(dialog.getByRole("alert")).toContainText("Online booking isn't connected yet");
    await expect(dialog.getByRole("link", { name: /email/i })).toBeVisible();
    await expect(dialog.getByRole("grid")).toHaveCount(0);
  });

  test("calendar: nav, picking a day, picking a time", async ({ page }) => {
    test.skip(!BOOKING_URL, "needs a build with NEXT_PUBLIC_BOOKING_URL (see the comment above)");
    // One free day early in this month's window and one in the next month, so both nav states occur.
    const now = new Date();
    const dayA = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
    const dayB = new Date(dayA.getFullYear(), dayA.getMonth() + 1, 15);
    const at = (d: Date, h: number, m = 0) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m).toISOString();
    const slots = [at(dayA, 10), at(dayA, 10, 30), at(dayB, 14)];
    await page.route((u) => u.href.startsWith(BOOKING_URL!), (route) =>
      route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, slots }) }));

    const dialog = await openBookingDialog(page);
    const grid = dialog.getByRole("grid");
    await expect(grid).toBeVisible();
    const prev = dialog.getByRole("button", { name: /previous month/i });
    const next = dialog.getByRole("button", { name: /next month/i });
    await expect(prev).toBeVisible();
    await expect(next).toBeVisible();
    // startMonth is the first free day's month, so "previous" is disabled there; endMonth stops "next" a month on.
    await expect(prev).toHaveAttribute("aria-disabled", "true");
    await expect(next).not.toHaveAttribute("aria-disabled");
    await next.click();
    await expect(next).toHaveAttribute("aria-disabled", "true");
    await expect(prev).not.toHaveAttribute("aria-disabled");
    await prev.click();
    await expect(prev).toHaveAttribute("aria-disabled", "true");

    // Days without slots are disabled; a free day is a live button.
    const free = dialog.locator(`td[data-day="${isoDay(dayA)}"]:not([data-outside])`);
    await expect(free).not.toHaveAttribute("data-disabled");
    await free.getByRole("button").click();

    await expect(dialog.getByText("Step 2 of 6")).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Pick a time." })).toBeVisible();
    const times = dialog.getByRole("radiogroup", { name: "Pick a time." }).getByRole("radio");
    await expect(times).toHaveCount(2);
    await times.first().click();

    await expect(dialog.getByText("Step 3 of 6")).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Who should I expect?" })).toBeVisible();
    await expect(dialog.getByLabel("Your name")).toBeFocused();
  });
});

test("mobile menu opens and closes at phone width", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "phone", "the hamburger menu only exists below lg");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await expect(menu).toBeVisible();
  const links = menu.getByRole("navigation", { name: "Mobile" }).getByRole("link");
  expect(await links.count()).toBeGreaterThan(0);
  for (const link of await links.all()) await expect(link).toBeVisible();

  await menu.getByRole("button", { name: "Close menu" }).click();
  await expect(menu).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Mobile" })).toHaveCount(0);
});

test("floating header drops inert when shown and gets it back at the top", async ({ page }) => {
  await page.goto("/");
  // SiteHeader portals the floating bar to <body> (inside an .ac-root wrapper); it is the one fixed child there.
  const floating = page.locator("body > div.ac-root > div.fixed");
  await expect(floating).toHaveCount(1);
  await expect(floating).toHaveAttribute("inert");

  // It shows on the way back up after leaving the in-flow header behind (stuck && scrolling up).
  // Let the header's rAF-throttled scroll handler run after each jump, so it sees two separate moves.
  const scrollTo = (y: number) => page.evaluate(async (top) => {
    window.scrollTo(0, top);
    for (let i = 0; i < 3; i++) await new Promise(requestAnimationFrame);
  }, y);
  await scrollTo(2000);
  await expect(floating).toHaveAttribute("inert"); // scrolling down keeps it hidden
  await scrollTo(1500);
  await expect(floating).not.toHaveAttribute("inert");
  await expect(floating).not.toHaveAttribute("aria-hidden");

  await scrollTo(0);
  await expect(floating).toHaveAttribute("inert");
  await expect(floating).toHaveAttribute("aria-hidden", "true");
});

test("about logo carousel moves when an arrow is clicked", async ({ page }) => {
  await page.goto("/about");
  const viewport = page.getByLabel("Use left and right arrow keys to move");
  const track = viewport.locator("> div").first();
  await viewport.scrollIntoViewIfNeeded();
  const transform = () => track.evaluate((el) => (el as HTMLElement).style.transform);
  // Wait until the carousel has measured itself, so the starting position is settled.
  await expect.poll(async () => track.evaluate((el) => el.querySelector("ul")!.getBoundingClientRect().width)).toBeGreaterThan(0);
  const before = await transform();

  await page.getByRole("button", { name: "Next items" }).click();
  await expect.poll(transform).not.toBe(before);
  const afterNext = await transform();

  await page.getByRole("button", { name: "Previous items" }).click();
  await expect.poll(transform).not.toBe(afterNext);
});
