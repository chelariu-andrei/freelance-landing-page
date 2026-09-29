import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const baseEnv = { ...process.env };
delete baseEnv.VERCEL;
delete baseEnv.NETLIFY;
delete baseEnv.CF_PAGES;
delete baseEnv.NEXT_PUBLIC_SITE_URL;

const run = (env) => spawnSync(process.execPath, ["scripts/check-placeholders.mjs"], { env, encoding: "utf8" });

test("exits 0 with no deploy-host env set", () => {
  const result = run({ ...baseEnv });
  assert.equal(result.status, 0);
});

test("exits 1 when VERCEL is set and no NEXT_PUBLIC_SITE_URL (site.url is example.com)", () => {
  const result = run({ ...baseEnv, VERCEL: "1" });
  assert.equal(result.status, 1);
  assert.match(result.stdout + result.stderr, /NEXT_PUBLIC_SITE_URL/);
});

test("exits 0 when VERCEL is set but NEXT_PUBLIC_SITE_URL overrides example.com", () => {
  const result = run({ ...baseEnv, VERCEL: "1", NEXT_PUBLIC_SITE_URL: "https://andrei.dev" });
  assert.equal(result.status, 0);
});

test("lists unfilled placeholder tokens, including CAL_LINK", () => {
  const result = run({ ...baseEnv });
  assert.match(result.stdout + result.stderr, /CAL_LINK/);
});
