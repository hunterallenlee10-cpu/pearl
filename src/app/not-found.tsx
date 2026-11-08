import Link from "next/link";

export const metadata = { title: "This one sold out" };

export default function NotFound() {
  return (
    <section className="bg-flour grid min-h-[100svh] place-items-center px-[var(--gutter)] pt-[var(--nav-h)] pb-16 text-center">
      <div>
        {/* an empty bread basket with a little "sold out" tag */}
        <svg viewBox="0 0 260 180" className="text-crust mx-auto w-64 md:w-80" aria-hidden>
          <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M30 80h200l-22 82H52z" fill="#F3EADB" />
            <path d="M44 100h172M50 120h160M56 140h148" strokeOpacity=".35" />
            <path d="M80 80v80M110 80v82M140 80v82M170 80v80M200 80l-6 80" strokeOpacity=".35" />
            <path d="M24 80h212" strokeWidth="5" />
            <path d="M70 80c0-44 120-44 120 0" />
            <circle cx="104" cy="66" r="3" fill="#C99A5B" stroke="none" />
            <circle cx="150" cy="60" r="2" fill="#C99A5B" stroke="none" />
            <circle cx="128" cy="70" r="2.5" fill="#C99A5B" stroke="none" />
          </g>
          <g transform="rotate(-12 214 52)">
            <path d="M190 36h52l8 16-8 16h-52z" fill="#2A1B12" />
            <circle cx="197" cy="52" r="3" fill="#FBF6EE" />
            <text
              x="206"
              y="57"
              fill="#FBF6EE"
              fontFamily="var(--font-hand), cursive"
              fontSize="15"
              fontWeight="700"
            >
              sold out
            </text>
          </g>
        </svg>
        <p className="eyebrow text-wheat-ink mt-10">404</p>
        <h1 className="display-lg mt-3">This one sold out.</h1>
        <p className="text-crust-soft mx-auto mt-5 max-w-md text-lg">
          The page you&rsquo;re after isn&rsquo;t on the shelf. There&rsquo;s fresh bread back at the start,
          though.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Back to the bakery
          </Link>
          <Link href="/menu" className="btn btn-secondary">
            This weekend&rsquo;s menu
          </Link>
        </div>
      </div>
    </section>
  );
}
