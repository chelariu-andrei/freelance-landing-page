import * as esbuild from "esbuild";
import path from "path";
const shim = (p) => path.resolve("src/shims", p);
const names = ["Button","ArrowCta","Badge","Chip","Input","Card","Icon","IconCircle","StepPill","SectionHeading","HighlightText","Divider","AvatarStack","Logo","Skeleton","Sparkline","MediaPanel","SignalCard","CampaignCard","TrendingTopics","ChannelCard","ScoreMeter","Container","Grid","Section","SiteHeader","SiteFooter","HeroSection","FeatureStep","ProcessLoop","StatStatement","CtaSection","LogoCarousel","DottedSurface","DottedSurfaceSection","PriceTag","CheckItem","PromoBanner","PricingHero","FeatureMatrix","CtaBanner","OrbitStatement","Reveal","Stagger","StaggerItem"];
const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: "Ac", components: names.map((name) => ({ name })) })} */`;
await esbuild.build({
  entryPoints: ["src/index.ts"], bundle: true, format: "iife", globalName: "__Ac", minify: true, target: "es2019",
  outfile: "dist/bundle.js", jsx: "automatic", legalComments: "none",
  alias: { "react": shim("react.js"), "react-dom": shim("react-dom.js"), "react/jsx-runtime": shim("jsx-runtime.js"), "react/jsx-dev-runtime": shim("jsx-runtime.js") },
  define: { "process.env.NODE_ENV": '"production"' },
  banner: { js: header }, footer: { js: "window.Ac=__Ac;" },
});
console.log("built");
