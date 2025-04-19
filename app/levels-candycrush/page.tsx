"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import LevelCard from "@/components/level-card";

export default function LevelsPage() {
  interface GameData {
    currentLevel: number;
    totalPoints: number;
    levels: {
      levelNumber: number;
      stars: number;
      cleared: boolean;
      maxPoints: number;
    }[];
  }

  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        // Replace with your actual userId or get it from your auth system
        const userId = localStorage.getItem("walletAddress"); // You should replace this with your actual user ID

        // First, try to get existing game data
        const response = await fetch(
          "https://backend.empireofbits.fun/api/v1/games/candycrush",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );
        const data = await response.json();
        console.log("Game data fetched:", data);
        setGameData(data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching game data:", err);
        setError("Failed to load levels. Please try again.");
        setLoading(false);
      }
    };

    fetchGameData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-800 to-purple-950 p-4 text-white flex items-center justify-center">
        <div className="text-2xl">Loading levels...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-800 to-purple-950 p-4 text-white flex items-center justify-center">
        <div className="text-xl text-red-300">{error}</div>
      </main>
    );
  }

  // Get the current level from game data
  const currentLevel = gameData?.currentLevel || 1;

  // Transform the levels data to the format needed by LevelCard
  const levels =
    gameData?.levels.map((level) => ({
      id: level.levelNumber,
      stars: level.stars,
      cleared: level.cleared,
      // A level is locked if its number is greater than currentLevel
      locked: level.levelNumber > currentLevel,
      targetScore: level.maxPoints,
    })) || [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-800 to-purple-950 p-4 text-white relative overflow-hidden">
      {/* Retro scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20 crt-effect"></div>

      {/* Pixelated background grid */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff22 1px, transparent 1px), linear-gradient(90deg, #ffffff22 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="container mx-auto max-w-4xl relative z-20">
        <div className="flex items-center mb-6">
          <Link href="/games">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-purple-700 active:translate-y-1 transition-transform"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1
            className="text-3xl font-bold text-center flex-1 text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] pixelated"
            style={{
              textShadow: "3px 3px 0px #ff00ff, -3px -3px 0px #00ffff",
            }}
          >
            SELECT LEVEL
          </h1>
          <div className="w-10"></div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {levels.map((level) => (
            <LevelCard
              key={level.id}
              level={level.id}
              stars={level.stars}
              locked={level.locked}
              cleared={level.cleared}
              targetScore={level.targetScore}
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-yellow-200">
            Current Progress: Level {currentLevel}
          </p>
          <p className="text-pink-300">
            Total Points: {gameData?.totalPoints || 0}
          </p>
        </div>
      </div>
    </main>
  );
}
