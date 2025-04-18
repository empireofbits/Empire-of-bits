"use client";

import { useEffect, useState, useRef } from "react";
import { useAudio } from "@/hooks/use-audio";

// Candy types
const CANDY_TYPES = ["red", "orange", "yellow", "green", "blue", "purple"];
const CANDY_COLORS = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-400",
  green: "bg-green-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
};

interface GameBoardProps {
  level: number;
  onScoreUpdate: (points: number) => void;
  onMoveComplete: () => void;
}

export default function GameBoard({
  level,
  onScoreUpdate,
  onMoveComplete,
}: GameBoardProps) {
  const BOARD_SIZE = 8;
  const [board, setBoard] = useState<string[][]>([]);
  const [selectedCandy, setSelectedCandy] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [animations, setAnimations] = useState<
    { row: number; col: number; type: string }[]
  >([]);
  const [dragStart, setDragStart] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const { playSound } = useAudio();

  // Initialize the board
  useEffect(() => {
    initializeBoard();
  }, [level]);

  const initializeBoard = async () => {
    const newBoard: string[][] = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      const newRow: string[] = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        let candyType;
        do {
          candyType =
            CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
          // Avoid creating matches when generating the board
        } while (
          (col >= 2 &&
            newRow[col - 1] === candyType &&
            newRow[col - 2] === candyType) ||
          (row >= 2 &&
            newBoard[row - 1][col] === candyType &&
            newBoard[row - 2][col] === candyType)
        );
        newRow.push(candyType);
      }
      newBoard.push(newRow);
    }

    setBoard(newBoard);

    // Check for any matches that might have been created during initialization
    setTimeout(async () => {
      await checkForMatches(newBoard, false);
    }, 500);
  };

  // Handle drag start
  const handleDragStart = (row: number, col: number) => {
    if (isSwapping || isChecking) return;

    setDragStart({ row, col });
    setSelectedCandy({ row, col });
    playSound("select");
  };

  // Handle drag over
  const handleDragOver = (row: number, col: number) => {
    if (!dragStart || isSwapping || isChecking) return;

    // Only consider adjacent candies
    const isAdjacent =
      (Math.abs(dragStart.row - row) === 1 && dragStart.col === col) ||
      (Math.abs(dragStart.col - col) === 1 && dragStart.row === row);

    if (isAdjacent) {
      setSelectedCandy({ row, col });
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (!dragStart || !selectedCandy || isSwapping || isChecking) {
      setDragStart(null);
      setSelectedCandy(null);
      return;
    }

    // If we dragged to a different candy
    if (
      dragStart.row !== selectedCandy.row ||
      dragStart.col !== selectedCandy.col
    ) {
      // Check if the candies are adjacent
      const isAdjacent =
        (Math.abs(dragStart.row - selectedCandy.row) === 1 &&
          dragStart.col === selectedCandy.col) ||
        (Math.abs(dragStart.col - selectedCandy.col) === 1 &&
          dragStart.row === selectedCandy.row);

      if (isAdjacent) {
        swapCandies(
          dragStart.row,
          dragStart.col,
          selectedCandy.row,
          selectedCandy.col
        );
        playSound("swap");
      }
    }

    setDragStart(null);
    setSelectedCandy(null);
  };

  // Legacy click handler (as fallback)
  const handleCandyClick = (row: number, col: number) => {
    if (isSwapping || isChecking) return;

    if (selectedCandy === null) {
      setSelectedCandy({ row, col });
      playSound("select");
    } else {
      // Check if the clicked candy is adjacent to the selected candy
      const isAdjacent =
        (Math.abs(selectedCandy.row - row) === 1 &&
          selectedCandy.col === col) ||
        (Math.abs(selectedCandy.col - col) === 1 && selectedCandy.row === row);

      if (isAdjacent) {
        swapCandies(selectedCandy.row, selectedCandy.col, row, col);
        playSound("swap");
      } else {
        setSelectedCandy({ row, col });
        playSound("select");
      }
    }
  };

  const swapCandies = async (
    row1: number,
    col1: number,
    row2: number,
    col2: number
  ) => {
    setIsSwapping(true);

    // Create a copy of the board
    const newBoard = [...board.map((row) => [...row])];

    // Swap the candies
    const temp = newBoard[row1][col1];
    newBoard[row1][col1] = newBoard[row2][col2];
    newBoard[row2][col2] = temp;

    setBoard(newBoard);
    setSelectedCandy(null);

    // Check if the swap created a match
    setTimeout(async () => {
      const hasMatches = await checkForMatches(newBoard, true);

      if (!hasMatches) {
        // If no matches were created, swap back
        const revertBoard = [...newBoard.map((row) => [...row])];
        revertBoard[row1][col1] = newBoard[row2][col2];
        revertBoard[row2][col2] = newBoard[row1][col1];

        setBoard(revertBoard);
        playSound("invalid");
      } else {
        // Valid move
        onMoveComplete();
      }

      setIsSwapping(false);
    }, 300);
  };

  const checkForMatches = async (
    currentBoard: string[][],
    countMove = true
  ) => {
    setIsChecking(true);

    // Check for horizontal matches
    let hasMatches = false;
    const matchedCandies: { row: number; col: number }[] = [];

    // Check horizontal matches
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE - 2; col++) {
        const candy = currentBoard[row][col];
        if (
          candy &&
          candy === currentBoard[row][col + 1] &&
          candy === currentBoard[row][col + 2]
        ) {
          hasMatches = true;

          // Determine the length of the match
          let matchLength = 3;
          while (
            col + matchLength < BOARD_SIZE &&
            currentBoard[row][col + matchLength] === candy
          ) {
            matchLength++;
          }

          // Add all matched candies to the list
          for (let i = 0; i < matchLength; i++) {
            matchedCandies.push({ row, col: col + i });
          }

          // Skip the matched candies
          col += matchLength - 1;
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = 0; row < BOARD_SIZE - 2; row++) {
        const candy = currentBoard[row][col];
        if (
          candy &&
          candy === currentBoard[row + 1][col] &&
          candy === currentBoard[row + 2][col]
        ) {
          hasMatches = true;

          // Determine the length of the match
          let matchLength = 3;
          while (
            row + matchLength < BOARD_SIZE &&
            currentBoard[row + matchLength][col] === candy
          ) {
            matchLength++;
          }

          // Add all matched candies to the list
          for (let i = 0; i < matchLength; i++) {
            matchedCandies.push({ row: row + i, col });
          }

          // Skip the matched candies
          row += matchLength - 1;
        }
      }
    }

    // Remove duplicates from matchedCandies
    const uniqueMatches = matchedCandies.filter(
      (match, index, self) =>
        index ===
        self.findIndex((m) => m.row === match.row && m.col === match.col)
    );

    if (hasMatches) {
      // Add explosion animations
      setAnimations(
        uniqueMatches.map((match) => ({
          row: match.row,
          col: match.col,
          type: "explode",
        }))
      );

      // Play match sound
      playSound("match");

      // Update score
      if (countMove) {
        onScoreUpdate(uniqueMatches.length * 100);
      }

      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Clear animations
      setAnimations([]);

      // Remove matched candies
      const newBoard = [...currentBoard.map((row) => [...row])];

      uniqueMatches.forEach((match) => {
        newBoard[match.row][match.col] = "";
      });

      setBoard(newBoard);

      // Wait for clearing animation
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Drop candies to fill empty spaces
      const updatedBoard = await dropCandies(newBoard);

      // Check for new matches
      await checkForMatches(updatedBoard, countMove);
    }

    setIsChecking(false);
    return hasMatches;
  };

  const dropCandies = async (currentBoard: string[][]) => {
    const newBoard = [...currentBoard.map((row) => [...row])];
    let hasDropped = false;

    // Drop existing candies
    for (let col = 0; col < BOARD_SIZE; col++) {
      let emptySpaces = 0;

      for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        if (newBoard[row][col] === "") {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          // Move candy down
          newBoard[row + emptySpaces][col] = newBoard[row][col];
          newBoard[row][col] = "";
          hasDropped = true;
        }
      }

      // Fill top rows with new candies
      for (let row = 0; row < BOARD_SIZE; row++) {
        if (newBoard[row][col] === "") {
          newBoard[row][col] =
            CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
          hasDropped = true;
        }
      }
    }

    if (hasDropped) {
      setBoard(newBoard);
      playSound("drop");

      // Wait for dropping animation
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    return newBoard;
  };

  return (
    <div
      ref={boardRef}
      className="grid grid-cols-8 gap-1 aspect-square relative"
      style={{
        backgroundImage:
          "repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.1) 3px, transparent 4px)",
        boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
      }}
    >
      {/* Retro scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(transparent 50%, rgba(0, 0, 0, 0.8) 50%)",
          backgroundSize: "100% 4px",
        }}
      ></div>

      {board.map((row, rowIndex) =>
        row.map((candy, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`
              relative aspect-square rounded-lg cursor-pointer
              ${
                candy && candy in CANDY_COLORS
                  ? CANDY_COLORS[candy as keyof typeof CANDY_COLORS]
                  : "bg-transparent"
              }
              ${
                selectedCandy?.row === rowIndex &&
                selectedCandy?.col === colIndex
                  ? "ring-4 ring-white ring-opacity-70 animate-pulse"
                  : ""
              }
              transition-all duration-200
              ${isSwapping ? "transition-transform duration-300" : ""}
              hover:brightness-110 active:scale-95
            `}
            onClick={() => handleCandyClick(rowIndex, colIndex)}
            onMouseDown={() => handleDragStart(rowIndex, colIndex)}
            onMouseEnter={() => handleDragOver(rowIndex, colIndex)}
            onMouseUp={handleDragEnd}
            onTouchStart={() => handleDragStart(rowIndex, colIndex)}
            onTouchMove={(e) => {
              if (!boardRef.current || !dragStart) return;

              const touch = e.touches[0];
              const boardRect = boardRef.current.getBoundingClientRect();
              const cellSize = boardRect.width / BOARD_SIZE;

              const col = Math.floor(
                (touch.clientX - boardRect.left) / cellSize
              );
              const row = Math.floor(
                (touch.clientY - boardRect.top) / cellSize
              );

              if (
                row >= 0 &&
                row < BOARD_SIZE &&
                col >= 0 &&
                col < BOARD_SIZE
              ) {
                handleDragOver(row, col);
              }
            }}
            onTouchEnd={handleDragEnd}
            style={{
              transform: animations.some(
                (anim) => anim.row === rowIndex && anim.col === colIndex
              )
                ? "scale(1.2)"
                : "scale(1)",
            }}
          >
            {/* Candy shape with more retro styling */}
            <div
              className={`
              absolute inset-1 rounded-full 
              ${candy ? `bg-${candy}-400 bg-opacity-70` : ""}
              shadow-inner
              transition-all duration-300
              ${
                animations.some(
                  (anim) => anim.row === rowIndex && anim.col === colIndex
                )
                  ? "scale-0"
                  : "scale-1"
              }
            `}
              style={{
                boxShadow:
                  "inset 0 -4px 4px rgba(0,0,0,0.3), inset 0 4px 4px rgba(255,255,255,0.3)",
              }}
            ></div>

            {/* Pixelated highlight */}
            <div
              className={`
              absolute top-1 left-1 right-1 h-1/3 rounded-t-full
              ${candy ? "bg-white bg-opacity-30" : ""}
            `}
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 80% 50%, 20% 50%)",
              }}
            ></div>

            {/* Retro pixel border */}
            <div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                boxShadow:
                  "inset 0 0 0 2px rgba(255,255,255,0.2), inset 0 0 0 4px rgba(0,0,0,0.1)",
                backgroundImage:
                  "radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.2) 100%)",
              }}
            ></div>

            {/* Animation effect */}
            {animations.some(
              (anim) =>
                anim.row === rowIndex &&
                anim.col === colIndex &&
                anim.type === "explode"
            ) && (
              <>
                <div className="absolute inset-0 bg-white animate-ping rounded-full"></div>
                <div className="absolute inset-[-50%] flex items-center justify-center">
                  <div className="text-yellow-300 text-2xl font-bold animate-bounce">
                    +100
                  </div>
                </div>
                {/* Particle effects */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `translate(-50%, -50%)`,
                      animation: `particle-${i} 0.5s forwards`,
                    }}
                  />
                ))}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
