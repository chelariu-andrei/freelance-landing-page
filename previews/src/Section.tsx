import * as React from "react";
import { Section, Container, SectionHeading } from "ac";
import { mount } from "./_data";
mount(
  <div className="ac-root">
    {(["cream", "ink", "yellow", "stone"] as const).map((t) => (
      <Section key={t} tone={t} padding="sm" frame={t === "cream" ? "bleed" : "framed"}>
        <Container><SectionHeading size="lg" tone={t === "ink" ? "dark" : "light"} title={`tone="${t}"`} subtitle={t === "cream" ? "frame=\"bleed\" — edge to edge" : "frame=\"framed\" — inset by the 16px gutter, radius-xl"} /></Container>
      </Section>
    ))}
  </div>
);
