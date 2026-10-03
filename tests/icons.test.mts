import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import vm from "node:vm";
import * as esbuild from "esbuild";

// src/index.ts pulls in .tsx, so node can't import it directly. Bundle it the way build.mjs does (window.React shims)
// and evaluate the IIFE in a VM with the real React on window, then read the library's `icons` export.
const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, "..");
const shim = (p: string) => path.join(root, "src/shims", p);

const EXPECTED = [
  "Lightbulb", "Palette", "Pipette", "Rocket", "Clock", "CornerRightDown", "ArrowUpRight", "ChevronRight", "Menu", "X",
  "Linkedin", "Instagram", "Search", "Music2", "MessageCircle", "Home", "Users", "Sparkles", "Waves", "HeartPulse",
  "Mail", "Building2", "MapPin", "KeyRound", "PenTool", "Code2", "Database", "Triangle", "Bot", "Aperture",
  "BarChart3", "CalendarDays", "Camera", "FileSignature", "Plus", "Gift", "Workflow", "ChartSpline", "Megaphone",
  "Handshake", "ThumbsUp", "KeySquare",
];

async function loadLibrary() {
  const out = await esbuild.build({
    absWorkingDir: root, entryPoints: ["src/index.ts"], bundle: true, format: "iife", globalName: "__Ac",
    write: false, jsx: "automatic", logLevel: "silent",
    alias: { "react": shim("react.js"), "react-dom": shim("react-dom.js"), "react/jsx-runtime": shim("jsx-runtime.js"), "react/jsx-dev-runtime": shim("jsx-runtime.js") },
    define: { "process.env.NODE_ENV": '"production"' },
  });
  const window: Record<string, unknown> = { React: require("react"), ReactDOM: require("react-dom") };
  const ctx = vm.createContext({ window, console, setTimeout, clearTimeout, queueMicrotask, performance });
  window.window = window;
  vm.runInContext(out.outputFiles[0].text + "\n;window.Ac = __Ac;", ctx);
  return window.Ac as { icons: Record<string, unknown> };
}

test("library icons export keeps every icon, in order", async () => {
  const { icons } = await loadLibrary();
  assert.deepEqual(Object.keys(icons), EXPECTED);
  for (const [name, value] of Object.entries(icons)) {
    const ok = typeof value === "function" || (typeof value === "object" && value !== null && "$$typeof" in value);
    assert.ok(ok, `${name} is not a component (got ${typeof value})`);
  }
});
