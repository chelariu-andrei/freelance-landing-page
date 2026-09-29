import { FileJson, Bot, Link2, Plug, Workflow, Repeat, Search, Cog, LayoutDashboard, RefreshCw, Code2, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { IconKey } from "@/content/content";

const map: Partial<Record<IconKey, LucideIcon>> = {
  mongodb: FileJson, springai: Bot, langchain4j: Link2, mcp: Plug, n8n: Workflow, make: Repeat,
  audit: Search, implement: Cog, platform: LayoutDashboard, legacy: RefreshCw, agents: Bot, code: Code2, process: ShieldCheck,
};

/** Original brand marks (devicon), served from /public/logos. */
const logos: Partial<Record<IconKey, string>> = {
  java: "java", spring: "spring", quarkus: "quarkus", postgres: "postgres", oracle: "oracle", react: "react",
  gcp: "gcp", terraform: "terraform", kubernetes: "kubernetes", docker: "docker", nextjs: "nextjs",
};

export function iconFor(key: IconKey, size = 26, strokeWidth = 1.75) {
  const logo = logos[key];
  if (logo) return <img src={`/logos/${logo}.svg`} width={size} height={size} alt="" aria-hidden className="block object-contain" />;
  const I = map[key]!;
  return <I size={size} strokeWidth={strokeWidth} aria-hidden />;
}
