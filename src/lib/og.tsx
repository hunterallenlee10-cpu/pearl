import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const ogSize = { width: 1200, height: 630 };

/** Shared social preview: a real photo, a warm gradient, the cream logo and a headline. */
export async function renderOg({ photo, title, sub }: { photo: string; title: string; sub: string }) {
  const [img, logo, fraunces, instrument] = await Promise.all([
    readFile(path.join(process.cwd(), "public", "og", `${photo}.jpg`)),
    readFile(path.join(process.cwd(), "public", "og", "logo-cream.png")),
    readFile(path.join(process.cwd(), "src", "assets", "fonts", "Fraunces-SemiBold.ttf")),
    readFile(path.join(process.cwd(), "src", "assets", "fonts", "InstrumentSans-Medium.ttf")),
  ]);
  const src = (b: Buffer, type: string) => `data:${type};base64,${b.toString("base64")}`;
  return new ImageResponse(
    <div
      style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#2A1B12" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src(img, "image/jpeg")}
        width={1200}
        height={630}
        alt=""
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          background:
            "linear-gradient(90deg, rgba(42,27,18,.88) 0%, rgba(42,27,18,.6) 45%, rgba(42,27,18,0) 75%)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          width: 720,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src(logo, "image/png")} width={230} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Fraunces",
              fontSize: 70,
              lineHeight: 1,
              color: "#FBF6EE",
              letterSpacing: -1.5,
            }}
          >
            {title}
          </div>
          <div style={{ fontFamily: "Instrument", fontSize: 28, color: "#E9D9BD", marginTop: 22 }}>{sub}</div>
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
        { name: "Instrument", data: instrument, weight: 500, style: "normal" },
      ],
    },
  );
}
