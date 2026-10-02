"use client";
import * as React from "react";
import { ArrowDown, Check, Mail, X } from "lucide-react";
import { useInView, useReducedMotion } from "framer-motion";
import { Card } from "@/primitives/Card";
import type { ServiceVisual } from "@/content/content";

/**
 * One worked example per service, played as a short scene: a real input moving through real engineering.
 * A playhead (`tick`) advances only while the diagram is on screen, holds on the finished frame, then replays.
 * The server renders that finished frame, so without JS or with reduced motion the example is simply complete.
 * Monospace is used only for what is literally code or data: JSON, HTTP, SQL, routes.
 */

function usePlayhead(ref: React.RefObject<Element>, end: number, stepMs: (k: number) => number, holdMs: number) {
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.45 });
  const [tick, setTick] = React.useState(end);
  const [cycle, setCycle] = React.useState(0);
  React.useEffect(() => {
    if (reduce || !inView) return;
    let timer: number;
    const run = (k: number) => {
      setTick(k);
      timer = window.setTimeout(k < end ? () => run(k + 1) : () => { setCycle((c) => c + 1); run(0); }, k < end ? stepMs(k) : holdMs);
    };
    run(0);
    return () => window.clearTimeout(timer);
    // stepMs is a pure function of k, declared inline by each visual.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, inView, end, holdMs]);
  return { tick, cycle };
}

const show = (on: boolean) => `transition-[opacity,transform] duration-base ease-out ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`;
const mono = "font-mono [font-variant-ligatures:none]";

function Frame({ visual, children }: { visual: ServiceVisual; children: React.ReactNode }) {
  return (
    <Card surface="white" radius="xl" padding="lg">
      <div role="img" aria-label={visual.ariaLabel} className="mx-auto w-full max-w-[34rem]">
        <div aria-hidden>{children}</div>
      </div>
      <p className="m-0 mx-auto mt-6 max-w-[34rem] border-0 border-t border-solid border-line pt-4 font-body text-sm text-ink-muted">{visual.example}</p>
    </Card>
  );
}

function Stem({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`relative flex h-8 items-center justify-center text-ink-muted ${className}`}>
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink-muted opacity-35" />
      <ArrowDown size={14} strokeWidth={1.75} className="relative bg-white" />
    </div>
  );
}

const Title = ({ children, note }: { children: React.ReactNode; note?: React.ReactNode }) => (
  <p className="m-0 flex items-baseline justify-between gap-3">
    <span className="font-display text-[1.0625rem] sm:text-lead leading-tight text-ink">{children}</span>
    {note && <span className="font-body text-caption text-ink-muted">{note}</span>}
  </p>
);

/* ── 01 · AI Automation: an invoice through extraction, guardrails, and out to the ERP or a person ── */

export function AutomationVisual({ visual }: { visual: ServiceVisual }) {
  const l = visual.labels;
  const cases = visual.cases ?? [];
  const ref = React.useRef<HTMLDivElement>(null);
  const F = 3, C = 3, END = F + C + 1;
  const { tick, cycle } = usePlayhead(ref, END, (k) => (k === 0 ? 800 : k < F ? 380 : k < END - 1 ? 560 : 700), 3000);
  const c = cases[cycle % cases.length];
  if (!c) return null;
  const fields = Math.min(tick, F);
  const checks = Math.max(0, Math.min(tick - F, C));
  const routed = tick >= END;

  return (
    <Frame visual={visual}>
      <div ref={ref}>
        {/* Inbox */}
        <div className="flex items-center gap-3 rounded-md border border-solid border-line bg-cream px-4 py-3">
          <span className="inline-flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-ink text-white"><Mail size={16} strokeWidth={1.75} /></span>
          <span className="min-w-0 flex-1">
            <span className={`block truncate text-[13px] text-ink ${mono}`}>{c.file}</span>
            <span className="block truncate font-body text-caption text-ink-muted">{c.from}</span>
          </span>
          <span className={`shrink-0 rounded-pill px-3 py-1 font-body text-caption ${routed ? "bg-ink text-white" : "bg-stone text-ink"}`}>{routed ? l.done : l.running}</span>
        </div>
        <Stem />

        {/* Agent: structured extraction */}
        <div className="rounded-md bg-yellow px-4 py-3">
          <Title note={l.agentNote}>{l.agent}</Title>
          <pre className={`m-0 mt-2 overflow-hidden rounded-sm bg-white px-3 py-2 text-[12px] sm:text-[12.5px] leading-[1.7] text-ink ${mono}`}>
            <span className="block text-ink-muted">{"{"}</span>
            {c.fields.map(([k, v], i) => (
              <span key={k} className={`block pl-4 ${show(i < fields)}`}>
                <span className="text-ink-muted">&quot;{k}&quot;:</span> &quot;{v}&quot;{i < c.fields.length - 1 ? "," : ""}
              </span>
            ))}
            <span className="block text-ink-muted">{"}"}</span>
          </pre>
        </div>
        <Stem />

        {/* Guardrails: each rule ticks or fails in turn */}
        <div className="rounded-md border border-solid border-line px-4 py-3">
          <Title>{l.guardrails}</Title>
          <ul className="m-0 mt-2 p-0 list-none flex flex-col gap-[6px]">
            {c.checks.map((ch, i) => {
              const done = i < checks;
              return (
                <li key={ch.label} className="flex items-center gap-[10px] font-body text-sm text-ink">
                  <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-base ease-out ${!done ? "bg-stone" : ch.ok ? "bg-mint" : "bg-coral"}`}>
                    <span className={`inline-flex transition-[opacity,transform] duration-base ease-out ${done ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
                      {ch.ok ? <Check size={12} strokeWidth={2.5} /> : <X size={12} strokeWidth={2.5} />}
                    </span>
                  </span>
                  <span className={`transition-opacity duration-base ease-out ${done ? "opacity-100" : "opacity-50"}`}>{ch.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Route: book it, or hand it to a person with the reason */}
        <div className="grid grid-cols-2 gap-3">
          {(["api", "human"] as const).map((r) => {
            const active = routed && c.route === r;
            return (
              <div key={r} className="flex flex-col">
                <Stem className={`transition-opacity duration-base ${routed && !active ? "opacity-30" : ""}`} />
                <div className={`flex-1 rounded-md border border-solid px-4 py-3 transition-[background-color,border-color,opacity] duration-base ease-out ${
                  active ? (r === "api" ? "border-ink bg-ink text-white" : "border-coral bg-coral text-ink") : routed ? "border-line opacity-40" : "border-line"
                }`}>
                  <span className={`block font-display text-[1.0625rem] leading-tight ${active && r === "api" ? "text-white" : "text-ink"}`}>{r === "api" ? l.api : l.human}</span>
                  <span className={`mt-1 block min-h-[2.6em] text-[11.5px] leading-snug ${mono} ${active ? (r === "api" ? "text-yellow" : "text-ink") : "text-ink-muted"} ${show(active)}`}>
                    {c.result}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Frame>
  );
}

/* ── 02 · Custom Software: one click in the app, traced through every layer ── */

const LAYER_TONE: Record<string, string> = { API: "bg-ink", Domain: "bg-yellow", DB: "bg-periwinkle", Ext: "bg-mint" };

export function SoftwareVisual({ visual }: { visual: ServiceVisual }) {
  const l = visual.labels;
  const spans = visual.spans ?? [];
  const total = Math.max(...spans.map((s) => s.start + s.ms), 1);
  const ref = React.useRef<HTMLDivElement>(null);
  const END = spans.length + 1;
  const { tick } = usePlayhead(ref, END, (k) => (k === 0 ? 1000 : 480), 3200);
  const pressed = tick >= 1;
  const answered = tick >= END;

  return (
    <Frame visual={visual}>
      <div ref={ref}>
        {/* The app: the click that starts it all */}
        <div className="rounded-md border border-solid border-line">
          <div className="flex items-center gap-2 border-0 border-b border-solid border-line px-4 py-2">
            {[0, 1, 2].map((i) => <span key={i} className="block h-2 w-2 rounded-full bg-line" />)}
            <span className="ml-2 font-body text-caption text-ink-muted">{l.app}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <span>
              <span className="block font-display text-[1.0625rem] leading-tight text-ink">{l.order}</span>
              <span className="block font-body text-caption text-ink-muted">{l.items}</span>
            </span>
            <span className={`inline-flex items-center gap-2 rounded-pill px-4 py-2 font-body text-sm transition-[background-color,color,transform,box-shadow] duration-base ease-out ${
              answered ? "bg-yellow text-ink" : pressed ? "bg-yellow text-ink scale-[0.97]" : "bg-ink text-white"
            }`}>
              {answered && <Check size={14} strokeWidth={2.25} />}{l.approve}
            </span>
          </div>
        </div>

        {/* The trace: each span lands in order, bars drawn to scale */}
        <div className="mt-5 flex items-baseline justify-between gap-3">
          <span className={`text-[12px] text-ink-muted ${mono}`}>{l.trace}<span className="hidden sm:inline"> · {spans[0]?.name}</span></span>
          <span className={`whitespace-nowrap text-[12px] text-ink ${mono} ${show(answered)}`}>{l.response} · {total} ms</span>
        </div>
        <ol className="m-0 mt-3 p-0 list-none flex flex-col gap-[10px]">
          {spans.map((s, i) => {
            const on = tick >= i + 1;
            return (
              <li key={s.name} className={`grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[13rem_minmax(0,1fr)_3rem] items-center gap-x-3 gap-y-1 ${show(on)}`}>
                <span className={`order-1 flex min-w-0 items-center gap-2 text-[12px] text-ink ${mono}`} style={{ paddingLeft: i === 0 ? 0 : 10 }}>
                  <span className={`h-2 w-2 shrink-0 rounded-full ${LAYER_TONE[s.layer] ?? "bg-ink-muted"}`} />
                  <span className="truncate">{s.name}</span>
                </span>
                <span className="order-3 sm:order-2 col-span-2 sm:col-span-1 relative block h-[10px] rounded-pill bg-cream">
                  <span
                    className={`absolute inset-y-0 rounded-pill origin-left transition-transform duration-slow ease-out ${LAYER_TONE[s.layer] ?? "bg-ink-muted"} ${on ? "scale-x-100" : "scale-x-0"}`}
                    style={{ left: `${(s.start / total) * 100}%`, width: `${Math.max((s.ms / total) * 100, 2)}%` }}
                  />
                </span>
                <span className={`order-2 sm:order-3 text-right text-[12px] text-ink-muted ${mono}`}>{s.ms} ms</span>
              </li>
            );
          })}
        </ol>

        <div className="mt-5 flex items-center gap-3 rounded-md bg-ink px-4 py-3 text-white">
          <span className="inline-flex shrink-0 text-yellow"><Check size={18} strokeWidth={2} /></span>
          <span className="font-body text-body">{l.owned}</span>
        </div>
      </div>
    </Frame>
  );
}

/* ── 03 · Legacy Modernization: the strangler fig, one traffic step at a time ── */

const fmt = (n: number) => n.toLocaleString("en-US");

export function LegacyVisual({ visual }: { visual: ServiceVisual }) {
  const l = visual.labels;
  const ramp = visual.ramp ?? [0, 100];
  const modules = visual.modules ?? [];
  const ref = React.useRef<HTMLDivElement>(null);
  const END = ramp.length - 1;
  const { tick } = usePlayhead(ref, END, () => 1400, 3000);
  const pct = ramp[Math.min(tick, END)];
  const cut = pct >= 100;

  return (
    <Frame visual={visual}>
      <div ref={ref}>
        <div className="mx-auto max-w-[17rem] rounded-md bg-ink px-4 py-3 text-center text-white">
          <span className="block font-display text-[1.0625rem] leading-tight">{l.gateway}</span>
          <span className={`mt-1 block text-[12px] text-muted-on-dark ${mono}`}>{l.gatewayNote}</span>
        </div>

        {/* Traffic split, drawn to scale */}
        <div className="mt-4 flex h-[10px] overflow-hidden rounded-pill bg-stone">
          <span className="block h-full bg-ink-muted opacity-50 transition-[width] duration-slow ease-out" style={{ width: `${100 - pct}%` }} />
          <span className="block h-full bg-yellow transition-[width] duration-slow ease-out" style={{ width: `${pct}%` }} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className={`rounded-md border border-dashed border-ink-muted bg-cream px-3 py-3 sm:px-4 transition-opacity duration-slow ease-out ${cut ? "opacity-40" : "opacity-100"}`}>
            <span className="block font-display text-[1.0625rem] leading-tight text-ink">{l.legacy}</span>
            <span className="mt-0.5 block font-body text-caption text-ink-muted">{l.legacyNote}</span>
            <span className="mt-2 block font-display text-heading-lg leading-none text-ink tabular-nums">{100 - pct}%</span>
          </div>
          <div className="rounded-md border border-solid border-yellow bg-white px-3 py-3 sm:px-4">
            <span className={`block text-[12px] sm:text-[13px] leading-tight text-ink ${mono}`}>{l.modern}</span>
            <span className="mt-0.5 block font-body text-caption text-ink-muted">{l.modernNote}</span>
            <span className="mt-2 block font-display text-heading-lg leading-none text-ink tabular-nums">{pct}%</span>
          </div>
        </div>

        {/* Shadow comparison: the reason it is safe to take the next step */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-md border border-solid border-line px-4 py-[10px]">
          <span className="font-body text-sm text-ink">{l.shadow}</span>
          <span className={`flex items-center gap-2 text-[12px] text-ink ${mono}`}>
            <span className="tabular-nums">{fmt(pct * 1240)} {l.compared}</span>
            <span className="text-ink-muted">·</span>
            <span className="inline-flex items-center gap-1"><span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-mint"><Check size={10} strokeWidth={2.75} /></span>0 {l.diffs}</span>
          </span>
        </div>

        {/* Modules: one done, one moving, the rest waiting their turn */}
        <ul className="m-0 mt-3 p-0 list-none grid grid-cols-2 sm:grid-cols-4 gap-2">
          {modules.map((m) => {
            const done = m.state === "done" || (m.state === "active" && cut);
            const active = m.state === "active" && !cut;
            return (
              <li key={m.name} className={`flex items-center justify-between gap-2 rounded-md px-3 py-2 font-body text-sm text-ink transition-colors duration-base ease-out ${
                done ? "bg-yellow" : active ? "border border-solid border-yellow bg-white" : "border border-dashed border-line text-ink-muted"
              }`}>
                {m.name}
                {done ? <Check size={14} strokeWidth={2.25} /> : active ? <span className={`text-[11px] tabular-nums ${mono}`}>{pct}%</span> : null}
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md bg-ink px-4 py-3 text-white">
          <span className="relative flex h-[10px] w-[10px] shrink-0">
            <span className="absolute inset-0 rounded-full bg-yellow opacity-60 motion-safe:animate-ping" />
            <span className="relative h-[10px] w-[10px] rounded-full bg-yellow" />
          </span>
          <span className="font-body text-body">{l.live}</span>
          <span aria-hidden className="hidden sm:inline text-muted-on-dark">·</span>
          <span className="font-body text-sm text-muted-on-dark">{l.rollback}</span>
        </div>
      </div>
    </Frame>
  );
}

export function visualFor(id: string, visual: ServiceVisual): React.ReactNode {
  if (id === "automation") return <AutomationVisual visual={visual} />;
  if (id === "tools") return <SoftwareVisual visual={visual} />;
  if (id === "legacy") return <LegacyVisual visual={visual} />;
  return null;
}
