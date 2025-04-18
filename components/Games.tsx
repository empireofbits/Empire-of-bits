"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import GameBoard from "@/components/game-board";
import LevelInfo from "@/components/level-info";
import GameOverModal from "@/components/game-over-modal";
import { useAudio } from "@/hooks/use-audio";

export default function Games() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const levelId = Number.parseInt(searchParams.get("level") || "1");
  console.log(levelId);

  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [stars, setStars] = useState(0);
  interface LevelData {
    levelNumber: number;
    maxPoints: number;
    cleared: boolean;
    stars: number;
  }

  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [pointsEarned, setPointsEarned] = useState(0);

  // Replace with your actual user ID or get it from your auth system
  const userId = localStorage.getItem("walletAddress"); // You should replace this with actual user ID from your auth system

  const { playSound } = useAudio();

  // Fetch level data when component mounts
  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        // Get game data to get this level's target score
        const response = await fetch(
          "http://127.0.0.1:3001/api/v1/games/candycrush",
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
        const gameData = data.data;

        // Find the current level in the game data
        interface GameLevel {
          levelNumber: number;
          maxPoints: number;
          cleared: boolean;
          stars: number;
        }

        interface GameData {
          levels: GameLevel[];
        }

        const game: GameData = gameData;

        const currentLevel: GameLevel | undefined = game.levels.find(
          (level) => level.levelNumber === levelId
        );

        if (currentLevel) {
          setLevelData(currentLevel);
        } else {
          // Fallback if level not found
          setLevelData({
            levelNumber: levelId,
            maxPoints: 1000 * levelId,
            cleared: false,
            stars: 0,
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching level data:", err);
        // Fallback if API call fails
        setLevelData({
          levelNumber: levelId,
          maxPoints: 1000 * levelId,
          cleared: false,
          stars: 0,
        });
        setLoading(false);
      }
    };

    fetchLevelData();
  }, [levelId, userId]);

  useEffect(() => {
    // Reset game state when level changes
    setScore(0);
    setMovesLeft(15 + Math.floor(levelId / 2));
    setGameOver(false);

    // Clear any existing redirect timer
    if (redirectTimer) {
      clearTimeout(redirectTimer);
      setRedirectTimer(null);
    }
  }, [levelId]);

  useEffect(() => {
    // Check if game is over
    if (movesLeft <= 0) {
      setGameOver(true);
      calculateStars();
      playSound("gameOver");
    }
  }, [movesLeft]);

  const calculateStars = () => {
    const targetScore = levelData?.maxPoints || 1000 * levelId;

    if (score >= targetScore * 1.5) {
      setStars(3);
    } else if (score >= targetScore) {
      setStars(2);
    } else if (score >= targetScore * 0.5) {
      setStars(1);
    } else {
      setStars(0);
    }
  };

  const handleScoreUpdate = (points: number) => {
    setScore((prev) => prev + points);
    playSound("score");
  };

  const handleMoveComplete = () => {
    setMovesLeft((prev) => prev - 1);
    // playSound("move")
  };

  const handleNextLevel = () => {
    router.push(`/play-candy?level=${levelId + 1}`);
  };

  const handleRetryLevel = () => {
    setScore(0);
    setMovesLeft(15 + Math.floor(levelId / 2));
    setGameOver(false);
  };

  const updateLevelProgressInBackend = async () => {
    const targetScore = levelData?.maxPoints || 1000 * levelId;
    const isLevelCompleted = score >= targetScore;

    try {
      const response = await fetch(
        `http://127.0.0.1:3001/api/v1/games/candycrush/${userId}/level`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            levelNumber: levelId,
            score,
            stars,
            cleared: isLevelCompleted,
          }),
        }
      );

      // Update points earned for display in the modal
      const data = await response.json();
      console.log("Level progress updated:", data);
      if (data.pointsEarned) {
        setPointsEarned(data.pointsEarned);
      }

      // Start the redirect timer if level was completed
      if (isLevelCompleted) {
        const timer = setTimeout(() => {
          router.push(
            `/?gameWon=true&gameName=candycrush&pointsEarned=${data.pointsEarned}`
          );
        }, 2000);
        setRedirectTimer(timer);
      }

      return data;
    } catch (err) {
      console.error("Error updating level progress:", err);
      return null;
    }
  };

  // Update backend when game is over
  useEffect(() => {
    if (gameOver) {
      updateLevelProgressInBackend();
    }
  }, [gameOver]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [redirectTimer]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-800 to-purple-950 p-4 text-white flex items-center justify-center">
        <div className="text-2xl">Loading level...</div>
      </main>
    );
  }

  const targetScore = levelData?.maxPoints || 1000 * levelId;

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

      <div className="container mx-auto max-w-md relative z-20">
        <div className="flex items-center mb-4">
          <Link href="/levels">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-purple-700 active:translate-y-1 transition-transform"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1
            className="text-2xl font-bold text-center flex-1 text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] pixelated"
            style={{
              textShadow: "2px 2px 0px #ff00ff, -2px -2px 0px #00ffff",
            }}
          >
            LEVEL {levelId}
          </h1>
          <div className="w-10"></div>
        </div>

        <LevelInfo
          score={score}
          targetScore={targetScore}
          movesLeft={movesLeft}
        />

        <div
          className="mt-4 bg-purple-900/50 p-2 rounded-lg border-4 border-purple-700"
          style={{
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.5), 0 4px 0 #6b21a8",
          }}
        >
          <GameBoard
            level={levelId}
            onScoreUpdate={handleScoreUpdate}
            onMoveComplete={handleMoveComplete}
          />
        </div>
      </div>

      {gameOver && (
        <GameOverModal
          score={score}
          targetScore={targetScore}
          stars={stars}
          pointsEarned={pointsEarned}
          redirecting={redirectTimer !== null}
          onNextLevel={handleNextLevel}
          onRetry={handleRetryLevel}
        />
      )}
    </main>
  );
}
