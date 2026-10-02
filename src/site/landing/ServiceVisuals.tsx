"use client";
import * as React from "react";
import { ArrowDown, Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "@/primitives/Card";
import type { ServiceVisual } from "@/content/content";

/**
 * One animated diagram per service, replacing the repeated "How it runs" card.
 * Every diagram renders its finished state in the static HTML (readable without JS or with reduced motion);
 * the loop only runs on the client, starts from that state, resets once, then builds it up again.
 */

const LOOP = 10;
const START = 1.2;
const YELLOW = "rgba(255, 214, 78, ";
const INK = "#1c1b1f";
const CREAM = "#f9f6f0";
const LINE = "#e4e1db";
const YELLOW_SOLID = "#ffd64e";
const YELLOW_SOFT = "#fff3c4";

const loopOf = (times: number[]) => ({ duration: LOOP, delay: START, repeat: Infinity, ease: "linear" as const, times });

/** [rest, rest, on, rest, rest] — the node flashes `on` as the signal arrives at fraction `at`. */
function flash<T>(rest: T, on: T, at: number): { values: T[]; times: number[] } {
  const a = Math.min(Math.max(at, 0.06), 0.8);
  return { values: [rest, rest, on, rest, rest], times: [0, a - 0.04, a, Math.min(a + 0.14, 0.97), 1] };
}

function useMotionOn() {
  return !useReducedMotion();
}

/** Bordered node with a flash animation. `lit` is the fraction of the loop at which it lights up. */
function Node({ lit, tone = "plain", children, className = "" }: { lit: number; tone?: "plain" | "agent" | "added"; children: React.ReactNode; className?: string }) {
  const on = useMotionOn();
  const f = flash(tone === "added" ? `${YELLOW}0.55)` : LINE, `${YELLOW}1)`, lit);
  const g = flash(tone === "added" ? YELLOW_SOFT : CREAM, tone === "added" ? YELLOW_SOLID : YELLOW_SOFT, lit);
  const base = tone === "agent"
    ? { borderColor: YELLOW_SOLID, backgroundColor: YELLOW_SOLID }
    : { borderColor: tone === "added" ? `${YELLOW}0.55)` : LINE, backgroundColor: tone === "added" ? YELLOW_SOFT : CREAM };
  return (
    <motion.div
      className={`rounded-md border border-solid px-4 py-3 text-ink ${className}`}
      style={base}
      animate={on && tone !== "agent" ? { borderColor: f.values, backgroundColor: g.values } : undefined}
      transition={on ? loopOf(f.times) : undefined}
    >
      {children}
    </motion.div>
  );
}

const Name = ({ children }: { children: React.ReactNode }) => <span className="block font-display text-[1.0625rem] sm:text-lead leading-tight">{children}</span>;
const Note = ({ children }: { children: React.ReactNode }) => <span className="mt-1 block font-body text-caption leading-snug text-ink-muted">{children}</span>;

/** Down arrow between steps, with a yellow dot that travels it at fraction `at` of the loop. */
function Link({ at, label }: { at: number; label?: string }) {
  const on = useMotionOn();
  return (
    <div className="relative flex h-9 items-center justify-center text-ink-muted" aria-hidden>
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink-muted opacity-35" />
      <ArrowDown size={16} strokeWidth={1.75} className="relative rounded-full bg-white" />
      {label && <span className="absolute left-1/2 ml-5 font-body text-caption text-ink-muted">{label}</span>}
      {on && (
        <motion.span
          className="absolute left-1/2 -ml-[5px] block h-2.5 w-2.5 rounded-full bg-yellow ring-2 ring-white"
          initial={{ opacity: 0 }}
          animate={{ top: ["0%", "0%", "0%", "85%", "85%", "85%"], opacity: [0, 0, 1, 1, 0, 0] }}
          transition={loopOf([0, at - 0.05, at - 0.04, at + 0.04, at + 0.05, 1])}
        />
      )}
    </div>
  );
}

function Frame({ visual, children }: { visual: ServiceVisual; children: React.ReactNode }) {
  return (
    <Card surface="white" radius="xl" padding="lg">
      <div role="img" aria-label={visual.ariaLabel} className="mx-auto w-full max-w-[30rem]">
        <div aria-hidden>{children}</div>
      </div>
    </Card>
  );
}

/** 01 — events → agent → guardrails → your APIs, or a human when the agent is unsure. */
export function AutomationVisual({ visual }: { visual: ServiceVisual }) {
  const l = visual.labels;
  return (
    <Frame visual={visual}>
      <div className="grid grid-cols-3 gap-2">
        {[l.email, l.ticket, l.form].map((t, i) => (
          <Node key={t} lit={0.08 + i * 0.03} className="text-center !px-2">
            <span className="block font-body text-body">{t}</span>
          </Node>
        ))}
      </div>
      <Link at={0.2} />
      <Node lit={0.3} tone="agent"><Name>{l.agent}</Name><span className="mt-1 block font-body text-caption leading-snug text-ink">{l.agentNote}</span></Node>
      <Link at={0.42} />
      <Node lit={0.5}><Name>{l.guardrails}</Name><Note>{l.guardrailsNote}</Note></Node>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col">
          <Link at={0.62} />
          <Node lit={0.7} tone="added" className="flex-1"><Name>{l.api}</Name><Note>{l.apiNote}</Note></Node>
        </div>
        <div className="flex flex-col">
          <Link at={0.78} />
          <Node lit={0.88} className="flex-1"><Name>{l.human}</Name><Note>{l.humanNote}</Note></Node>
        </div>
      </div>
    </Frame>
  );
}

/** 02 — the stack is built from the data layer up, then handed over. */
export function SoftwareVisual({ visual }: { visual: ServiceVisual }) {
  const l = visual.labels;
  const layers = [
    { name: l.ui, note: l.uiNote, lit: 0.62 },
    { name: l.api, note: l.apiNote, lit: 0.48 },
    { name: l.backend, note: l.backendNote, lit: 0.34 },
    { name: l.data, note: l.dataNote, lit: 0.2 },
  ];
  const on = useMotionOn();
  return (
    <Frame visual={visual}>
      <div className="flex flex-col gap-2">
        {layers.map((ly, i) => (
          <Node key={ly.name} lit={ly.lit} tone={i === 0 ? "added" : "plain"} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <Name>{ly.name}</Name>
            <span className="font-body text-caption leading-snug text-ink-muted sm:text-right">{ly.note}</span>
          </Node>
        ))}
        <div className="mt-1 flex items-center gap-3 rounded-md bg-ink px-4 py-3 text-white">
          <motion.span
            className="inline-flex shrink-0 text-yellow"
            animate={on ? { scale: [1, 1, 0.4, 0.4, 1.3, 1, 1] } : undefined}
            transition={on ? loopOf([0, 0.04, 0.05, 0.74, 0.78, 0.82, 1]) : undefined}
          >
            <Check size={18} strokeWidth={2} />
          </motion.span>
          <span className="font-body text-body">{l.owned}</span>
        </div>
      </div>
    </Frame>
  );
}

/** 03 — modules move one at a time out of the legacy system; the system never goes down. */
export function LegacyVisual({ visual }: { visual: ServiceVisual }) {
  const l = visual.labels;
  const mods = [l.m1, l.m2, l.m3, l.m4];
  const on = useMotionOn();
  const at = (i: number) => 0.14 + i * 0.17;
  return (
    <Frame visual={visual}>
      <div className="grid grid-cols-2 gap-4">
        <p className="m-0 font-body text-caption uppercase tracking-[0.12em] text-ink-muted">{l.before}</p>
        <p className="m-0 font-body text-caption uppercase tracking-[0.12em] text-ink">{l.after}</p>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
        {mods.map((m, i) => {
          // Left: solid until its turn, then ghosted (migrated). Right: empty slot until its turn, then yellow + test tick.
          const t = at(i);
          const old = { opacity: [0.35, 1, 1, 0.35, 0.35], times: [0, 0.02, t - 0.02, t, 1] };
          const neo = { opacity: [1, 0.25, 0.25, 1, 1], times: [0, 0.02, t - 0.02, t, 1] };
          return (
            <React.Fragment key={m}>
              <motion.div
                className="rounded-md border border-dashed border-ink-muted px-4 py-3 bg-cream"
                style={{ opacity: 0.35 }}
                animate={on ? { opacity: old.opacity } : undefined}
                transition={on ? loopOf(old.times) : undefined}
              >
                <span className="font-body text-body text-ink">{m}</span>
              </motion.div>
              <motion.div
                className="flex items-center justify-between gap-2 rounded-md border border-solid border-yellow bg-yellow px-4 py-3"
                animate={on ? { opacity: neo.opacity } : undefined}
                transition={on ? loopOf(neo.times) : undefined}
              >
                <span className="font-display text-[1.0625rem] sm:text-lead leading-tight text-ink">{m}</span>
                <span className="inline-flex items-center gap-1 font-body text-caption text-ink"><Check size={14} strokeWidth={2.25} aria-hidden /><span className="hidden sm:inline">{l.tested}</span></span>
              </motion.div>
            </React.Fragment>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-md bg-ink px-4 py-3 text-white">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          {on && <motion.span className="absolute inset-0 rounded-full bg-yellow" animate={{ scale: [1, 2.2], opacity: [0.6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }} />}
          <span className="relative h-2.5 w-2.5 rounded-full bg-yellow" />
        </span>
        <span className="font-body text-body">{l.live}</span>
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
