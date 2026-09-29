import * as React from "react";
import { ScoreMeter } from "ac";
import { mount } from "./_data";
mount(
  <div className="ac-root bg-white p-6 rounded-lg flex flex-col gap-8">
    <ScoreMeter label="Listing Quality Score" value={86} />
    <ScoreMeter label="Photo coverage" value={52} dots={20} />
  </div>
);
