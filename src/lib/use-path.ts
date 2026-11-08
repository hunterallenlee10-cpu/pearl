"use client";
import { usePathname } from "next/navigation";

/**
 * usePathname, normalised. When Vercel re-renders the home page in the background (ISR), the
 * server sees its path as "/index" while the browser sees "/". Anything that renders differently
 * on the home page must use this, or the two disagree and React throws a hydration error.
 */
export function usePath() {
  const p = usePathname();
  return !p || p === "/index" ? "/" : p;
}
