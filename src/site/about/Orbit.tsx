"use client";
import { OrbitStatement } from "@/sections/OrbitStatement";
import { iconFor } from "@/site/icons";
import { content } from "@/content/content";

/** Same setup as the library's cream OrbitStatement example; the centre disc keeps the default "Ac." wordmark. */
export function Orbit() {
  const o = content.about.orbit;
  return (
    <OrbitStatement
      tone="cream"
      magnet={0.5}
      statement={o.statement}
      centerPosition={{ x: 50, y: 50, size: 40 }}
      items={o.items.map((it) => ({ id: it.id, label: it.label, x: it.x, y: it.y, size: it.size, icon: iconFor(it.icon, 28) }))}
    />
  );
}
