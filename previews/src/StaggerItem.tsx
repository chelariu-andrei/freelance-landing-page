import * as React from "react";
import { Stagger, StaggerItem, Button, Card } from "ac";
import { mount } from "./_data";
function Demo() {
  const [k, setK] = React.useState(0);
  const variants = ["up", "down", "left", "right", "scale", "fade"] as const;
  return (
    <div className="ac-root bg-cream p-6 rounded-lg flex flex-col gap-5">
      <div className="flex items-center gap-4"><Button size="sm" variant="secondary" onClick={() => setK(k + 1)}>Replay</Button><span className="text-sm text-ink-muted">Each child picks its own entrance variant.</span></div>
      <Stagger key={k} immediate stagger={0.1} className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {variants.map((v) => <StaggerItem key={v} variant={v} distance={32}><Card padding="sm" surface="yellow"><p className="m-0 font-display text-button-lg text-center">{v}</p></Card></StaggerItem>)}
      </Stagger>
    </div>
  );
}
mount(<Demo />);
