import React, { useRef, useEffect, useState } from "react";

export function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const container = containerRef.current;
    
    if (!canvas || !ctx || !container || isRevealed) return;

    // Set canvas dimensions to match container
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw the gold gradient scratch layer
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#C9A84C");
    gradient.addColorStop(0.5, "#F5D78E");
    gradient.addColorStop(1, "#B8860B");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text instruction
    ctx.font = "16px Montserrat, sans-serif";
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch Here ✦", canvas.width / 2, canvas.height / 2);

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 40;
    ctx.globalCompositeOperation = "destination-out";

    let lastX = 0;
    let lastY = 0;

    const getPosition = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      setIsScratching(true);
      const pos = getPosition(e);
      lastX = pos.x;
      lastY = pos.y;
      scratch(pos.x, pos.y);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isScratching) return;
      e.preventDefault();
      const pos = getPosition(e);
      scratch(pos.x, pos.y, true);
      lastX = pos.x;
      lastY = pos.y;
      checkReveal();
    };

    const handleEnd = () => {
      setIsScratching(false);
      checkReveal();
    };

    const scratch = (x: number, y: number, isMove = false) => {
      ctx.beginPath();
      if (isMove) {
        ctx.moveTo(lastX, lastY);
      } else {
        ctx.moveTo(x, y);
      }
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const checkReveal = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;
      
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) {
          transparentPixels++;
        }
      }

      const totalPixels = pixels.length / 4;
      const percentRevealed = (transparentPixels / totalPixels) * 100;

      if (percentRevealed > 50) {
        setIsRevealed(true);
      }
    };

    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    canvas.addEventListener("touchstart", handleStart, { passive: false });
    canvas.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleStart);
      canvas.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      canvas.removeEventListener("touchstart", handleStart);
      canvas.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isRevealed, isScratching]);

  return (
    <div className="flex flex-col items-center gap-6 py-12 px-4 w-full max-w-sm mx-auto">
      <h2 className="text-sm font-sans tracking-[0.2em] text-muted-foreground uppercase text-center">
        Scratch to discover the date
      </h2>
      
      <div 
        ref={containerRef}
        className="relative w-full aspect-[3/2] rounded-xl overflow-hidden shadow-lg border border-border bg-card flex items-center justify-center flex-col p-6 text-center"
      >
        <div className={`transition-opacity duration-1000 flex flex-col items-center justify-center gap-2 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
          <div className="font-script text-4xl text-primary">5th & 6th July 2026</div>
          <div className="font-serif italic text-xl text-foreground/80 mt-2">Rahul weds Taruna</div>
        </div>
        
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 cursor-pointer touch-none transition-opacity duration-1000 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        />
        
        {isRevealed && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             {/* Simple CSS confetti could go here, but omitted for brevity as per instructions */}
             <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping" />
             <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-secondary rounded-full animate-ping delay-150" />
             <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-accent rounded-full animate-ping delay-300" />
          </div>
        )}
      </div>
    </div>
  );
}
