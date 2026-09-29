import * as React from "react";
import { LogoCarousel, Button, icons } from "ac";
import { mount } from "./_data";
const { Bot, PenTool, Code2, Database, Triangle, Aperture, BarChart3, CalendarDays, Camera, FileSignature, MessageCircle, Plus, Home } = icons;
const I = (C: any) => <C strokeWidth={1.5} />;
const start = [
  { id: "assistant", name: "Assistant", icon: I(Bot), description: "Drafts listings and replies" },
  { id: "design", name: "Design", icon: I(PenTool), description: "Brochures and social posts" },
  { id: "code", name: "Code", icon: I(Code2), description: "Site and integrations" },
  { id: "data", name: "Database", icon: I(Database), description: "Listings and leads" },
  { id: "hosting", name: "Hosting", icon: I(Triangle), description: "Deploys the site" },
  { id: "crm", name: "CRM", icon: I(Aperture), description: "Every client, one place" },
  { id: "analytics", name: "Analytics", icon: I(BarChart3), description: "What buyers search for" },
  { id: "legacy", name: "Legacy", icon: I(Home), description: "Being phased out", inactive: true },
];
const queue = [
  { id: "calendar", name: "Calendar", icon: I(CalendarDays), description: "Viewings, booked" },
  { id: "photo", name: "Photos", icon: I(Camera), description: "Listing shoots" },
  { id: "esign", name: "E-sign", icon: I(FileSignature), description: "Contracts, signed" },
  { id: "chat", name: "WhatsApp", icon: I(MessageCircle), description: "Buyer conversations" },
];
function Demo() {
  const [items, setItems] = React.useState(start);
  const next = queue.find((q) => !items.some((i) => i.id === q.id));
  return (
    <div className="ac-root flex flex-col">
      <LogoCarousel
        eyebrow="AI tools"
        title="The stack,"
        titleMuted="and what each is for."
        subtitle="Reached for daily. Short on purpose — a tool used once a quarter is a tool you are bad at."
        items={items}
        onItemClick={() => {}}
      />
      <div className="bg-cream px-5 md:px-10 lg:px-16 pb-10 flex flex-wrap gap-3">
        <Button size="sm" variant="secondary" disabled={!next} iconLeft={<Plus size={16} strokeWidth={2} />} onClick={() => next && setItems([...items, next])}>
          {next ? `Add “${next.name}” to the queue` : "Queue is full"}
        </Button>
        <Button size="sm" variant="outline-dark" disabled={items.length <= 3} onClick={() => setItems(items.slice(0, -1))}>Remove last</Button>
      </div>
      <LogoCarousel
        tone="white" direction="right" speed={24} items={start.slice(0, 6)}
        title="Custom sizing"
        subtitle="tile 80 → 120 (md) → 180 (xl) · icon 36 → 96 · taller track on desktop"
        tile={{ base: 80, md: 120, xl: 180 }}
        icon={{ base: 36, md: 56, xl: 96 }}
        gap={{ base: 12, xl: 28 }}
        arrow={{ base: 40, xl: 88 }}
        trackPadding={{ base: 8, lg: 40 }}
        radius={{ base: 12, xl: 24 }}
      />
      <LogoCarousel size="sm" items={start} arrows={false} speed={30} />
      <LogoCarousel title="Loading state" items={[]} loading loadingCount={5} size="md" />
    </div>
  );
}
mount(<Demo />);
