import * as React from "react";
import { MediaPanel, TrendingTopics } from "ac";
import { mount, topics } from "./_data";
mount(
  <div className="ac-root bg-cream p-4 rounded-lg">
    <MediaPanel><TrendingTopics items={topics.slice(0, 3)} animated={false} /></MediaPanel>
  </div>
);
