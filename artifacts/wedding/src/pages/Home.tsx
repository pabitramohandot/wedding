import React, { useEffect, useRef } from "react";
import { ScratchCard } from "@/components/ScratchCard";
import { CountdownTimer } from "@/components/CountdownTimer";
import { EnvelopeSection } from "@/components/EnvelopeSection";
import videoSrc from "@assets/generated_videos/generated_video.mp4";
import floralImg from "@assets/generated_images/watercolor_indian_wedding_floral_627e.png";
import venueImg from "@assets/generated_images/sterling_resort_puri_odisha_85a0.png";
import { Flower2 } from "lucide-react";

function Divider() {
  return (
    <div className="w-full flex justify-center items-center py-12 opacity-50">
      <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent w-2/3 max-w-[200px]" />
      <div className="w-2 h-2 rounded-full bg-primary mx-2 rotate-45" />
      <div className="h-px bg-gradient-to-r from-primary via-primary to-transparent w-2/3 max-w-[200px]" />
    </div>
  );
}

function FadeIn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="transition-all duration-1000 ease-out opacity-0 translate-y-8">
      {children}
    </div>
  );
}

function TimelineDay({ events }: { events: { name: string; time: string }[] }) {
  return (
    <div className="relative mx-auto" style={{ maxWidth: 360 }}>
      {/* Center vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/25 -translate-x-1/2" />

      <div className="space-y-0">
        {events.map((event, i) => {
          const isLeft = i % 2 === 0;
          return (
            <TimelineItem key={i} event={event} isLeft={isLeft} index={i} />
          );
        })}
      </div>
    </div>
  );
}

function TimelineItem({ event, isLeft, index }: { event: { name: string; time: string }; isLeft: boolean; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-x-0');
            entry.target.classList.remove('opacity-0', isLeft ? '-translate-x-6' : 'translate-x-6');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isLeft]);

  return (
    <div className="relative flex items-center" style={{ minHeight: 80 }}>
      {/* Left side */}
      <div className="w-1/2 pr-5 flex justify-end">
        {isLeft && (
          <div
            ref={ref}
            className={`text-right transition-all duration-700 opacity-0 ${isLeft ? '-translate-x-6' : 'translate-x-6'}`}
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <p className="font-serif font-semibold text-base text-foreground leading-tight">{event.name}</p>
            <p className="font-sans text-[11px] text-primary/80 uppercase tracking-wider mt-0.5">{event.time}</p>
          </div>
        )}
      </div>

      {/* Center dot */}
      <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-primary bg-background z-10 shadow-sm" />

      {/* Right side */}
      <div className="w-1/2 pl-5 flex justify-start">
        {!isLeft && (
          <div
            ref={ref}
            className={`text-left transition-all duration-700 opacity-0 ${isLeft ? '-translate-x-6' : 'translate-x-6'}`}
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <p className="font-serif font-semibold text-base text-foreground leading-tight">{event.name}</p>
            <p className="font-sans text-[11px] text-primary/80 uppercase tracking-wider mt-0.5">{event.time}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="w-full max-w-[430px] mx-auto bg-background text-foreground shadow-2xl min-h-[100dvh] overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-black">
        <video 
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-background/90" />
        
        <div className="relative z-10 flex flex-col items-center text-center mt-20">
          <h1 className="font-script text-6xl md:text-7xl text-white drop-shadow-lg tracking-wide mb-6">
            Rahul & Taruna
          </h1>
          <div className="flex flex-col items-center mt-32 opacity-80 animate-bounce">
            <span className="text-white text-xs uppercase tracking-widest font-sans mb-2">Scroll to discover</span>
            <div className="w-[1px] h-12 bg-white/50" />
          </div>
        </div>
      </section>

      {/* Names & Announcement */}
      <section className="py-24 px-6 text-center bg-background">
        <FadeIn>
          <img src={floralImg} alt="" className="w-24 h-24 mx-auto mb-8 opacity-90 object-contain" />
          <h2 className="font-script text-5xl md:text-6xl text-primary mb-4 leading-tight">
            Rahul & Taruna
          </h2>
          <p className="font-serif italic text-2xl md:text-3xl text-foreground/80">
            are getting married !!
          </p>
        </FadeIn>
      </section>

      <Divider />

      {/* Scratch Card */}
      <section className="py-16 bg-background">
        <FadeIn>
          <ScratchCard />
        </FadeIn>
      </section>

      <Divider />

      {/* Envelope Letter */}
      <section className="bg-[#FAF7F2] relative">
        <EnvelopeSection />
      </section>

      {/* Countdown Timer */}
      <section className="py-24 px-6 bg-[#2C1810] relative overflow-hidden flex justify-center">
        <div 
          className="absolute inset-0 opacity-10 bg-repeat pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url(${floralImg})`, backgroundSize: '150px' }}
        />
        <div className="relative z-10 w-full">
          <FadeIn>
            <CountdownTimer />
          </FadeIn>
        </div>
      </section>

      {/* Event Schedule */}
      <section className="py-24 px-4 bg-background">
        <FadeIn>
          <h2 className="font-script text-5xl text-primary text-center mb-2">Schedule of Events</h2>
          <p className="text-center font-sans text-xs tracking-[0.2em] text-foreground/40 uppercase mb-16">5th & 6th July 2026</p>
        </FadeIn>

        {/* Day 1 */}
        <FadeIn>
          <div className="text-center mb-8">
            <span className="inline-block font-sans text-xs tracking-[0.25em] uppercase text-primary/80 border border-primary/30 rounded-full px-5 py-1.5">
              Sunday · 5th July 2026
            </span>
          </div>
        </FadeIn>

        <TimelineDay events={[
          { name: "Haldi & Carnival", time: "10:15 AM" },
          { name: "Pool Party", time: "12:15 PM" },
          { name: "Tilak & Sangeet", time: "6:15 PM" },
        ]} />

        <div className="my-12 flex items-center justify-center gap-4">
          <div className="h-px bg-primary/20 flex-1 max-w-[80px]" />
          <Flower2 className="w-5 h-5 text-primary/40" />
          <div className="h-px bg-primary/20 flex-1 max-w-[80px]" />
        </div>

        {/* Day 2 */}
        <FadeIn>
          <div className="text-center mb-8">
            <span className="inline-block font-sans text-xs tracking-[0.25em] uppercase text-primary/80 border border-primary/30 rounded-full px-5 py-1.5">
              Monday · 6th July 2026
            </span>
          </div>
        </FadeIn>

        <TimelineDay events={[
          { name: "Mayra", time: "10:15 AM" },
          { name: "Korath & Baraat", time: "6:30 PM" },
          { name: "Reception", time: "7:00 PM" },
          { name: "Phere", time: "After Midnight" },
        ]} />
      </section>

      <Divider />

      {/* Venue */}
      <section className="py-16 px-6 bg-background">
        <FadeIn>
          <h2 className="text-sm font-sans tracking-[0.2em] text-primary uppercase text-center mb-8">
            Reception Venue
          </h2>
          
          <div className="relative p-2 bg-white rounded-xl shadow-lg mb-8 mx-auto max-w-sm border border-border">
            <div className="relative rounded-lg overflow-hidden border border-primary/20">
              <img 
                src={venueImg} 
                alt="Sterling Resort" 
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="font-script text-5xl text-primary mb-2">Sterling Resort</h3>
            <p className="font-sans text-sm text-foreground/70 uppercase tracking-widest mb-8">Puri, Odisha</p>
            
            <a 
              href="https://maps.google.com/?q=Sterling+Resort+Puri+Odisha" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-8 py-3 rounded-full font-sans text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-colors duration-300"
            >
              <span className="text-base">📍</span> View on Google Maps
            </a>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-[#FAF7F2] text-center border-t border-border flex flex-col items-center">
        <img src={floralImg} alt="" className="w-12 h-12 object-contain opacity-60 mb-6" />
        <h2 className="font-script text-4xl text-primary mb-3">Rahul & Taruna</h2>
        <p className="font-sans text-xs uppercase tracking-widest text-foreground/60 mb-8">
          5th & 6th July 2026 • Sterling Resort, Puri
        </p>
        <p className="font-sans italic text-[10px] text-muted-foreground">
          Made with ♥ for our special day
        </p>
      </footer>
    </main>
  );
}
