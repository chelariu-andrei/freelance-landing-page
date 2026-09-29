import * as React from "react";
import { Target, Folder, ChevronRight, ImageIcon } from "lucide-react";
import { cx } from "../lib/cx";
import { Badge } from "../primitives/Badge";
import { Skeleton } from "../primitives/Skeleton";

export interface Metric { label: string; value: string; }
export interface CampaignCardProps {
  title: string;
  /** Objective badge, e.g. "Awareness". */
  objective?: string;
  /** Channel bar text, e.g. "Portal listings, Instagram, Facebook". */
  channels?: string;
  metrics: Metric[];
  image?: { src: string; alt: string };
  loading?: boolean;
  className?: string;
}

/** Campaign summary: image, title, objective badge, channel bar and a 2-column metric grid. */
export function CampaignCard({ title, objective, channels, metrics, image, loading, className }: CampaignCardProps) {
  return (
    <div className={cx("bg-white rounded-lg p-3 flex flex-col sm:flex-row gap-3 text-ink", className)} aria-busy={loading || undefined}>
      <div className="sm:w-1/3 shrink-0 rounded-md overflow-hidden bg-stone min-h-32 flex items-center justify-center">
        {loading ? <Skeleton className="w-full h-full min-h-32" /> : image ? <img src={image.src} alt={image.alt} className="w-full h-full object-cover block" /> : <ImageIcon size={32} strokeWidth={1.5} className="text-ink-muted" aria-hidden />}
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-2 py-1">
        {loading ? (
          <><Skeleton className="h-5 w-3/4" /><Skeleton shape="pill" className="h-8 w-full" /><Skeleton className="h-20 w-full" /></>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="font-display text-body-md truncate">{title}</span>
              {objective && <Badge tone="yellow" icon={<Target size={12} strokeWidth={2} />}>{objective}</Badge>}
            </div>
            {channels && (
              <div className="flex items-center gap-2 rounded-pill bg-periwinkle px-3 py-2 text-caption font-medium">
                <Folder size={14} strokeWidth={1.75} aria-hidden /><span className="flex-1 truncate">{channels}</span><ChevronRight size={14} aria-hidden />
              </div>
            )}
            <dl className="grid grid-cols-2 m-0 rounded-md border border-solid border-line">
              {metrics.map((m, i) => (
                <div key={i} className={cx("flex gap-1 px-2 py-2 text-caption whitespace-nowrap overflow-hidden border-0 border-solid border-line", i % 2 === 0 && "border-r", i >= 2 && "border-t")}>
                  <dt className="text-ink-muted">{m.label}:</dt><dd className="m-0 font-medium truncate">{m.value}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </div>
    </div>
  );
}
