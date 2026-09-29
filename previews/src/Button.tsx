import * as React from "react";
import { Button, icons } from "ac";
import { mount } from "./_data";
const { ArrowUpRight } = icons;
mount(
  <div className="ac-root flex flex-col gap-4">
    <div className="flex flex-wrap items-center gap-3 bg-cream p-6 rounded-lg">
      <Button variant="primary">Book a Viewing</Button>
      <Button variant="secondary">Talk to Us</Button>
      <Button variant="outline-dark">Outline</Button>
      <Button variant="ghost" iconRight={<ArrowUpRight size={18} strokeWidth={1.75} />}>Ghost link</Button>
      <Button variant="primary" disabled>Disabled</Button>
    </div>
    <div className="ac-dark flex flex-wrap items-center gap-3 bg-ink p-6 rounded-lg">
      <Button variant="outline" size="lg">Request a Viewing</Button>
      <Button variant="light" size="lg">Talk to Us</Button>
      <Button variant="primary" size="md">Primary md</Button>
      <Button variant="light" size="sm">Small</Button>
    </div>
  </div>
);
