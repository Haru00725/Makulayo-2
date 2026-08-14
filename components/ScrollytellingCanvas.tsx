"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollytellingCanvasProps {
  progress: number;
}

export function ScrollytellingCanvas({ progress }: ScrollytellingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const totalFrames = 178; // Native 24fps video (spray ends at frame 178)

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      // zero pad the index to 3 digits (e.g. 001, 012, 300)
      const paddedIndex = i.toString().padStart(3, '0');
      img.src = `/sequence/frame-${paddedIndex}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setIsLoaded(true);
        }
      };
      imgArray.push(img);
    }
    setImages(imgArray);
  }, []);

  // Draw current frame based on progress
  useEffect(() => {
    if (!isLoaded || images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Map progress (0 to 1) to frame index (0 to 299)
    const frameIndex = Math.min(
      totalFrames - 1,
      Math.max(0, Math.floor(progress * totalFrames))
    );

    const img = images[frameIndex];
    if (!img) return;

    // Handle high DPI displays for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    // Set internal canvas dimensions matching the window
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    // Scale context to ensure correct drawing operations
    ctx.scale(dpr, dpr);
    
    // Improve upscaling quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Calculate aspect ratio cover (cover-fit)
    const windowRatio = window.innerWidth / window.innerHeight;
    const imgRatio = img.width / img.height;
    
    let renderWidth = window.innerWidth;
    let renderHeight = window.innerHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (windowRatio > imgRatio) {
      // Window is wider than image relative to height
      renderWidth = window.innerWidth;
      renderHeight = renderWidth / imgRatio;
      offsetY = (window.innerHeight - renderHeight) / 2;
    } else {
      // Window is taller than image relative to width
      renderHeight = window.innerHeight;
      renderWidth = renderHeight * imgRatio;
      offsetX = (window.innerWidth - renderWidth) / 2;
    }

    // Clear canvas and draw
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
  }, [progress, isLoaded, images]);

  return (
    <div className="fixed inset-0 w-full h-full bg-brand-void z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover max-md:scale-100 md:scale-125 md:translate-x-[4%] md:translate-y-[4%]"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-void z-20">
          <span className="text-brand-ivory-muted text-sm tracking-widest uppercase">Loading Experience...</span>
        </div>
      )}
    </div>
  );
}
