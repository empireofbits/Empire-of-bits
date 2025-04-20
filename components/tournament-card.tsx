"use client";

import { motion } from "framer-motion";
import { Trophy, Users, Clock, Coins } from "lucide-react";
import Link from "next/link";
import { AnimatedButton } from "./animated-button";
import { useTheme } from "./theme-provider";

interface TournamentCardProps {
  tournament: {
    id: number;
    title: string;
    game: string;
    entryFee: number;
    prize: number;
    players: number;
    status: string;
    timeLeft: string;
  };
  onHover?: () => void;
  onClick?: () => void;
}

export function TournamentCard({
  tournament,
  onHover,
  onClick,
}: TournamentCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className="bg-background border-3 border-foreground hover:border-[hsl(var(--accent-yellow))] transition-colors arcade-card"
      whileHover={{ y: -8 }}
      onMouseEnter={onHover}
      onClick={onClick}
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold">{tournament.title}</h3>
            <p className="text-lg text-foreground/70 mt-1">{tournament.game}</p>
          </div>
          <div
            className={`px-3 py-1.5 text-base font-bold text-white ${
              tournament.status === "live"
                ? "bg-red-600"
                : tournament.status === "registering"
                ? "bg-green-600"
                : "bg-yellow-600"
            }`}
          >
            {tournament.status.toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-secondary p-4 border-2 border-foreground/20">
            <div className="text-sm text-foreground/70 mb-2 flex items-center">
              <Trophy className="h-4 w-4 mr-2" />
              PRIZE POOL
            </div>
            <div className="text-2xl font-bold text-[hsl(var(--accent-yellow))]">
              {tournament.prize} Sol
            </div>
          </div>

          <div className="bg-secondary p-4 border-2 border-foreground/20">
            <div className="text-sm text-foreground/70 mb-2 flex items-center">
              <Coins className="h-4 w-4 mr-2" />
              ENTRY FEE
            </div>
            <div className="text-2xl font-bold">{tournament.entryFee} SOL</div>
          </div>

          <div className="bg-secondary p-4 border-2 border-foreground/20">
            <div className="text-sm text-foreground/70 mb-2 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              PLAYERS
            </div>
            <div className="text-2xl font-bold">{tournament.players}</div>
          </div>

          <div className="bg-secondary p-4 border-2 border-foreground/20">
            <div className="text-sm text-foreground/70 mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              TIME LEFT
            </div>
            <div className="text-2xl font-bold">{tournament.timeLeft}</div>
          </div>
        </div>

        <Link href={`/coming-soon`}>
          <AnimatedButton className="arcade-btn bg-[hsl(var(--accent-purple))] text-white px-5 py-3 w-full border-3 border-[hsl(var(--accent-purple)/0.7)] hover:bg-[hsl(var(--accent-purple)/0.9)] transition-colors text-lg">
            {tournament.status === "registering"
              ? "REGISTER NOW"
              : "VIEW DETAILS"}
          </AnimatedButton>
        </Link>
      </div>
    </motion.div>
  );
}
