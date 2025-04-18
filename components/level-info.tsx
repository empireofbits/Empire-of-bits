import { Progress } from "@/components/ui/progress";

interface LevelInfoProps {
  score: number;
  targetScore: number;
  movesLeft: number;
}

export default function LevelInfo({
  score,
  targetScore,
  movesLeft,
}: LevelInfoProps) {
  const progressPercentage = Math.min(100, (score / targetScore) * 100);

  return (
    <div
      className="bg-purple-900/70 rounded-lg p-3 border-4 border-purple-700"
      style={{
        boxShadow: "inset 0 0 10px rgba(0,0,0,0.5), 0 4px 0 #6b21a8",
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-pink-300 pixelated">
          Score:
        </div>
        <div className="text-lg font-bold text-white pixelated">
          {score} / {targetScore}
        </div>
      </div>

      <Progress
        value={progressPercentage}
        className="h-3 bg-purple-950"
        indicatorClassName="bg-gradient-to-r from-pink-500 to-pink-400"
      />

      <div className="flex justify-between items-center mt-3">
        <div className="text-sm font-medium text-pink-300 pixelated">
          Moves left:
        </div>
        <div className="text-lg font-bold text-white pixelated">
          {movesLeft}
        </div>
      </div>
    </div>
  );
}
