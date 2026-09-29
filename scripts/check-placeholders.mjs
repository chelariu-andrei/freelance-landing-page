#!/usr/bin/env node
// Warns about unfilled {{PLACEHOLDER}} tokens and an example.com site URL in
// src/content/content.ts. Fails the build only when a deploy host is
// detected and the effective site URL is still example.com.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentPath = resolve(__dirname, "..", "src", "content", "content.ts");
const src = readFileSync(contentPath, "utf8");

const tokens = [...new Set([...src.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)].map((m) => m[1]))].sort();

if (tokens.length > 0) {
  console.warn(`Warning: unfilled placeholders in src/content/content.ts: ${tokens.map((t) => `{{${t}}}`).join(", ")}`);
} else {
  console.log("No unfilled placeholders found in src/content/content.ts.");
}

const urlMatch = src.match(/url:\s*"([^"]*)"/);
const contentUrl = urlMatch ? urlMatch[1] : "";
const effectiveUrl = process.env.NEXT_PUBLIC_SITE_URL || contentUrl;

let host = "";
try {
  host = new URL(effectiveUrl).hostname;
} catch {
  host = "";
}
const isExampleCom = host === "example.com";

if (isExampleCom) {
  console.warn(`Warning: effective site URL "${effectiveUrl}" is example.com. Set NEXT_PUBLIC_SITE_URL to your real domain.`);
}

const deployHost = process.env.VERCEL || process.env.NETLIFY || process.env.CF_PAGES;

if (deployHost && isExampleCom) {
  console.error(
    `Error: a deploy host was detected (VERCEL/NETLIFY/CF_PAGES) but the effective site URL is still example.com. Set NEXT_PUBLIC_SITE_URL to your real domain before deploying.`
  );
  process.exit(1);
}

process.exit(0);
