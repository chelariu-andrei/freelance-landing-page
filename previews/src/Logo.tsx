import * as React from "react";
import { Logo } from "ac";
import { mount } from "./_data";
mount(
  <div className="ac-root grid grid-cols-2 gap-4">
    <div className="bg-cream p-8 rounded-lg flex flex-col gap-4 items-start"><Logo size="sm" /><Logo size="md" /></div>
    <div className="ac-dark bg-ink p-8 rounded-lg"><Logo tone="white" size="xl" /></div>
  </div>
);
