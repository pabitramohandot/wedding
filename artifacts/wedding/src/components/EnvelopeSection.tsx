import React, { useRef, useEffect } from "react";

/**
 * Scroll-driven envelope.
 * Uses requestAnimationFrame + direct style mutation (no setState) for
 * true 60fps without React re-renders, immune to iframe/overflow issues.
 *
 * Parent <section> in Home.tsx must NOT have overflow:hidden/auto.
 */
export function EnvelopeSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  // animated element refs
  const flapRef     = useRef<HTMLDivElement>(null);
  const letterRef   = useRef<HTMLDivElement>(null);
  const hintRef     = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const g1Ref       = useRef<HTMLDivElement>(null);
  const g2Ref       = useRef<HTMLDivElement>(null);
  const g3Ref       = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const insideFoldsRef = useRef<HTMLDivElement>(null);
  const rafId       = useRef(0);

  useEffect(() => {
    const tick = () => {
      const section = sectionRef.current;
      if (section) {
        const rect        = section.getBoundingClientRect();
        const scrollable  = section.offsetHeight - window.innerHeight;
        const p           = scrollable > 0
          ? Math.max(0, Math.min(1, -rect.top / scrollable))
          : 0;

        // Flap angle: 0→180° during p 0→0.25
        const flapAngle   = Math.min(180, (p / 0.25) * 180);
        
        // Scale top border-radius of the envelope body from 16px (closed) to 0px (open)
        // as the flap rotates from 0 to 90 degrees.
        const radiusPercent = Math.max(0, 1 - (flapAngle / 90));
        const topRadius     = radiusPercent * 16;
        
        // Letter rise: 0→1 during p 0.15→0.75
        const letterRise  = Math.max(0, Math.min(1, (p - 0.15) / 0.60));
        const letterY     = -letterRise * 115;
        const letterOpacity = Math.min(1, letterRise * 2.5);
        const shadow      = letterRise > 0.05
          ? `0 ${8 + letterRise * 28}px ${20 + letterRise * 44}px rgba(44,24,16,${(0.08 + letterRise * 0.14).toFixed(2)})`
          : "none";

        // Content blocks 0→1 during p 0.35→0.90
        const cp  = Math.max(0, (p - 0.35) / 0.55);
        const g1  = Math.min(1, cp * 4);
        const g2  = Math.min(1, Math.max(0, cp - 0.30) * 4);
        const g3  = Math.min(1, Math.max(0, cp - 0.62) * 4);

        const hintOp  = Math.max(0, 1 - p * 4);
        const titleOp = Math.max(0, 1 - p * 6);

        // Apply directly to DOM
        if (flapRef.current) {
          flapRef.current.style.transform = `rotateX(${flapAngle}deg)`;
          flapRef.current.style.zIndex    = flapAngle > 90 ? "0" : "30";
        }
        if (letterRef.current) {
          letterRef.current.style.transform = `translateY(${letterY}%)`;
          letterRef.current.style.opacity   = String(Math.max(0.01, letterOpacity));
          letterRef.current.style.boxShadow = shadow;
        }
        if (hintRef.current)     hintRef.current.style.opacity     = String(hintOp);
        if (titleRef.current)    titleRef.current.style.opacity     = String(titleOp);
        if (progressRef.current) progressRef.current.style.width    = `${p * 100}%`;
        if (g1Ref.current) {
          g1Ref.current.style.opacity   = String(g1);
          g1Ref.current.style.transform = `translateY(${(1 - g1) * 8}px)`;
        }
        if (g2Ref.current) {
          g2Ref.current.style.opacity   = String(g2);
          g2Ref.current.style.transform = `translateY(${(1 - g2) * 8}px)`;
        }
        if (g3Ref.current) {
          g3Ref.current.style.opacity   = String(g3);
          g3Ref.current.style.transform = `translateY(${(1 - g3) * 10}px)`;
        }
        if (envelopeRef.current) {
          envelopeRef.current.style.borderTopLeftRadius  = `${topRadius}px`;
          envelopeRef.current.style.borderTopRightRadius = `${topRadius}px`;
        }
        if (insideFoldsRef.current) {
          insideFoldsRef.current.style.borderTopLeftRadius  = `${topRadius}px`;
          insideFoldsRef.current.style.borderTopRightRadius = `${topRadius}px`;
        }
      }
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  return (
    /* Tall outer div — user scrolls through this */
    <div ref={sectionRef} style={{ height: "280vh", position: "relative" }}>

      {/* Sticky viewport — pins to top while section scrolls past */}
      <div style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(170deg,#FDFAF3 0%,#F5EDD8 100%)",
      }}>

        {/* Radial glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 55% at 50% 60%, rgba(201,168,76,0.09) 0%, transparent 70%)",
        }}/>

        {/* Section title — fades out as it opens */}
        <div ref={titleRef} style={{
          position: "absolute", top: 40, left: 0, right: 0,
          textAlign: "center", opacity: 1, pointerEvents: "none",
        }}>
          <p className="font-sans uppercase text-primary/85"
            style={{ fontSize: "12px", letterSpacing: "0.3em", fontWeight: 600 }}>
            A Warm Welcome from
          </p>
          <h2 className="font-script text-primary mt-1"
            style={{ fontSize: "clamp(2.2rem,8vw,3rem)" }}>
            Varma Family
          </h2>
        </div>

        {/* Envelope + Letter wrapper */}
        <div style={{ width: "min(300px,84vw)", position: "relative", perspective: "1000px" }}>

          {/* ── LETTER (rises upward on scroll) ─────────── */}
          <div ref={letterRef} style={{
            position: "absolute",
            left: 8, right: 8,
            bottom: "4%", top: "4%",
            zIndex: 20,
            opacity: 0.01,
            transform: "translateY(0%)",
            background: "linear-gradient(168deg,#FFFEF9 0%,#FAF5E8 100%)",
            border: "1.5px solid rgba(201,168,76,0.32)",
            borderRadius: 6,
            boxShadow: "none",
            padding: "14px 14px 10px",
            overflow: "hidden",
          }}>
            {/* Inset gold border */}
            <div style={{
              position: "absolute", inset: 6,
              border: "1.2px solid rgba(201,168,76,0.20)",
              borderRadius: 4, pointerEvents: "none",
            }}/>



            {/* Block 1 — Greeting */}
            <div ref={g1Ref} style={{ opacity:0, transform:"translateY(8px)", textAlign:"center", paddingTop:8 }}>
              <h3 className="font-script text-primary"
                style={{ fontSize:"clamp(1.45rem,5.2vw,1.95rem)" }}>
                Dear Friends &amp; Family,
              </h3>
              <div style={{ height:1, width:52, background:"rgba(201,168,76,0.25)", margin:"4px auto 0" }}/>
            </div>

            {/* Block 2 — Body */}
            <div ref={g2Ref} style={{ opacity:0, transform:"translateY(8px)", textAlign:"center", marginTop:8 }}>
              <p className="font-serif text-foreground/90 leading-relaxed font-medium"
                style={{ fontSize:"clamp(0.85rem,2.9vw,0.95rem)" }}>
                With immense joy and gratitude, we solicit your gracious presence and blessings as
                we celebrate this beautiful occasion with our families and loved ones.
              </p>
              <p className="font-serif text-foreground/90 leading-relaxed font-medium"
                style={{ fontSize:"clamp(0.85rem,2.9vw,0.95rem)", marginTop:6 }}>
                Your love, laughter and blessings will make these moments even more special,
                and we look forward to creating memories together.
              </p>
            </div>

            {/* Block 3 — Signature */}
            <div ref={g3Ref} style={{ opacity:0, transform:"translateY(10px)", textAlign:"center", marginTop:6 }}>
              <span className="font-serif italic text-foreground/75 font-semibold"
                style={{ fontSize:"13px" }}>
                With all our love,
              </span>
              <h4 className="font-script text-primary"
                style={{ fontSize:"clamp(1.45rem,5.2vw,1.95rem)", marginTop:1 }}>
                Rahul &amp; Taruna
              </h4>
            </div>
          </div>

          {/* ── ENVELOPE ─────────────────────────────────── */}
          <div
            ref={envelopeRef}
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4/3.5",
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              background: "linear-gradient(170deg,#330000 0%,#220000 100%)",
              border: "1px solid rgba(201,168,76,0.35)",
              boxShadow: "0 16px 56px rgba(44,24,16,0.22), 0 4px 12px rgba(44,24,16,0.10)",
              overflow: "visible",
            }}
          >
            {/* Inside V-folds */}
            <div
              ref={insideFoldsRef}
              style={{
                position: "absolute",
                inset: 0,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                overflow: "hidden",
                zIndex: 1,
                pointerEvents: "none",
              }}
            >
              <svg viewBox="0 0 100 100" preserveAspectRatio="none"
                style={{ width:"100%",height:"100%",display:"block" }}>
                <path d="M0,100 L50,58 L100,100 Z" fill="#3D0000"/>
                <path d="M0,0 L50,58 L100,0 Z"    fill="#330000"/>
              </svg>
            </div>

            {/* Flap — rotates open on scroll */}
            <div ref={flapRef} style={{
              position: "absolute", top:0, left:0,
              width: "100%", height: "52%",
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              transform: "rotateX(0deg)",
              zIndex: 30,
            }}>
              {/* Front face */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  overflow: "hidden",
                }}
              >
                <svg viewBox="0 0 100 50" preserveAspectRatio="none"
                  style={{ width:"100%",height:"100%",display:"block" }}>
                  <defs>
                    <linearGradient id="flapGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%"   stopColor="#550000"/>
                      <stop offset="100%" stopColor="#3C0000"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,0 L50,48 L100,0 Z" fill="url(#flapGrad)"/>
                  <path d="M2,0 L50,45.5 L98,0" fill="none"
                    stroke="#D4B76C" strokeWidth="0.65" strokeLinecap="round"/>
                </svg>
                {/* Wax seal */}
                <div style={{
                  position:"absolute", bottom:2, left:"50%",
                  transform:"translate(-50%,40%)",
                  width:36, height:36, borderRadius:"50%",
                  background:"radial-gradient(circle at 38% 35%,#C0392B,#7B0E0E)",
                  boxShadow:"0 2px 10px rgba(139,26,26,0.55),inset 0 1px 0 rgba(255,150,150,0.2)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  zIndex:5,
                }}>
                  <span style={{
                    color:"rgba(255,220,180,0.95)", fontSize:12.5,
                    fontFamily:"'Great Vibes',cursive",
                    letterSpacing: "-0.02em",
                  }}>TR</span>
                </div>
              </div>
              {/* Back face */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  transform: "rotateX(180deg)",
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                  overflow: "hidden",
                }}
              >
                <svg viewBox="0 0 100 50" preserveAspectRatio="none"
                  style={{ width:"100%",height:"100%",display:"block" }}>
                  <path d="M0,50 L50,0 L100,50 Z" fill="#440000"/>
                  <path d="M2,50 L50,3 L98,50" fill="none"
                    stroke="#D4B76C" strokeWidth="0.5" />
                </svg>
              </div>
            </div>

            {/* Front panel (covers bottom of letter while inside envelope) */}
            <div style={{
              position:"absolute", inset:0, zIndex:31,
              pointerEvents:"none", overflow:"hidden",
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
            }}>
              <svg viewBox="0 0 100 120" preserveAspectRatio="none"
                style={{ width:"100%",height:"100%",display:"block" }}>
                <path d="M0,48 L50,90 L100,48 L100,120 L0,120 Z" fill="#4A0000"/>
                <path d="M0,48 L50,90 L100,48" fill="none"
                  stroke="#D4B76C" strokeWidth="0.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div ref={hintRef} style={{
          position:"absolute", bottom:28, left:0, right:0,
          display:"flex", flexDirection:"column", alignItems:"center", gap:6,
          opacity:1, pointerEvents:"none",
        }}>
          <p className="font-sans uppercase text-primary/85"
            style={{ fontSize:"12px", letterSpacing:"0.28em", fontWeight: 600 }}>
            Scroll to open
          </p>
          <svg width="16" height="22" viewBox="0 0 16 22" fill="none">
            <path d="M8 3 L8 19 M3 14 L8 19 L13 14"
              stroke="rgba(180,140,60,0.4)" strokeWidth="1.2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Progress bar */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0,
          height:2, background:"rgba(201,168,76,0.08)",
        }}>
          <div ref={progressRef} style={{
            height:"100%", width:"0%",
            background:"rgba(201,168,76,0.4)",
          }}/>
        </div>

      </div>
    </div>
  );
}
