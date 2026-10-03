"use client";
import { CtaSection } from "@/sections/CtaSection";
import { openBooking } from "@/site/booking/BookingDialog";
import { content } from "@/content/content";

export function Contact() {
  const c = content.landing.contact;
  return (
    <div id="contact">
      <CtaSection tone="ink" title={c.title} subtitle={c.subtitle} cta={{ label: c.cta, hoverLabel: c.ctaHover, onClick: openBooking }} />
    </div>
  );
}
