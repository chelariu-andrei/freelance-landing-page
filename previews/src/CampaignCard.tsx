import * as React from "react";
import { CampaignCard } from "ac";
import { mount, metrics } from "./_data";
mount(
  <div className="ac-root ac-dark bg-ink p-6 rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-4">
    <CampaignCard title="Spring open-house week" objective="Awareness" channels="Portal listings, Instagram, Facebook" metrics={metrics} />
    <CampaignCard title="" metrics={[]} loading />
  </div>
);
