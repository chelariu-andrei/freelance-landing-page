import * as React from "react";
import { Divider } from "ac";
import { mount } from "./_data";
mount(
  <div className="ac-root grid grid-cols-2 gap-4">
    <div className="bg-white p-6 rounded-lg flex flex-col gap-4 text-sm"><span>Above</span><Divider /><span>Solid on light</span><Divider variant="dashed" /><span>Dashed connector</span></div>
    <div className="ac-dark bg-ink text-white p-6 rounded-lg flex gap-4 text-sm items-center h-full"><span>Left</span><Divider orientation="vertical" tone="dark" /><span>Vertical on dark</span></div>
  </div>
);
