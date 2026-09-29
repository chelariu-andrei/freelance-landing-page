import * as React from "react";
import { cx } from "../lib/cx";
import { IconCircle } from "../primitives/Icon";

export interface ChannelCardProps {
  name: string;
  /** Channel glyph (pass the channel's own logo SVG, or a generic icon). */
  icon?: React.ReactNode;
  iconTone?: "periwinkle" | "yellow" | "white" | "stone";
  /** Format tags, e.g. ["Feed (4:5)", "Story (9:16)"]. */
  formats: string[];
  className?: string;
}

/** White card listing a channel and the ad/post formats generated for it. */
export function ChannelCard({ name, icon, iconTone = "periwinkle", formats, className }: ChannelCardProps) {
  return (
    <div className={cx("bg-white rounded-md p-3 lg:p-4 flex flex-col gap-3 text-ink", className)}>
      <div className="flex items-center gap-2">
        {icon && <IconCircle tone={iconTone} size="sm" className="w-7 h-7">{icon}</IconCircle>}
        <span className="font-body text-body-md font-medium">{name}</span>
      </div>
      <ul className="flex flex-wrap gap-2 m-0 p-0 list-none">
        {formats.map((f) => <li key={f} className="rounded-pill bg-cream px-2 py-1 text-caption font-medium">{f}</li>)}
      </ul>
    </div>
  );
}
