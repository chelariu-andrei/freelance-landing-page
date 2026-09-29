import * as React from "react";
import { cx } from "../lib/cx";
import { Reveal } from "../motion/Reveal";

export type StatPart =
  | { kind: "text"; text: string }
  | { kind: "icon"; icon: React.ReactNode; label?: string }
  | { kind: "value"; text: string };

export interface StatRow {
  parts: StatPart[];
  /** Optional round bubble after the pill (the stone arrow disc). */
  bubble?: React.ReactNode;
}

export interface StatStatementProps {
  rows: StatRow[];
  /** Horizontal offset of each following row at desktop, like the reference's stepped layout. Default true. */
  stepped?: boolean;
  animated?: boolean;
  /** Decorative layer behind the pills, e.g. <DottedSurface contained color="#1c1b1f" fogColor="#f9f6f0" />. */
  background?: React.ReactNode;
  className?: string;
}

/** Big white pills carrying a sentence with yellow icon/value bubbles ("In minutes ⏱ not months", "Up to 90% savings…"). */
export function StatStatement({ rows, stepped = true, animated = true, background, className }: StatStatementProps) {
  return (
    <section className={cx("relative bg-cream py-10 lg:py-16 px-2 lg:px-gutter overflow-hidden", className)}>
      {background}
      <div className="relative z-10 mx-auto max-w-wide flex flex-col">
        {rows.map((row, ri) => {
          const content = (
            <div className={cx("flex items-start", stepped && ri > 0 && "lg:pl-20")}>
              <p className="m-0 flex flex-wrap items-center gap-x-4 lg:gap-x-8 gap-y-3 bg-white rounded-pill px-8 lg:px-24 py-6 min-h-stat font-display text-heading-xl lg:text-display-lg text-ink">
                {row.parts.map((p, pi) =>
                  p.kind === "text" ? <span key={pi}>{p.text}</span> :
                  p.kind === "value" ? <span key={pi} className="inline-flex items-center bg-yellow rounded-pill px-5 lg:px-12 py-1 lg:py-4">{p.text}</span> :
                  <span key={pi} role={p.label ? "img" : undefined} aria-label={p.label} aria-hidden={p.label ? undefined : true} className="inline-flex items-center justify-center bg-yellow rounded-full w-12 h-12 lg:w-32 lg:h-32">{p.icon}</span>
                )}
              </p>
              {row.bubble && <span aria-hidden className="hidden md:inline-flex self-start items-center justify-center shrink-0 w-stat h-stat bg-stone rounded-full -ml-1">{row.bubble}</span>}
            </div>
          );
          return animated ? <Reveal key={ri} delay={ri * 0.12} variant={ri % 2 ? "left" : "right"} distance={48}>{content}</Reveal> : <React.Fragment key={ri}>{content}</React.Fragment>;
        })}
      </div>
    </section>
  );
}
