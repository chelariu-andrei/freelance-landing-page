"use client";
import { OrbitStatement } from "@/sections/OrbitStatement";
import { iconFor } from "@/site/icons";
import { content } from "@/content/content";
import { isSet } from "@/content/links";

export function Orbit() {
  const o = content.about.orbit;
  const photo = content.site.photo;
  return (
    <OrbitStatement
      tone="cream"
      magnet={0.3}
      statement={o.statement}
      centerPosition={{ x: 50, y: 50, size: 34 }}
      center={
        isSet(photo)
          ? <img src={photo} alt={o.photoAlt} className="w-full h-full object-cover rounded-full" />
          : <span className="font-display text-display-lg text-ink" role="img" aria-label={o.photoAlt}>{o.monogram}</span>
      }
      items={o.items.map((it) => ({ id: it.id, label: it.label, x: it.x, y: it.y, size: it.size, icon: iconFor(it.icon, 28) }))}
    />
  );
}
