"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  glitch?: boolean;
}

export function AnimatedText({
  text,
  className,
  delay = 0,
  speed = 50,
  glitch = false,
}: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (delay > 0) {
      timeout = setTimeout(() => {
        startAnimation();
      }, delay);
    } else {
      startAnimation();
    }

    function startAnimation() {
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, speed);

        return () => clearTimeout(timer);
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [currentIndex, text, delay, speed]);

  useEffect(() => {
    if (!glitch || currentIndex < text.length) return;

    // Add glitch effect after text is fully displayed
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, [glitch, currentIndex, text]);

  if (!glitch) {
    return <div className={className}>{displayText}</div>;
  }

  return (
    <motion.div className={`relative ${className}`}>
      <div className={isGlitching ? "opacity-0" : "opacity-100"}>
        {displayText}
      </div>
      {isGlitching && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-full text-cyan-400 mix-blend-screen"
            style={{ clipPath: "polygon(0 15%, 100% 15%, 100% 40%, 0 40%)" }}
            animate={{ x: [-2, 2, -1, 0] }}
            transition={{ duration: 0.2 }}
          >
            {displayText}
          </motion.div>
          <motion.div
            className="absolute top-0 left-0 w-full text-red-400 mix-blend-screen"
            style={{ clipPath: "polygon(0 65%, 100% 65%, 100% 90%, 0 90%)" }}
            animate={{ x: [2, -2, 1, 0] }}
            transition={{ duration: 0.2 }}
          >
            {displayText}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
