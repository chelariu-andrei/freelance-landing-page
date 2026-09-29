import * as React from "react";
import { Stagger, StaggerItem, Button, Card } from "ac";
import { mount } from "./_data";
function Demo() {
  const [k, setK] = React.useState(0);
  return (
    <div className="ac-root bg-cream p-6 rounded-lg flex flex-col gap-5">
      <div className="flex items-center gap-4"><Button size="sm" variant="secondary" onClick={() => setK(k + 1)}>Replay</Button><span className="text-sm text-ink-muted">Parent that plays its children one after another (stagger 0.12s).</span></div>
      <Stagger key={k} immediate stagger={0.12} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {["Discover", "Create", "Test", "Launch"].map((n) => <StaggerItem key={n}><Card padding="sm" surface="white"><p className="m-0 font-display text-button-lg">{n}</p></Card></StaggerItem>)}
      </Stagger>
    </div>
  );
}
mount(<Demo />);
