import * as React from "react";
import { cx } from "../lib/cx";
import { StepPill } from "../primitives/StepPill";
import { Stagger, StaggerItem } from "../motion/Reveal";

export interface ProcessStep { label: string; icon?: React.ReactNode; description: React.ReactNode; }

export interface ProcessLoopProps {
  title?: React.ReactNode;
  steps: ProcessStep[];
  /** vertical = the mobile reference (cards stacked, dashed loop around) · horizontal = 4-up row at desktop. Default "auto": vertical on mobile, horizontal from lg. */
  layout?: "auto" | "vertical" | "horizontal";
  /** Draw the dashed loop connector. Default true. */
  loop?: boolean;
  animated?: boolean;
  className?: string;
}

/** "Here's how we do it": white step cards with an ink StepPill + short description, joined by a dashed loop. */
export function ProcessLoop({ title, steps, layout = "auto", loop = true, animated = true, className }: ProcessLoopProps) {
  const three = steps.length === 3;
  const listCls = cx(
    "relative grid gap-4 m-0 p-0 list-none",
    layout === "vertical" && "grid-cols-1 max-w-[20rem] mx-auto",
    layout === "horizontal" && (three ? "grid-cols-3" : "grid-cols-4"),
    layout === "auto" && "grid-cols-1 max-w-[20rem] mx-auto lg:max-w-none",
    layout === "auto" && (three ? "lg:grid-cols-3" : "lg:grid-cols-4"),
  );
  const loopCls = cx(
    "absolute pointer-events-none border-0 border-dashed border-muted-on-dark rounded-lg",
    layout === "horizontal" ? "-inset-y-6 inset-x-8 border-t-[1.5px] border-b-[1.5px]" :
    layout === "vertical" ? "-inset-x-8 inset-y-8 border-l-[1.5px] border-r-[1.5px]" :
    "-inset-x-8 inset-y-8 border-l-[1.5px] border-r-[1.5px] lg:inset-x-8 lg:-inset-y-6 lg:border-l-0 lg:border-r-0 lg:border-t-[1.5px] lg:border-b-[1.5px]",
  );
  const Item = ({ s }: { s: ProcessStep }) => (
    <div className="relative bg-white rounded-md p-6 lg:p-8 flex flex-col items-center gap-4 text-center h-full">
      <StepPill label={s.label} icon={s.icon} size="md" tone="ink" />
      <p className="m-0 font-body text-body-md text-ink">{s.description}</p>
    </div>
  );
  return (
    <section className={cx("bg-cream py-10 lg:py-24 px-10", className)}>
      {title && <h2 className="m-0 mb-8 lg:mb-12 text-center font-display font-regular text-heading-lg text-ink">{title}</h2>}
      <div className="relative mx-auto max-w-container">
        {loop && <span aria-hidden className={loopCls} />}
        {animated ? (
          <Stagger as="div" className={listCls}>
            {steps.map((s, i) => <StaggerItem key={i} className="relative"><Item s={s} /></StaggerItem>)}
          </Stagger>
        ) : (
          <ol className={listCls}>{steps.map((s, i) => <li key={i} className="relative"><Item s={s} /></li>)}</ol>
        )}
      </div>
    </section>
  );
}
