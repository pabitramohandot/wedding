import React, { useRef, useEffect, useState } from "react";
import floralImg from "@assets/generated_images/watercolor_indian_wedding_floral_627e.png";

export function EnvelopeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setIsOpen(true), 300);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="py-24 px-6 flex justify-center items-center min-h-[80vh] perspective-[800px] overflow-hidden">
      <div className="relative w-full max-w-[340px] aspect-[4/5] mx-auto">
        
        {/* The Letter inside */}
        <div 
          className={`absolute left-4 right-4 bg-card border border-primary/30 rounded shadow-sm p-6 flex flex-col items-center text-center transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-10 ${
            isOpen ? '-translate-y-[60%]' : 'translate-y-0 opacity-0'
          }`}
          style={{ bottom: '10%', top: '10%' }}
        >
          <img src={floralImg} alt="floral" className="w-16 h-16 object-contain opacity-80 mb-4" />
          <h3 className="font-script text-3xl text-primary mb-4">Dear Friends & Family,</h3>
          <p className="font-serif text-sm leading-relaxed text-foreground mb-4">
            With immense joy and gratitude, we solicit your gracious presence and blessings as we celebrate this beautiful occasion with our families and loved ones.
          </p>
          <p className="font-serif text-sm leading-relaxed text-foreground mb-6">
            Your love, laughter and blessings will make these moments even more special, and we look forward to creating memories together.
          </p>
          <div className="mt-auto">
            <span className="font-serif italic text-sm block mb-1">With Love,</span>
            <span className="font-script text-2xl text-primary">Rahul & Taruna</span>
          </div>
        </div>

        {/* Envelope Back */}
        <div className="absolute inset-0 bg-[#EFE9DD] rounded shadow-xl z-0" />
        
        {/* Envelope Flap (Top) */}
        <div 
          className={`absolute top-0 left-0 w-full h-[50%] origin-top transition-transform duration-1000 z-20 ${
            isOpen ? 'rotate-x-180 z-0' : 'rotate-x-0'
          }`}
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        >
          <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full drop-shadow-md">
            <path d="M0,0 L50,50 L100,0 Z" fill="#D4B76C" />
          </svg>
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-sm">
             <div className="w-6 h-6 rounded-full border border-white/20" />
          </div>
        </div>

        {/* Envelope Front Left/Right/Bottom (covers the letter until it slides out) */}
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded">
          <svg viewBox="0 0 100 120" preserveAspectRatio="none" className="w-full h-full drop-shadow-lg">
            <path d="M0,0 L50,45 L100,0 L100,120 L0,120 Z" fill="#F4EFE6" stroke="rgba(201,168,76,0.2)" strokeWidth="0.5" />
          </svg>
        </div>

      </div>
    </div>
  );
}
