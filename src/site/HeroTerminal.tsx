"use client";
import * as React from "react";
import { useReducedMotion } from "framer-motion";

export interface HeroTerminalProps {
  /** Working directory shown in the title bar. */
  path: string;
  command: string;
  /** Completed steps, in order. */
  steps: string[];
  /** The program's output once every step has run. */
  done: string;
  ariaLabel: string;
  /** Seconds before the command starts typing (the hero aside fades in first). */
  delay?: number;
  className?: string;
}

/** Seconds per keystroke, nudged per character so the typing reads as a person, not a ticker. */
const keystroke = (ch: string, i: number) => (ch === " " ? 0.11 : 0.034 + ((i * 7) % 5) * 0.008);
const ENTER = 0.32;
const STEP_IN = 0.1;
const STEP_RUN = [0.34, 0.42, 0.3, 0.46, 0.36, 0.5];
const OUTPUT = 0.4;
const PROMPT = 0.45;

/**
 * Quiet terminal accent for the hero. One clock (`tick`) walks the whole scene: each keystroke, the enter,
 * every step's start and finish, the output, the idle prompt. The server renders the finished scene, so
 * without JS or with reduced motion it is simply complete; on mount the clock rewinds (still hidden behind
 * the aside's own fade-in) and plays once.
 */
export function HeroTerminal({ path, command, steps, done, ariaLabel, delay = 1.25, className }: HeroTerminalProps) {
  const reduce = useReducedMotion();
  const n = command.length;
  const end = n + 3 + steps.length * 2;
  const [tick, setTick] = React.useState(end);

  React.useEffect(() => {
    if (reduce) { setTick(end); return; }
    setTick(0);
    const at: number[] = [];
    let t = delay;
    for (let i = 0; i < n; i++) at.push((t += keystroke(command[i], i)));
    at.push((t += ENTER));
    steps.forEach((_, i) => { at.push((t += STEP_IN)); at.push((t += STEP_RUN[i % STEP_RUN.length])); });
    at.push((t += OUTPUT), (t += PROMPT));
    const timers = at.map((s, i) => window.setTimeout(() => setTick(i + 1), s * 1000));
    return () => timers.forEach(clearTimeout);
  }, [reduce, command, steps, n, end, delay]);

  const typed = Math.min(tick, n);
  const after = tick - n; // 1 = enter pressed
  const started = (i: number) => after >= 2 + i * 2;
  const finished = (i: number) => after >= 3 + i * 2;
  const outputShown = after >= 2 + steps.length * 2;
  const idle = tick >= end;
  const fade = "transition-[opacity,transform] duration-base ease-out";

  return (
    <figure role="img" aria-label={ariaLabel} className={["ac-term m-0 overflow-hidden rounded-sm border border-solid border-[rgba(255,255,255,0.14)] bg-ink font-mono", className].filter(Boolean).join(" ")}>
      <div aria-hidden className="flex items-center justify-between gap-4 border-0 border-b border-solid border-[rgba(255,255,255,0.08)] px-4 py-[10px]">
        <span className="flex gap-[6px]">
          {[0, 1, 2].map((i) => <span key={i} className="block h-[9px] w-[9px] rounded-full border border-solid border-[rgba(255,255,255,0.2)]" />)}
        </span>
        <span className="text-[11px] leading-none text-subtle-on-dark">{path}</span>
      </div>

      <div aria-hidden className="px-4 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-6 text-[11.5px] min-[400px]:text-[12.5px] sm:text-[13px] xl:text-[14px] leading-[1.8] text-muted-on-dark">
        <p className="m-0 whitespace-nowrap text-white">
          <span className="mr-[1ch] text-subtle-on-dark">$</span>
          {command.slice(0, typed)}
          {after < 1 && <Caret blink={typed === 0} />}
        </p>

        <ul className="m-0 mt-3 p-0 list-none">
          {steps.map((s, i) => {
            const on = started(i);
            const ok = finished(i);
            return (
              <li key={i} className={`flex whitespace-nowrap ${fade} ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[3px]"}`}>
                <span className="relative mr-[1ch] inline-block w-[1ch] shrink-0 text-center">
                  <span className={`absolute inset-0 text-subtle-on-dark ${fade} ${ok ? "opacity-0" : "opacity-100"}`}>·</span>
                  <span className={`inline-block text-success ${fade} ${ok ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>✓</span>
                </span>
                <span className={`transition-opacity duration-base ease-out ${ok ? "opacity-100" : "opacity-50"}`}>{s}</span>
              </li>
            );
          })}
        </ul>

        <p className={`m-0 mt-3 whitespace-nowrap text-yellow ${fade} ${outputShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[3px]"}`}>
          <span className="mr-[1ch]">→</span>{done}
        </p>

        <p className={`m-0 mt-3 whitespace-nowrap transition-opacity duration-fast ${idle ? "opacity-100" : "opacity-0"}`}>
          <span className="mr-[1ch] text-subtle-on-dark">$</span>
          <Caret blink />
        </p>
      </div>
    </figure>
  );
}

function Caret({ blink }: { blink?: boolean }) {
  return <span className={`inline-block h-[1.15em] w-[1ch] translate-y-[0.2em] bg-muted-on-dark ${blink ? "ac-caret" : ""}`} />;
}
