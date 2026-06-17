import React, { useState, useEffect } from "react";

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // July 5, 2026 04:45:00 UTC
    const targetDate = new Date("2026-07-05T04:45:00Z").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeBlocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds }
  ];

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <h3 className="text-sm font-sans tracking-[0.2em] text-primary uppercase text-center">
        The celebration begins in…
      </h3>
      
      <div className="flex justify-center gap-3 md:gap-4 w-full">
        {timeBlocks.map((block) => (
          <div key={block.label} className="flex flex-col items-center gap-2">
            <div className="w-16 h-20 md:w-20 md:h-24 bg-black/40 backdrop-blur-sm border border-primary/30 rounded-lg flex items-center justify-center shadow-[inset_0_0_15px_rgba(201,168,76,0.1)]">
              <span className="font-serif text-3xl md:text-4xl font-bold text-white tracking-widest tabular-nums">
                {block.value.toString().padStart(2, "0")}
              </span>
            </div>
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-widest text-primary/80">
              {block.label}
            </span>
          </div>
        ))}
      </div>
      
      <div className="font-script text-3xl md:text-4xl text-primary mt-4">
        Until The Big Day
      </div>
    </div>
  );
}
