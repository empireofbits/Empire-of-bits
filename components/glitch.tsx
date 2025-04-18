"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface GlitchProps {
  text: string;
  className?: string;
}

export function Glitch({ text, className = "" }: GlitchProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 150);
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className={isGlitching ? "opacity-0" : "opacity-100"}>{text}</div>
      {isGlitching && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-full text-white mix-blend-difference"
            style={{ clipPath: "polygon(0 15%, 100% 15%, 100% 40%, 0 40%)" }}
            animate={{ x: [-2, 2, -1, 0] }}
            transition={{ duration: 0.2 }}
          >
            {text}
          </motion.div>
          <motion.div
            className="absolute top-0 left-0 w-full text-white mix-blend-difference"
            style={{ clipPath: "polygon(0 65%, 100% 65%, 100% 90%, 0 90%)" }}
            animate={{ x: [2, -2, 1, 0] }}
            transition={{ duration: 0.2 }}
          >
            {text}
          </motion.div>
        </>
      )}
    </div>
  );
}
