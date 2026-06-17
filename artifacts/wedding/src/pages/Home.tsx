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
      <section className="py-24 px-6 bg-background">
        <FadeIn>
          <h2 className="text-sm font-sans tracking-[0.2em] text-primary uppercase text-center mb-12">
            Event Schedule
          </h2>
          
          <div className="space-y-12">
            {/* Day 1 */}
            <div className="bg-card border border-primary/20 rounded-xl p-8 shadow-sm">
              <h3 className="font-script text-4xl text-primary text-center mb-6">
                5th July 2026 <span className="font-sans text-sm font-medium tracking-widest uppercase block mt-2 text-foreground/60">Sunday</span>
              </h3>
              <ul className="space-y-6">
                {[
                  { name: "Haldi & Carnival", time: "10:15 AM onwards" },
                  { name: "Pool Party", time: "12:15 PM onwards" },
                  { name: "Tilak & Sangeet", time: "6:15 PM onwards" },
                ].map((event, i) => (
                  <li key={i} className="flex flex-col border-b border-primary/10 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-1">
                      <Flower2 className="w-4 h-4 text-primary/60" />
                      <span className="font-serif font-bold text-xl text-foreground">{event.name}</span>
                    </div>
                    <span className="font-sans text-xs text-muted-foreground ml-7 uppercase tracking-wider">{event.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Day 2 */}
            <div className="bg-card border border-primary/20 rounded-xl p-8 shadow-sm">
              <h3 className="font-script text-4xl text-primary text-center mb-6">
                6th July 2026 <span className="font-sans text-sm font-medium tracking-widest uppercase block mt-2 text-foreground/60">Monday</span>
              </h3>
              <ul className="space-y-6">
                {[
                  { name: "Mayra", time: "10:15 AM onwards" },
                  { name: "Korath & Baraat", time: "6:30 PM onwards" },
                  { name: "Reception", time: "7:00 PM onwards" },
                  { name: "Phere", time: "After Midnight" },
                ].map((event, i) => (
                  <li key={i} className="flex flex-col border-b border-primary/10 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-1">
                      <Flower2 className="w-4 h-4 text-primary/60" />
                      <span className="font-serif font-bold text-xl text-foreground">{event.name}</span>
                    </div>
                    <span className="font-sans text-xs text-muted-foreground ml-7 uppercase tracking-wider">{event.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>
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
