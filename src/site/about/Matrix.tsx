"use client";
import { FeatureMatrix } from "@/sections/FeatureMatrix";
import { iconFor } from "@/site/icons";
import { content } from "@/content/content";

export function Matrix() {
  const m = content.about.matrix;
  return (
    <FeatureMatrix
      title={m.title}
      meta={m.meta}
      modules={m.modules.map((mod) => ({
        id: mod.id, name: mod.name, tagline: mod.tagline, iconTone: mod.iconTone, icon: iconFor(mod.icon, 22),
        features: mod.features.map((f) => ({ lead: f.lead, text: `— ${f.text}` })),
      }))}
    />
  );
}
