import React, { useState, useEffect } from "react";

interface PreloaderEnvelopeProps {
  onStart?: () => void;
  onComplete: () => void;
}

const PETALS = [
  { left: "10%", delay: "0s",   dur: "8s",  color: "#D4B76C" },
  { left: "25%", delay: "1.5s", dur: "10s", color: "#E8C4B8" },
  { left: "40%", delay: "3.2s", dur: "9s",  color: "#C9A84C" },
  { left: "60%", delay: "0.8s", dur: "11s", color: "#F5C5A3" },
  { left: "75%", delay: "2.5s", dur: "7.5s", color: "#D4B76C" },
  { left: "90%", delay: "1.2s", dur: "9.5s", color: "#E8C4B8" },
];

export function PreloaderEnvelope({ onStart, onComplete }: PreloaderEnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Disable scrolling while the preloader invitation is active
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    if (onStart) onStart();
    
    // Step 1: Wax seal pops, flap opens (takes 800ms)
    // Step 2: Full screen slides up / fades out
    setTimeout(() => {
      setIsDone(true);
      setTimeout(() => {
        onComplete();
      }, 1000); // Wait for the slide-out transition to complete
    }, 1100);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF6EE] select-none transition-all duration-1000 ease-in-out grain-overlay ${
        isDone ? "opacity-0 scale-[1.3] pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        boxShadow: "0 0 100px rgba(0, 0, 0, 0.1) inset"
      }}
    >
      {/* Self-contained styling */}
      <style>{`
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        @keyframes pulse-subtle {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 4px 20px rgba(201,168,76,0.4), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.3);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.08);
            box-shadow: 0 8px 30px rgba(201,168,76,0.6), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.3);
          }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s infinite ease-in-out;
        }
        @keyframes preloaderPetalFloat {
          0%   { transform: translateY(110vh) rotate(0deg) scale(1); opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(-10vh) rotate(360deg) scale(0.5); opacity: 0; }
        }
        .preloader-petal {
          position: absolute;
          width: 12px;
          height: 14px;
          border-radius: 60% 0 60% 0;
          animation: preloaderPetalFloat var(--dur) var(--delay) linear infinite;
          pointer-events: none;
        }
      `}</style>

      {/* Floating Petals Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PETALS.map((p, i) => (
          <div
            key={i}
            className="preloader-petal animate-pulse"
            style={{
              left: p.left,
              bottom: "-20px",
              "--delay": p.delay,
              "--dur": p.dur,
              backgroundColor: `${p.color}aa`,
            } as React.CSSProperties}
          />
        ))}
      </div>
      {/* Invitation Header Text */}
      <div
        className={`text-center mb-5 px-6 z-10 transition-all duration-700 ease-in-out ${
          isOpening ? "opacity-0 -translate-y-6 pointer-events-none" : "opacity-100 translate-y-0"
        }`}
      >
        <h2 className="font-script text-[3.2rem] text-[#550000] leading-tight my-2 drop-shadow-sm">
          You're Invited
        </h2>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-primary text-[12px] tracking-[0.2em] font-semibold uppercase">
            ✦ Tap to Open ✦
          </span>
        </div>
      </div>
      {/* 3D Envelope Container */}
      <div
        className="relative w-[min(320px,84vw)] aspect-[4/3] z-10 transition-all duration-1000 ease-in-out"
        style={{
          perspective: "1000px",
          transform: isOpening ? "scale(1.06)" : "scale(1)",
        }}
      >
        {/* Envelope Base / Inner Background */}
        <div className="absolute inset-0 bg-[#330000] rounded-[16px] border border-[#3C0000] shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Gold Monogram watermark inside the envelope */}
          <div className="opacity-10 scale-95 flex flex-col items-center">
            <span className="font-script text-[4.5rem] text-[#D4B76C] leading-none">R & T</span>
            <div className="h-px w-20 bg-[#D4B76C] mt-2 opacity-50" />
          </div>
        </div>
        {/* Top Flap (Rotates open) */}
        <div
          className="absolute top-0 left-0 w-full h-[50%]"
          style={{
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            transform: isOpening ? "rotateX(180deg)" : "rotateX(0deg)",
            zIndex: isOpening ? 5 : 20,
            transition: "transform 800ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Front Side of Flap (pointing down, with gold trim border) */}
          <div
            className="absolute inset-0 backface-hidden z-20"
            style={{
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              overflow: "hidden",
            }}
          >
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full drop-shadow-[0_4px_8px_rgba(85,0,0,0.25)]">
              {/* Outer flap path */}
              <path d="M0,0 L50,47.5 L100,0 Z" fill="#550000" />
              {/* Gold border inset line */}
              <path d="M2,0 L50,45.5 L98,0" fill="none" stroke="#D4B76C" strokeWidth="0.65" strokeLinecap="round" />
            </svg>
          </div>
          {/* Back Side of Flap (interior surface, seen when flipped open) */}
          <div
            className="absolute inset-0 backface-hidden z-10"
            style={{
              transform: "rotateX(180deg)",
              borderBottomLeftRadius: "16px",
              borderBottomRightRadius: "16px",
              overflow: "hidden",
            }}
          >
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0,50 L50,0 L100,50 Z" fill="#440000" stroke="#2A0000" strokeWidth="0.5" />
            </svg>
          </div>
        </div>
        {/* Side & Bottom Folds Overlay */}
        <div
          className="absolute inset-0 w-full h-full z-15 pointer-events-none"
          style={{
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <svg viewBox="0 0 100 75" preserveAspectRatio="none" className="w-full h-full drop-shadow-[0_-3px_10px_rgba(0,0,0,0.25)]">
            {/* Left fold fold shadow */}
            <path d="M0,0 L50,37.5 L0,75 Z" fill="#3B0000" />
            {/* Right fold fold shadow */}
            <path d="M100,0 L50,37.5 L100,75 Z" fill="#3B0000" />
            {/* Bottom V fold */}
            <path d="M0,75 L50,37.5 L100,75 Z" fill="#4A0000" />
            {/* Fold seams accent lines */}
            <path d="M0,0 L50,37.5 M100,0 L50,37.5" stroke="#220000" strokeWidth="0.35" />
          </svg>
        </div>
        {/* Interactive Wax Seal Button */}
        <button
          onClick={handleOpen}
          disabled={isOpening}
          className={`absolute top-[50%] left-[50%] z-30
            w-16 h-16 rounded-full cursor-pointer flex items-center justify-center
            bg-gradient-to-br from-[#F5D480] via-[#C9A84C] to-[#997A27]
            border border-[#E5C368]
            transition-all duration-[600ms] ease-out
            ${isOpening ? "scale-0 opacity-0 rotate-180 pointer-events-none" : "animate-pulse-subtle hover:scale-108 active:scale-95"}
          `}
          style={{
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Circular textured border and text */}
          <div className="w-[84%] h-[84%] rounded-full border border-dashed border-[#FFF3D1]/45 flex flex-col items-center justify-center">
            <span className="font-sans text-[11px] uppercase tracking-[0.15em] font-bold text-[#4D390F]">TAP</span>
            <span className="font-sans text-[11px] uppercase tracking-[0.15em] font-bold text-[#4D390F] mt-[1px]">ME</span>
          </div>
        </button>
      </div>
    </div>
  );
}
