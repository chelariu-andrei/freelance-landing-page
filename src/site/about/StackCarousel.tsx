"use client";
import { LogoCarousel } from "@/sections/LogoCarousel";
import { iconFor } from "@/site/icons";
import { content } from "@/content/content";

export function StackCarousel() {
  const s = content.about.stack;
  return (
    <LogoCarousel
      eyebrow={s.eyebrow}
      title={s.title}
      titleMuted={s.titleMuted}
      size="md"
      speed={24}
      items={s.items.map((it) => ({ id: it.id, name: it.name, description: it.description, icon: iconFor(it.icon, 40, 1.5) }))}
    />
  );
}
