import * as React from "react";
import { SectionHeading } from "ac";
import { mount } from "./_data";
mount(
  <div className="ac-root flex flex-col gap-4">
    <div className="bg-cream p-8 rounded-lg"><SectionHeading title="Homes that fit how you live" subtitle="A short supporting sentence in the body face, capped at a readable measure." /></div>
    <div className="ac-dark bg-ink p-8 rounded-lg"><SectionHeading tone="dark" align="center" title="See It In Action" subtitle="Let us show you how we can sell your home faster." /></div>
    <div className="ac-dark bg-ink p-8 rounded-lg"><SectionHeading tone="dark" size="lg" title={<>The Growth<br />Engine</>} /></div>
  </div>
);
