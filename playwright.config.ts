import { defineConfig, devices } from "@playwright/test";

// Visual regression for the static export: build first, this serves out/ as Vercel would (clean URLs).
// Baselines are rendered on Windows chromium; re-baseline (--update-snapshots) on Linux CI.
export default defineConfig({
  testDir: "tests/visual",
  snapshotPathTemplate: "{testDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}",
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled" } },
  use: { baseURL: "http://localhost:4173", reducedMotion: "reduce", colorScheme: "light" },
  projects: [
    { name: "phone", use: { ...devices["Pixel 7"], browserName: "chromium" } },
    { name: "tablet", use: { viewport: { width: 820, height: 1180 }, browserName: "chromium" } },
    { name: "desktop", use: { viewport: { width: 1440, height: 900 }, browserName: "chromium" } },
  ],
  webServer: { command: "npx serve out -l 4173 --no-clipboard", url: "http://localhost:4173", reuseExistingServer: true },
});
