"use client";

import { motion } from "framer-motion";
import { Users, Coins, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedButton } from "./animated-button";
import { useTheme } from "./theme-provider";

interface GameCardProps {
  game: {
    id: number;
    title: string;
    category: string;
    minBet: number;
    maxPlayers: number;
    prize: number;
    players: number;
    status: string;
    image: string;
  };
  onHover?: () => void;
  onClick?: () => void;
}

export function GameCard({ game, onHover, onClick }: GameCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getGameImage = (id: number) => {
    return `/game${id}.png`;
  };

  return (
    <motion.div
      className="bg-background border-3 border-foreground hover:border-[hsl(var(--accent-yellow))] transition-colors arcade-card"
      whileHover={{ y: -8 }}
      onMouseEnter={onHover}
      onClick={onClick}
    >
      <div className="bg-secondary h-56 relative overflow-hidden">
        <Image
          src={`${game.image}`}
          alt={game.title}
          width={500}
          height={300}
          className="object-cover w-full h-full"
        />

        <div className="absolute top-0 left-0 w-full p-3 flex justify-between">
          <span className="px-3 py-1.5 bg-background/80 text-base font-bold">
            {game.category}
          </span>

          <span
            className={`px-3 py-1.5 text-base font-bold ${
              game.status === "live"
                ? "bg-red-600 text-white"
                : "bg-yellow-600 text-white"
            }`}
          >
            {game.status === "live" ? "LIVE" : "WAITING"}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-3 flex justify-between text-sm">
          <span className="px-3 py-1.5 bg-background/80 font-bold flex items-center">
            <Coins className="h-4 w-4 mr-2 text-[hsl(var(--accent-yellow))]" />
            MIN BET: {game.minBet} SOL
          </span>

          <span className="px-3 py-1.5 bg-background/80 font-bold flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {game.players}/{game.maxPlayers}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3 flex items-center">
          {game.title}
          {game.status === "live" && (
            <span className="ml-3 inline-flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </h3>

        <div className="flex justify-between items-center text-base text-foreground/70 mb-5">
          <div className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-[hsl(var(--accent-yellow))]" />
            Prize Pool: {game.prize} SOL
          </div>
        </div>

        <Link href={`coming-soon`}>
          <AnimatedButton
            className={`arcade-btn bg-[hsl(var(--accent-purple))] text-white px-5 py-3 w-full border-3 border-[hsl(var(--accent-purple)/0.7)] hover:bg-[hsl(var(--accent-purple)/0.9)] transition-colors text-lg`}
          >
            {game.status === "live" ? "JOIN GAME" : "PLAY NOW"}
          </AnimatedButton>
        </Link>
      </div>
    </motion.div>
  );
}
