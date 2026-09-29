import * as React from "react";
import { cx } from "../lib/cx";

export interface AvatarItem { src?: string; name: string; }
export interface AvatarStackProps {
  people: AvatarItem[];
  /** Shown as a "+N" ink disc after the faces. */
  extraCount?: number;
  size?: "sm" | "md";
  /** Max faces shown before collapsing into the count. Default 7. */
  max?: number;
  /** The surface the stack sits on — draws the separating ring in that color. Default "white". */
  ground?: "white" | "yellow" | "cream" | "ink";
  className?: string;
}

const tones = ["bg-periwinkle", "bg-mint", "bg-blush", "bg-yellow", "bg-coral", "bg-stone"];
const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

/** Overlapping face cluster ("Customer Signal"). Falls back to pastel initials when no photo is given. */
export function AvatarStack({ people, extraCount, size = "md", max = 7, ground = "white", className }: AvatarStackProps) {
  const shown = people.slice(0, max);
  const rest = (extraCount ?? 0) + Math.max(0, people.length - max);
  const ring = { white: "border-white", yellow: "border-yellow", cream: "border-cream", ink: "border-ink" }[ground];
  const s = size === "md" ? "w-10 h-10 text-caption -ml-2" : "w-6 h-6 text-micro -ml-1";
  return (
    <div className={cx("flex items-center pl-2", size === "sm" && "pl-1", className)} aria-label={`${people.length + (extraCount ?? 0)} people`} role="img">
      {shown.map((p, i) => (
        <span key={i} className={cx("inline-flex items-center justify-center rounded-full overflow-hidden border-2 border-solid font-body font-medium text-ink shrink-0", ring, s, tones[i % tones.length])}>
          {p.src ? <img src={p.src} alt="" className="w-full h-full object-cover" /> : <span className="text-ink">{initials(p.name)}</span>}
        </span>
      ))}
      {rest > 0 && <span className={cx("inline-flex items-center justify-center rounded-full bg-ink text-white font-body font-medium shrink-0 border-2 border-solid", ring, s)}>{rest}</span>}
    </div>
  );
}
