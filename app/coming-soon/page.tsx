"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function ComingSoonPage() {
  const router = useRouter();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [stars, setStars] = useState<
    {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      color: string;
    }[]
  >([]);
  const [asteroids, setAsteroids] = useState<
    {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }[]
  >([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate stars
  useEffect(() => {
    const newStars = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.8 + 0.2,
      color: `hsl(${Math.random() * 60 + 220}, 100%, ${
        Math.random() * 30 + 70
      }%)`,
    }));
    setStars(newStars);
  }, []);

  // Generate asteroids
  useEffect(() => {
    const newAsteroids = Array.from({ length: 15 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 60 + 20,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setAsteroids(newAsteroids);
  }, []);

  // Canvas animation for space elements
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrameId: number;

    const render = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((star, i) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha =
          star.opacity * (0.5 + Math.sin(Date.now() * 0.001 + i) * 0.5);
        ctx.fill();

        // Move stars
        stars[i].y += star.speed;
        if (stars[i].y > canvas.height) {
          stars[i].y = 0;
          stars[i].x = Math.random() * canvas.width;
        }
      });

      // Draw asteroids
      asteroids.forEach((asteroid, i) => {
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(
          ((asteroid.rotation + Date.now() * 0.01 * asteroid.rotationSpeed) *
            Math.PI) /
            180
        );

        ctx.beginPath();
        ctx.globalAlpha = asteroid.opacity;

        // Create irregular asteroid shape
        const points = 8;
        for (let j = 0; j < points; j++) {
          const angle = (j / points) * Math.PI * 2;
          const radius = asteroid.size * (0.7 + Math.sin(j * 5) * 0.3);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.closePath();
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, asteroid.size);
        gradient.addColorStop(0, "rgba(120, 70, 180, 0.8)");
        gradient.addColorStop(1, "rgba(60, 20, 90, 0.1)");
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = "rgba(180, 100, 255, 0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Move asteroids
        asteroids[i].x += asteroid.speedX;
        asteroids[i].y += asteroid.speedY;

        // Wrap around screen
        if (asteroids[i].x > canvas.width + asteroid.size)
          asteroids[i].x = -asteroid.size;
        if (asteroids[i].x < -asteroid.size)
          asteroids[i].x = canvas.width + asteroid.size;
        if (asteroids[i].y > canvas.height + asteroid.size)
          asteroids[i].y = -asteroid.size;
        if (asteroids[i].y < -asteroid.size)
          asteroids[i].y = canvas.height + asteroid.size;
      });

      // Occasional meteor effect
      if (Math.random() < 0.02) {
        const meteor = {
          x: Math.random() * canvas.width,
          y: 0,
          length: Math.random() * 150 + 50,
          speed: Math.random() * 15 + 10,
          angle: Math.random() * 30 + 30,
          width: Math.random() * 3 + 1,
        };

        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(
          meteor.x + Math.cos((meteor.angle * Math.PI) / 180) * meteor.length,
          meteor.y + Math.sin((meteor.angle * Math.PI) / 180) * meteor.length
        );

        const gradient = ctx.createLinearGradient(
          meteor.x,
          meteor.y,
          meteor.x + Math.cos((meteor.angle * Math.PI) / 180) * meteor.length,
          meteor.y + Math.sin((meteor.angle * Math.PI) / 180) * meteor.length
        );

        gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
        gradient.addColorStop(0.2, "rgba(255, 160, 220, 0.7)");
        gradient.addColorStop(1, "rgba(120, 0, 255, 0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = meteor.width;
        ctx.stroke();
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [stars, asteroids]);

  // Loading progress bar animation
  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 95) {
          clearInterval(loadingInterval);
          return 95;
        }
        return prev + Math.random() * 5;
      });
    }, 500);

    return () => clearInterval(loadingInterval);
  }, []);

  return (
    <div className="min-h-screen bg-space-gradient flex flex-col p-8 font-cyber relative overflow-hidden">
      {/* Canvas for space animations */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Cosmic dust particles */}
      <div className="cosmic-dust"></div>

      {/* Back button */}
      <button
        onClick={() => router.push("/games")}
        className="absolute top-8 left-8 flex items-center justify-center bg-button-gradient p-4 rounded-md text-xl border-2 border-purple-500 z-20 transition-all duration-300 hover:scale-105 hover:rotate-1 cosmic-button"
        aria-label="Back to games"
      >
        <ArrowLeft size={32} className="text-cyan-300" />
        <span className="ml-2 tracking-wider text-cyan-300">BACK</span>
      </button>

      {/* Coming soon text */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 mt-10">
        <div className="relative cosmic-text-container">
          <h1 className="text-8xl md:text-9xl font-bold tracking-widest text-center mb-8 cosmic-text">
            COMING
          </h1>
          <h1 className="text-8xl md:text-9xl font-bold tracking-widest text-center cosmic-text">
            SOON
          </h1>

          {/* Cosmic glow effect */}
          <div className="cosmic-glow"></div>
        </div>

        {/* Loading bar */}
        <div className="mt-20 w-3/4 max-w-lg">
          <div className="text-xl mb-2 flex justify-between text-cyan-300">
            <span className="cosmic-flicker">INITIALIZING UNIVERSE</span>
            <span>{Math.floor(loadingProgress)}%</span>
          </div>
          <div className="h-8 border-2 border-purple-500 p-1 cosmic-loading-container">
            <div
              className="h-full bg-loading-gradient cosmic-loading-bar"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <div className="mt-4 text-center text-xl text-pink-400">
            <span className="inline-block animate-bounce delay-0">.</span>
            <span className="inline-block animate-bounce delay-100">.</span>
            <span className="inline-block animate-bounce delay-200">.</span>
          </div>
        </div>
      </div>

      {/* Nebula overlay effect */}
      <div className="fixed inset-0 pointer-events-none nebula-overlay z-5"></div>
    </div>
  );
}
