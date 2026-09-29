import * as React from "react";
import { FeatureStep, MediaPanel, TrendingTopics, ChannelCard, SignalCard, ScoreMeter, Chip, icons } from "ac";
import { mount, topics, people } from "./_data";
const { Lightbulb, Palette, Instagram, Search, Users, Waves } = icons;
mount(
  <div className="ac-root">
    <FeatureStep number="01" label="Discover" icon={<Lightbulb size={26} strokeWidth={1.75} />}
      body="Win new clients by understanding what they care about most. Ac. gathers market, search and listing data so you always know which homes are in demand."
      media={<MediaPanel><TrendingTopics title="Trending Searches" items={topics} animated={false} /></MediaPanel>} />
    <FeatureStep tone="yellow" number="02" label="Create" icon={<Palette size={26} strokeWidth={1.75} />}
      body="Make an impression with tailored listings. Ac. learns your brand style: you control how much to automate."
      media={
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <SignalCard surface="white" className="md:col-span-2" title="Buyer Signal" delta="+92%" people={people.slice(0, 5)} extraCount={12} />
          <div className="md:col-span-3 flex flex-col gap-3">
            <ChannelCard name="Instagram" icon={<Instagram size={14} strokeWidth={2} />} formats={["Feed (4:5)", "Feed (1:1)", "Story (9:16)"]} />
            <ChannelCard name="Search" iconTone="stone" icon={<Search size={14} strokeWidth={2} />} formats={["Search (1:1)", "Display (1:1)"]} />
          </div>
          <div className="md:col-span-5 bg-white rounded-md p-4 flex flex-col gap-4">
            <ScoreMeter label="Brand Relevance Score" value={86} />
            <div className="flex flex-wrap gap-2"><Chip icon={<Users size={18} strokeWidth={1.75} />}>First-time buyers</Chip><Chip icon={<Waves size={18} strokeWidth={1.75} />}>Seaside second homes</Chip></div>
          </div>
        </div>
      } />
  </div>
);
