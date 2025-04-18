import Link from "next/link";
import { Star, Lock, CheckCircle } from "lucide-react";

interface LevelCardProps {
  level: number;
  stars: number;
  locked: boolean;
  cleared?: boolean;
  targetScore?: number;
}

export default function LevelCard({
  level,
  stars,
  locked,
  cleared = false,
  targetScore = 0,
}: LevelCardProps) {
  // Determine background color based on level status
  const getBgColors = () => {
    if (cleared) {
      return {
        gradient: "from-green-600 to-green-800",
        border: "border-green-500",
        hover: "hover:from-green-500 hover:to-green-700",
        shadow: "#10b981",
      };
    }
    // Current level (playable but not cleared)
    if (!locked) {
      return {
        gradient: "from-pink-600 to-pink-800",
        border: "border-pink-500",
        hover: "hover:from-pink-500 hover:to-pink-700",
        shadow: "#db2777",
      };
    }
    // Locked level
    return {
      gradient: "from-gray-700 to-gray-800",
      border: "border-gray-700",
      hover: "",
      shadow: "#374151",
    };
  };

  const colors = getBgColors();

  return (
    <div className="aspect-square">
      {locked ? (
        <div
          className={`h-full flex items-center justify-center rounded-lg bg-gradient-to-b ${colors.gradient} ${colors.border} opacity-70`}
          style={{
            boxShadow: `inset 0 0 10px rgba(0,0,0,0.5), 0 4px 0 ${colors.shadow}`,
          }}
        >
          <Lock className="h-8 w-8 text-gray-400" />
        </div>
      ) : (
        <Link href={`/play-candy?level=${level}`}>
          <div
            className={`h-full flex flex-col items-center justify-center rounded-lg bg-gradient-to-b ${colors.gradient} border-4 ${colors.border} ${colors.hover} transition-colors cursor-pointer shadow-md active:translate-y-1 transition-transform`}
            style={{
              boxShadow: `0 4px 0 ${colors.shadow}`,
              textShadow: "2px 2px 0 rgba(0,0,0,0.5)",
            }}
          >
            <span className="text-2xl font-bold pixelated">{level}</span>

            {cleared && (
              <CheckCircle className="h-5 w-5 text-white absolute top-2 right-2" />
            )}

            <div className="flex mt-1">
              {[1, 2, 3].map((i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i <= stars
                      ? "text-yellow-300 fill-yellow-300"
                      : "text-gray-500"
                  }`}
                />
              ))}
            </div>

            {targetScore > 0 && (
              <div className="text-xs mt-1 opacity-80">
                Target: {targetScore}
              </div>
            )}
          </div>
        </Link>
      )}
    </div>
  );
}
