"use client";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Stagger, StaggerItem } from "@/motion/Reveal";
import { stagger } from "@/tokens/motion";

export interface PipelineDiagramProps {
  /** Six steps in reading order: three existing, then the agent, its tools, production. */
  steps: string[];
  /** One short line under each step name. */
  notes?: string[];
  ariaLabel: string;
  className?: string;
}

/**
 * The diagram is a U: down through the system you already run (left), across into the AI agent,
 * then up through its tools to production (right). DOM stays in reading order; the grid places each step.
 */
const CELL = [
  "col-start-1 row-start-1", "col-start-1 row-start-2", "col-start-1 row-start-3",
  "col-start-2 row-start-3", "col-start-2 row-start-2", "col-start-2 row-start-1",
];

const LOOP = 9;
const START = 2.2;
const ARRIVE = [0.05, 0.2, 0.35, 0.5, 0.65, 0.8];
const YELLOW = "rgba(255, 214, 78, ";

export function PipelineDiagram({ steps, notes = [], ariaLabel, className }: PipelineDiagramProps) {
  const reduce = !!useReducedMotion();
  const loop = { duration: LOOP, delay: START, repeat: Infinity, ease: "linear" as const };

  return (
    <Stagger immediate delay={1.1} stagger={stagger.base} className={className}>
      <div className="relative">
        {/* Decor: the added zone, the path, direction chevrons and the travelling signal. */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 rounded-md border border-dashed" style={{ borderColor: `${YELLOW}0.4)`, background: `${YELLOW}0.04)` }} />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline points="25,16.67 25,83.33 50,83.33" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <polyline points="50,83.33 75,83.33 75,16.67" fill="none" stroke={`${YELLOW}0.7)`} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
          <Chevron left={25} top={33.33} Icon={ArrowDown} />
          <Chevron left={25} top={66.67} Icon={ArrowDown} />
          <Chevron left={50} top={83.33} Icon={ArrowRight} yellow />
          <Chevron left={75} top={66.67} Icon={ArrowUp} yellow />
          <Chevron left={75} top={33.33} Icon={ArrowUp} yellow />
          {!reduce && (
            <motion.span
              className="absolute block h-2.5 w-2.5 -ml-[5px] -mt-[5px] rounded-full bg-yellow ring-2 ring-ink"
              initial={{ opacity: 0 }}
              animate={{
                left: ["25%", "25%", "25%", "25%", "75%", "75%", "75%", "75%", "75%"],
                top: ["16.67%", "16.67%", "50%", "83.33%", "83.33%", "50%", "16.67%", "16.67%", "16.67%"],
                opacity: [0, 1, 1, 1, 1, 1, 1, 0, 0],
              }}
              transition={{ ...loop, times: [0, 0.05, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 1] }}
            />
          )}
        </div>

        <ol aria-label={ariaLabel} className="relative m-0 p-0 list-none grid grid-cols-2 grid-rows-3">
          {steps.map((name, i) => {
            const added = i >= 3;
            const agent = i === 3;
            const final = i === steps.length - 1;
            const a = ARRIVE[i] ?? 0;
            const times = [0, Math.max(a - 0.03, 0.001), a, Math.min(a + 0.14, 0.99), 1];
            const lit = (off: string, on: string) => (reduce ? undefined : [off, off, on, off, off]);
            return (
              <StaggerItem as="li" key={i} variant="fade" className={`${CELL[i]} flex`} >
                <motion.div
                  className={[
                    "flex-1 min-w-0 flex flex-col justify-center rounded-md border border-solid",
                    agent ? "bg-yellow text-ink border-yellow" : added ? "text-white" : "text-white bg-ink",
                  ].join(" ")}
                  style={{ padding: "14px 16px", margin: "clamp(12px, 1.6vw, 15px) clamp(10px, 2.4vw, 20px)", ...(agent ? {} : { borderColor: added ? `${YELLOW}0.55)` : "rgba(255,255,255,0.28)", backgroundColor: added ? "#1c1b1f" : undefined }) }}
                  animate={reduce ? undefined : agent
                    ? { scale: [1, 1, 1.04, 1, 1] }
                    : { borderColor: lit(added ? `${YELLOW}0.55)` : "rgba(255,255,255,0.28)", `${YELLOW}1)`), backgroundColor: lit("#1c1b1f", final ? "#3a3320" : "#2a2820") }}
                  transition={reduce ? undefined : { ...loop, times }}
                >
                  <span className={`font-display text-[1.0625rem] sm:text-lead leading-tight ${agent ? "font-medium" : ""}`}>{name}</span>
                  {notes[i] && <span className={`mt-1 font-body text-caption leading-snug ${agent ? "text-ink" : "text-muted-on-dark"}`}>{notes[i]}</span>}
                </motion.div>
              </StaggerItem>
            );
          })}
        </ol>
      </div>
    </Stagger>
  );
}

function Chevron({ left, top, Icon, yellow }: { left: number; top: number; Icon: typeof ArrowDown; yellow?: boolean }) {
  return (
    <span
      className="absolute flex h-6 w-6 -ml-3 -mt-3 items-center justify-center rounded-full bg-ink"
      style={{ left: `${left}%`, top: `${top}%`, color: yellow ? `${YELLOW}1)` : "rgba(255,255,255,0.7)" }}
    >
      <Icon size={14} strokeWidth={2} />
    </span>
  );
}
