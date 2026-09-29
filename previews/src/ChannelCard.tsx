import * as React from "react";
import { ChannelCard, icons } from "ac";
import { mount } from "./_data";
const { Instagram, Search, Building2, MessageCircle } = icons;
mount(
  <div className="ac-root bg-yellow p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-3">
    <ChannelCard name="Instagram" icon={<Instagram size={14} strokeWidth={2} />} formats={["Feed (4:5)", "Feed (1:1)", "Story (9:16)"]} />
    <ChannelCard name="Search" iconTone="stone" icon={<Search size={14} strokeWidth={2} />} formats={["Search (1:1)", "Display (1:1)"]} />
    <ChannelCard name="Property portals" iconTone="yellow" icon={<Building2 size={14} strokeWidth={2} />} formats={["Listing photos (4:3)", "Floor plan"]} />
    <ChannelCard name="WhatsApp" iconTone="white" icon={<MessageCircle size={14} strokeWidth={2} />} formats={["Broadcast", "Status (9:16)"]} />
  </div>
);
