import * as React from "react";
import { ProcessLoop } from "ac";
import { mount, steps } from "./_data";
mount(
  <div className="ac-root">
    <ProcessLoop title="Here's how we do it:" steps={steps} />
  </div>
);
