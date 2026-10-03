"use client";
import * as React from "react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalendarProps = DayPickerProps;

const reset = "appearance-none border-0 bg-transparent p-0 m-0 font-body";
const navButton = cn(
  reset,
  "ac-focus inline-flex h-10 w-10 items-center justify-center rounded-full text-ink cursor-pointer transition-colors duration-fast hover:bg-cream",
  "disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent",
);

/**
 * shadcn-style Calendar on react-day-picker v9. Styled with the Ac. tokens instead of shadcn's CSS variables,
 * and resets native button styles itself because Tailwind preflight is off in this project.
 */
export function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("font-body text-ink", className)}
      classNames={{
        months: "relative flex flex-col gap-4",
        month: "flex flex-col gap-3",
        month_caption: "flex h-10 items-center px-1",
        caption_label: "font-display text-lead",
        nav: "absolute right-0 top-0 flex items-center gap-1",
        button_previous: navButton,
        button_next: navButton,
        month_grid: "w-full border-collapse",
        weekday: "pb-2 text-caption font-medium text-ink-muted",
        day: "p-0.5 text-center",
        day_button: cn(
          reset,
          "ac-focus inline-flex h-10 w-10 items-center justify-center rounded-full text-body text-current cursor-pointer transition-colors duration-fast hover:bg-yellow",
        ),
        today: "font-semibold",
        selected: "[&>button]:bg-ink [&>button]:text-white [&>button:hover]:bg-ink",
        outside: "text-ink-muted",
        disabled: "opacity-30 [&>button]:cursor-default [&>button:hover]:bg-transparent",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: c }) =>
          orientation === "left" ? <ChevronLeft size={20} aria-hidden className={c} /> : <ChevronRight size={20} aria-hidden className={c} />,
      }}
      {...props}
    />
  );
}
