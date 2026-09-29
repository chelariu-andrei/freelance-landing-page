import * as esbuild from "esbuild";
import fs from "fs"; import path from "path";
const shim = (p) => path.resolve("src/shims", p);
const meta = {
  Button: ["Actions", 260], ArrowCta: ["Actions", 360], Badge: ["Content", 100], Chip: ["Content", 220], Input: ["Forms", 420],
  Card: ["Surfaces", 320], Icon: ["Content", 200], StepPill: ["Content", 420], SectionHeading: ["Content", 560], HighlightText: ["Content", 280],
  Divider: ["Content", 180], AvatarStack: ["Content", 200], Logo: ["Brand", 220], Skeleton: ["Feedback", 110], Sparkline: ["Data", 100],
  SignalCard: ["Data", 260], CampaignCard: ["Data", 300], TrendingTopics: ["Data", 900], ChannelCard: ["Data", 260], ScoreMeter: ["Data", 220],
  MediaPanel: ["Layout", 520], Grid: ["Layout", 320], Section: ["Layout", 700], SiteHeader: ["Layout", 300, 1280], SiteFooter: ["Layout", 820, 1440],
  HeroSection: ["Sections", 1000, 1440], FeatureStep: ["Sections", 1500, 1440], ProcessLoop: ["Sections", 520, 1280], StatStatement: ["Sections", 620, 1440],
  CtaSection: ["Sections", 1100, 1440], LogoCarousel: ["Sections", 900, 1440], DottedSurface: ["Backgrounds", 1800, 1440], DottedSurfaceSection: ["Sections", 2600, 1440], PriceTag: ["Pricing", 400], CheckItem: ["Pricing", 300], PromoBanner: ["Pricing", 300, 1440], PricingHero: ["Pricing", 1000, 1440], FeatureMatrix: ["Pricing", 1400, 1440], CtaBanner: ["Pricing", 900, 1440], PricingPage: ["Pages", 3000, 1440], OrbitStatement: ["Sections", 1600, 1440], IconCircle: ["Content", 260], Stagger: ["Motion", 200], StaggerItem: ["Motion", 200], Container: ["Layout", 260], Reveal: ["Motion", 320],
};
const out = {};
for (const f of fs.readdirSync("previews/src").filter((f) => f.endsWith(".tsx") && !f.startsWith("_"))) {
  const name = f.replace(".tsx", "");
  const r = await esbuild.build({
    entryPoints: [`previews/src/${f}`], bundle: true, write: false, format: "iife", minify: true, target: "es2019", jsx: "automatic",
    alias: { react: shim("react.js"), "react-dom": shim("react-dom.js"), "react/jsx-runtime": shim("jsx-runtime.js"), ac: shim("ac.js") },
  });
  let js = r.outputFiles[0].text.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "\\x3C!--");
  out[name] = js;
}
fs.mkdirSync("dist/previews", { recursive: true });
for (const [name, js] of Object.entries(out)) fs.writeFileSync(`dist/previews/${name}.js`, js);
fs.writeFileSync("dist/previews/meta.json", JSON.stringify(meta));
console.log(Object.keys(out).length, "previews");
