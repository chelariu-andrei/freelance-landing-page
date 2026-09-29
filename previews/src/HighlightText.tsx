import * as React from "react";
import { HighlightText } from "ac";
import { mount } from "./_data";
mount(
  <div className="ac-root flex flex-col gap-4">
    <div className="ac-dark bg-ink p-8 rounded-lg font-display text-heading-xl text-white">Start your <HighlightText>next move.</HighlightText></div>
    <div className="bg-cream p-8 rounded-lg font-display text-heading-xl text-ink">Up to <HighlightText variant="marker">90%</HighlightText> faster.</div>
  </div>
);
