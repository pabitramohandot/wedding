import React, { useRef, useEffect, useState } from "react";
import floralImg from "@assets/generated_images/watercolor_indian_wedding_floral_627e.png";

export function EnvelopeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<"closed" | "opening" | "open">("closed");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setStage("opening"), 400);
          setTimeout(() => setStage("open"),    1400);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="py-24 px-6 flex flex-col items-center min-h-[85vh] justify-center overflow-hidden"
    >
      {/* Section label */}
      <div className="text-center mb-10">
        <p className="font-sans uppercase text-foreground/30" style={{ fontSize: "0.6rem", letterSpacing: "0.3em" }}>
          A personal note
        </p>
        <h2 className="font-script text-primary mt-1" style={{ fontSize: "clamp(2.4rem,9vw,3.2rem)" }}>
          You're Invited
        </h2>
      </div>

      {/* Envelope */}
      <div
        className="relative mx-auto"
        style={{ width: "min(320px, 85vw)", perspective: "900px" }}
      >
        {/* Letter card — slides up out of envelope */}
        <div
          className="absolute left-3 right-3 z-20 rounded-sm"
          style={{
            bottom: "15%",
            top: "12%",
            background: "linear-gradient(170deg, #FFFDF8 0%, #FAF6EC 100%)",
            border: "1px solid rgba(201,168,76,0.3)",
            boxShadow: "0 4px 24px rgba(44,24,16,0.12)",
            transform: stage === "open" ? "translateY(-105%)" : "translateY(0)",
            opacity: stage === "closed" ? 0 : 1,
            transition: "transform 1.1s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease",
            padding: "24px 20px",
          }}
        >
          {/* Corner florals */}
          <img src={floralImg} alt="" className="absolute top-2 left-2 w-10 h-10 object-contain opacity-50"
            style={{ transform: "rotate(-15deg)" }} />
          <img src={floralImg} alt="" className="absolute top-2 right-2 w-10 h-10 object-contain opacity-50"
            style={{ transform: "rotate(15deg) scaleX(-1)" }} />
          <img src={floralImg} alt="" className="absolute bottom-2 left-2 w-8 h-8 object-contain opacity-30"
            style={{ transform: "rotate(15deg) scaleY(-1)" }} />
          <img src={floralImg} alt="" className="absolute bottom-2 right-2 w-8 h-8 object-contain opacity-30"
            style={{ transform: "rotate(-15deg) scale(-1)" }} />

          {/* Thin gold border inset */}
          <div className="absolute inset-3 border border-primary/15 pointer-events-none rounded-sm" />

          <div className="flex flex-col items-center text-center gap-3 pt-4 pb-2">
            <h3 className="font-script text-primary" style={{ fontSize: "clamp(1.6rem,6vw,2.2rem)" }}>
              Dear Friends &amp; Family,
            </h3>
            <div className="h-px w-16 bg-primary/20" />
            <p className="font-serif text-foreground/75 leading-relaxed" style={{ fontSize: "clamp(0.8rem,3.2vw,0.95rem)" }}>
              With immense joy and gratitude, we solicit your gracious presence and blessings as we celebrate this beautiful occasion with our families and loved ones.
            </p>
            <p className="font-serif text-foreground/75 leading-relaxed" style={{ fontSize: "clamp(0.8rem,3.2vw,0.95rem)" }}>
              Your love, laughter and blessings will make these moments even more special, and we look forward to creating memories together.
            </p>
            <div className="mt-2">
              <span className="font-serif italic text-foreground/40" style={{ fontSize: "0.8rem" }}>With all our love,</span>
              <h4 className="font-script text-primary" style={{ fontSize: "clamp(1.6rem,6vw,2.2rem)" }}>
                Rahul &amp; Taruna
              </h4>
            </div>
          </div>
        </div>

        {/* Envelope body */}
        <div
          className="relative"
          style={{
            width: "100%",
            aspectRatio: "4/3",
            background: "linear-gradient(170deg, #EDE5D0 0%, #E0D4B8 100%)",
            borderRadius: 4,
            boxShadow: "0 12px 48px rgba(44,24,16,0.18)",
            border: "1px solid rgba(201,168,76,0.35)",
            overflow: "visible",
          }}
        >
          {/* Envelope flap */}
          <div
            style={{
              position: "absolute",
              top: 0, left: 0,
              width: "100%",
              height: "50%",
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              transform: stage === "opening" || stage === "open"
                ? "rotateX(180deg)"
                : "rotateX(0deg)",
              transition: "transform 1s cubic-bezier(0.4,0,0.2,1)",
              zIndex: stage === "open" ? 0 : 30,
            }}
          >
            {/* Front face of flap */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
              <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
                <path d="M0,0 L50,48 L100,0 Z" fill="#C9A66A" />
                <path d="M0,0 L50,48 L100,0 Z" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="0.5" />
              </svg>
              {/* Wax seal */}
              <div
                style={{
                  position: "absolute",
                  bottom: 2, left: "50%",
                  transform: "translate(-50%, 40%)",
                  width: 34, height: 34,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #C0392B, #8B1A1A)",
                  boxShadow: "0 2px 8px rgba(139,26,26,0.5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  zIndex: 5,
                }}
              >
                <span style={{ color: "rgba(255,220,180,0.9)", fontSize: 12, fontFamily: "Great Vibes, cursive" }}>R</span>
              </div>
            </div>
            {/* Back face of flap (inside) */}
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}>
              <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
                <path d="M0,0 L50,48 L100,0 Z" fill="#D4C098" />
              </svg>
            </div>
          </div>

          {/* Inside bottom V fold */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}
          >
            <path d="M0,100 L50,55 L100,100 Z" fill="#D8CCA8" />
            <path d="M0,0 L50,55 L100,0 Z" fill="#E0D4B8" />
          </svg>
        </div>
      </div>

      {/* Hint text */}
      {stage === "closed" && (
        <p className="font-sans text-foreground/25 text-center mt-8" style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Scroll to open
        </p>
      )}
    </div>
  );
}
