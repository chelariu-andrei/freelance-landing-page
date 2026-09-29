import * as React from "react";
import { Chip, icons } from "ac";
import { mount } from "./_data";
const { Users, Home, Waves, HeartPulse } = icons;
function Demo() {
  const [sel, setSel] = React.useState(0);
  const opts = ["Families", "Investors", "Students"];
  return (
    <div className="ac-root flex flex-col gap-4 bg-white p-6 rounded-lg">
      <div className="flex flex-wrap gap-3">
        <Chip icon={<Users size={18} strokeWidth={1.75} />}>First-time buyers</Chip>
        <Chip icon={<Waves size={18} strokeWidth={1.75} />}>Seaside second homes</Chip>
        <Chip icon={<Home size={18} strokeWidth={1.75} />}>Relocating families</Chip>
      </div>
      <div className="flex flex-wrap gap-3">
        <Chip tone="blush" icon={<HeartPulse size={18} strokeWidth={1.75} />}>Walkable neighbourhoods near parks</Chip>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Audience filter">
        {opts.map((o, i) => <Chip key={o} size="sm" tone={i === sel ? "periwinkle" : "stone"} selected={i === sel} onClick={() => setSel(i)}>{o}</Chip>)}
      </div>
    </div>
  );
}
mount(<Demo />);
