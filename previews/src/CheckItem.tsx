import * as React from "react";
import { CheckItem } from "ac";
import { mount } from "./_data";
mount(
  <div className="ac-root grid grid-cols-1 md:grid-cols-2 gap-4">
    <ul className="bg-cream rounded-lg p-6 flex flex-col gap-4 m-0">
      <CheckItem lead="Live demand">— tracked daily</CheckItem>
      <CheckItem lead="Unlimited campaigns">you run yourself*</CheckItem>
      <CheckItem lead="Legal review" excluded>— add-on</CheckItem>
    </ul>
    <ul className="ac-dark bg-ink text-white rounded-lg p-6 flex flex-col gap-4 m-0">
      <CheckItem tone="white" size="md" lead="On dark">white disc</CheckItem>
      <CheckItem tone="yellow" size="md" lead="Emphasis">yellow disc</CheckItem>
    </ul>
  </div>
);
