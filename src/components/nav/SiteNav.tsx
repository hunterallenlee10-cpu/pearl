"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { StatusPill } from "./StatusPill";
import { MobileMenu } from "./MobileMenu";
import { navLinks } from "./nav-links";

export function SiteNav() {
  const pathname = usePathname();
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setAtTop(y < 24);
        // hide on scroll down, reveal on scroll up (with a little hysteresis)
        if (y > 240 && y > lastY.current + 6) setHidden(true);
        else if (y < lastY.current - 6 || y < 240) setHidden(false);
        lastY.current = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const overHero = pathname === "/" && atTop;
  const solid = !overHero;

  return (
    <>
      <header
        data-nav
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow,color] duration-500 ease-(--ease-dough) ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${
          solid
            ? "bg-flour/82 text-crust shadow-[0_1px_0_rgb(91_58_36/0.08)] backdrop-blur-xl backdrop-saturate-150"
            : "text-flour"
        }`}
      >
        <nav aria-label="Main" className="container-page flex h-(--nav-h) items-center gap-6">
          <Link
            href="/"
            aria-label="Pearl Bakery, home"
            className="-ml-1 shrink-0 rounded-md p-1"
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <Logo className="h-11 w-auto md:h-12" tone={solid ? "crust" : "cream"} title="" />
          </Link>

          <ul className="ml-auto hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className="group relative rounded-full px-4 py-2 font-medium no-underline"
                  >
                    {l.label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-4 bottom-1 h-px origin-left bg-current transition-transform duration-500 ease-(--ease-dough) ${
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="ml-auto hidden sm:block lg:ml-2">
            <StatusPill tone={solid ? "light" : "glass"} />
          </div>

          <button
            type="button"
            className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-medium sm:ml-2 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            Menu
            <span aria-hidden className="flex w-5 flex-col gap-1.25">
              <span className="h-0.5 rounded bg-current" />
              <span className="h-0.5 w-3.5 rounded bg-current" />
            </span>
          </button>
        </nav>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} pathname={pathname} />
    </>
  );
}
