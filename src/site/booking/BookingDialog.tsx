"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import { CONTACT_FALLBACK } from "@/content/links";

const BOOK_HASH = new URL(CONTACT_FALLBACK, "http://x").hash; // "#book"
const OPEN_EVENT = "ac:open-booking";

/** Opens the booking popup from anywhere (e.g. a button's onClick). */
export const openBooking = () => window.dispatchEvent(new Event(OPEN_EVENT));

// The calendar and form only load once someone opens the popup.
const BookingFlow = dynamic(() => import("./BookingFlow").then((m) => m.BookingFlow), { ssr: false });

/**
 * One booking popup for the whole site, mounted in the root layout. Every "Book a call" link points at /#book;
 * a click on one is caught here and opens the popup in place, so nobody is sent to another page.
 * Visiting /#book directly opens it too. A native <dialog> gives focus trapping, Esc and the backdrop for free.
 */
export function BookingDialog() {
  const ref = React.useRef<HTMLDialogElement>(null);
  const [open, setOpen] = React.useState(false);
  // Remount the flow on each open so a finished booking starts fresh next time.
  const [session, setSession] = React.useState(0);

  const show = React.useCallback(() => {
    const d = ref.current;
    if (!d || d.open) return;
    setSession((s) => s + 1);
    setOpen(true);
    d.showModal();
    document.documentElement.style.overflow = "hidden";
  }, []);

  const close = React.useCallback(() => ref.current?.close(), []);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.hash !== BOOK_HASH || a.origin !== window.location.origin) return;
      e.preventDefault();
      show();
    };
    const onHash = () => {
      if (window.location.hash !== BOOK_HASH) return;
      history.replaceState(null, "", window.location.pathname + window.location.search);
      show();
    };
    onHash();
    document.addEventListener("click", onClick);
    window.addEventListener(OPEN_EVENT, show);
    window.addEventListener("hashchange", onHash);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener(OPEN_EVENT, show);
      window.removeEventListener("hashchange", onHash);
    };
  }, [show]);

  return (
    <dialog
      ref={ref}
      aria-label="Book a discovery call"
      onClose={() => { setOpen(false); document.documentElement.style.overflow = ""; }}
      // A click on the backdrop lands on the <dialog> itself; clicks inside land on its children.
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      className="ac-booking ac-light m-auto w-[calc(100%-2rem)] max-w-[40rem] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-lg lg:rounded-xl border-0 bg-cream text-ink p-0"
    >
      <div className="relative p-6 pt-16 lg:p-10 lg:pt-16">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="ac-focus absolute right-3 top-3 lg:right-5 lg:top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border-0 bg-transparent text-ink cursor-pointer transition-colors duration-fast hover:bg-white"
        >
          <X size={22} strokeWidth={1.75} aria-hidden />
        </button>
        {open && <BookingFlow key={session} />}
      </div>
    </dialog>
  );
}
