import React, { useEffect, useRef, useState } from "react";
import { ScratchCard } from "@/components/ScratchCard";
import { CountdownTimer } from "@/components/CountdownTimer";
import { EnvelopeSection } from "@/components/EnvelopeSection";
import videoSrc from "@assets/generated_videos/generated_video.mp4";
import floralImg from "@assets/generated_images/watercolor_indian_wedding_floral_627e.png";
import venueImg from "@assets/generated_images/sterling_resort_puri_odisha_85a0.png";

/* ── Floating Petals Background ─────────────────────── */
const PETALS = [
  { left: "8%",  delay: "0s",   dur: "9s",  color: "#D4B76C" },
  { left: "18%", delay: "1.5s", dur: "11s", color: "#E8C4B8" },
  { left: "32%", delay: "3s",   dur: "8s",  color: "#C9A84C" },
  { left: "47%", delay: "0.8s", dur: "13s", color: "#F5C5A3" },
  { left: "61%", delay: "2.2s", dur: "10s", color: "#D4B76C" },
  { left: "75%", delay: "4s",   dur: "7s",  color: "#E8C4B8" },
  { left: "88%", delay: "1s",   dur: "12s", color: "#C9A84C" },
];

function FloatingPetals({ dark = false }: { dark?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PETALS.map((p, i) => (
        <div
          key={i}
          className="petal"
          style={{
            left: p.left,
            bottom: "-20px",
            "--delay": p.delay,
            "--dur": p.dur,
            backgroundColor: dark ? `${p.color}55` : `${p.color}88`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ── FadeIn on scroll ───────────────────────────────── */
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("opacity-100", "translate-y-0");
              entry.target.classList.remove("opacity-0", "translate-y-10");
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out opacity-0 translate-y-10 ${className}`}>
      {children}
    </div>
  );
}

/* ── Gold ornament divider ──────────────────────────── */
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-10 px-8">
      <div className="h-px bg-gradient-to-r from-transparent to-primary/40 flex-1" />
      <div className="w-1.5 h-1.5 bg-primary/60 rotate-45" />
      <div className="w-2.5 h-2.5 border border-primary/60 rotate-45" />
      <div className="w-1.5 h-1.5 bg-primary/60 rotate-45" />
      <div className="h-px bg-gradient-to-l from-transparent to-primary/40 flex-1" />
    </div>
  );
}

/* ── Timeline with alternating left/right + big time ── */
function TimelineDay({ events }: { events: { name: string; time: string }[] }) {
  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: 380 }}>
      {/* Vertical line */}
      <div className="absolute left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent -translate-x-1/2" />
      <div className="space-y-2">
        {events.map((event, i) => (
          <TimelineItem key={i} event={event} isLeft={i % 2 === 0} index={i} />
        ))}
      </div>
    </div>
  );
}

function TimelineItem({ event, isLeft, index }: {
  event: { name: string; time: string };
  isLeft: boolean;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "translateX(0)";
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div className="relative flex items-center" style={{ minHeight: 88 }}>
      {/* Left slot */}
      <div className="w-1/2 pr-7 flex justify-end">
        {isLeft && (
          <div
            ref={ref}
            style={{
              opacity: 0,
              transform: "translateX(-24px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
            className="text-right"
          >
            <p className="font-serif text-[2rem] leading-none text-foreground font-light tracking-tight">
              {event.time}
            </p>
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-primary/70 mt-1 font-medium">
              {event.name}
            </p>
          </div>
        )}
      </div>

      {/* Diamond dot */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10">
        <div className="w-3.5 h-3.5 bg-primary rotate-45 diamond-pulse shadow-sm" />
      </div>

      {/* Right slot */}
      <div className="w-1/2 pl-7 flex justify-start">
        {!isLeft && (
          <div
            ref={ref}
            style={{
              opacity: 0,
              transform: "translateX(24px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
            className="text-left"
          >
            <p className="font-serif text-[2rem] leading-none text-foreground font-light tracking-tight">
              {event.time}
            </p>
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-primary/70 mt-1 font-medium">
              {event.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────── */
export default function Home() {
  return (
    <main className="w-full max-w-[430px] mx-auto bg-background text-foreground" style={{ boxShadow: "0 0 80px rgba(201,168,76,0.08)", overflowX: "clip" }}>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-black">
        <video
          src={videoSrc}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        {/* layered gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <p className="font-sans text-[9px] uppercase tracking-[0.35em] text-white/60 mb-6">Together Forever</p>
          <h1 className="font-script leading-none text-white mb-3" style={{ fontSize: "clamp(3.2rem, 14vw, 5.5rem)", textShadow: "0 2px 40px rgba(0,0,0,0.5)" }}>
            Rahul & Taruna
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="h-px w-10 bg-white/40" />
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/70">5th · 6th July 2026</p>
            <div className="h-px w-10 bg-white/40" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-white/50">Scroll</span>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <rect x="1" y="1" width="10" height="16" rx="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"/>
            <rect x="4.5" y="4" width="3" height="5" rx="1.5" fill="rgba(255,255,255,0.5)">
              <animate attributeName="y" values="4;8;4" dur="1.8s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.8s" repeatCount="indefinite"/>
            </rect>
          </svg>
        </div>
      </section>

      {/* ── NAMES & ANNOUNCEMENT ─────────────────────── */}
      <section className="relative py-20 px-6 text-center bg-background overflow-hidden">
        <FloatingPetals />
        {/* Ghost text background */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden
        >
          <span className="font-script text-[7rem] text-primary/5 whitespace-nowrap leading-none" style={{ fontSize: "clamp(5rem,28vw,9rem)" }}>
            R & T
          </span>
        </div>

        <div className="relative z-10">
          <FadeIn delay={0}>
            <img src={floralImg} alt="" className="w-28 h-28 mx-auto mb-6 object-contain drop-shadow-sm" style={{ filter: "drop-shadow(0 4px 12px rgba(201,168,76,0.25))" }} />
          </FadeIn>
          <FadeIn delay={150}>
            <h2 className="font-script leading-none mb-3 text-gold-shimmer" style={{ fontSize: "clamp(3rem,12vw,5rem)" }}>
              Rahul & Taruna
            </h2>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="font-serif italic text-foreground/70 leading-tight mb-1" style={{ fontSize: "clamp(1.4rem,6vw,2rem)" }}>
              are getting married
            </p>
            <p className="font-serif text-primary" style={{ fontSize: "clamp(1.4rem,6vw,2rem)" }}>!!</p>
          </FadeIn>
          <FadeIn delay={450}>
            <div className="ornament-line mt-6 text-primary/40 text-xs font-sans tracking-[0.2em] uppercase">
              Puri, Odisha
            </div>
          </FadeIn>
        </div>
      </section>

      <GoldDivider />

      {/* ── SCRATCH CARD ─────────────────────────────── */}
      <section className="py-16 bg-[#FAF7F0] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <FadeIn>
          <ScratchCard />
        </FadeIn>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </section>

      <GoldDivider />

      {/* ── ENVELOPE LETTER ──────────────────────────── */}
      {/* NOTE: NO overflow-hidden here — it would break position:sticky inside EnvelopeSection */}
      <section className="bg-[#FAF7F2] relative">
        <EnvelopeSection />
      </section>

      {/* ── COUNTDOWN ────────────────────────────────── */}
      <section className="py-28 px-6 relative overflow-hidden flex justify-center" style={{ background: "linear-gradient(160deg,#1a0e08 0%,#2C1810 50%,#1a0e08 100%)" }}>
        <FloatingPetals dark />
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)" }} />
        {/* Floral watermark */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{ backgroundImage: `url(${floralImg})`, backgroundSize: "180px", backgroundRepeat: "repeat" }}
        />
        <div className="relative z-10 w-full">
          <FadeIn>
            <CountdownTimer />
          </FadeIn>
        </div>
      </section>

      {/* ── EVENT SCHEDULE ───────────────────────────── */}
      <section className="py-24 px-4 bg-background relative overflow-hidden">
        {/* Ghost date bg */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
          <span className="font-serif text-primary/[0.03] leading-none whitespace-nowrap" style={{ fontSize: "clamp(4rem,24vw,8rem)", fontWeight: 300 }}>
            July 2026
          </span>
        </div>

        <div className="relative z-10">
          <FadeIn>
            <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-primary/50 text-center mb-2">Wedding Itinerary</p>
            <h2 className="font-script text-center text-primary mb-1" style={{ fontSize: "clamp(2.8rem,10vw,4rem)" }}>
              Schedule of Events
            </h2>
            <div className="ornament-line text-primary/30 text-[9px] font-sans tracking-[0.2em] uppercase justify-center mt-1 mb-16 px-8">
              5th &amp; 6th July 2026
            </div>
          </FadeIn>

          {/* Day 1 */}
          <FadeIn delay={100}>
            <div className="flex items-center justify-center mb-8">
              <div className="border border-primary/30 rounded-full px-5 py-1.5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary/60 rotate-45" />
                <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-primary/70">Sunday · 5th July 2026</span>
                <div className="w-1.5 h-1.5 bg-primary/60 rotate-45" />
              </div>
            </div>
          </FadeIn>

          <TimelineDay events={[
            { name: "Haldi & Carnival", time: "10:15 AM" },
            { name: "Pool Party",       time: "12:15 PM" },
            { name: "Tilak & Sangeet",  time: "6:15 PM"  },
          ]} />

          {/* Separator */}
          <div className="my-10 flex items-center justify-center gap-3">
            <div className="h-px bg-primary/15 flex-1 max-w-[70px]" />
            <div className="w-2 h-2 border border-primary/40 rotate-45" />
            <div className="w-2.5 h-2.5 bg-primary/20 rotate-45" />
            <div className="w-2 h-2 border border-primary/40 rotate-45" />
            <div className="h-px bg-primary/15 flex-1 max-w-[70px]" />
          </div>

          {/* Day 2 */}
          <FadeIn delay={100}>
            <div className="flex items-center justify-center mb-8">
              <div className="border border-primary/30 rounded-full px-5 py-1.5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary/60 rotate-45" />
                <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-primary/70">Monday · 6th July 2026</span>
                <div className="w-1.5 h-1.5 bg-primary/60 rotate-45" />
              </div>
            </div>
          </FadeIn>

          <TimelineDay events={[
            { name: "Mayra",           time: "10:15 AM"      },
            { name: "Korath & Baraat", time: "6:30 PM"       },
            { name: "Reception",       time: "7:00 PM"       },
            { name: "Phere",           time: "After Midnight" },
          ]} />
        </div>
      </section>

      <GoldDivider />

      {/* ── VENUE ────────────────────────────────────── */}
      <section className="py-16 px-6 bg-background relative overflow-hidden">
        <FloatingPetals />
        <div className="relative z-10">
          <FadeIn>
            <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-primary/50 text-center mb-1">Venue</p>
            <h2 className="font-script text-center text-primary mb-8" style={{ fontSize: "clamp(2.5rem,10vw,3.5rem)" }}>
              Reception Venue
            </h2>
          </FadeIn>

          <FadeIn delay={150}>
            {/* Image with decorative corner lines */}
            <div className="relative mx-auto" style={{ maxWidth: 340 }}>
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl z-10" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr z-10" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl z-10" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br z-10" />
              <div className="overflow-hidden rounded-lg shadow-xl border border-primary/10">
                <img
                  src={venueImg}
                  alt="Sterling Resort, Puri"
                  className="w-full h-60 object-cover"
                  style={{ filter: "contrast(1.05) saturate(1.1)" }}
                />
                {/* Overlay label */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className="bg-black/50 backdrop-blur-sm rounded-full px-5 py-1.5">
                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/90">Sterling Resort · Puri</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="text-center mt-10">
              <h3 className="font-script text-primary mb-1" style={{ fontSize: "clamp(2.8rem,10vw,4rem)" }}>Sterling Resort</h3>
              <p className="font-sans text-xs text-foreground/50 uppercase tracking-[0.25em] mb-8">Puri, Odisha</p>
              <a
                href="https://maps.google.com/?q=Sterling+Resort+Puri+Odisha"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-primary/50 text-primary px-8 py-3 rounded-full font-sans text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-lg"
              >
                <span>📍</span> View on Google Maps
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="relative py-20 px-6 text-center overflow-hidden" style={{ background: "linear-gradient(180deg,#FAF7F2 0%,#F0E8D8 100%)" }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <FloatingPetals />
        <div className="relative z-10 flex flex-col items-center">
          <img src={floralImg} alt="" className="w-16 h-16 object-contain opacity-70 mb-6"
            style={{ filter: "drop-shadow(0 2px 8px rgba(201,168,76,0.3))" }} />
          <h2 className="font-script text-primary mb-2 text-gold-shimmer" style={{ fontSize: "clamp(2.5rem,10vw,3.5rem)" }}>
            Rahul & Taruna
          </h2>
          <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-foreground/40 mb-3">
            5th &amp; 6th July 2026
          </p>
          <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-foreground/30 mb-10">
            Sterling Resort, Puri, Odisha
          </p>
          <div className="flex items-center gap-2 opacity-30">
            <div className="h-px w-8 bg-primary" />
            <div className="w-1 h-1 bg-primary rotate-45" />
            <div className="h-px w-8 bg-primary" />
          </div>
          <p className="font-serif italic text-[11px] text-muted-foreground mt-4">
            Made with ♥ for our special day
          </p>
        </div>
      </footer>

    </main>
  );
}
