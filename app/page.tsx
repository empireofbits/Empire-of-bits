"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Trophy,
  Users,
  Gamepad2,
  Zap,
  Wallet,
  Bell,
  Menu,
  X,
  ArrowRight,
  Coins,
  BarChart3,
  Award,
  Clock,
  Sparkles,
} from "lucide-react";
import { GameCard } from "@/components/game-card";
import { TournamentCard } from "@/components/tournament-card";
import { useMobile } from "@/hooks/use-mobile";
import { AnimatedButton } from "@/components/animated-button";
import { ParticleButton } from "@/components/particle-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import RetroWelcomePopup from "@/components/retroWelcomePopup";
import RetroGameCompletionPopup from "@/components/GameComplitionPopup";

export default function Home() {
  const [isHovering, setIsHovering] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("featured");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [cryptoBalance, setCryptoBalance] = useState("0.00");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [scrolled, setScrolled] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [showRetroWelcome, setShowRetroWelcome] = useState(false);
  const [showConnectWalletPrompt, setShowConnectWalletPrompt] = useState(false);
  const [gameCompletionInfo, setGameCompletionInfo] = useState<{
    pointsEarned: number;
    gameWon: boolean;
    gameName: string;
  } | null>(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Tournament Starting",
      message: "WEEKEND WARRIOR tournament starts in 30 minutes!",
    },
    {
      id: 2,
      title: "New Game Added",
      message: "CRYPTO PUZZLER is now available to play!",
    },
    {
      id: 3,
      title: "Bonus Tokens",
      message: "You received 50 bonus tokens for daily login!",
    },
  ]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const isMobile = useMobile();
  const { theme } = useTheme();
  const { toast } = useToast();

  // Simulated data
  const featuredGames = [
    {
      id: 1,
      title: "CRYPTO RACER",
      category: "Racing",
      image: "/images/cryptoRacer.jpeg",
      minBet: 0.01,
      maxPlayers: 8,
      prize: 0.25,
      players: 6,
      status: "live",
    },
    {
      id: 2,
      title: "PIXEL WARRIORS",
      category: "Fighting",
      image: "/images/pixelWarriors.jpeg",
      minBet: 0.05,
      maxPlayers: 2,
      prize: 0.15,
      players: 2,
      status: "live",
    },
    {
      id: 3,
      title: "NFT HUNTERS",
      category: "Adventure",
      image: "/images/nftHunters.jpeg",
      minBet: 0.02,
      maxPlayers: 4,
      prize: 0.12,
      players: 1,
      status: "waiting",
    },
  ];

  const tournaments = [
    {
      id: 1,
      title: "WEEKEND WARRIOR",
      game: "MULTI-GAME",
      entryFee: 0.1,
      prize: 5.0,
      players: 64,
      status: "registering",
      timeLeft: "1d 12h",
    },
    {
      id: 2,
      title: "CRYPTO CUP",
      game: "CRYPTO RACER",
      entryFee: 0.25,
      prize: 10.0,
      players: 32,
      status: "live",
      timeLeft: "ongoing",
    },
  ];

  const leaderboardData = [
    {
      rank: 1,
      player: "CryptoKing",
      game: "PIXEL WARRIORS",
      score: 98750,
      earnings: 12.45,
    },
    {
      rank: 2,
      player: "BlockchainBeast",
      game: "CRYPTO RACER",
      score: 87320,
      earnings: 8.72,
    },
    {
      rank: 3,
      player: "NFTNinja",
      game: "NFT HUNTERS",
      score: 76540,
      earnings: 7.21,
    },
    {
      rank: 4,
      player: "TokenTitan",
      game: "CRYPTO RACER",
      score: 65980,
      earnings: 5.89,
    },
    {
      rank: 5,
      player: "MetaMaster",
      game: "PIXEL WARRIORS",
      score: 54320,
      earnings: 4.32,
    },
  ];

  const handleGameInteraction = () => {
    if (!walletConnected) {
      setShowConnectWalletPrompt(true);
      // Auto-hide prompt after 5 seconds
      setTimeout(() => setShowConnectWalletPrompt(false), 5000);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Use window.location to get search params
    const params = new URLSearchParams(window.location.search);
    console.log(params.toString());
    const pointsEarned = params.get("pointsEarned");
    const gameWon = params.get("gameWon");
    const gameName = params.get("gameName");

    if (pointsEarned && gameWon && gameName) {
      // Set game completion info
      setGameCompletionInfo({
        pointsEarned: parseInt(pointsEarned),
        gameWon: gameWon === "true",
        gameName: gameName,
      });

      // Update user points
      if (parseInt(pointsEarned) > 0) {
        setUserPoints((prev) => prev + parseInt(pointsEarned));
      }

      // Clean up URL params after processing
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  const handleCloseGameCompletion = () => {
    setGameCompletionInfo(null);
  };

  // const fetchUserPoints = async () => {
  //   // if (!walletConnected) return;
  //   // console.log(walletConnected);
  //   console.log("Fetching user points...");
  //   try {
  //     setIsLoading(true);

  //     // Get user ID from wallet address
  //     const walletAddress = "wallet-address-here"; // This would be the actual connected wallet address

  //     // Make API call to your backend
  //     const response = await fetch("http://127.0.0.1:3001/api/v1/users", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId: walletAddress,
  //       }),
  //     });

  //     const data = await response.json();
  //     console.log(data);

  //     if (data.success) {
  //       setUserPoints(data.data.points);

  //       // Show retro congratulation popup for new users
  //       if (data.newUser) {
  //         setShowRetroWelcome(true);
  //         // Pre-load the welcome sound
  //         const audio = new Audio("/sounds/retro-welcome.mp3");
  //         audio.load();
  //       }
  //     } else {
  //       console.error("Failed to fetch user:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error in user data operation:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handlePointsUpdate = (newPoints: number) => {
    setUserPoints(newPoints);
    // Here you would typically make an API call to update the points on your backend
    // Example: await fetch('/api/user/points', { method: 'PUT', body: JSON.stringify({ points: newPoints }) });
  };

  // Show welcome toast on first load
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setTimeout(() => {
        toast({
          title: "Welcome to Empire of Bits!",
          description:
            "The ultimate Web3 arcade gaming platform. Connect your wallet to start playing!",
          duration: 5000,
        });
        localStorage.setItem("hasSeenWelcome", "true");
      }, 1000);
    }
  }, [toast]);

  const playSound = (sound: string) => {
    if (audioRef.current) {
      audioRef.current.src = `/sounds/${sound}.mp3`;
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play prevented:", e));
    }
  };

  // useEffect(() => {
  //   if (walletConnected) {
  //     console.log("Wallet connected, fetching points...");
  //     fetchUserPoints();
  //   }
  // }, [walletConnected]);

  // 3. Update the handleConnectWallet function to ensure proper flow
  const handleConnectWallet = async () => {
    try {
      setIsLoading(true);
      console.log("Connecting wallet...");

      // Mock wallet connection process
      // For real implementation, replace with actual wallet connection code
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setWalletConnected(true);
      setShowWalletModal(false);
      setCryptoBalance("0.05");
      setTokenBalance("100");

      // Note: We're not calling fetchUserPoints here anymore
      // because the useEffect will handle that

      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully!",
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const WalletPrompt = () => {
    if (!showConnectWalletPrompt) return null;

    return (
      <div className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-blue-500 p-4 rounded-lg shadow-lg animate-pulse z-50 max-w-sm">
        <h3 className="text-white font-bold text-lg mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-white text-sm mb-3">
          Connect your wallet to play games and earn rewards!
        </p>
        <button
          onClick={() => setShowWalletModal(true)}
          className="bg-white text-purple-600 px-4 py-2 rounded-md font-bold text-sm hover:bg-opacity-90 transition-all"
        >
          Connect Now
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono overflow-hidden relative">
      <AnimatePresence>
        {showRetroWelcome && (
          <RetroWelcomePopup onClose={() => setShowRetroWelcome(false)} />
        )}

        {gameCompletionInfo && (
          <RetroGameCompletionPopup
            pointsEarned={gameCompletionInfo.pointsEarned}
            gameWon={gameCompletionInfo.gameWon}
            gameName={gameCompletionInfo.gameName}
            onClose={handleCloseGameCompletion}
          />
        )}
      </AnimatePresence>
      {/* Audio element for sound effects */}
      <audio ref={audioRef} className="hidden" />

      {/* Theme-specific effects */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {theme === "dark" ? (
          <>
            {/* Dark theme effects */}
            <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-10"></div>
            <div className="absolute inset-0 bg-radial-gradient opacity-20"></div>
            <div className="absolute inset-0 crt-effect"></div>
          </>
        ) : (
          <>
            {/* Light theme effects */}
            <div className="absolute inset-0 dot-pattern"></div>
            <div className="absolute inset-0 animated-gradient"></div>
          </>
        )}
      </div>

      {/* Noise overlay */}
      <div className="noise"></div>

      {/* Custom cursor (desktop only) */}
      {!isMobile && (
        <motion.div
          className="fixed w-12 h-12 pointer-events-none z-50 mix-blend-difference hidden md:block"
          animate={{ x: cursorPosition.x - 24, y: cursorPosition.y - 24 }}
          transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
        >
          <div className="w-full h-full border-3 border-current rotate-45 animate-pulse"></div>
        </motion.div>
      )}

      {/* Sticky Header */}
      <Header userPoints={userPoints} onPointsUpdate={handlePointsUpdate} />

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 bg-background z-40 md:hidden pt-20"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col h-full px-6 py-8">
              <Link
                href="/"
                className="py-5 border-b-2 border-foreground/20 text-2xl font-bold"
                onClick={() => {
                  setMenuOpen(false);
                  playSound("click");
                }}
              >
                HOME
              </Link>
              <Link
                href="/games"
                className="py-5 border-b-2 border-foreground/20 text-2xl font-bold"
                onClick={() => {
                  setMenuOpen(false);
                  playSound("click");
                }}
              >
                GAMES
              </Link>
              <Link
                href="/tournaments"
                className="py-5 border-b-2 border-foreground/20 text-2xl font-bold"
                onClick={() => {
                  setMenuOpen(false);
                  playSound("click");
                }}
              >
                TOURNAMENTS
              </Link>
              <Link
                href="/marketplace"
                className="py-5 border-b-2 border-foreground/20 text-2xl font-bold"
                onClick={() => {
                  setMenuOpen(false);
                  playSound("click");
                }}
              >
                MARKETPLACE
              </Link>

              {!walletConnected && (
                <AnimatedButton
                  className="mt-8 flex items-center justify-center gap-3 bg-[hsl(var(--accent-purple))] py-4 border-3 border-[hsl(var(--accent-purple)/0.7)] text-xl font-bold text-white"
                  onClick={() => {
                    setShowWalletModal(true);
                    setMenuOpen(false);
                    playSound("click");
                  }}
                >
                  <Wallet className="h-6 w-6" />
                  <span>CONNECT WALLET</span>
                </AnimatedButton>
              )}

              {walletConnected && (
                <div className="mt-8 p-6 border-3 border-foreground bg-secondary">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-foreground/70 text-lg">WALLET</span>
                    <span className="text-base">0x71...3F4d</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="flex items-center text-lg">
                      <Image
                        src="/sol.png"
                        width={20}
                        height={20}
                        alt="Sol"
                        className="mr-2"
                      />
                      SOL Balance
                    </span>
                    <span className="font-bold text-lg">{cryptoBalance}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center text-lg">
                      <Image
                        src="/token.png"
                        width={20}
                        height={20}
                        alt="Game Token"
                        className="mr-2"
                      />
                      EOB Tokens
                    </span>
                    <span className="font-bold text-lg">{tokenBalance}</span>
                  </div>
                </div>
              )}

              {/* Theme toggle in mobile menu */}
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-4">
                  <span className="text-lg">THEME:</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet Connection Modal */}
      <AnimatePresence>
        {showWalletModal && (
          <motion.div
            className="fixed inset-0 bg-foreground/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-background border-4 border-foreground p-8 max-w-md w-full relative pixel-corners"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <button
                className="absolute top-4 right-4 text-foreground/70 hover:text-foreground"
                onClick={() => {
                  setShowWalletModal(false);
                  playSound("click");
                }}
              >
                <X className="h-8 w-8" />
              </button>

              <h2
                className="text-3xl font-bold mb-8 text-center glitch-text-sm"
                data-text="CONNECT WALLET"
              >
                CONNECT WALLET
              </h2>

              <div className="grid gap-5">
                <AnimatedButton
                  className="flex items-center justify-between p-5 border-3 border-foreground hover:border-[hsl(var(--accent-yellow))] hover:bg-foreground/5 transition-colors"
                  onClick={handleConnectWallet}
                >
                  <div className="flex items-center">
                    <Image
                      src="/metamask.png"
                      width={40}
                      height={40}
                      alt="MetaMask"
                      className="mr-4"
                    />
                    <span className="font-bold text-xl">Phantom</span>
                  </div>
                  <ArrowRight className="h-6 w-6" />
                </AnimatedButton>

                <AnimatedButton
                  className="flex items-center justify-between p-5 border-3 border-foreground hover:border-[hsl(var(--accent-yellow))] hover:bg-foreground/5 transition-colors"
                  onClick={handleConnectWallet}
                >
                  <div className="flex items-center">
                    <Image
                      src="/walletconnect.png"
                      width={40}
                      height={40}
                      alt="WalletConnect"
                      className="mr-4"
                    />
                    <span className="font-bold text-xl">Backpack</span>
                  </div>
                  <ArrowRight className="h-6 w-6" />
                </AnimatedButton>

                <AnimatedButton
                  className="flex items-center justify-between p-5 border-3 border-foreground hover:border-[hsl(var(--accent-yellow))] hover:bg-foreground/5 transition-colors"
                  onClick={handleConnectWallet}
                >
                  <div className="flex items-center">
                    <Image
                      src="/coinbase.png"
                      width={40}
                      height={40}
                      alt="Coinbase Wallet"
                      className="mr-4"
                    />
                    <span className="font-bold text-xl">Solflare</span>
                  </div>
                  <ArrowRight className="h-6 w-6" />
                </AnimatedButton>
              </div>

              <p className="text-sm text-foreground/70 mt-8 text-center">
                By connecting your wallet, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 relative z-10 pt-28">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 text-center relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-[hsl(var(--accent-purple))] rotate-45 animate-float"></div>
            <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-[hsl(var(--accent-yellow))] rotate-45 animate-float-delay"></div>
            <div className="absolute bottom-1/4 left-1/3 w-7 h-7 bg-[hsl(var(--accent-green))] rotate-45 animate-float-slow"></div>
            <div className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-red-500 rotate-45 animate-float-slower"></div>
          </div>

          <div className="max-w-5xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <span className="inline-block px-4 py-2 bg-[hsl(var(--accent-purple))] text-base font-bold border-3 border-[hsl(var(--accent-purple)/0.7)] mb-3 text-white">
                Solana ARCADE GAMING
              </span>
            </motion.div>

            <motion.h2
              className="text-5xl md:text-7xl font-bold mb-8 glitch-text-lg"
              data-text="PLAY. BET. WIN."
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              PLAY. BET. WIN.
            </motion.h2>

            <motion.p
              className="text-xl md:text-2xl mb-12 text-foreground/80 max-w-3xl mx-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Relive the classics, earn the future.
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div
                className="relative inline-block"
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => {
                  setIsHovering("games");
                  playSound("hover");
                }}
                onMouseLeave={() => setIsHovering("")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link href="/games">
                  <ParticleButton
                    className="bg-[hsl(var(--accent-purple))] text-white px-12 py-5 text-2xl font-bold border-4 border-[hsl(var(--accent-purple)/0.7)] relative overflow-hidden group"
                    onClick={() => playSound("click")}
                  >
                    <span className="relative z-10 flex items-center">
                      PLAY GAMES
                      <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </ParticleButton>
                </Link>
                {/* Pixel effect on hover */}
                {isHovering === "games" && (
                  <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[hsl(var(--accent-yellow))]"></div>
                )}
              </motion.div>

              <motion.div
                className="relative inline-block"
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => {
                  setIsHovering("tournaments");
                  playSound("hover");
                }}
                onMouseLeave={() => setIsHovering("")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link href="/tournaments">
                  <AnimatedButton
                    className="bg-transparent text-foreground px-12 py-5 text-2xl font-bold border-4 border-foreground relative overflow-hidden group"
                    onClick={() => playSound("click")}
                  >
                    <span className="relative z-10 flex items-center">
                      TOURNAMENTS
                      <Trophy className="ml-3 h-6 w-6" />
                    </span>
                  </AnimatedButton>
                </Link>
                {isHovering === "tournaments" && (
                  <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[hsl(var(--accent-purple))]"></div>
                )}
              </motion.div>
            </div>

            {!walletConnected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-10"
              >
                <button
                  className="text-base text-[hsl(var(--accent-yellow))] flex items-center mx-auto hover:underline"
                  onClick={() => {
                    setShowWalletModal(true);
                    playSound("click");
                  }}
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect wallet to start earning
                </button>
              </motion.div>
            )}
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="bg-background/50 border-3 border-foreground p-6 retro-shadow">
              <div className="text-4xl font-bold text-[hsl(var(--accent-yellow))]">
                24
              </div>
              <div className="text-base text-foreground/70 mt-2">GAMES</div>
            </div>
            <div className="bg-background/50 border-3 border-foreground p-6 retro-shadow">
              <div className="text-4xl font-bold text-[hsl(var(--accent-yellow))]">
                70+
              </div>
              <div className="text-base text-foreground/70 mt-2">PLAYERS</div>
            </div>
            <div className="bg-background/50 border-3 border-foreground p-6 retro-shadow">
              <div className="text-4xl font-bold text-[hsl(var(--accent-yellow))]">
                12
              </div>
              <div className="text-base text-foreground/70 mt-2">
                TOURNAMENTS
              </div>
            </div>
            <div className="bg-background/50 border-3 border-foreground p-6 retro-shadow">
              <div className="text-4xl font-bold text-[hsl(var(--accent-yellow))]">
                1 Sol
              </div>
              <div className="text-base text-foreground/70 mt-2">
                PRIZE POOL
              </div>
            </div>
          </motion.div>
        </section>

        {/* Game Showcase Section */}
        <section className="py-16 px-4 border-y-4 border-foreground relative overflow-hidden">
          {/* Section background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-[hsl(var(--accent-purple))/10] to-background/0 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto relative">
            {/* Section tabs */}
            <div className="flex overflow-x-auto scrollbar-hide mb-10 pb-2">
              <AnimatedButton
                className={`px-8 py-4 mr-3 whitespace-nowrap text-lg ${
                  activeSection === "featured"
                    ? "bg-foreground text-background"
                    : "bg-transparent text-foreground border-3 border-foreground"
                }`}
                onClick={() => {
                  setActiveSection("featured");
                  playSound("click");
                }}
              >
                <Zap className="w-5 h-5 mr-2 inline-block" />
                FEATURED GAMES
              </AnimatedButton>
              <AnimatedButton
                className={`px-8 py-4 mr-3 whitespace-nowrap text-lg ${
                  activeSection === "tournaments"
                    ? "bg-foreground text-background"
                    : "bg-transparent text-foreground border-3 border-foreground"
                }`}
                onClick={() => {
                  setActiveSection("tournaments");
                  playSound("click");
                }}
              >
                <Trophy className="w-5 h-5 mr-2 inline-block" />
                TOURNAMENTS
              </AnimatedButton>
              <AnimatedButton
                className={`px-8 py-4 mr-3 whitespace-nowrap text-lg ${
                  activeSection === "leaderboard"
                    ? "bg-foreground text-background"
                    : "bg-transparent text-foreground border-3 border-foreground"
                }`}
                onClick={() => {
                  setActiveSection("leaderboard");
                  playSound("click");
                }}
              >
                <BarChart3 className="w-5 h-5 mr-2 inline-block" />
                LEADERBOARD
              </AnimatedButton>
            </div>

            {/* Featured Games */}
            <AnimatePresence mode="wait">
              {activeSection === "featured" && (
                <motion.div
                  key="featured"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredGames.map((game) => (
                      <GameCard
                        key={game.id}
                        game={game}
                        onHover={() => playSound("hover")}
                        onClick={() => playSound("click")}
                      />
                    ))}
                  </div>

                  <div className="text-center mt-12">
                    <Link href="/games">
                      <AnimatedButton
                        className="text-lg border-3 border-foreground px-8 py-4 hover:border-[hsl(var(--accent-yellow))] hover:text-[hsl(var(--accent-yellow))]"
                        onHover={() => playSound("hover")}
                        onClick={() => playSound("click")}
                      >
                        VIEW ALL GAMES
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </AnimatedButton>
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Tournaments */}
              {activeSection === "tournaments" && (
                <motion.div
                  key="tournaments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {tournaments.map((tournament) => (
                      <TournamentCard
                        key={tournament.id}
                        tournament={tournament}
                        onHover={() => playSound("hover")}
                        onClick={() => playSound("click")}
                      />
                    ))}
                  </div>

                  <div className="text-center mt-12">
                    <Link href="/tournaments">
                      <AnimatedButton
                        className="text-lg border-3 border-foreground px-8 py-4 hover:border-[hsl(var(--accent-yellow))] hover:text-[hsl(var(--accent-yellow))]"
                        onHover={() => playSound("hover")}
                        onClick={() => playSound("click")}
                      >
                        VIEW ALL TOURNAMENTS
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </AnimatedButton>
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Leaderboard */}
              {activeSection === "leaderboard" && (
                <motion.div
                  key="leaderboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-background/50 border-3 border-foreground p-6 retro-shadow">
                    <div className="grid grid-cols-5 gap-6 font-bold mb-6 text-[hsl(var(--accent-yellow))] border-b-3 border-foreground pb-4 text-lg">
                      <div>RANK</div>
                      <div>PLAYER</div>
                      <div>GAME</div>
                      <div>SCORE</div>
                      <div>EARNINGS</div>
                    </div>

                    {leaderboardData.map((entry, index) => (
                      <motion.div
                        key={index}
                        className="grid grid-cols-5 gap-6 py-4 border-b-2 border-foreground/20 text-lg"
                        whileHover={{
                          backgroundColor: "hsl(var(--foreground) / 0.1)",
                        }}
                        onMouseEnter={() => playSound("hover")}
                      >
                        <div className="font-bold flex items-center">
                          {entry.rank === 1 && (
                            <Award className="h-5 w-5 mr-2 text-[hsl(var(--accent-yellow))]" />
                          )}
                          {entry.rank === 2 && (
                            <Award className="h-5 w-5 mr-2 text-gray-400" />
                          )}
                          {entry.rank === 3 && (
                            <Award className="h-5 w-5 mr-2 text-amber-700" />
                          )}
                          {entry.rank}
                        </div>
                        <div className="text-foreground">{entry.player}</div>
                        <div className="text-foreground/70">{entry.game}</div>
                        <div className="text-foreground">
                          {entry.score.toLocaleString()}
                        </div>
                        <div className="text-[hsl(var(--accent-green))]">
                          {entry.earnings} SOL
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="text-center mt-12">
                    <Link href="/leaderboard">
                      <AnimatedButton
                        className="text-lg border-3 border-foreground px-8 py-4 hover:border-[hsl(var(--accent-yellow))] hover:text-[hsl(var(--accent-yellow))]"
                        onHover={() => playSound("hover")}
                        onClick={() => playSound("click")}
                      >
                        VIEW FULL LEADERBOARD
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </AnimatedButton>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-28 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-4xl font-bold mb-6 glitch-text-sm"
                data-text="HOW IT WORKS"
              >
                HOW IT WORKS
              </h2>
              <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
                Empire of Bits combines retro arcade gaming
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <motion.div
                className="bg-background border-3 border-foreground p-8 relative retro-shadow"
                whileHover={{ y: -8 }}
                onMouseEnter={() => playSound("hover")}
              >
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-[hsl(var(--accent-purple))] flex items-center justify-center text-2xl font-bold text-white">
                  1
                </div>
                <Wallet className="h-16 w-16 mb-6 text-[hsl(var(--accent-yellow))]" />
                <h3 className="text-2xl font-bold mb-4">CONNECT WALLET</h3>
                <p className="text-lg text-foreground/70">
                  Connect your Solana wallet to unlock a world of retro gaming
                  and digital rewards. Your wallet is the key to depositing
                  funds, tracking your assets, and collecting your hard-earned
                  winnings.
                </p>
              </motion.div>

              <motion.div
                className="bg-background border-3 border-foreground p-8 relative retro-shadow"
                whileHover={{ y: -8 }}
                onMouseEnter={() => playSound("hover")}
              >
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-[hsl(var(--accent-purple))] flex items-center justify-center text-2xl font-bold text-white">
                  2
                </div>
                <Gamepad2 className="h-16 w-16 mb-6 text-[hsl(var(--accent-yellow))]" />
                <h3 className="text-2xl font-bold mb-4">
                  Choose Your Challenge
                </h3>
                <p className="text-lg text-foreground/70">
                  Select from a lineup of classic arcade games, each with a
                  modern twist of Sol stakes. Place your bets, compete against
                  other players, and relive the thrill of retro gaming with a
                  Web3 edge.
                </p>
              </motion.div>

              <motion.div
                className="bg-background border-3 border-foreground p-8 relative retro-shadow"
                whileHover={{ y: -8 }}
                onMouseEnter={() => playSound("hover")}
              >
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-[hsl(var(--accent-purple))] flex items-center justify-center text-2xl font-bold text-white">
                  3
                </div>
                <Coins className="h-16 w-16 mb-6 text-[hsl(var(--accent-yellow))]" />
                <h3 className="text-2xl font-bold mb-4">WIN CRYPTO</h3>
                <p className="text-lg text-foreground/70">
                  Win matches, top the leaderboards, and watch yourself grow
                  with every victory. Earn an exclusive NFT as you dominate the
                  arcade and build your empire of bits.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Live Games Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-background to-[hsl(var(--accent-purple))/20] border-t-4 border-foreground">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-10 flex items-center">
              <Users className="mr-3 h-8 w-8 text-[hsl(var(--accent-yellow))]" />
              LIVE GAMES
              <span className="ml-4 inline-flex h-4 w-4 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((stream) => (
                <motion.div
                  key={stream}
                  className="bg-background border-3 border-foreground p-6 arcade-card"
                  whileHover={{ scale: 1.03 }}
                  onMouseEnter={() => playSound("hover")}
                >
                  <div className="bg-secondary h-72 mb-6 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-3 right-3 bg-red-600 px-3 py-1.5 text-sm font-bold flex items-center text-white">
                      <span className="mr-2 inline-flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      LIVE
                    </div>

                    <div className="absolute bottom-3 left-3 bg-background/80 px-3 py-1.5 text-sm font-bold">
                      <div className="flex items-center">
                        <Coins className="h-4 w-4 mr-2 text-[hsl(var(--accent-yellow))]" />
                        PRIZE POOL: 0.{Math.floor(Math.random() * 90) + 10} SOL
                      </div>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-background/80 px-3 py-1.5 text-sm font-bold">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {Math.floor(Math.random() * 10) + 2}:
                        {Math.floor(Math.random() * 60)
                          .toString()
                          .padStart(2, "0")}{" "}
                        LEFT
                      </div>
                    </div>

                    <Image
                      src={`/images/games${stream}.jpeg`}
                      width={500}
                      height={300}
                      alt={`Game ${stream}`}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold flex items-center">
                        {stream === 1 ? "CRYPTO RACER" : "PIXEL WARRIORS"}
                        {stream === 1 && (
                          <span className="ml-3 inline-block px-2 py-1 bg-[hsl(var(--accent-green))] text-black text-sm font-bold">
                            POPULAR
                          </span>
                        )}
                      </h3>
                      <p className="text-lg text-foreground/70 flex items-center mt-2">
                        <Users className="h-4 w-4 mr-2" />
                        {stream === 1 ? "8" : "2"} PLAYERS • ROUND{" "}
                        {Math.floor(Math.random() * 5) + 1}
                      </p>
                    </div>
                    <AnimatedButton
                      className="bg-[hsl(var(--accent-purple))] border-3 border-[hsl(var(--accent-purple)/0.7)] px-5 py-3 text-lg text-white"
                      onClick={() => playSound("click")}
                    >
                      SPECTATE
                    </AnimatedButton>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-28 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>

            {/* Animated particles */}
            <div className="absolute inset-0">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-foreground opacity-20 rotate-45"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${
                      3 + Math.random() * 7
                    }s infinite linear`,
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div className="max-w-5xl mx-auto relative">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-background border-4 border-foreground p-10 md:p-16 retro-shadow"
            >
              <Sparkles className="h-16 w-16 mx-auto mb-8 text-[hsl(var(--accent-yellow))]" />

              <h2
                className="text-4xl md:text-5xl font-bold mb-8 glitch-text"
                data-text="JOIN THE ARCADE REVOLUTION"
              >
                JOIN THE ARCADE REVOLUTION
              </h2>

              <p className="text-2xl text-foreground/80 mb-10 max-w-3xl mx-auto">
                Experience the fusion of retro gaming and blockchain technology.
                Play, compete, and earn like never before.
              </p>

              {!walletConnected ? (
                <ParticleButton
                  className="bg-[hsl(var(--accent-purple))] text-white px-12 py-5 text-2xl font-bold border-4 border-[hsl(var(--accent-purple)/0.7)] relative overflow-hidden group"
                  onHover={() => playSound("hover")}
                  onClick={() => {
                    setShowWalletModal(true);
                    playSound("click");
                  }}
                >
                  <span className="relative z-10 flex items-center">
                    CONNECT WALLET TO START
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                </ParticleButton>
              ) : (
                <Link href="/games">
                  <ParticleButton
                    className="bg-[hsl(var(--accent-purple))] text-white px-12 py-5 text-2xl font-bold border-4 border-[hsl(var(--accent-purple)/0.7)] relative overflow-hidden group"
                    onHover={() => playSound("hover")}
                    onClick={() => playSound("click")}
                  >
                    <span className="relative z-10 flex items-center">
                      START PLAYING NOW
                      <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </ParticleButton>
                </Link>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t-4 border-foreground py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <Gamepad2 className="h-10 w-10 mr-3 text-foreground" />
              <h3 className="text-3xl font-bold tracking-tight">
                <span className="inline-block">EMPIRE</span>
                <span className="inline-block text-[hsl(var(--accent-yellow))]">
                  {" "}
                  OF{" "}
                </span>
                <span className="inline-block text-[hsl(var(--accent-purple))]">
                  BITS
                </span>
              </h3>
            </div>
            <p className="text-xl text-foreground/70 mb-8">
              The ultimate Empire of bits arcade gaming platform. Compete in
              retro-style games, bet cryptocurrency, and win big in tournaments.
            </p>
            <div className="flex space-x-5">
              <motion.a
                href="#"
                className="w-12 h-12 border-3 border-foreground flex items-center justify-center hover:border-[hsl(var(--accent-yellow))] transition-colors arcade-btn-large"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => playSound("hover")}
                onClick={() => playSound("click")}
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </motion.a>
              <motion.a
                href="#"
                className="w-12 h-12 border-3 border-foreground flex items-center justify-center hover:border-[hsl(var(--accent-yellow))] transition-colors arcade-btn-large"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => playSound("hover")}
                onClick={() => playSound("click")}
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.a>
              <motion.a
                href="#"
                className="w-12 h-12 border-3 border-foreground flex items-center justify-center hover:border-[hsl(var(--accent-yellow))] transition-colors arcade-btn-large"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => playSound("hover")}
                onClick={() => playSound("click")}
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 border-b-2 border-gray-800 pb-3">
              NAVIGATION
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-lg text-gray-400 hover:text-white transition-colors flex items-center"
                  onMouseEnter={() => playSound("hover")}
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/games"
                  className="text-lg text-gray-400 hover:text-white transition-colors flex items-center"
                  onMouseEnter={() => playSound("hover")}
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Games
                </Link>
              </li>
              <li>
                <Link
                  href="/tournaments"
                  className="text-lg text-gray-400 hover:text-white transition-colors flex items-center"
                  onMouseEnter={() => playSound("hover")}
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Tournaments
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace"
                  className="text-lg text-gray-400 hover:text-white transition-colors flex items-center"
                  onMouseEnter={() => playSound("hover")}
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="text-lg text-gray-400 hover:text-white transition-colors flex items-center"
                  onMouseEnter={() => playSound("hover")}
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 border-b-2 border-gray-800 pb-3">
              RESOURCES
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/help"
                  className="text-lg text-gray-400 hover:text-white transition-colors flex items-center"
                  onMouseEnter={() => playSound("hover")}
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-lg text-gray-400 hover:text-white transition-colors flex items-center"
                  onMouseEnter={() => playSound("hover")}
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-lg text-gray-400 hover:text-white transition-colors flex items-center"
                  onMouseEnter={() => playSound("hover")}
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-lg text-gray-400 hover:text-white transition-colors flex items-center"
                  onMouseEnter={() => playSound("hover")}
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-lg text-gray-400 hover:text-white transition-colors flex items-center"
                  onMouseEnter={() => playSound("hover")}
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t-2 border-gray-800 text-center">
          <p className="text-lg mb-3 text-gray-500">
            &copy; {new Date().getFullYear()} Empire of Bits. All rights
            reserved.
          </p>
          <p className="text-base text-gray-600">
            Cryptocurrency betting may not be available in all jurisdictions.
            Users are responsible for complying with local laws.
          </p>
        </div>
      </footer>
    </div>
  );
}
