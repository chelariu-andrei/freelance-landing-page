import * as React from "react";
import { icons } from "ac";
const { Lightbulb, Palette, Pipette, Rocket } = icons;
export const people = ["Ana Pop", "Mihai Ionescu", "Ioana Dinu", "Radu Stan", "Elena Marin", "Vlad Toma", "Carmen Lupu"].map((name) => ({ name }));
export const navLinks = [
  { label: "Properties", href: "#properties" },
  { label: "About Us", href: "#about" },
  { label: "Journal", href: "#journal" },
  { label: "Pricing", href: "#pricing" },
];
export const headerCtas = [
  { label: "Talk to Us", href: "#talk", variant: "secondary" as const },
  { label: "Book a Viewing", href: "#book", variant: "primary" as const },
];
export const topics = [
  { title: "Two-bedroom flats near metro lines", category: "Bucharest · Rentals", score: "90%", scoreTone: "mint" as const, trend: [3, 4, 4, 5, 6, 6, 8, 9], people: people.slice(0, 3) },
  { title: "Houses with gardens outside the ring road", category: "Ilfov · Sales", score: "96%", scoreTone: "mint" as const, trend: [2, 3, 2, 4, 3, 5, 6, 7], people: people.slice(2, 5) },
  { title: "Studios for first-time buyers", category: "Cluj · Sales", score: "64%", scoreTone: "yellow" as const, trend: [5, 4, 3, 3, 4, 4, 5, 6], people: people.slice(1, 4) },
  { title: "Renovated interwar apartments", category: "Bucharest · Sales", score: "92%", scoreTone: "mint" as const, trend: [4, 6, 3, 5, 4, 6, 7, 7], people: people.slice(3, 6) },
];
export const steps = [
  { label: "Discover", icon: <Lightbulb size={20} strokeWidth={1.75} />, description: <>Spot demand.<br />Find new buyers.</> },
  { label: "Create", icon: <Palette size={20} strokeWidth={1.75} />, description: <>Craft listings<br />that convert.</> },
  { label: "Test", icon: <Pipette size={20} strokeWidth={1.75} />, description: <>Predict buyer<br />engagement.</> },
  { label: "Launch", icon: <Rocket size={20} strokeWidth={1.75} />, description: <>Run smart campaign<br />optimisation loops.</> },
];
export const metrics = [
  { label: "Reach", value: "320.5K" }, { label: "Impressions", value: "545.2K" },
  { label: "CTR", value: "3.2%" }, { label: "Cost per lead", value: "€3.12" },
  { label: "Flight", value: "1–31 Jan" }, { label: "Spent", value: "€8,675" },
];
export function mount(el: React.ReactElement) {
  const root = document.getElementById("root")!;
  (window as any).ReactDOM.createRoot(root).render(el);
}

import { icons as _icons } from "ac";
const { Lightbulb: _L, Workflow: _W, Palette: _P, ChartSpline: _C, Rocket: _R, Handshake: _H } = _icons;
const ic = (C: any) => <C size={26} strokeWidth={1.75} />;
export const modules = [
  { id: "discover", name: "Discover", tagline: "Know what buyers want", icon: ic(_L), iconTone: "periwinkle" as const, features: [
    { lead: "Live demand", text: "— the areas and home types buyers search for, tracked daily" },
    { lead: "Buyer segments", text: "— first-time buyers, investors, relocating families" } ] },
  { id: "campaigns", name: "Campaigns", tagline: "Never start from blank", icon: ic(_W), iconTone: "yellow" as const, features: [
    { lead: "Unlimited listing campaigns", text: "you run yourself*" },
    { lead: "Monthly marketing plan", text: "— refreshed every month" } ] },
  { id: "studio", name: "Creative Studio", tagline: "Make an impression", icon: ic(_P), iconTone: "blush" as const, features: [
    { lead: "Photo edits and virtual staging", text: "every month" },
    { lead: "Portal listings + social posts + print brochures", text: "sized and ready to publish" },
    { lead: "Video walkthroughs", text: "— all formats" } ] },
  { id: "sim", name: "Buyer Simulator", tagline: "Test before you spend", icon: ic(_C), iconTone: "mint" as const, features: [
    { lead: "Predicted interest score", text: "for every listing, before it goes live" } ] },
  { id: "channels", name: "Channels", tagline: "Publish everywhere", icon: ic(_R), iconTone: "periwinkle" as const, features: [
    { lead: "Portals + social:", text: "one approved listing, every channel" } ] },
  { id: "advisor", name: "Advisor", tagline: "A human on call", icon: ic(_H), iconTone: "coral" as const, features: [
    { lead: "Monthly strategy call", text: "with a senior agent" },
    { lead: "Legal document review", text: "— add-on", excluded: true } ] },
];
