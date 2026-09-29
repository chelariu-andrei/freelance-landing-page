import * as React from "react";
import { cx } from "../lib/cx";
import { IconCircle } from "../primitives/Icon";
import { CheckItem } from "../primitives/CheckItem";
import { Stagger, StaggerItem } from "../motion/Reveal";

export interface MatrixFeature { lead?: React.ReactNode; text?: React.ReactNode; excluded?: boolean }
export interface MatrixModule {
  id: string;
  name: string;
  tagline?: string;
  icon: React.ReactNode;
  /** Disc colour. Rotate through the pastels. */
  iconTone?: "periwinkle" | "yellow" | "blush" | "mint" | "coral" | "stone";
  features: MatrixFeature[];
}

export interface FeatureMatrixProps {
  title: React.ReactNode;
  /** Right-aligned overline next to the title, e.g. "Six modules · one bill". */
  meta?: string;
  modules: MatrixModule[];
  /** Footnote under the list, e.g. "* Fair-use limits apply". */
  footnote?: React.ReactNode;
  tone?: "cream" | "white";
  animated?: boolean;
  className?: string;
}

/** "What's included": module rows (icon disc, name, tagline) with a checklist of features each, separated by hairlines. */
export function FeatureMatrix({ title, meta, modules, footnote, tone = "cream", animated = true, className }: FeatureMatrixProps) {
  const Row = ({ m }: { m: MatrixModule }) => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-center py-8 lg:py-10 border-0 border-b border-solid border-line">
      <div className="md:col-span-5 lg:col-span-4 flex items-center gap-5">
        <IconCircle tone={m.iconTone ?? "periwinkle"} size="lg" className="lg:w-20 lg:h-20">{m.icon}</IconCircle>
        <div className="flex flex-col gap-1">
          <h3 className="m-0 font-display font-regular text-heading-lg lg:text-[2.25rem] lg:leading-tight text-ink">{m.name}</h3>
          {m.tagline && <p className="m-0 font-body text-body-md text-ink-muted">{m.tagline}</p>}
        </div>
      </div>
      <ul className="md:col-span-7 lg:col-span-8 flex flex-col gap-4 m-0 p-0">
        {m.features.map((f, i) => <CheckItem key={i} lead={f.lead} excluded={f.excluded}>{f.text}</CheckItem>)}
      </ul>
    </div>
  );
  return (
    <section className={cx("bg-cream px-2 lg:px-gutter py-2", className)}>
      <div className={cx("rounded-lg lg:rounded-xl py-12 lg:py-16", tone === "cream" ? "bg-cream border border-solid border-line" : "bg-white")}>
        <div className="mx-auto max-w-container px-5 md:px-10 lg:px-24">
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 lg:pb-8 border-0 border-b border-solid border-line">
            <h2 className="m-0 font-display font-regular text-heading-xl text-ink">{title}</h2>
            {meta && <p className="m-0 font-body text-overline uppercase text-ink-muted font-semibold">{meta}</p>}
          </header>
          {animated ? (
            <Stagger stagger={0.08}>{modules.map((m) => <StaggerItem key={m.id} distance={16}><Row m={m} /></StaggerItem>)}</Stagger>
          ) : modules.map((m) => <Row key={m.id} m={m} />)}
          {footnote && <p className="m-0 mt-6 font-body text-sm text-ink-muted">{footnote}</p>}
        </div>
      </div>
    </section>
  );
}
