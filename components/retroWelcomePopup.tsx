import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface RetroWelcomePopupProps {
  onClose: () => void;
}

function RetroWelcomePopup({ onClose }: RetroWelcomePopupProps) {
  const [audioPlayed, setAudioPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current && !audioPlayed) {
      audioRef.current.volume = 0.5;
      audioRef.current
        .play()
        .then(() => setAudioPlayed(true))
        .catch((err) => console.error("Failed to play audio:", err));
    }

    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose, audioPlayed]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <audio
        ref={audioRef}
        src="/sounds/retro-welcome.mp3"
        className="hidden"
      />

      <motion.div
        className="relative bg-black border-4 border-neon-pink p-8 max-w-md w-full text-center overflow-hidden"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: {
            delay: 0.3,
            type: "spring",
            stiffness: 300,
          },
        }}
      >
        <div className="absolute inset-0 scanlines pointer-events-none"></div>

        <motion.div
          className="absolute inset-0 bg-neon-blue opacity-20"
          animate={{
            opacity: [0.1, 0.2, 0.1, 0.3, 0.1],
            x: [-2, 1, -1, 0, -1],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.5,
          }}
        />

        <motion.h2
          className="text-neon-green text-4xl font-bold mb-6 tracking-wider"
          animate={{
            textShadow: [
              "0 0 5px #00ff00, 0 0 10px #00ff00",
              "0 0 7px #00ff00, 0 0 14px #00ff00",
              "0 0 5px #00ff00, 0 0 10px #00ff00",
            ],
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          WELCOME TO EMPIRE OF BITS!
        </motion.h2>

        <motion.div
          className="text-2xl font-pixel text-white mb-8"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <p className="mb-4">YOU'VE BEEN AWARDED</p>
          <div className="flex items-center justify-center">
            <motion.span
              className="text-neon-yellow text-5xl font-bold"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              50
            </motion.span>
            <span className="text-neon-yellow text-3xl ml-2">POINTS!</span>
          </div>
        </motion.div>

        <div className="flex justify-center mb-8">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-12 h-12 bg-yellow-400 rounded-full mx-1 border-2 border-yellow-600"
              animate={{
                y: [0, -20, 0],
                rotateY: [0, 180, 360],
              }}
              transition={{
                delay: i * 0.15,
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-yellow-800 font-bold">
                $
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          className="bg-neon-red text-white px-8 py-3 font-bold text-xl border-2 border-white hover:bg-red-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
        >
          START PLAYING!
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default RetroWelcomePopup;
