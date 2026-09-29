import * as React from "react";
import { FeatureMatrix } from "ac";
import { mount, modules } from "./_data";
mount(
  <div className="ac-root">
    <FeatureMatrix title="What's included every month" meta="Six modules · one bill" modules={modules} footnote="* Fair-use limits apply. Add-ons are billed separately." />
  </div>
);
