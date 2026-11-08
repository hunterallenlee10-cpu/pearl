"use client";
import { useEffect, useRef } from "react";

/**
 * Flour dust drifting through a diagonal beam of light. Plain Canvas 2D (~2 KB): ~120 soft
 * motes on desktop, ~60 on phones. Parallax with the pointer (or device tilt where no permission
 * prompt is needed). Pauses when off-screen or the tab is hidden; never runs under reduced motion
 * or Save-Data.
 */
export function FlourParticles({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      nav.connection?.saveData ||
      (nav.deviceMemory && nav.deviceMemory < 2)
    )
      return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const N = mobile ? 60 : 120;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0,
      h = 0;
    type Mote = { x: number; y: number; z: number; r: number; vx: number; vy: number; ph: number };
    let motes: Mote[] = [];
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    // Beam runs from top-left toward bottom-right; most motes live inside it.
    const inBeam = (): [number, number] => {
      const t = Math.random();
      const spread = (Math.random() - 0.5) * 0.5;
      return [(0.05 + t * 0.9 + spread * 0.5) * w, (t * 0.85 - spread * 0.6) * h];
    };
    const spawn = (m?: Mote): Mote => {
      const [x, y] = inBeam();
      const z = Math.random();
      return Object.assign(m ?? ({} as Mote), {
        x,
        y,
        z,
        r: rand(0.6, 2.2) * (0.6 + z),
        vx: rand(0.02, 0.12),
        vy: rand(-0.05, 0.08),
        ph: Math.random() * Math.PI * 2,
      });
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = Array.from({ length: N }, () => spawn());
    };
    resize();

    // a soft sprite, drawn once
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 32;
    const sctx = sprite.getContext("2d")!;
    const g = sctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, "rgba(255,248,234,1)");
    g.addColorStop(0.4, "rgba(255,244,224,.55)");
    g.addColorStop(1, "rgba(255,244,224,0)");
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, 32, 32);

    let px = 0,
      py = 0,
      tx = 0,
      ty = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 30));
      ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    // Only where no permission prompt is required (Android); iOS needs a user gesture, so it stays static.
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: unknown } | undefined;
    if (mobile && DOE && typeof DOE.requestPermission !== "function") {
      window.addEventListener("deviceorientation", onTilt, { passive: true });
    }

    let raf = 0;
    let running = false;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(48, now - last) / 16.67;
      last = now;
      px += (tx - px) * 0.04;
      py += (ty - py) * 0.04;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.ph += 0.012 * dt;
        m.x += (m.vx + Math.sin(m.ph) * 0.08) * dt * (0.5 + m.z);
        m.y += (m.vy + Math.cos(m.ph * 0.7) * 0.05) * dt * (0.5 + m.z);
        if (m.x > w + 20 || m.y > h + 20 || m.y < -20) spawn(m);
        const ox = px * 14 * (m.z + 0.2);
        const oy = py * 10 * (m.z + 0.2);
        // brighter inside the beam's centre line
        const d = Math.abs((m.y / h) * 0.95 - (m.x / w - 0.05)) ;
        const a = Math.max(0, 0.85 - d * 1.4) * (0.35 + m.z * 0.65) * (0.65 + Math.sin(m.ph * 2) * 0.35);
        if (a < 0.02) continue;
        ctx.globalAlpha = a;
        const s = m.r * 4;
        ctx.drawImage(sprite, m.x + ox - s / 2, m.y + oy - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    let onScreen = true;
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen && document.visibilityState === "visible") start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.visibilityState === "visible" && onScreen ? start() : stop());
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    canvas.style.opacity = "1";

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-[2s] ${className}`}
    />
  );
}
