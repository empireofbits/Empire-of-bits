import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, ArrowDown } from "lucide-react";
import useSound from "use-sound";
import Image from "next/image";

interface RetroGameCompletionPopupProps {
  pointsEarned: number;
  gameWon: boolean;
  gameName: string;
  onClose: () => void;
}

const RetroGameCompletionPopup = ({
  pointsEarned,
  gameWon,
  gameName,
  onClose,
}: RetroGameCompletionPopupProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [playSuccess] = useSound("/sounds/success.mp3", { volume: 0.5 });
  const [playFailure] = useSound("/sounds/failure.mp3", { volume: 0.5 });

  useEffect(() => {
    // Play sound on mount
    if (gameWon) {
      playSuccess();
    } else {
      playFailure();
    }

    // Auto-close after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Wait for exit animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [gameWon, playSuccess, playFailure, onClose]);

  const formatGameName = (name: string) => {
    return name
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-black border-4 border-white p-6 pt-8 max-w-sm w-full text-center"
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: -30 }}
          >
            {/* CRT scanlines effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-30"></div>
              <div className="absolute inset-0 crt-effect"></div>
            </div>

            {/* Glitchy border */}
            <div className="absolute inset-0 border-4 border-white opacity-80 animate-glitch"></div>

            {/* Content */}
            <div className="relative z-10">
              {gameWon ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto mb-4 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center"
                  >
                    <Trophy size={32} />
                  </motion.div>
                  <motion.h2
                    className="text-3xl font-bold text-white mb-2 tracking-wider"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-green-400">YOU WON!</span>
                  </motion.h2>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto mb-4 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center"
                  >
                    <X size={32} />
                  </motion.div>
                  <motion.h2
                    className="text-3xl font-bold text-white mb-2 tracking-wider"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-red-400">GAME OVER</span>
                  </motion.h2>
                </>
              )}

              <motion.div
                className="mb-4 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-white">
                  {formatGameName(gameName)}
                </h3>
              </motion.div>

              <motion.div
                className="bg-black border-2 border-white p-4 mb-6"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-white">POINTS EARNED:</span>
                  <motion.span
                    className="text-xl font-bold text-yellow-300"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    {pointsEarned}
                  </motion.span>
                </div>
              </motion.div>

              <motion.div
                className="text-white text-sm opacity-70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.8 }}
              >
                <ArrowDown className="inline mr-1" size={14} />
                <span>Closing in 2 seconds</span>
                <ArrowDown className="inline ml-1" size={14} />
              </motion.div>
            </div>

            {/* Pixelated corners */}
            <div className="absolute top-0 left-0 w-4 h-4 bg-white"></div>
            <div className="absolute top-0 right-0 w-4 h-4 bg-white"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 bg-white"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-white"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RetroGameCompletionPopup;
