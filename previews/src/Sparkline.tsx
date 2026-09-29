import * as React from "react";
import { Sparkline, Badge } from "ac";
import { mount } from "./_data";
mount(
  <div className="ac-root bg-cream p-6 rounded-lg flex gap-3">
    {[[3,4,4,5,6,6,8,9],[5,4,3,3,4,4,5,6],[4,6,3,5,4,6,7,7]].map((p, i) => (
      <span key={i} className="inline-flex items-center gap-2 bg-white rounded-pill pl-1 pr-3 py-1"><Badge tone={i === 1 ? "yellow" : "mint"}>{["90%","64%","92%"][i]}</Badge><Sparkline points={p} label={`Trend ${i + 1}`} /></span>
    ))}
  </div>
);
