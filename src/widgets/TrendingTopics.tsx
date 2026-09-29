import * as React from "react";
import { cx } from "../lib/cx";
import { Badge } from "../primitives/Badge";
import { AvatarStack, type AvatarItem } from "../primitives/AvatarStack";
import { Button } from "../primitives/Button";
import { Skeleton } from "../primitives/Skeleton";
import { Sparkline } from "./Sparkline";
import { Stagger, StaggerItem } from "../motion/Reveal";

export interface TopicItem {
  title: string;
  category: string;
  /** Score shown in the badge, e.g. "90%". */
  score: string;
  /** mint ≥ 85 · yellow below (reference rule). */
  scoreTone?: "mint" | "yellow" | "coral";
  trend: number[];
  people?: AvatarItem[];
}

export interface TrendingTopicsProps {
  title?: string;
  items: TopicItem[];
  actionLabel?: string;
  onAction?: (item: TopicItem, index: number) => void;
  loading?: boolean;
  /** Rows shown while loading. Default 4. */
  loadingRows?: number;
  emptyTitle?: string;
  emptyBody?: string;
  /** Stagger rows in on scroll. Default true. */
  animated?: boolean;
  className?: string;
}

/** Ranked list card: number disc, title + category, score badge, sparkline, faces, action. Collapses to two lines on mobile. */
export function TrendingTopics({
  title = "Trending Topics", items, actionLabel = "Create campaign", onAction, loading, loadingRows = 4,
  emptyTitle = "Nothing trending yet", emptyBody = "Topics appear here once there is enough data.", animated = true, className,
}: TrendingTopicsProps) {
  const Row = ({ it, i }: { it: TopicItem; i: number }) => (
    <div className="flex flex-wrap items-center gap-3 rounded-md bg-cream p-3">
      <span className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-periwinkle font-display text-lead shrink-0">{i + 1}</span>
      <div className="grow basis-topic min-w-0">
        <p className="m-0 font-body text-sm font-medium leading-snug">{it.title}</p>
        <p className="m-0 font-body text-micro text-ink-muted mt-1">{it.category}</p>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-3 ml-auto max-w-full">
        <div className="flex items-center gap-2 rounded-pill bg-white pl-1 pr-3 py-1">
          <Badge tone={it.scoreTone ?? "mint"}>{it.score}</Badge>
          <Sparkline points={it.trend} />
        </div>
        {it.people && <AvatarStack people={it.people} size="sm" max={3} ground="cream" className="hidden sm:flex" />}
        <Button size="sm" variant="secondary" onClick={() => onAction?.(it, i)}>{actionLabel}</Button>
      </div>
    </div>
  );

  let body: React.ReactNode;
  if (loading) {
    body = Array.from({ length: loadingRows }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 rounded-md bg-cream p-3">
        <Skeleton shape="circle" className="w-10 h-10" />
        <div className="flex-1 flex flex-col gap-2"><Skeleton className="h-4 w-3/5" /><Skeleton className="h-3 w-1/4" /></div>
        <Skeleton shape="pill" className="h-8 w-24" />
      </div>
    ));
  } else if (!items.length) {
    body = (
      <div className="rounded-md bg-cream p-8 text-center flex flex-col gap-2 items-center">
        <p className="m-0 font-display text-button-lg">{emptyTitle}</p>
        <p className="m-0 font-body text-sm text-ink-muted max-w-prose">{emptyBody}</p>
      </div>
    );
  } else if (animated) {
    body = (
      <Stagger className="flex flex-col gap-2" stagger={0.08}>
        {items.map((it, i) => <StaggerItem key={i} variant="up" distance={12}><Row it={it} i={i} /></StaggerItem>)}
      </Stagger>
    );
  } else {
    body = <div className="flex flex-col gap-2">{items.map((it, i) => <Row key={i} it={it} i={i} />)}</div>;
  }

  return (
    <section className={cx("bg-white rounded-md lg:rounded-lg p-4 lg:p-5 flex flex-col gap-4 text-ink", className)} aria-busy={loading || undefined}>
      <h3 className="m-0 font-display text-button-lg lg:text-heading-lg lg:text-[1.5rem] font-regular">{title}</h3>
      {loading || !items.length ? <div className="flex flex-col gap-2">{body}</div> : body}
    </section>
  );
}
