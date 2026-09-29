import * as React from "react";
import { IconCircle, icons } from "ac";
import { mount } from "./_data";
const { Lightbulb, Palette, Rocket, Clock, ArrowUpRight, CornerRightDown, Home, Handshake } = icons;
const tones = ["white", "yellow", "ink", "stone", "periwinkle", "mint", "blush", "coral"] as const;
mount(
  <div className="ac-root flex flex-col gap-4">
    <div className="bg-cream rounded-lg p-6 flex flex-wrap items-center gap-3">
      {tones.map((t, i) => (
        <div key={t} className="flex flex-col items-center gap-2">
          <IconCircle tone={t} size="lg">{React.createElement([Lightbulb, Palette, ArrowUpRight, CornerRightDown, Rocket, Clock, Home, Handshake][i], { size: 28, strokeWidth: 1.75 })}</IconCircle>
          <span className="text-caption text-ink-muted">{t}</span>
        </div>
      ))}
    </div>
    <div className="ac-dark bg-ink rounded-lg p-6 flex items-end gap-4">
      {(["sm", "md", "lg", "xl"] as const).map((s) => (
        <div key={s} className="flex flex-col items-center gap-2">
          <IconCircle tone="white" size={s}><Rocket size={s === "sm" ? 16 : s === "md" ? 22 : s === "lg" ? 28 : 56} strokeWidth={1.75} /></IconCircle>
          <span className="text-caption text-muted-on-dark">{s}</span>
        </div>
      ))}
    </div>
  </div>
);
