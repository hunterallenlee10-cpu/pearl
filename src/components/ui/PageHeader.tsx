import type { ReactNode } from "react";

/** Top of an inner page: eyebrow, the page's single <h1>, and an intro line. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden bg-flour pt-[calc(var(--nav-h)+4rem)] pb-14 md:pt-[calc(var(--nav-h)+6rem)] md:pb-20">
      <div className="container-page">
        <p className="eyebrow text-wheat-ink" data-reveal>
          {eyebrow}
        </p>
        <h1 className="display-xl mt-5 max-w-[14ch]" data-reveal style={{ "--reveal-delay": "0.05s" } as React.CSSProperties}>
          {title}
        </h1>
        {intro && (
          <p className="mt-7 max-w-2xl text-xl leading-relaxed text-crust-soft" data-reveal style={{ "--reveal-delay": "0.12s" } as React.CSSProperties}>
            {intro}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
