import * as React from "react";
import { cx } from "../lib/cx";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  /** Visually hide the label (still read by screen readers). */
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  /** light = on cream/white · dark = on ink. */
  tone?: "light" | "dark";
  size?: "md" | "lg";
  iconLeft?: React.ReactNode;
}

/** Pill text field. Not shown on the reference site — derived from the button geometry (see README). */
export function Input({
  label, hideLabel, hint, error, tone = "light", size = "md", iconLeft, id, className, disabled, ref, ...rest
}: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
  const auto = React.useId();
  const fid = id ?? auto;
  const dark = tone === "dark";
  const describedBy = error ? `${fid}-err` : hint ? `${fid}-hint` : undefined;
  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <label htmlFor={fid} className={cx("font-body text-sm font-medium", dark ? "text-white" : "text-ink", hideLabel && "sr-only")}>{label}</label>
      <div
        className={cx(
          "flex items-center gap-3 rounded-pill border border-solid transition-colors duration-fast ease-out",
          size === "md" ? "h-btn-md px-6" : "h-btn-lg px-8",
          dark ? "bg-transparent border-line-on-dark focus-within:border-yellow" : "bg-white border-line focus-within:border-ink",
          error && "border-ink",
          disabled && "opacity-40",
        )}
      >
        {iconLeft && <span className={cx("inline-flex", dark ? "text-muted-on-dark" : "text-ink-muted")} aria-hidden>{iconLeft}</span>}
        <input
          ref={ref}
          id={fid}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={cx(
            "flex-1 min-w-0 h-full bg-transparent border-0 outline-none font-body",
            size === "md" ? "text-body" : "text-button-lg",
            dark ? "text-white placeholder:text-muted-on-dark" : "text-ink placeholder:text-ink-muted",
          )}
          {...rest}
        />
      </div>
      {error ? (
        <p id={`${fid}-err`} className="inline-flex self-start items-center gap-2 rounded-pill bg-coral text-ink px-3 py-1 text-caption font-medium">{error}</p>
      ) : hint ? (
        <p id={`${fid}-hint`} className={cx("text-caption px-6", dark ? "text-muted-on-dark" : "text-ink-muted")}>{hint}</p>
      ) : null}
    </div>
  );
}
