import * as React from "react";
import { TrendingTopics } from "ac";
import { mount, topics } from "./_data";
mount(
  <div className="ac-root flex flex-col gap-4">
    <div className="bg-stone p-6 rounded-xl"><TrendingTopics title="Trending Searches" items={topics} /></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TrendingTopics items={[]} loading loadingRows={3} />
      <TrendingTopics items={[]} />
    </div>
  </div>
);
