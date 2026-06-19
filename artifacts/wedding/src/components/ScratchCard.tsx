import React, { useRef, useEffect, useState } from "react";

const SPARKLE_COUNT = 16;

function Sparkles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: SPARKLE_COUNT }).map((_, i) => {
        const angle = (i / SPARKLE_COUNT) * 360;
        const dist = 30 + Math.random() * 40;
        const x = 50 + Math.cos((angle * Math.PI) / 180) * dist;
        const y = 50 + Math.sin((angle * Math.PI) / 180) * dist;
        const size = 4 + Math.random() * 6;
        return (
          <div
            key={i}
            className="sparkle absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              background: i % 3 === 0 ? "#C9A84C" : i % 3 === 1 ? "#F5C5A3" : "#E8C4B8",
              animationDelay: `${i * 0.06}s`,
              animationDuration: `${0.8 + Math.random() * 0.4}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export function ScratchCard() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scratchingRef = useRef(false);
  const lastPos       = useRef({ x: 0, y: 0 });
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPct, setScratchPct] = useState(0);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isRevealed) return;

    const ctx  = canvas.getContext("2d")!;
    const rect = container.getBoundingClientRect();
    const dpr  = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = rect.height;

    // Set canvas dimensions scaled by devicePixelRatio for sharp rendering on retina screens
    canvas.width  = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width  = `${width}px`;
    canvas.style.height = `${height}px`;

    // Scale drawing context to match screen coordinates
    ctx.scale(dpr, dpr);

    // Gold gradient layer
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0,   "#A87520");
    grad.addColorStop(0.3, "#F5D78E");
    grad.addColorStop(0.55,"#C9A84C");
    grad.addColorStop(0.8, "#F0C060");
    grad.addColorStop(1,   "#8B6010");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle grid texture
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth   = 0.5;
    for (let x = 0; x < width; x += 12) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 12) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Instruction text
    ctx.font      = "bold 14px Montserrat, sans-serif";
    ctx.fillStyle = "rgba(85,0,0,0.85)"; // Rich, high-visibility Maroon
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦  Scratch to Reveal  ✦", width / 2, height / 2);

    // Scratch mode
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineJoin = "round";
    ctx.lineCap  = "round";
    ctx.lineWidth = 50; // Solid, strong scratching stroke width
    ctx.strokeStyle = "black";

    const getPos = (e: MouseEvent | TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      const cx = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const cy = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      return { x: cx - r.left, y: cy - r.top };
    };

    // Fast, sampled pixel opacity checking to guarantee 60fps dragging on mobile
    const checkReveal = () => {
      const imgWidth  = canvas.width;
      const imgHeight = canvas.height;
      const data = ctx.getImageData(0, 0, imgWidth, imgHeight).data;
      let cleared = 0;
      let total = 0;

      // Sample every 4th pixel to avoid costly CPU iterations on high-DPI screens
      for (let y = 0; y < imgHeight; y += 4) {
        for (let x = 0; x < imgWidth; x += 4) {
          const idx = (y * imgWidth + x) * 4;
          total++;
          if (data[idx + 3] < 128) cleared++;
        }
      }

      const pct = (cleared / total) * 100;
      setScratchPct(pct);
      if (pct >= 45) setIsRevealed(true);
    };

    const onStart = (e: MouseEvent | TouchEvent) => {
      scratchingRef.current = true;
      const p = getPos(e);
      lastPos.current = p;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!scratchingRef.current) return;
      e.preventDefault();
      const p = getPos(e);
      ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      lastPos.current = p;
      checkReveal();
    };
    const onEnd = () => { scratchingRef.current = false; checkReveal(); };

    canvas.addEventListener("mousedown", onStart);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchstart", onStart, { passive: false });
    canvas.addEventListener("touchmove",  onMove,  { passive: false });
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchend", onEnd);

    return () => {
      canvas.removeEventListener("mousedown", onStart);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchstart", onStart);
      canvas.removeEventListener("touchmove",  onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isRevealed]);

  return (
    <div className="flex flex-col items-center gap-6 px-6 w-full max-w-sm mx-auto">
      {/* Section label */}
      <div className="text-center">
        <p className="font-sans uppercase text-foreground/75" style={{ fontSize: "12px", letterSpacing: "0.25em" }}>
          A little secret for you
        </p>
        <h2
          className="font-script text-primary mt-1"
          style={{ fontSize: "clamp(2rem,8vw,2.8rem)" }}
        >
          Scratch to Discover
        </h2>
      </div>

      {/* Card */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          aspectRatio: "3/2",
          background: "linear-gradient(135deg,#fdf8f0 0%,#fff8ec 100%)",
          boxShadow: "0 8px 40px rgba(201,168,76,0.2), 0 2px 8px rgba(44,24,16,0.08)",
          border: "1px solid rgba(201,168,76,0.25)",
        }}
      >
        {/* Revealed content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6"
          style={{ opacity: 1 }}
        >
          <p className="font-sans uppercase text-primary/85" style={{ fontSize: "12px", letterSpacing: "0.2em" }}>
            Save the date
          </p>
          <h3 className="font-script text-primary text-gold-shimmer" style={{ fontSize: "clamp(2rem,8vw,2.6rem)" }}>
            5th &amp; 6th July 2026
          </h3>
          <p className="font-serif italic text-foreground/85" style={{ fontSize: "clamp(1rem,4vw,1.3rem)" }}>
            Rahul weds Taruna
          </p>
          <p className="font-sans text-foreground/75 uppercase" style={{ fontSize: "12px", letterSpacing: "0.15em", marginTop: 2 }}>
            Sterling Resort · Puri, Odisha
          </p>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 touch-none cursor-pointer"
          style={{
            opacity: isRevealed ? 0 : 1,
            pointerEvents: isRevealed ? "none" : "auto",
            display: isRevealed ? "none" : "block",
          }}
        />

        {/* Sparkle burst on reveal */}
        {isRevealed && <Sparkles />}
      </div>

      {/* Progress hint */}
      {!isRevealed && scratchPct > 2 && scratchPct < 45 && (
        <p className="font-sans text-foreground/75 text-center" style={{ fontSize: "12px", letterSpacing: "0.15em" }}>
          Keep scratching…
        </p>
      )}

    </div>
  );
}
