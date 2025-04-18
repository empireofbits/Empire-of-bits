"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface ParticleButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onHover?: () => void;
}

export function ParticleButton({
  children,
  className,
  onClick,
  onHover,
}: ParticleButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; color: string }>
  >([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Clean up particles after animation
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles([]);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [particles]);

  const createParticles = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const colors = ["#ffffff", "#facc15", "#a855f7", "#22c55e"];
    const newParticles = [];

    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        size: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setParticles(newParticles);
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={onHover}
      onClick={(e) => {
        setIsPressed(true);
        createParticles(e);
        setTimeout(() => setIsPressed(false), 300);
        onClick && onClick();
      }}
    >
      {children}

      {/* Ripple effect on click */}
      {isPressed && (
        <motion.span
          className="absolute inset-0 bg-white rounded-sm"
          initial={{ opacity: 0.5, scale: 0.5 }}
          animate={{ opacity: 0, scale: 1.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Particles */}
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
          initial={{ scale: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: [0, (Math.random() - 0.5) * 100],
            y: [0, (Math.random() - 0.5) * 100],
            opacity: [1, 0],
          }}
          transition={{ duration: 0.8 }}
        />
      ))}
    </motion.button>
  );
}
