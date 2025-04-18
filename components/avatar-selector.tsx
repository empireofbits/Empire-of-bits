"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const AVATARS = [
  { id: 1, ascii: "(⌐■_■)", borderColor: "border-white" },
  { id: 2, ascii: "ʕ•ᴥ•ʔ", borderColor: "border-white" },
  { id: 3, ascii: "(づ｡◕‿‿◕｡)づ", borderColor: "border-white" },
  { id: 4, ascii: "ಠ_ಠ", borderColor: "border-white" },
  { id: 5, ascii: "(╯°□°）╯︵ ┻━┻", borderColor: "border-white" },
  { id: 6, ascii: "¯\\_(ツ)_/¯", borderColor: "border-white" },
];

export default function AvatarSelector() {
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    // Load saved avatar from localStorage
    const savedAvatar = localStorage.getItem("selectedAvatar");
    if (savedAvatar !== null) {
      setSelectedAvatar(Number.parseInt(savedAvatar));
    }

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 150);
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleSelectAvatar = (index: number) => {
    setSelectedAvatar(index);
    localStorage.setItem("selectedAvatar", index.toString());
    setIsOpen(false);
  };

  const handlePrevAvatar = () => {
    const newIndex =
      selectedAvatar === 0 ? AVATARS.length - 1 : selectedAvatar - 1;
    handleSelectAvatar(newIndex);
  };

  const handleNextAvatar = () => {
    const newIndex =
      selectedAvatar === AVATARS.length - 1 ? 0 : selectedAvatar + 1;
    handleSelectAvatar(newIndex);
  };

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-24 h-24 border-2 border-white flex items-center justify-center text-xl cursor-pointer relative overflow-hidden ${
          glitching ? "glitch-effect" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative z-10 font-mono">
          {AVATARS[selectedAvatar]?.ascii || "(⌐■_■)"}
        </div>
      </motion.div>

      {/* Avatar selector */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black border-2 border-white p-4 z-20 w-64"
        >
          <div className="text-center mb-2 text-white text-sm font-mono">
            SELECT AVATAR
          </div>

          <div className="grid grid-cols-2 gap-2">
            {AVATARS.map((avatar, index) => (
              <motion.div
                key={avatar.id}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
                whileTap={{ scale: 0.9 }}
                className={`h-16 border border-white flex items-center justify-center text-lg cursor-pointer relative overflow-hidden ${
                  selectedAvatar === index ? "bg-white/20" : ""
                }`}
                onClick={() => handleSelectAvatar(index)}
              >
                <div className="relative z-10 font-mono">{avatar.ascii}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Navigation buttons */}
      {!isOpen && (
        <div className="flex justify-center mt-2 gap-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-black border border-white text-white"
              onClick={handlePrevAvatar}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-black border border-white text-white"
              onClick={handleNextAvatar}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
