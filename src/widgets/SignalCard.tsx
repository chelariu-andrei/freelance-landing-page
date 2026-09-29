import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cx } from "../lib/cx";
import { Badge } from "../primitives/Badge";
import { AvatarStack, type AvatarItem } from "../primitives/AvatarStack";
import { Skeleton } from "../primitives/Skeleton";

export interface SignalCardProps {
  title: string;
  /** Delta badge, e.g. "+92%". */
  delta?: string;
  deltaTone?: "mint" | "yellow" | "coral";
  people: AvatarItem[];
  extraCount?: number;
  linkLabel?: string;
  href?: string;
  /** yellow = hero accent card · white = inside yellow sections. */
  surface?: "yellow" | "white";
  loading?: boolean;
  className?: string;
}

/** Compact metric card: title, delta badge, audience faces, link. */
export function SignalCard({ title, delta, deltaTone = "mint", people, extraCount, linkLabel = "See results", href = "#", surface = "yellow", loading, className }: SignalCardProps) {
  return (
    <div className={cx("rounded-lg p-6 flex flex-col gap-4 text-ink", surface === "yellow" ? "bg-yellow" : "bg-white", className)} aria-busy={loading || undefined}>
      {loading ? (
        <>
          <div className="flex justify-between items-center"><Skeleton className="h-5 w-40" /><Skeleton shape="pill" className="h-6 w-12" /></div>
          <Skeleton shape="pill" className="h-10 w-56" />
          <Skeleton className="h-4 w-24" />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center gap-4">
            <span className="font-display text-button-lg leading-tight">{title}</span>
            {delta && <Badge tone={deltaTone} size="md">{delta}</Badge>}
          </div>
          <AvatarStack people={people} extraCount={extraCount} ground={surface} />
          <a href={href} className="ac-focus inline-flex items-center gap-1 self-start rounded-sm font-body text-body-md lg:text-button-lg text-ink no-underline hover:underline underline-offset-4">
            {linkLabel}<ChevronRight size={18} strokeWidth={1.75} aria-hidden />
          </a>
        </>
      )}
    </div>
  );
}
