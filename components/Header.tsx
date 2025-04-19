"use client";

import { useState, useRef, useEffect } from "react";
import {
  Gamepad2,
  Bell,
  Wallet,
  X,
  Menu,
  ChevronLeft,
  Zap,
  Sparkles,
  Trophy,
  CircleUserRound,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { ParticleButton } from "@/components/particle-button";
import { AnimatedButton } from "./animated-button";
import RetroWelcomePopup from "./retroWelcomePopup";
import { useSolanaWallet } from "@/components/solana-wallet-provider";
import { pointsService } from "@/services/points-service";

interface HeaderProps {
  userPoints?: number;
  onPointsUpdate?: (newPoints: number) => void;
}

export default function Header({
  userPoints = 0,
  onPointsUpdate,
}: HeaderProps) {
  const [isFetchingPoints, setIsFetchingPoints] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const [isHovering, setIsHovering] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [showSellDialog, setShowSellDialog] = useState(false);
  const [showRetroWelcome, setShowRetroWelcome] = useState(false);
  const [points, setPoints] = useState(userPoints);
  const [isProcessing, setIsProcessing] = useState(false);
  const [Loading, setIsLoading] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("home");
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const [showPointsTooltip, setShowPointsTooltip] = useState(false);

  const {
    walletAddress,
    connecting: isLoading,
    connected: walletConnected,
    connectWallet,
    disconnectWallet,
    balance: cryptoBalance,
    availableWallets,
    sendTransaction,
    receiveTransaction,
  } = useSolanaWallet();

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

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const { theme } = useTheme();
  const { toast } = useToast();

  // Constants
  const POINTS_PER_TRANSACTION = 150;
  const SOL_PER_TRANSACTION = 0.01;

  const updateUserPointsInBackend = async (
    userId: string,
    points: number,
    operation: string
  ) => {
    try {
      const response = await fetch(
        `https://backend.empireofbits.fun/api/v1/users/${userId}/points`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            points,
            operation,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (!data.success) {
        throw new Error(data.error || "Failed to update points in backend");
      }

      return data;
    } catch (error) {
      console.error("Error updating points in backend:", error);
      throw error;
    }
  };

  const fetchUserPoints = async () => {
    // if (!walletConnected) return;
    // console.log(walletConnected);
    console.log("Fetching user points...");
    try {
      setIsLoading(true);

      // Get user ID from wallet address
      const walletAddress = localStorage.getItem("walletAddress");
      console.log("Wallet Address:", walletAddress);

      // Make API call to your backend
      const response = await fetch("https://backend.empireofbits.fun/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: walletAddress,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        setPoints(data.data.points);

        // Show retro congratulation popup for new users
        if (data.newUser) {
          setShowRetroWelcome(true);
          // Pre-load the welcome sound
          const audio = new Audio("/sounds/retro-welcome.mp3");
          audio.load();
        }
      } else {
        console.error("Failed to fetch user:", data.message);
      }
    } catch (error) {
      console.error("Error in user data operation:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setPoints(userPoints);
  }, [userPoints]);

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
    if (walletConnected || localStorage.getItem("walletAddress")) {
      console.log("Wallet connected, fetching points...");
      fetchUserPoints();
    }
  }, [walletConnected]);

  const playSound = (sound: string) => {
    if (audioRef.current) {
      audioRef.current.src = `/sounds/${sound}.mp3`;
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play prevented:", e));
    }
  };

  // Buy points
  const handleBuyPoints = async () => {
    if (!walletConnected || !walletAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);

      // Call points service to buy points
      const result = await pointsService.buyPoints(
        walletAddress,
        sendTransaction
      );

      if (result.success) {
        // Update points in UI
        const newPoints = points + POINTS_PER_TRANSACTION;
        const walletAddress = localStorage.getItem("walletAddress");
        updateUserPointsInBackend(
          walletAddress as string,
          POINTS_PER_TRANSACTION,
          "add"
        );
        setPoints(newPoints);

        if (onPointsUpdate) {
          onPointsUpdate(newPoints);
        }

        toast({
          title: "Points Purchased!",
          description: `You have successfully purchased ${POINTS_PER_TRANSACTION} points for ${SOL_PER_TRANSACTION} SOL.`,
          duration: 5000,
        });
        playSound("success");
      } else {
        toast({
          title: "Purchase Failed",
          description: result.error || "Failed to buy points",
          variant: "destructive",
        });
        playSound("error");
      }
    } catch (error: any) {
      console.error("Error buying points:", error);

      // More specific error messages based on error type
      let errorMessage = "An error occurred during the transaction";

      if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient SOL balance to complete this transaction";
      } else if (error.message?.includes("User rejected")) {
        errorMessage = "Transaction was rejected by the wallet";
      } else if (error.message?.includes("Redis")) {
        errorMessage =
          "Error storing transaction data, but points were purchased";
      }

      toast({
        title: "Transaction Error",
        description: errorMessage,
        variant: "destructive",
      });
      playSound("error");
    } finally {
      setIsProcessing(false);
      setShowBuyDialog(false);
    }
  };

  // Sell points
  const handleSellPoints = async () => {
    if (!walletConnected || !walletAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (points < POINTS_PER_TRANSACTION) {
      toast({
        title: "Insufficient Points",
        description: `You need at least ${POINTS_PER_TRANSACTION} points to sell`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);

      // Call points service to sell points
      const result = await pointsService.sellPoints(
        walletAddress,
        receiveTransaction
      );

      if (result.success) {
        // Update points in UI
        const newPoints = points - POINTS_PER_TRANSACTION;
        updateUserPointsInBackend(
          walletAddress as string,
          POINTS_PER_TRANSACTION,
          "deduct"
        );
        setPoints(newPoints);

        if (onPointsUpdate) {
          onPointsUpdate(newPoints);
        }

        toast({
          title: "Points Sold!",
          description: `You have successfully sold ${POINTS_PER_TRANSACTION} points for ${SOL_PER_TRANSACTION} SOL.`,
          duration: 5000,
        });
        playSound("success");
      } else {
        toast({
          title: "Sale Failed",
          description: result.error || "Failed to sell points",
          variant: "destructive",
        });
        playSound("error");
      }
    } catch (error: any) {
      console.error("Error selling points:", error);

      // More specific error messages based on error type
      let errorMessage = "An error occurred during the transaction";

      if (error.message?.includes("User rejected")) {
        errorMessage = "Transaction was rejected by the wallet";
      } else if (error.message?.includes("Redis")) {
        errorMessage = "Error storing transaction data, but points were sold";
      }

      toast({
        title: "Transaction Error",
        description: errorMessage,
        variant: "destructive",
      });
      playSound("error");
    } finally {
      setIsProcessing(false);
      setShowSellDialog(false);
    }
  };

  const navItems = [
    {
      name: "home",
      label: "HOME",
      icon: <Gamepad2 className="w-4 h-4" />,
      href: "/",
    },
    {
      name: "games",
      label: "GAMES",
      icon: <Zap className="w-4 h-4" />,
      href: "/games",
    },
    {
      name: "points",
      label: "POINTS",
      icon: <Sparkles className="w-4 h-4" />,
      href: "/points-exchange",
    },
    {
      name: "vesting",
      label: "VESTING",
      icon: <Trophy className="w-4 h-4" />,
      href: "/vesting",
    },
    {
      name: "profile",
      label: "PROFILE",
      icon: <CircleUserRound className="w-4 h-4" />,
      href: "/profile",
    },
  ];

  return (
    <>
      {/* Audio element for sound effects */}
      <AnimatePresence>
        {showRetroWelcome && (
          <RetroWelcomePopup onClose={() => setShowRetroWelcome(false)} />
        )}
      </AnimatePresence>
      <audio ref={audioRef} className="hidden" />

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

      {/* Animated background gradient */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background to-background/50 pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent blur-3xl transform-gpu"></div>
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent blur-3xl transform-gpu"></div>
        </div>
      </div>

      {/* Sticky Header */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "py-2 backdrop-blur-xl border-b border-foreground/10 bg-background/70"
            : "py-4 bg-transparent"
        }`}
      >
        {/* Animated accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-purple-500 via-yellow-500 to-purple-500 animate-gradient-x"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* Main header container */}
          <div className="flex flex-col">
            {/* Upper section with logo and wallet */}
            <div className="flex justify-between items-center mb-2 md:mb-0">
              {/* Logo section with animation */}
              <Link href="/" className="group relative z-10">
                <motion.div
                  className="flex items-center gap-3"
                  onHoverStart={() => setIsHoveringLogo(true)}
                  onHoverEnd={() => setIsHoveringLogo(false)}
                >
                  {/* Logo container with glow effect */}
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-yellow-500 blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300"
                      animate={isHoveringLogo ? { scale: [1, 1.2, 1] } : {}}
                      transition={{
                        duration: 1.5,
                        repeat: isHoveringLogo ? Number.POSITIVE_INFINITY : 0,
                      }}
                    />
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-foreground/30 bg-background/80 backdrop-blur-sm">
                      <Image
                        src="/images/logoEmpire.jpg"
                        alt="Empire of Bits Logo"
                        width={48}
                        height={48}
                        className="object-cover transition-transform group-hover:scale-110 duration-300"
                      />
                    </div>
                  </div>

                  {/* Title with animated letters */}
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center">
                      {["E", "M", "P", "I", "R", "E"].map((letter, i) => (
                        <motion.span
                          key={`title-1-${i}`}
                          className="inline-block"
                          whileHover={{ y: -5, color: "#9333ea", scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                      <motion.span
                        className="inline-block mx-1 text-[hsl(var(--accent-yellow))]"
                        whileHover={{ rotate: 5, scale: 1.2 }}
                      >
                        OF
                      </motion.span>
                      {["B", "I", "T", "S"].map((letter, i) => (
                        <motion.span
                          key={`title-2-${i}`}
                          className="inline-block text-[hsl(var(--accent-purple))]"
                          whileHover={{ y: -5, color: "#eab308", scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </h1>
                    <div className="flex items-center gap-1 text-xs text-foreground/70">
                      <span className="inline-block">PLAY</span>
                      <span className="inline-block h-1 w-1 rounded-full bg-foreground/40"></span>
                      <span className="inline-block">EARN</span>
                      <span className="inline-block h-1 w-1 rounded-full bg-foreground/40"></span>
                      <span className="inline-block">CONQUER</span>
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* Right side controls for desktop */}
              <div className="hidden md:flex items-center gap-3">
                {/* Points Display with tooltip */}
                {walletConnected && (
                  <div
                    className="relative"
                    onMouseEnter={() => setShowPointsTooltip(true)}
                    onMouseLeave={() => setShowPointsTooltip(false)}
                  >
                    <motion.div
                      className="flex items-center gap-2 bg-background/50 backdrop-blur-md p-2 rounded-full border border-foreground/10 hover:border-foreground/30 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center gap-1 px-2">
                        <Image
                          src="/images/cryptoCoin1.png"
                          width={18}
                          height={18}
                          alt="Points"
                        />
                        <span className="text-sm font-bold">{points}</span>
                      </div>
                    </motion.div>

                    {/* Points tooltip */}
                    <AnimatePresence>
                      {showPointsTooltip && (
                        <motion.div
                          className="absolute right-0 mt-2 w-48 bg-background/95 backdrop-blur-md border border-foreground/10 rounded-lg shadow-xl z-50 p-3"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <div className="flex justify-between mb-2">
                            <span className="text-xs text-foreground/70">
                              Your Points
                            </span>
                            <span className="text-xs font-bold">{points}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <motion.button
                              className="px-2 py-1 bg-green-600/90 text-white text-xs font-bold rounded-md"
                              whileHover={{
                                scale: 1.05,
                                backgroundColor: "rgba(22, 163, 74, 1)",
                              }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                handleBuyPoints();
                                playSound("click");
                              }}
                              onMouseEnter={() => playSound("hover")}
                              disabled={isProcessing || !walletConnected}
                            >
                              BUY
                            </motion.button>

                            <motion.button
                              className="px-2 py-1 bg-red-600/90 text-white text-xs font-bold rounded-md"
                              whileHover={{
                                scale: 1.05,
                                backgroundColor: "rgba(220, 38, 38, 1)",
                              }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                handleSellPoints();
                                playSound("click");
                              }}
                              onMouseEnter={() => playSound("hover")}
                              disabled={
                                isProcessing ||
                                !walletConnected ||
                                points < POINTS_PER_TRANSACTION
                              }
                            >
                              SELL
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <div className="relative">
                  <motion.button
                    className="relative p-2 rounded-full bg-background/50 backdrop-blur-md border border-foreground/10 hover:border-foreground/30 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => playSound("hover")}
                    onClick={() => {
                      setShowNotification(!showNotification);
                      playSound("notification");
                    }}
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <motion.span
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        {notifications.length}
                      </motion.span>
                    )}
                  </motion.button>

                  {/* Notifications dropdown */}
                  <AnimatePresence>
                    {showNotification && (
                      <motion.div
                        className="absolute right-0 mt-2 w-80 bg-background/95 backdrop-blur-md border border-foreground/10 rounded-lg shadow-xl z-50"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      >
                        <div className="p-3 border-b border-foreground/10 flex justify-between items-center">
                          <h3 className="text-sm font-bold">NOTIFICATIONS</h3>
                          <button
                            className="text-xs text-foreground/70 hover:text-foreground"
                            onClick={() => setNotifications([])}
                            title="Clear all notifications"
                            aria-label="Clear all notifications"
                          >
                            CLEAR ALL
                          </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <motion.div
                                key={notification.id}
                                className="p-4 border-b border-foreground/5 hover:bg-foreground/5 transition-colors"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <h4 className="text-sm font-bold mb-1">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-foreground/70">
                                  {notification.message}
                                </p>
                              </motion.div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-foreground/50">
                              <p className="text-sm">No new notifications</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Wallet connection */}
                {walletConnected ? (
                  <motion.div
                    className="flex items-center gap-2 bg-background/50 backdrop-blur-md p-2 pl-3 pr-4 rounded-full border border-foreground/10 hover:border-foreground/30 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => playSound("hover")}
                    onClick={() => setShowWalletModal(true)}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-yellow-500/20 animate-pulse"></div>
                      <Wallet className="h-5 w-5 text-[hsl(var(--accent-yellow))] relative z-10" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold truncate max-w-[80px]">
                        {walletAddress
                          ? `${walletAddress.slice(
                              0,
                              4
                            )}...${walletAddress.slice(-4)}`
                          : ""}
                      </span>
                      <span className="text-xs">{cryptoBalance} SOL</span>
                    </div>
                  </motion.div>
                ) : (
                  <ParticleButton
                    onClick={() => {
                      connectWallet();
                      playSound("click");
                    }}
                    onHover={() => playSound("hover")}
                    className="flex items-center gap-2 bg-[hsl(var(--accent-purple))] p-2 pl-3 pr-4 rounded-full border border-[hsl(var(--accent-purple)/0.3)] text-sm font-bold text-white"
                  >
                    <Wallet className="h-5 w-5" />
                    <span>CONNECT</span>
                  </ParticleButton>
                )}
              </div>

              {/* Mobile controls */}
              <div className="flex md:hidden items-center gap-2">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notifications for mobile */}
                <div className="relative">
                  <motion.button
                    className="relative p-2 rounded-full bg-background/50 backdrop-blur-md border border-foreground/10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => playSound("hover")}
                    onClick={() => {
                      setShowNotification(!showNotification);
                      playSound("notification");
                    }}
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                        {notifications.length}
                      </span>
                    )}
                  </motion.button>
                </div>

                {/* Mobile menu button */}
                <motion.button
                  className="p-2 rounded-full bg-background/50 backdrop-blur-md border border-foreground/10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    playSound("click");
                  }}
                >
                  {menuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Navigation bar - desktop */}
            <nav className="hidden md:block">
              <div className="flex justify-center">
                <div className="relative bg-background/30 backdrop-blur-md rounded-full p-1 border border-foreground/10">
                  <ul className="flex space-x-1 relative">
                    {navItems.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`relative px-5 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${
                            activeNavItem === item.name
                              ? "text-white"
                              : "text-foreground/70 hover:text-foreground"
                          }`}
                          onMouseEnter={() => playSound("hover")}
                          onClick={() => {
                            setActiveNavItem(item.name);
                            playSound("click");
                          }}
                        >
                          {activeNavItem === item.name && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full -z-10"
                              layoutId="activeNavBackground"
                              initial={false}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                              }}
                            />
                          )}
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Wallet Modal */}
        <AnimatePresence>
          {showWalletModal && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWalletModal(false)}
            >
              <motion.div
                className="bg-background/95 backdrop-blur-md border border-foreground/20 rounded-xl p-6 max-w-md w-full relative"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative elements */}
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-yellow-500/20 rounded-full blur-xl"></div>

                <button
                  className="absolute top-4 right-4 text-foreground/60 hover:text-foreground transition-colors"
                  onClick={() => {
                    setShowWalletModal(false);
                    playSound("click");
                  }}
                  title="Close Wallet Modal"
                >
                  <X className="h-6 w-6" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-yellow-500 bg-clip-text text-transparent">
                  {walletConnected ? "WALLET CONNECTED" : "CONNECT WALLET"}
                </h2>

                <div className="space-y-4">
                  {walletConnected ? (
                    <div className="space-y-6">
                      <div className="p-4 rounded-lg bg-foreground/5 border border-foreground/10">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-foreground/70">Address</span>
                          <span className="font-mono text-sm">
                            {walletAddress
                              ? `${walletAddress.slice(
                                  0,
                                  6
                                )}...${walletAddress.slice(-6)}`
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-foreground/70">Balance</span>
                          <span className="font-bold text-[hsl(var(--accent-yellow))]">
                            {cryptoBalance} SOL
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-foreground/70">Points</span>
                          <span className="font-bold text-[hsl(var(--accent-purple))]">
                            {points}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          className="p-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-lg"
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            handleBuyPoints();
                            playSound("click");
                          }}
                          disabled={isProcessing}
                        >
                          BUY POINTS
                        </motion.button>
                        <motion.button
                          className="p-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-lg"
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            handleSellPoints();
                            playSound("click");
                          }}
                          disabled={
                            isProcessing || points < POINTS_PER_TRANSACTION
                          }
                        >
                          SELL POINTS
                        </motion.button>
                      </div>

                      <AnimatedButton
                        className="w-full flex items-center justify-center p-3 border-2 border-red-500 hover:bg-red-500/10 transition-colors rounded-lg"
                        onClick={() => {
                          disconnectWallet();
                          setPoints(0);
                          setShowWalletModal(false);
                          playSound("click");
                        }}
                      >
                        <span className="font-bold text-red-500">
                          DISCONNECT WALLET
                        </span>
                      </AnimatedButton>
                    </div>
                  ) : (
                    <>
                      {availableWallets.length > 0 ? (
                        availableWallets.map((wallet, index) => (
                          <AnimatedButton
                            key={index}
                            className="flex items-center justify-between p-4 border border-foreground/10 hover:border-foreground/30 bg-foreground/5 hover:bg-foreground/10 rounded-lg transition-all duration-300"
                            onClick={() => {
                              connectWallet(wallet.provider);
                              setShowWalletModal(false);
                              playSound("click");
                            }}
                          >
                            <div className="flex items-center">
                              <Image
                                src={wallet.icon || "/placeholder.svg"}
                                width={40}
                                height={40}
                                alt={wallet.name}
                                className="mr-4 rounded-full"
                              />
                              <span className="font-bold text-xl">
                                {wallet.name}
                              </span>
                            </div>
                            <ChevronLeft className="h-6 w-6 rotate-180" />
                          </AnimatedButton>
                        ))
                      ) : (
                        <div className="text-center p-6 bg-foreground/5 rounded-lg border border-foreground/10">
                          <p className="text-foreground mb-4">
                            No Solana wallets detected
                          </p>
                          <a
                            href="https://phantom.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-400 underline hover:text-yellow-300 transition-colors"
                          >
                            Install Phantom Wallet
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <p className="text-sm text-foreground/50 mt-6 text-center">
                  By connecting your wallet, you agree to our Terms of Service
                  and Privacy Policy
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu - full screen overlay */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="fixed inset-0 z-50 md:hidden bg-background/95 backdrop-blur-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex flex-col h-full">
                {/* Mobile menu header */}
                <div className="flex justify-between items-center p-4 border-b border-foreground/10">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-foreground/30">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt="Empire of Bits Logo"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <h2 className="text-xl font-bold">EMPIRE OF BITS</h2>
                  </Link>
                  <motion.button
                    className="p-2 rounded-full bg-foreground/5"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setMenuOpen(false);
                      playSound("click");
                    }}
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>

                {/* Mobile navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <ul className="space-y-2">
                    {navItems.map((item, index) => (
                      <motion.li
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 p-4 rounded-lg ${
                            activeNavItem === item.name
                              ? "bg-gradient-to-r from-purple-500 to-yellow-500 text-white"
                              : "bg-foreground/5 text-foreground hover:bg-foreground/10"
                          }`}
                          onClick={() => {
                            setActiveNavItem(item.name);
                            setMenuOpen(false);
                            playSound("click");
                          }}
                        >
                          <div className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center">
                            {item.icon}
                          </div>
                          <span className="text-lg font-bold">
                            {item.label}
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Mobile wallet section */}
                  <div className="mt-8 space-y-4">
                    <h3 className="text-sm font-medium text-foreground/70 uppercase tracking-wider px-2">
                      Account
                    </h3>

                    {walletConnected ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-foreground/5 border border-foreground/10">
                          <div className="flex items-center gap-3 mb-3">
                            <Wallet className="h-5 w-5 text-[hsl(var(--accent-yellow))]" />
                            <div className="flex flex-col">
                              <span className="font-bold truncate">
                                {walletAddress
                                  ? `${walletAddress.slice(
                                      0,
                                      4
                                    )}...${walletAddress.slice(-4)}`
                                  : ""}
                              </span>
                              <span className="text-sm text-foreground/70">
                                {cryptoBalance} SOL
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 p-2 bg-background/50 rounded-lg">
                            <Image
                              src="/token.png"
                              width={24}
                              height={24}
                              alt="Points"
                            />
                            <span className="font-bold">{points} POINTS</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            className="p-3 bg-green-600 text-white text-sm font-bold rounded-lg"
                            onClick={() => {
                              handleBuyPoints();
                              playSound("click");
                            }}
                            disabled={isProcessing || !walletConnected}
                          >
                            BUY POINTS
                          </button>

                          <button
                            className="p-3 bg-red-600 text-white text-sm font-bold rounded-lg"
                            onClick={() => {
                              handleSellPoints();
                              playSound("click");
                            }}
                            disabled={
                              isProcessing ||
                              !walletConnected ||
                              points < POINTS_PER_TRANSACTION
                            }
                          >
                            SELL POINTS
                          </button>
                        </div>

                        <button
                          className="w-full p-3 border-2 border-red-500 text-red-500 font-bold rounded-lg"
                          onClick={() => {
                            disconnectWallet();
                            setPoints(0);
                            setMenuOpen(false);
                            playSound("click");
                          }}
                        >
                          DISCONNECT WALLET
                        </button>
                      </div>
                    ) : (
                      <button
                        className="w-full p-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-lg"
                        onClick={() => {
                          connectWallet();
                          setMenuOpen(false);
                          playSound("click");
                        }}
                      >
                        CONNECT WALLET
                      </button>
                    )}
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
