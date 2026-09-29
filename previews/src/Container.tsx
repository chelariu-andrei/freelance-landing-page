import * as React from "react";
import { Container } from "ac";
import { mount } from "./_data";
mount(
  <div className="ac-root flex flex-col gap-3 bg-stone py-4 rounded-lg">
    {(["content", "wide", "full"] as const).map((w) => (
      <Container key={w} width={w}><div className="bg-white rounded-md p-4 text-sm"><strong>width="{w}"</strong> — {w === "content" ? "max 1440px" : w === "wide" ? "max 1760px" : "no cap"}, side padding 20 → 40 → 64px</div></Container>
    ))}
  </div>
);
