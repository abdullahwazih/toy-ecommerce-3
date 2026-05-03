"use client";

import * as React from "react";
import { cn } from "./ui";

type ImageLightboxProps = {
  src: string;
  alt: string;
  triggerClassName?: string;
  imgClassName?: string;
  modalImgClassName?: string;
  triggerAriaLabel?: string;
};

export default function ImageLightbox({
  src,
  alt,
  triggerClassName,
  imgClassName,
  modalImgClassName,
  triggerAriaLabel,
}: ImageLightboxProps) {
  const [open, setOpen] = React.useState(false);
  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    // Focus the close button for keyboard users.
    const raf = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open]);

  if (!src) return null;

  return (
    <>
      <button
        type="button"
        className={cn("block", triggerClassName)}
        onClick={() => setOpen(true)}
        aria-label={triggerAriaLabel ?? `Enlarge image: ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          className={cn("cursor-zoom-in", imgClassName)}
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="relative max-h-[90vh] max-w-[95vw]">
            <button
              ref={closeButtonRef}
              type="button"
              className="absolute -right-3 -top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-gray-900 shadow hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              onClick={() => setOpen(false)}
              aria-label="Close image"
            >
              <span aria-hidden="true" className="text-xl leading-none">
                ×
              </span>
            </button>

            <img
              src={src}
              alt={alt}
              className={cn(
                "max-h-[90vh] max-w-[95vw] rounded-2xl bg-white object-contain shadow-2xl",
                modalImgClassName,
              )}
            />
          </div>
        </div>
      )}
    </>
  );
}

