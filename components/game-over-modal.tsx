"use client";

import { Button } from "@/components/ui/button";
import { Star, Home, RotateCcw, ArrowRight } from "lucide-react";
import Link from "next/link";

interface GameOverModalProps {
  score: number;
  targetScore: number;
  stars: number;
  pointsEarned?: number;
  redirecting?: boolean;
  onNextLevel: () => void;
  onRetry: () => void;
}

export default function GameOverModal({
  score,
  targetScore,
  stars,
  pointsEarned = 0,
  redirecting = false,
  onNextLevel,
  onRetry,
}: GameOverModalProps) {
  const isLevelCompleted = score >= targetScore;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 pointer-events-none z-10 opacity-30 crt-effect"></div>

      <div
        className="bg-gradient-to-b from-purple-800 to-purple-900 rounded-xl border-4 border-purple-600 p-6 max-w-md w-full animate-bounce-in shadow-2xl relative z-20"
        style={{
          boxShadow:
            "0 0 20px rgba(255,0,255,0.5), 0 0 40px rgba(0,255,255,0.3)",
        }}
      >
        <h2
          className="text-3xl font-bold text-center text-yellow-300 mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] pixelated"
          style={{
            textShadow: "3px 3px 0px #ff00ff, -3px -3px 0px #00ffff",
          }}
        >
          {isLevelCompleted ? "LEVEL COMPLETE!" : "LEVEL FAILED!"}
        </h2>

        <div className="flex justify-center mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="mx-2 transform transition-all duration-500"
              style={{
                scale: i <= stars ? "1.2" : "1",
                transitionDelay: `${i * 200}ms`,
              }}
            >
              <Star
                size={40}
                className={`${
                  i <= stars
                    ? "text-yellow-300 fill-yellow-300 animate-pulse"
                    : "text-gray-600"
                }`}
              />
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-6 bg-purple-950/50 p-3 rounded-lg border-2 border-purple-700">
          <div className="flex justify-between">
            <span className="text-pink-300 pixelated">Score:</span>
            <span className="font-bold pixelated">{score}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-pink-300 pixelated">Target:</span>
            <span className="font-bold pixelated">{targetScore}</span>
          </div>

          {isLevelCompleted && pointsEarned > 0 && (
            <div className="flex justify-between text-green-400">
              <span className="pixelated">Points Earned:</span>
              <span className="font-bold pixelated">+{pointsEarned}</span>
            </div>
          )}
        </div>

        {isLevelCompleted && redirecting && (
          <div className="text-center mb-4 text-green-300 animate-pulse">
            Congratulations! Redirecting to home page...
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <Link href="/">
            <Button
              variant="outline"
              className="w-full bg-purple-700 hover:bg-purple-800 border-4 border-purple-500 active:translate-y-1 transition-transform"
              style={{
                boxShadow: "0 4px 0 #7e22ce",
                textShadow: "1px 1px 0 rgba(0,0,0,0.5)",
              }}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>

          <Button
            variant="outline"
            className="w-full bg-purple-700 hover:bg-purple-800 border-4 border-purple-500 active:translate-y-1 transition-transform"
            onClick={onRetry}
            style={{
              boxShadow: "0 4px 0 #7e22ce",
              textShadow: "1px 1px 0 rgba(0,0,0,0.5)",
            }}
            disabled={redirecting}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>

          {isLevelCompleted && !redirecting && (
            <Button
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-4 border-green-700 active:translate-y-1 transition-transform"
              onClick={onNextLevel}
              style={{
                boxShadow: "0 4px 0 #166534",
                textShadow: "1px 1px 0 rgba(0,0,0,0.5)",
              }}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {/* Empty cell if level failed */}
          {!isLevelCompleted && <div></div>}
        </div>
      </div>
    </div>
  );
}
