import React, { useState, useEffect, useRef } from "react";

function FlipNumber({ value, label }: { value: number; label: string }) {
  const [displayed, setDisplayed] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (value !== prev.current) {
      setFlipping(true);
      setTimeout(() => {
        setDisplayed(value);
        setFlipping(false);
      }, 180);
      prev.current = value;
    }
  }, [value]);

  const str = displayed.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: 72, height: 88,
          background: "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0.3) 100%)",
          border: "1px solid rgba(201,168,76,0.35)",
          borderRadius: 6,
          boxShadow: "0 0 20px rgba(201,168,76,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Center crease line */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/30 z-10" />
        <span
          className="font-serif text-white tabular-nums"
          style={{
            fontSize: "2.4rem",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            opacity: flipping ? 0 : 1,
            transform: flipping ? "rotateX(-40deg) scale(0.9)" : "rotateX(0deg) scale(1)",
            transition: "opacity 0.18s ease, transform 0.18s ease",
          }}
        >
          {str}
        </span>
      </div>
      <span
        className="font-sans uppercase text-primary/60"
        style={{ fontSize: "0.6rem", letterSpacing: "0.22em", fontWeight: 500 }}
      >
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date("2026-07-05T04:45:00Z").getTime();
    const tick = () => {
      const dist = target - Date.now();
      if (dist <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days:    Math.floor(dist / 86400000),
        hours:   Math.floor((dist % 86400000) / 3600000),
        minutes: Math.floor((dist % 3600000) / 60000),
        seconds: Math.floor((dist % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Label */}
      <div className="text-center">
        <p className="font-sans uppercase text-primary/50" style={{ fontSize: "0.6rem", letterSpacing: "0.3em" }}>
          The celebration begins in
        </p>
      </div>

      {/* Tiles */}
      <div className="flex justify-center gap-4">
        <FlipNumber value={timeLeft.days}    label="Days"    />
        <FlipNumber value={timeLeft.hours}   label="Hours"   />
        <FlipNumber value={timeLeft.minutes} label="Mins"    />
        <FlipNumber value={timeLeft.seconds} label="Secs"    />
      </div>

      {/* Colons */}
      <div className="flex justify-center gap-4 -mt-14 pointer-events-none" aria-hidden>
        {[0,1,2].map(i => (
          <div key={i} className="w-[72px] flex justify-end pr-1 items-center">
            {i < 3 && <span className="font-serif text-primary/40 text-2xl relative" style={{ left: 36 }}>·</span>}
          </div>
        ))}
      </div>

      {/* "Until The Big Day" */}
      <div className="text-center mt-2">
        <h3
          className="font-script text-gold-shimmer"
          style={{ fontSize: "clamp(2.4rem,9vw,3.2rem)", lineHeight: 1 }}
        >
          Until The Big Day
        </h3>
        <p className="font-sans text-white/25 uppercase mt-2" style={{ fontSize: "0.6rem", letterSpacing: "0.25em" }}>
          5th · 6th July 2026 · Sterling Resort, Puri
        </p>
      </div>
    </div>
  );
}
