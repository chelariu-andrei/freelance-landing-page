import * as React from "react";
import { DottedSurfaceSection, Chip } from "ac";
import { mount } from "./_data";

type Mode = "light" | "cream" | "dark";
const Slider = ({ label, value, min, max, step, onChange, fmt }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; fmt?: (v: number) => string }) => (
  <label className="flex flex-col gap-2 min-w-[9rem] flex-1">
    <span className="flex justify-between font-body text-caption font-medium text-ink"><span>{label}</span><span className="text-ink-muted">{fmt ? fmt(value) : value}</span></span>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full" style={{ accentColor: "var(--ink)" }} />
  </label>
);

function Playground() {
  const [mode, setMode] = React.useState<Mode>("light");
  const [speed, setSpeed] = React.useState(1);
  const [dotSize, setDotSize] = React.useState(8);
  const [amplitude, setAmplitude] = React.useState(50);
  const [spacing, setSpacing] = React.useState(150);
  const [opacity, setOpacity] = React.useState(0.8);
  const code = `<DottedSurfaceSection mode="${mode}" speed={${speed}} dotSize={${dotSize}} amplitude={${amplitude}} spacing={${spacing}} opacity={${opacity}} />`;
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white rounded-lg border border-solid border-line p-5 flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Mode">
          <span className="font-body text-caption font-medium mr-2">Mode</span>
          {(["light", "cream", "dark"] as Mode[]).map((m) => <Chip key={m} size="sm" tone={m === mode ? "periwinkle" : "stone"} selected={m === mode} onClick={() => setMode(m)}>{m}</Chip>)}
        </div>
        <div className="flex flex-wrap gap-6">
          <Slider label="Wave speed" value={speed} min={0} max={3} step={0.1} onChange={setSpeed} fmt={(v) => `${v.toFixed(1)}×`} />
          <Slider label="Dot size" value={dotSize} min={2} max={20} step={1} onChange={setDotSize} fmt={(v) => `${v}px`} />
          <Slider label="Wave height" value={amplitude} min={0} max={150} step={5} onChange={setAmplitude} />
          <Slider label="Density (spacing)" value={spacing} min={60} max={260} step={10} onChange={setSpacing} />
          <Slider label="Opacity" value={opacity} min={0.1} max={1} step={0.05} onChange={setOpacity} fmt={(v) => v.toFixed(2)} />
        </div>
        <code className="block font-mono text-caption text-ink-muted bg-cream rounded-md p-3 overflow-x-auto whitespace-nowrap">{code}</code>
      </div>
      <DottedSurfaceSection
        frame="bleed" height="md" mode={mode} speed={speed} dotSize={dotSize} amplitude={amplitude} spacing={spacing} opacity={opacity}
        eyebrow="Playground" title="Homes that" highlight="move you."
        subtitle="Drag the sliders — the wave updates live."
        primaryCta={{ label: "Book a Viewing", href: "#book" }} secondaryCta={{ label: "Talk to Us", href: "#talk" }}
      />
    </div>
  );
}

mount(
  <div className="ac-root flex flex-col gap-2 bg-cream">
    <div className="px-2 lg:px-4 pt-2"><Playground /></div>
    <DottedSurfaceSection
      mode="dark" height="md" speed={0.5} dotSize={6}
      eyebrow="Dark mode · calm" title="Sell with" highlight="confidence."
      subtitle="Ink ground, light dots, half speed."
      primaryCta={{ label: "Get a valuation", href: "#val" }} secondaryCta={{ label: "How it works", href: "#how" }}
    />
    <DottedSurfaceSection
      mode="light" height="sm" align="left" speed={1.8} dotSize={12} amplitude={80}
      eyebrow="Light mode · lively" title="New listings" highlight="every week."
      subtitle="White ground, bigger dots, faster and taller waves."
    />
    <DottedSurfaceSection
      mode="cream" height="sm" speed={0.8} dotSize={4} spacing={90} opacity={0.6}
      eyebrow="Cream mode · fine grain" title="Find your" highlight="next home."
      subtitle="Dense, small dots for a subtle texture."
    />
  </div>
);
