import * as React from "react";
import { PromoBanner, icons } from "ac";
import { mount } from "./_data";
const { Gift, Megaphone } = icons;
function Demo() {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="ac-root flex flex-col gap-4">
      <PromoBanner icon={<Gift size={32} strokeWidth={1.75} />} highlight="Free photoshoot for new listings.">Your first month's on us — for a limited time.</PromoBanner>
      <PromoBanner tone="yellow" href="#offer" icon={<Megaphone size={28} strokeWidth={1.75} />} highlight="Open house weekend:">12–13 October, 30 homes in Bucharest.</PromoBanner>
      {open ? <PromoBanner onDismiss={() => setOpen(false)} highlight="Dismissible.">Click × to close.</PromoBanner> : <p className="m-0 text-sm text-ink-muted">Dismissed.</p>}
    </div>
  );
}
mount(<Demo />);
