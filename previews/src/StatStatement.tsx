import * as React from "react";
import { StatStatement, icons } from "ac";
import { mount } from "./_data";
const { Clock, CornerRightDown } = icons;
mount(
  <div className="ac-root">
    <StatStatement rows={[
      { parts: [{ kind: "text", text: "In days" }, { kind: "icon", icon: <Clock className="w-6 h-6 lg:w-16 lg:h-16" strokeWidth={1.75} />, label: "clock" }, { kind: "text", text: "not months" }], bubble: <CornerRightDown className="w-8 h-8 lg:w-24 lg:h-24" strokeWidth={1.75} /> },
      { parts: [{ kind: "text", text: "Up to" }, { kind: "value", text: "90%" }, { kind: "text", text: "less time on admin." }] },
    ]} />
  </div>
);
