import * as React from "react";
import { OrbitStatement, icons } from "ac";
import { mount } from "./_data";
const { Rocket, ThumbsUp, ChartSpline, KeySquare, Home, MapPin } = icons;
const I = (C: any) => <C strokeWidth={1.75} />;
mount(
  <div className="ac-root flex flex-col gap-2">
    <OrbitStatement
      statement={<>Where smarter decisions lead to faster sales</>}
      items={[
        { id: "launch", label: "Launch", icon: I(Rocket), x: 16, y: 40, size: 23.5 },
        { id: "trust", label: "Trust", icon: I(ThumbsUp), x: 88, y: 62, size: 17 },
        { id: "growth", label: "Growth", icon: I(ChartSpline), x: 80, y: 90, size: 12 },
      ]}
    />
    <OrbitStatement
      tone="cream"
      magnet={0.5}
      statement={<>Every step of your move, in one place</>}
      centerPosition={{ x: 50, y: 50, size: 40 }}
      items={[
        { id: "home", label: "Find", icon: I(Home), x: 14, y: 30, size: 16 },
        { id: "map", label: "Explore", icon: I(MapPin), x: 22, y: 82, size: 12 },
        { id: "keys", label: "Move in", icon: I(KeySquare), x: 86, y: 40, size: 20 },
      ]}
    />
  </div>
);
