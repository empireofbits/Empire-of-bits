"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onHover?: () => void;
}

export function AnimatedButton({
  children,
  className,
  onClick,
  onHover,
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.button
      className={`relative ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={onHover}
      onClick={() => {
        setIsPressed(true);
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
    </motion.button>
  );
}
