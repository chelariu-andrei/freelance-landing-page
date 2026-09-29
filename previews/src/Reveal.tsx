import * as React from "react";
import { Reveal, Stagger, StaggerItem, Button, Card } from "ac";
import { mount } from "./_data";
function Demo() {
  const [k, setK] = React.useState(0);
  return (
    <div className="ac-root bg-cream p-6 rounded-lg flex flex-col gap-6">
      <div><Button size="sm" variant="secondary" onClick={() => setK(k + 1)}>Replay</Button></div>
      <div key={k} className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-3">
          {(["up", "left", "scale"] as const).map((v, i) => <Reveal key={v} immediate variant={v} delay={i * 0.1}><Card><p className="m-0 font-display text-button-lg">variant="{v}"</p></Card></Reveal>)}
        </div>
        <Stagger immediate stagger={0.1} className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((n) => <StaggerItem key={n}><Card surface="yellow" padding="sm"><p className="m-0 font-display text-button-lg">Stagger {n}</p></Card></StaggerItem>)}
        </Stagger>
      </div>
    </div>
  );
}
mount(<Demo />);
