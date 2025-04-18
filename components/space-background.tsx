"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";

interface SpaceBackgroundProps {
  children: React.ReactNode;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

interface Asteroid {
  x: number;
  y: number;
  size: number;
  rotation: number;
  speed: number;
  rotationSpeed: number;
}

export default function SpaceBackground({ children }: SpaceBackgroundProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    // Generate random stars for the background
    const newStars = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.05 + 0.01,
    }));
    setStars(newStars);

    // Generate random asteroids
    const newAsteroids = Array.from({ length: 8 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 30 + 10,
      rotation: Math.random() * 360,
      speed: Math.random() * 0.5 + 0.1,
      rotationSpeed: (Math.random() - 0.5) * 0.5,
    }));
    setAsteroids(newAsteroids);

    // Set up canvas animation
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      newStars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Move stars
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      // Draw asteroids
      newAsteroids.forEach((asteroid) => {
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate((asteroid.rotation * Math.PI) / 180);

        // Draw asteroid (irregular polygon)
        ctx.beginPath();
        const points = 7;
        for (let i = 0; i < points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const radius = asteroid.size * (0.8 + Math.random() * 0.4);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
        ctx.fill();
        ctx.strokeStyle = "rgba(150, 150, 150, 0.8)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();

        // Move and rotate asteroids
        asteroid.y += asteroid.speed;
        asteroid.x += Math.sin(asteroid.rotation / 30) * 0.5;
        asteroid.rotation += asteroid.rotationSpeed;

        // Reset position when out of screen
        if (asteroid.y > canvas.height + asteroid.size) {
          asteroid.y = -asteroid.size;
          asteroid.x = Math.random() * canvas.width;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Grid lines */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] z-0" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
