"use client";

import { useEffect, useRef, useState } from "react";

type SoundType =
  | "select"
  | "swap"
  | "match"
  | "invalid"
  | "drop"
  | "score"
  | "gameOver"
  | "levelComplete";

export function useAudio() {
  const [muted, setMuted] = useState(false);
  const audioRefs = useRef<Record<SoundType, HTMLAudioElement | null>>({
    select: null,
    swap: null,
    match: null,
    invalid: null,
    drop: null,
    score: null,
    gameOver: null,
    levelComplete: null,
  });

  useEffect(() => {
    // Initialize audio elements
    if (typeof window !== "undefined") {
      audioRefs.current = {
        select: new Audio("/sounds/select.mp3"),
        swap: new Audio("/sounds/swap.mp3"),
        match: new Audio("/sounds/match.mp3"),
        invalid: new Audio("/sounds/invalid.mp3"),
        drop: new Audio("/sounds/drop.mp3"),
        score: new Audio("/sounds/score.mp3"),
        gameOver: new Audio("/sounds/game-over.mp3"),
        levelComplete: new Audio("/sounds/level-complete.mp3"),
      };

      // Preload sounds and set retro-style audio settings
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.load();
          audio.volume = 0.5;

          // Add a bit of distortion to make sounds more "retro"
          try {
            if (window.AudioContext || (window as any).webkitAudioContext) {
              const audioContext = new ((window as any).AudioContext ||
                (window as any).webkitAudioContext)();
              const source = audioContext.createMediaElementSource(audio);

              // Create a simple distortion effect
              const distortion = audioContext.createWaveShaper();
              const makeDistortionCurve = (amount = 50) => {
                const k = typeof amount === "number" ? amount : 50;
                const n_samples = 44100;
                const curve = new Float32Array(n_samples);
                const deg = Math.PI / 180;

                for (let i = 0; i < n_samples; ++i) {
                  const x = (i * 2) / n_samples - 1;
                  curve[i] =
                    ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
                }
                return curve;
              };

              distortion.curve = makeDistortionCurve(200);
              distortion.oversample = "4x";

              // Connect the nodes
              source.connect(distortion);
              distortion.connect(audioContext.destination);
            }
          } catch (e) {
            // Fallback if audio processing is not supported
            console.log("Advanced audio processing not supported");
          }
        }
      });
    }

    return () => {
      // Cleanup
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  const playSound = (type: SoundType) => {
    if (muted || !audioRefs.current[type]) return;

    // Stop and reset the sound before playing
    const audio = audioRefs.current[type];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((err) => console.error("Error playing sound:", err));
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  return { playSound, toggleMute, muted };
}
