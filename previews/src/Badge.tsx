import * as React from "react";
import { Badge, icons } from "ac";
import { mount } from "./_data";
const { Sparkles } = icons;
mount(
  <div className="ac-root flex flex-wrap items-center gap-3 bg-white p-6 rounded-lg">
    <Badge tone="mint">90%</Badge>
    <Badge tone="yellow">64%</Badge>
    <Badge tone="coral">−12%</Badge>
    <Badge tone="yellow" icon={<Sparkles size={12} strokeWidth={2} />}>Awareness</Badge>
    <Badge tone="mint" size="md">+92%</Badge>
    <Badge tone="periwinkle" size="md">New listing</Badge>
    <Badge tone="ink">86%</Badge>
  </div>
);
