import * as React from "react";
import { Icon, IconCircle, icons } from "ac";
import { mount } from "./_data";
const { Lightbulb, Palette, Pipette, Rocket, Clock, CornerRightDown, ArrowUpRight, Home } = icons;
mount(
  <div className="ac-root flex flex-col gap-6 bg-cream p-6 rounded-lg">
    <div className="flex items-end gap-4 text-ink">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => <Icon key={s} icon={Home} size={s} />)}
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <IconCircle tone="white"><Lightbulb size={24} strokeWidth={1.75} /></IconCircle>
      <IconCircle tone="white"><Palette size={24} strokeWidth={1.75} /></IconCircle>
      <IconCircle tone="white"><Pipette size={24} strokeWidth={1.75} /></IconCircle>
      <IconCircle tone="white"><Rocket size={24} strokeWidth={1.75} /></IconCircle>
      <IconCircle tone="yellow" size="lg"><Clock size={32} strokeWidth={1.75} /></IconCircle>
      <IconCircle tone="ink" size="lg"><ArrowUpRight size={32} strokeWidth={1.5} /></IconCircle>
      <IconCircle tone="stone" size="lg" className="bg-white"><CornerRightDown size={32} strokeWidth={1.75} /></IconCircle>
    </div>
  </div>
);
