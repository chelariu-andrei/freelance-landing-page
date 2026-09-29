import { Coffee, Leaf, Zap, Database, FileJson, Atom, Cloud, Layers, Boxes, Bot, Link2, Plug, Workflow, Repeat, Search, Cog, LayoutDashboard, RefreshCw, Code2, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { IconKey } from "@/content/content";

const map: Record<IconKey, LucideIcon> = {
  java: Coffee, spring: Leaf, quarkus: Zap, postgres: Database, mongodb: FileJson, react: Atom, gcp: Cloud,
  terraform: Layers, kubernetes: Boxes, springai: Bot, langchain4j: Link2, mcp: Plug, n8n: Workflow, make: Repeat,
  audit: Search, implement: Cog, platform: LayoutDashboard, legacy: RefreshCw, agents: Bot, code: Code2, process: ShieldCheck,
};

export function iconFor(key: IconKey, size = 26, strokeWidth = 1.75) {
  const I = map[key];
  return <I size={size} strokeWidth={strokeWidth} aria-hidden />;
}
