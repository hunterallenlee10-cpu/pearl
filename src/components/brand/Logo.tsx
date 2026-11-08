// The logo as a cached SVG file: tiny HTML, nothing added to the JS bundle.
// For animating the wheat sprig on its own, use LogoInline (inline SVG with a separate sprig group).
export type LogoTone = "crust" | "cream";

const SRC: Record<LogoTone, string> = { crust: "/brand/logo.svg", cream: "/brand/logo-cream.svg" };

export function Logo({
  className,
  tone = "crust",
  title = "Pearl Bakery",
}: {
  className?: string;
  tone?: LogoTone;
  /** Accessible name; pass "" when a parent already names the link. */
  title?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG logo, no optimisation needed
    <img src={SRC[tone]} alt={title} width={950} height={588} className={className} decoding="async" />
  );
}
