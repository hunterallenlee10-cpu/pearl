"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePath } from "@/lib/use-path";

/**
 * Wraps internal link navigations in the View Transitions API so pages change with a soft
 * "flour sweep" (see ::view-transition rules in globals.css). Browsers without the API, and
 * visitors who prefer reduced motion, get normal navigation.
 */
export function ViewTransitions() {
  const router = useRouter();
  const pathname = usePath();
  const pending = useRef<(() => void) | null>(null);

  useEffect(() => {
    const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => unknown };
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target || a.hasAttribute("download") || !a.href) return;
      const url = new URL(a.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      doc.startViewTransition!(
        () =>
          new Promise<void>((resolve) => {
            const t = window.setTimeout(resolve, 1200);
            pending.current = () => {
              clearTimeout(t);
              resolve();
            };
            router.push(url.pathname + url.search + url.hash);
          }),
      );
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    if (!pending.current) return;
    const done = pending.current;
    pending.current = null;
    requestAnimationFrame(() => done());
  }, [pathname]);

  return null;
}
