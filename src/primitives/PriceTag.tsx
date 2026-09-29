import * as React from "react";
import { cx } from "../lib/cx";

export interface PriceTagProps {
  /** Number or preformatted string, e.g. 499 or "1.290". */
  amount: number | string;
  /** Currency symbol or code, e.g. "$", "€", "RON". */
  currency?: string;
  /** Where the currency sits. Symbols usually "before", codes like "RON" usually "after". Default "before". */
  currencyPosition?: "before" | "after";
  /** Period suffix, e.g. "/ mo". */
  period?: string;
  /** Small line under the price, e.g. "Billed monthly · 3-month term". */
  note?: React.ReactNode;
  /** xl = pricing hero (up to 192px) · lg = cards (88px) · md = inline (44px). Default "xl". */
  size?: "md" | "lg" | "xl";
  /** Price colour context. Default "light" (ink text). */
  tone?: "light" | "dark";
  align?: "left" | "right";
  className?: string;
}

const amountSize = { md: "text-heading-lg", lg: "text-display-lg", xl: "text-price" };
const periodSize = { md: "text-body", lg: "text-heading-lg lg:text-[2rem]", xl: "text-heading-lg" };

/** Big display price with currency, period and a billing note. */
export function PriceTag({ amount, currency = "$", currencyPosition = "before", period, note, size = "xl", tone = "light", align = "right", className }: PriceTagProps) {
  const dark = tone === "dark";
  const formatted = typeof amount === "number" ? amount.toLocaleString("en-US") : amount;
  const label = `${currencyPosition === "before" ? currency : ""}${formatted}${currencyPosition === "after" ? " " + currency : ""}${period ? " " + period : ""}`;
  return (
    <div className={cx("flex flex-col gap-3", align === "right" ? "items-end text-right" : "items-start text-left", className)}>
      <p className={cx("m-0 flex items-baseline font-display font-regular", dark ? "text-white" : "text-ink")} aria-label={label}>
        <span aria-hidden className={cx(amountSize[size], "leading-none whitespace-nowrap")}>
          {currencyPosition === "before" && currency}{formatted}{currencyPosition === "after" && <span className="ml-[0.1em] text-[0.45em] tracking-normal">{currency}</span>}
        </span>
        {period && <span aria-hidden className={cx(periodSize[size], "ml-2 lg:ml-3 whitespace-nowrap", dark ? "text-muted-on-dark" : "text-ink-muted")}>{period}</span>}
      </p>
      {note && <p className={cx("m-0 font-body text-body-md", dark ? "text-muted-on-dark" : "text-ink-muted")}>{note}</p>}
    </div>
  );
}
