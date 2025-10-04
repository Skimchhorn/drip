'use client';

import { useEffect, useState } from "react";

export default function ResolutionGuard({ children }: { children: React.ReactNode }) {
  const [tooSmall, setTooSmall] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setTooSmall(window.innerWidth < 1600 || window.innerHeight < 900);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);
  
 return (
    <div className="relative w-screen h-screen">
      {/* Always render children */}
      {children}

      {/* Overlay if too small */}
      {tooSmall && (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white text-xl z-50">
          Please use a larger window (min 1920×1080).
        </div>
      )}
    </div>
  );
}