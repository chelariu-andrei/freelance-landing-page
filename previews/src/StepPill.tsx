import * as React from "react";
import { StepPill, icons } from "ac";
import { mount } from "./_data";
const { Lightbulb, Palette, Rocket } = icons;
mount(
  <div className="ac-root flex flex-col gap-4">
    <div className="bg-cream p-6 rounded-lg flex flex-wrap gap-6">
      <StepPill number="01" label="Discover" icon={<Lightbulb size={26} strokeWidth={1.75} />} />
    </div>
    <div className="bg-yellow p-6 rounded-lg flex flex-wrap gap-6">
      <StepPill number="02" label="Create" icon={<Palette size={26} strokeWidth={1.75} />} />
    </div>
    <div className="bg-white p-6 rounded-lg flex flex-wrap gap-4">
      <StepPill size="md" tone="ink" label="Launch" icon={<Rocket size={18} strokeWidth={1.75} />} />
      <StepPill size="md" tone="ink" label="No icon" />
    </div>
  </div>
);
