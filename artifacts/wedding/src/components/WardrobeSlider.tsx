import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import coverImg from "@assets/wardrobe_cover.jpg";
import haldiImg from "@assets/wardrobe_haldi.jpg";
import mayraImg from "@assets/wardrobe_mayra.jpg";
import sangeetImg from "@assets/wardrobe_sangeet.jpg";
import weddingImg from "@assets/wardrobe_wedding.jpg";

const IMAGES = [
  { src: coverImg, alt: "Wardrobe Planner Cover" },
  { src: haldiImg, alt: "Haldi & Pool Party Style Guide" },
  { src: mayraImg, alt: "Mayra & Carnival Style Guide" },
  { src: sangeetImg, alt: "Sangeet Style Guide" },
  { src: weddingImg, alt: "Wedding Style Guide" }
];

export function WardrobeSlider() {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % IMAGES.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div className="relative z-10 w-full">
      {/* Title */}
      <div className="text-center mb-5 px-4">
        <p className="font-sans text-[12px] uppercase tracking-[0.2em] text-primary/80 text-center mb-1">Look Book</p>
        <h2 className="font-script text-center text-primary mb-1" style={{ fontSize: "clamp(2.8rem,10vw,4rem)" }}>
          Wardrobe
        </h2>
        <div className="ornament-line text-primary/80 text-[12px] font-sans tracking-[0.15em] uppercase justify-center mt-1 mb-6 px-8">
          Style Guide &amp; Dress Codes
        </div>
      </div>

      {/* Slide Container */}
      <div className="relative mx-auto w-full px-8" style={{ maxWidth: 350 }}>
        {/* Gold corners */}
        <div className="absolute -top-2 left-6 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl z-10" />
        <div className="absolute -top-2 right-6 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr z-10" />
        <div className="absolute -bottom-2 left-6 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl z-10" />
        <div className="absolute -bottom-2 right-6 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br z-10" />

        {/* Image Card */}
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="relative overflow-hidden rounded-xl shadow-xl border border-primary/10 bg-[#FAF7F2] aspect-[9/16] cursor-grab active:cursor-grabbing select-none"
        >
          {/* Slides List */}
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {IMAGES.map((img, i) => (
              <div key={i} className="w-full h-full shrink-0 relative">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover pointer-events-none"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          {/* Overlay Navigation Buttons */}
          <button
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/55 text-white flex items-center justify-center border border-white/20 backdrop-blur-sm transition-colors cursor-pointer active:scale-90"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/55 text-white flex items-center justify-center border border-white/20 backdrop-blur-sm transition-colors cursor-pointer active:scale-90"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full border border-primary/40 transition-all duration-300 ${
              index === i ? "bg-primary w-6" : "bg-transparent hover:bg-primary/20"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
