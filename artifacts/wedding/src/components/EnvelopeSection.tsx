import React, { useRef, useEffect, useState } from "react";
import floralImg from "@assets/generated_images/watercolor_indian_wedding_floral_627e.png";

/**
 * Scroll-driven envelope section.
 * The section is 280vh tall so the user "scrolls through" it.
 * Inside there's a sticky viewport that pins while the scroll
 * drives the letter upward and reveals content line-by-line.
 */
export function EnvelopeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 → 1

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalScrollable = el.offsetHeight - window.innerHeight;
      // How far we've scrolled into this section (clamp 0→1)
      const scrolled = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      setProgress(scrolled);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Derived values from progress
  const flapAngle       = Math.min(1, progress / 0.25) * 180;          // 0→180° while p=0→0.25
  const letterRise      = Math.max(0, (progress - 0.15) / 0.6);        // 0→1 while p=0.15→0.75
  const letterY         = -letterRise * 118;                            // % upward (out of envelope)
  const letterOpacity   = Math.min(1, letterRise * 2);

  // Content blocks fade in sequentially
  const blockProgress   = Math.max(0, (progress - 0.35) / 0.55);       // 0→1 while p=0.35→0.90
  const block1Opacity   = Math.min(1, blockProgress * 4);
  const block2Opacity   = Math.min(1, Math.max(0, blockProgress - 0.3) * 4);
  const block3Opacity   = Math.min(1, Math.max(0, blockProgress - 0.6) * 4);
  const block3Y         = Math.max(0, 1 - Math.max(0, blockProgress - 0.6) * 5) * 10;

  return (
    /* Tall section — the scroll happens here */
    <div ref={sectionRef} style={{ height: "280vh", position: "relative" }}>
      {/* Sticky viewport */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
           className="flex flex-col items-center justify-center bg-[#FAF7F2]">

        {/* Soft radial background glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(201,168,76,0.07) 0%, transparent 70%)" }} />

        {/* Section label — fades out as letter rises */}
        <div className="absolute top-12 left-0 right-0 text-center pointer-events-none"
          style={{ opacity: Math.max(0, 1 - progress * 5), transition: "opacity 0.1s" }}>
          <p className="font-sans uppercase text-foreground/30" style={{ fontSize: "0.6rem", letterSpacing: "0.3em" }}>
            A personal note
          </p>
          <h2 className="font-script text-primary mt-1" style={{ fontSize: "clamp(2.2rem,8vw,3rem)" }}>
            You're Invited
          </h2>
        </div>

        {/* Envelope + Letter */}
        <div className="relative" style={{ width: "min(300px,84vw)", perspective: "1000px" }}>

          {/* ── LETTER CARD ─────────────────────────────── */}
          <div
            className="absolute left-2 right-2 z-20 rounded"
            style={{
              bottom: "14%",
              top: "10%",
              transform: `translateY(${letterY}%)`,
              opacity: Math.max(0.01, letterOpacity),
              transition: "none",
              background: "linear-gradient(168deg, #FFFEF9 0%, #FAF5E8 100%)",
              border: "1px solid rgba(201,168,76,0.28)",
              boxShadow: letterRise > 0.05
                ? `0 ${8 + letterRise * 24}px ${20 + letterRise * 40}px rgba(44,24,16,${0.08 + letterRise * 0.12})`
                : "none",
              padding: "20px 18px 18px",
              overflow: "hidden",
            }}
          >
            {/* Thin inset gold border */}
            <div className="absolute inset-2.5 border border-primary/12 rounded-sm pointer-events-none" />

            {/* Corner florals */}
            <img src={floralImg} alt="" className="absolute top-1 left-1 w-9 h-9 object-contain opacity-55"
              style={{ transform: "rotate(-12deg)" }} />
            <img src={floralImg} alt="" className="absolute top-1 right-1 w-9 h-9 object-contain opacity-55"
              style={{ transform: "rotate(12deg) scaleX(-1)" }} />

            {/* Block 1 — Greeting */}
            <div style={{ opacity: block1Opacity, transform: `translateY(${(1-block1Opacity)*8}px)`, transition: "none" }}
                 className="text-center pt-5">
              <h3 className="font-script text-primary" style={{ fontSize: "clamp(1.5rem,5.5vw,2rem)" }}>
                Dear Friends &amp; Family,
              </h3>
              <div className="h-px w-14 bg-primary/20 mx-auto mt-2" />
            </div>

            {/* Block 2 — Body text */}
            <div style={{ opacity: block2Opacity, transform: `translateY(${(1-block2Opacity)*8}px)`, transition: "none" }}
                 className="mt-4 text-center">
              <p className="font-serif text-foreground/72 leading-relaxed" style={{ fontSize: "clamp(0.75rem,2.8vw,0.88rem)" }}>
                With immense joy and gratitude, we solicit your gracious presence and blessings as we celebrate this beautiful occasion with our families and loved ones.
              </p>
              <p className="font-serif text-foreground/72 leading-relaxed mt-2.5" style={{ fontSize: "clamp(0.75rem,2.8vw,0.88rem)" }}>
                Your love, laughter and blessings will make these moments even more special, and we look forward to creating memories together.
              </p>
            </div>

            {/* Block 3 — Signature */}
            <div style={{ opacity: block3Opacity, transform: `translateY(${block3Y}px)`, transition: "none" }}
                 className="mt-4 text-center">
              <span className="font-serif italic text-foreground/38" style={{ fontSize: "0.78rem" }}>
                With all our love,
              </span>
              <h4 className="font-script text-primary mt-0.5" style={{ fontSize: "clamp(1.5rem,5.5vw,2rem)" }}>
                Rahul &amp; Taruna
              </h4>
            </div>
          </div>

          {/* ── ENVELOPE BODY ───────────────────────────── */}
          <div
            className="relative"
            style={{
              width: "100%",
              aspectRatio: "4/3.2",
              borderRadius: 4,
              background: "linear-gradient(170deg,#EDE5D0 0%,#DDD0B0 100%)",
              border: "1px solid rgba(201,168,76,0.35)",
              boxShadow: "0 16px 56px rgba(44,24,16,0.2), 0 4px 12px rgba(44,24,16,0.10)",
              overflow: "visible",
            }}
          >
            {/* Inside fold patterns */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none"
                 style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:1,pointerEvents:"none" }}>
              <path d="M0,100 L50,58 L100,100 Z" fill="#D5C8A0" />
              <path d="M0,0 L50,58 L100,0 Z"   fill="#E5D9B8" />
            </svg>

            {/* ── FLAP ─────────────────────────────────── */}
            <div
              style={{
                position: "absolute", top: 0, left: 0,
                width: "100%", height: "52%",
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
                transform: `rotateX(${flapAngle}deg)`,
                zIndex: flapAngle > 90 ? 0 : 30,
              }}
            >
              {/* Front face */}
              <div style={{ position:"absolute",inset:0,backfaceVisibility:"hidden" }}>
                <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ width:"100%",height:"100%",display:"block" }}>
                  <defs>
                    <linearGradient id="flap-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%"   stopColor="#C8A455"/>
                      <stop offset="100%" stopColor="#A88030"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,0 L50,48 L100,0 Z" fill="url(#flap-grad)" />
                  <path d="M0,0 L50,48 L100,0 Z" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="0.4" />
                </svg>
                {/* Wax seal */}
                <div style={{
                  position:"absolute",bottom:2,left:"50%",
                  transform:"translate(-50%,40%)",
                  width:36,height:36,borderRadius:"50%",
                  background:"radial-gradient(circle at 38% 35%,#C0392B,#7B0E0E)",
                  boxShadow:"0 2px 10px rgba(139,26,26,0.55), inset 0 1px 0 rgba(255,150,150,0.2)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  zIndex:5,
                }}>
                  <span style={{ color:"rgba(255,220,180,0.95)",fontSize:13,fontFamily:"'Great Vibes',cursive" }}>R</span>
                </div>
              </div>
              {/* Back (inside of flap) */}
              <div style={{ position:"absolute",inset:0,backfaceVisibility:"hidden",transform:"rotateX(180deg)" }}>
                <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ width:"100%",height:"100%",display:"block" }}>
                  <path d="M0,0 L50,48 L100,0 Z" fill="#D8CBA5" />
                </svg>
              </div>
            </div>

            {/* Front face covers letter bottom */}
            <div style={{
              position:"absolute",inset:0,zIndex:31,pointerEvents:"none",overflow:"hidden",borderRadius:4,
            }}>
              <svg viewBox="0 0 100 120" preserveAspectRatio="none"
                   style={{ width:"100%",height:"100%",display:"block" }}>
                <path d="M0,48 L50,90 L100,48 L100,120 L0,120 Z" fill="#E8DCB8" />
              </svg>
            </div>
          </div>
        </div>

        {/* Scroll progress hint */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none"
          style={{ opacity: Math.max(0, 1 - progress * 3), transition: "opacity 0.2s" }}>
          <p className="font-sans text-foreground/25 uppercase" style={{ fontSize: "0.55rem", letterSpacing: "0.28em" }}>
            Scroll to open
          </p>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path d="M8 4 L8 20 M3 15 L8 20 L13 15" stroke="rgba(180,140,60,0.35)" strokeWidth="1.2"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Progress bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/8">
          <div className="h-full bg-primary/30 transition-none" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
