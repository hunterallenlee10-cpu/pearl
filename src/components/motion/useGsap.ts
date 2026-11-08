"use client";
import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { loadGsap, prefersReducedMotion, type Gsap, type ScrollTriggerT } from "./gsap";

type Setup = (ctx: {
  gsap: Gsap;
  ScrollTrigger: ScrollTriggerT;
  reduced: boolean;
  scope: HTMLElement;
}) => void | (() => void);

/**
 * Runs GSAP code scoped to `scope` once GSAP has loaded. Everything created inside is reverted
 * on unmount (gsap.context), so sections stay independent of each other.
 */
export function useGsap(scope: RefObject<HTMLElement | null>, setup: Setup, deps: unknown[] = []) {
  const setupRef = useRef(setup);
  useEffect(() => {
    setupRef.current = setup;
  });

  const revertRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !scope.current) return;
      const el = scope.current;
      let extra: void | (() => void);
      const ctx = gsap.context(() => {
        extra = setupRef.current({ gsap, ScrollTrigger, reduced: prefersReducedMotion(), scope: el });
      }, el);
      revertRef.current = () => {
        if (typeof extra === "function") extra();
        ctx.revert();
      };
    });
    return () => {
      cancelled = true;
      revertRef.current?.();
      revertRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // On unmount, undo pins and wrappers in the layout phase, i.e. *before* React removes the DOM.
  // (Passive-effect cleanup runs after removal, when a pin spacer would already have confused React.)
  useLayoutEffect(
    () => () => {
      revertRef.current?.();
      revertRef.current = null;
    },
    [],
  );
}
