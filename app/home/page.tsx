"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Gamepad2,
  Trophy,
  Coins,
  Users,
  Eye,
  MessageSquare,
  BotIcon as Robot,
  Calendar,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { Tilt } from "react-tilt";
import { ParticlesContainer } from "@/components/particles-container";
import { GlitchText } from "@/components/glitch-text";
import { ScrollProgress } from "@/components/scroll-progress";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.8]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 8]);
  const headerY = useTransform(scrollY, [0, 100], [0, -10]);
  const springHeaderY = useSpring(headerY, { stiffness: 100, damping: 30 });

  const heroRef = useRef(null);
  const gamesRef = useRef(null);
  const howItWorksRef = useRef(null);
  const featuresRef = useRef(null);
  const businessRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: false, amount: 0.2 });
  const gamesInView = useInView(gamesRef, { once: false, amount: 0.2 });
  const howItWorksInView = useInView(howItWorksRef, {
    once: false,
    amount: 0.2,
  });
  const featuresInView = useInView(featuresRef, { once: false, amount: 0.2 });
  const businessInView = useInView(businessRef, { once: false, amount: 0.2 });
  const ctaInView = useInView(ctaRef, { once: false, amount: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-cyberpunk">
      {/* Particles Background */}
      <ParticlesContainer />

      {/* Cursor follow effect */}
      <motion.div
        className="fixed w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl pointer-events-none z-0"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: "spring", damping: 15 }}
      />

      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Header - Now with blur effect */}
      <motion.header
        style={{
          opacity: headerOpacity,
          backdropFilter: `blur(${headerBlur.get()}px)`,
          y: springHeaderY,
        }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 md:p-8 border-b border-white/10 bg-black/30"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <span className="text-2xl font-bold tracking-tight">
            <GlitchText text="EMPIRE OF BITS" />
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg px-8 border border-white/20 shadow-[0_0_15px_rgba(124,58,237,0.5)]"
          >
            <Link href="/signup" className="relative group">
              <span className="relative z-10 flex items-center gap-2">
                GET STARTED
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-white/10 blur-sm rounded-md group-hover:bg-white/20 transition-colors"></span>
            </Link>
          </Button>
        </motion.div>
      </motion.header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative z-10 pt-32 md:pt-40 px-6 md:px-8 min-h-screen flex items-center"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center"
          >
            <div className="mb-4 inline-block">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={
                  heroInView
                    ? { scale: 1, opacity: 1 }
                    : { scale: 0.8, opacity: 0 }
                }
                transition={{ duration: 0.5, delay: 0.1 }}
                className="px-4 py-1 bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-full border border-purple-500/30 text-sm md:text-base font-medium mb-6 inline-block"
              >
                RETRO GAMING MEETS CRYPTO
              </motion.div>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight mb-6 leading-none">
              <span className="block">PLAY.</span>
              <span className="block mt-2">EARN.</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-purple-400 animate-gradient">
                CONQUER.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              The ultimate retro gaming platform with crypto rewards. Play
              classic arcade games, earn points, and convert them to real
              Solana.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-block group"
            >
              <Button
                asChild
                size="lg"
                className="relative z-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-xl px-10 py-8 border border-white/20"
              >
                <Link href="/signup" className="flex items-center gap-2">
                  GET STARTED{" "}
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur-lg opacity-30 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
          </motion.div>

          {/* Floating Game Icons */}
          <div className="relative h-40 mt-20 hidden md:block">
            {[
              { icon: "🎮", x: "10%", delay: 0 },
              { icon: "🚀", x: "30%", delay: 0.5 },
              { icon: "🏆", x: "50%", delay: 1 },
              { icon: "💰", x: "70%", delay: 1.5 },
              { icon: "👾", x: "90%", delay: 2 },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="absolute text-4xl"
                initial={{ y: 100, opacity: 0 }}
                animate={
                  heroInView
                    ? { y: [0, -20, 0], opacity: 1 }
                    : { y: 100, opacity: 0 }
                }
                transition={{
                  y: {
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: item.delay,
                  },
                  opacity: { duration: 0.5, delay: item.delay },
                }}
                style={{ left: item.x }}
              >
                {item.icon}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          <p className="text-sm text-gray-400 mb-2">Scroll to explore</p>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1.5 h-1.5 bg-white rounded-full mt-2"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        </motion.div>
      </section>

      {/* Game Showcase */}
      <section
        ref={gamesRef}
        className="relative z-10 py-24 md:py-32 px-6 md:px-8 min-h-screen flex items-center bg-gradient-to-b from-black via-purple-950/10 to-black"
      >
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={gamesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 relative inline-block">
              <span className="relative z-10">CLASSIC GAMES REIMAGINED</span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={gamesInView ? { width: "100%" } : { width: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Rediscover your favorite arcade classics with a crypto twist
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                name: "BATTLESHIP",
                icon: "🚢",
                color: "from-blue-600 to-cyan-400",
              },
              {
                name: "CANDY CRUSH",
                icon: "🍭",
                color: "from-pink-600 to-purple-400",
              },
              {
                name: "PLATFORMER",
                icon: "🏃",
                color: "from-green-600 to-emerald-400",
              },
              {
                name: "SPACE INVADERS",
                icon: "👾",
                color: "from-red-600 to-orange-400",
              },
            ].map((game, index) => (
              <Tilt
                key={game.name}
                options={{ max: 25, scale: 1.05, speed: 300 }}
                className="w-full h-full perspective-1000"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    gamesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="h-full"
                >
                  <div className="relative group h-full">
                    <div className="absolute inset-0.5 bg-gradient-to-br from-white/5 to-white/30 rounded-xl blur-sm group-hover:blur-md transition-all"></div>
                    <div
                      className={`relative h-full aspect-square bg-gradient-to-br ${game.color} bg-opacity-10 rounded-xl flex flex-col items-center justify-center p-6 border border-white/10 group-hover:border-white/30 transition-colors overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-black/70 z-0"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent z-0"></div>
                      <span className="text-5xl mb-4 relative z-10">
                        {game.icon}
                      </span>
                      <span className="text-lg md:text-xl font-bold text-center relative z-10">
                        {game.name}
                      </span>
                      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                </motion.div>
              </Tilt>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={gamesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-12 text-gray-400"
          >
            <p className="text-lg">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                And many more games
              </span>{" "}
              coming soon...
            </p>
          </motion.div>

          {/* Game Screenshots Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={gamesInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 relative overflow-hidden rounded-xl border border-white/10 h-64 md:h-80"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
            <div className="absolute inset-0 flex items-center">
              <motion.div
                className="flex gap-4 px-4"
                animate={{ x: [0, -1000] }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[300px] h-48 md:h-64 bg-gradient-to-br from-purple-800/30 to-blue-800/30 rounded-lg border border-white/10 flex items-center justify-center"
                  >
                    <span className="text-4xl">🎮</span>
                  </div>
                ))}
              </motion.div>
            </div>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black via-transparent to-black"></div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section
        ref={howItWorksRef}
        className="relative z-10 py-24 md:py-32 px-6 md:px-8 min-h-screen flex items-center"
      >
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={
              howItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-1 bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-full border border-purple-500/30 text-sm md:text-base font-medium mb-6">
              SIMPLE & REWARDING
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              HOW IT WORKS
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Simple steps to start playing and earning
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Connecting line between steps */}
            <motion.div
              className="absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 hidden md:block"
              initial={{ scaleX: 0 }}
              animate={howItWorksInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ transformOrigin: "left" }}
            />

            {[
              {
                title: "PLAY GAMES",
                description:
                  "Sign up and get free points to start playing our collection of classic arcade games",
                icon: <Gamepad2 className="w-10 h-10" />,
                color: "from-purple-600 to-blue-600",
              },
              {
                title: "WIN POINTS",
                description:
                  "Compete against others or AI, climb leaderboards, and earn points for every victory",
                icon: <Trophy className="w-10 h-10" />,
                color: "from-blue-600 to-cyan-600",
              },
              {
                title: "EARN CRYPTO",
                description:
                  "Convert your points to Solana or vest them for 3-6 months to earn 25-50% more",
                icon: <Coins className="w-10 h-10" />,
                color: "from-cyan-600 to-purple-600",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  howItWorksInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                className="relative"
              >
                <Tilt
                  options={{ max: 15, scale: 1.02, speed: 300 }}
                  className="h-full"
                >
                  <div className="relative group h-full">
                    <div className="absolute inset-0.5 bg-gradient-to-br from-white/5 to-white/20 rounded-xl blur-sm group-hover:blur-md transition-all"></div>
                    <div className="relative h-full bg-black bg-opacity-80 rounded-xl p-8 border border-white/10 group-hover:border-white/30 transition-colors overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} transform origin-left transition-transform duration-500 group-hover:scale-x-100`}
                      ></div>

                      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-full blur-3xl"></div>

                      <div
                        className={`bg-gradient-to-br ${item.color} p-4 rounded-lg inline-block mb-6 relative z-10`}
                      >
                        {item.icon}
                      </div>

                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4">
                          {item.title}
                        </h3>
                        <p className="text-gray-300">{item.description}</p>
                      </div>

                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>

          {/* Animated Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              howItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-20 relative h-64 rounded-xl border border-white/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">PLAY-TO-EARN CYCLE</h3>
                <div className="flex items-center justify-center gap-8">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-purple-900/50 border border-purple-500/50 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Gamepad2 className="w-8 h-8" />
                  </motion.div>
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="w-16 text-center"
                  >
                    <ArrowRight className="w-16 h-6 text-purple-400" />
                  </motion.div>
                  <motion.div
                    className="w-20 h-20 rounded-full bg-blue-900/50 border border-blue-500/50 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <Trophy className="w-8 h-8" />
                  </motion.div>
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0.5,
                    }}
                    className="w-16 text-center"
                  >
                    <ArrowRight className="w-16 h-6 text-blue-400" />
                  </motion.div>
                  <motion.div
                    className="w-20 h-20 rounded-full bg-cyan-900/50 border border-cyan-500/50 flex items-center justify-center"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <Coins className="w-8 h-8" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section
        ref={featuresRef}
        className="relative z-10 py-24 md:py-32 px-6 md:px-8 min-h-screen flex items-center bg-gradient-to-b from-black via-purple-950/10 to-black"
      >
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={
              featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-1 bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-full border border-purple-500/30 text-sm md:text-base font-medium mb-6">
              PACKED WITH FEATURES
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 relative inline-block">
              <span className="relative z-10">PLATFORM FEATURES</span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={featuresInView ? { width: "100%" } : { width: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need for the ultimate gaming experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Global Leaderboards",
                description:
                  "Compete with players worldwide and climb to the top",
                icon: <Users className="w-6 h-6" />,
                color: "from-purple-600 to-blue-600",
              },
              {
                title: "Live Game Spectating",
                description: "Watch the best players and learn new strategies",
                icon: <Eye className="w-6 h-6" />,
                color: "from-blue-600 to-cyan-600",
              },
              {
                title: "Game Comments",
                description:
                  "Engage with the community and share your thoughts",
                icon: <MessageSquare className="w-6 h-6" />,
                color: "from-cyan-600 to-green-600",
              },
              {
                title: "AI Opponents",
                description:
                  "Practice against intelligent bots of varying difficulty",
                icon: <Robot className="w-6 h-6" />,
                color: "from-green-600 to-yellow-600",
              },
              {
                title: "Regular Tournaments",
                description: "Join scheduled competitions with bigger rewards",
                icon: <Calendar className="w-6 h-6" />,
                color: "from-yellow-600 to-orange-600",
              },
              {
                title: "Crypto Rewards",
                description: "Convert your winnings to Solana cryptocurrency",
                icon: <Coins className="w-6 h-6" />,
                color: "from-orange-600 to-purple-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Tilt
                  options={{ max: 15, scale: 1.02, speed: 300 }}
                  className="h-full"
                >
                  <div className="relative group h-full">
                    <div className="absolute inset-0.5 bg-gradient-to-br from-white/5 to-white/20 rounded-lg blur-sm group-hover:blur-md transition-all"></div>
                    <div className="relative h-full bg-black bg-opacity-80 rounded-lg p-6 border border-white/10 group-hover:border-white/30 transition-colors overflow-hidden flex items-center gap-4">
                      <div
                        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100`}
                      ></div>

                      <div
                        className={`bg-gradient-to-br ${feature.color} p-3 rounded-lg flex-shrink-0 relative z-10`}
                      >
                        {feature.icon}
                      </div>

                      <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>

          {/* Feature Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-20 relative rounded-xl border border-white/10 overflow-hidden p-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-6 text-center">
                FEATURE HIGHLIGHTS
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-black/50 p-6 rounded-lg border border-white/10">
                  <h4 className="text-xl font-bold mb-4 text-purple-400">
                    TOURNAMENTS
                  </h4>
                  <p className="text-gray-300 mb-4">
                    Weekly and monthly competitions with prize pools and special
                    rewards.
                  </p>
                  <div className="h-32 bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-purple-400" />
                  </div>
                </div>
                <div className="bg-black/50 p-6 rounded-lg border border-white/10">
                  <h4 className="text-xl font-bold mb-4 text-blue-400">
                    SOCIAL FEATURES
                  </h4>
                  <p className="text-gray-300 mb-4">
                    Connect with friends, form teams, and chat while gaming.
                  </p>
                  <div className="h-32 bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Users className="w-12 h-12 text-blue-400" />
                  </div>
                </div>
                <div className="bg-black/50 p-6 rounded-lg border border-white/10">
                  <h4 className="text-xl font-bold mb-4 text-cyan-400">
                    CRYPTO INTEGRATION
                  </h4>
                  <p className="text-gray-300 mb-4">
                    Seamless Solana wallet connection and point conversion.
                  </p>
                  <div className="h-32 bg-cyan-900/20 rounded-lg flex items-center justify-center">
                    <Coins className="w-12 h-12 text-cyan-400" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business Model */}
      <section
        ref={businessRef}
        className="relative z-10 py-24 md:py-32 px-6 md:px-8 min-h-screen flex items-center"
      >
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={
              businessInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-1 bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-full border border-purple-500/30 text-sm md:text-base font-medium mb-6">
              VALUE PROPOSITION
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              BUSINESS MODEL
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              How we create value for players and investors
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={
                businessInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
              }
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Tilt
                options={{ max: 10, scale: 1.02, speed: 300 }}
                className="h-full"
              >
                <div className="relative group h-full">
                  <div className="absolute inset-0.5 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl blur-sm group-hover:blur-md transition-all"></div>
                  <div className="relative h-full bg-black bg-opacity-80 rounded-xl p-8 border border-white/10 group-hover:border-white/30 transition-colors overflow-hidden">
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-full blur-3xl"></div>

                    <h3 className="text-2xl font-bold mb-6 flex items-center">
                      <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                        FOR PLAYERS
                      </span>
                      <div className="h-px flex-grow bg-gradient-to-r from-purple-500 to-blue-500 ml-4"></div>
                    </h3>

                    <ul className="space-y-4 relative z-10">
                      {[
                        "Free points on signup to start playing immediately",
                        "Earn points by winning games and tournaments",
                        "Convert points to Solana cryptocurrency",
                        "Vest points for 3-6 months to earn 25-50% more",
                        "Purchase additional points with Solana",
                      ].map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={
                            businessInView
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: -10 }
                          }
                          transition={{
                            duration: 0.3,
                            delay: 0.4 + index * 0.1,
                          }}
                          className="flex items-start gap-3"
                        >
                          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-1 rounded-full mt-1">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-200">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Tilt>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={
                businessInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
              }
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Tilt
                options={{ max: 10, scale: 1.02, speed: 300 }}
                className="h-full"
              >
                <div className="relative group h-full">
                  <div className="absolute inset-0.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm group-hover:blur-md transition-all"></div>
                  <div className="relative h-full bg-black bg-opacity-80 rounded-xl p-8 border border-white/10 group-hover:border-white/30 transition-colors overflow-hidden">
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl"></div>

                    <h3 className="text-2xl font-bold mb-6 flex items-center">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        FOR THE PLATFORM
                      </span>
                      <div className="h-px flex-grow bg-gradient-to-r from-blue-500 to-purple-500 ml-4"></div>
                    </h3>

                    <ul className="space-y-4 relative z-10">
                      {[
                        "Transaction fees on point-to-Solana conversions",
                        "Premium game access and special tournaments",
                        "Yield from vested points during lock-up periods",
                        "Partnerships with game developers and advertisers",
                        "NFT collectibles and special in-game items",
                      ].map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: 10 }}
                          animate={
                            businessInView
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: 10 }
                          }
                          transition={{
                            duration: 0.3,
                            delay: 0.4 + index * 0.1,
                          }}
                          className="flex items-start gap-3"
                        >
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1 rounded-full mt-1">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-200">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          </div>

          {/* Business Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              businessInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              {
                label: "Active Players",
                value: "10K+",
                color: "from-purple-600 to-blue-600",
              },
              {
                label: "Games Played",
                value: "1M+",
                color: "from-blue-600 to-cyan-600",
              },
              {
                label: "Points Earned",
                value: "50M+",
                color: "from-cyan-600 to-purple-600",
              },
              {
                label: "SOL Distributed",
                value: "5000+",
                color: "from-purple-600 to-blue-600",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  businessInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                className="relative"
              >
                <div className="absolute inset-0.5 bg-gradient-to-br from-white/5 to-white/20 rounded-lg blur-sm"></div>
                <div className="relative bg-black bg-opacity-80 rounded-lg p-6 border border-white/10 text-center">
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}
                  ></div>
                  <h4 className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.value}
                  </h4>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="relative z-10 py-24 md:py-32 px-6 md:px-8 min-h-[80vh] flex items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto w-full"
        >
          <div className="relative">
            <div className="absolute inset-0.5 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-2xl blur-md"></div>
            <div className="relative bg-black bg-opacity-80 rounded-2xl p-8 md:p-12 border border-white/10 text-center overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-70"
                    initial={{
                      x: Math.random() * 100 + "%",
                      y: Math.random() * 100 + "%",
                    }}
                    animate={{
                      x: [
                        Math.random() * 100 + "%",
                        Math.random() * 100 + "%",
                        Math.random() * 100 + "%",
                      ],
                      y: [
                        Math.random() * 100 + "%",
                        Math.random() * 100 + "%",
                        Math.random() * 100 + "%",
                      ],
                    }}
                    transition={{
                      duration: 10 + Math.random() * 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={
                    ctaInView
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0.9, opacity: 0 }
                  }
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-4xl md:text-6xl font-bold mb-6">
                    <GlitchText text="READY TO PLAY AND EARN?" />
                  </h2>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={
                    ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                  }
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                >
                  Join thousands of players already earning rewards through our
                  retro gaming platform. Get started with free points today!
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={
                    ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                  }
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="relative inline-block group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur-lg opacity-70 group-hover:opacity-100 animate-pulse transition-opacity"></div>
                  <Button
                    asChild
                    size="lg"
                    className="relative z-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-xl px-10 py-8 border border-white/20"
                  >
                    <Link href="/signup" className="flex items-center gap-2">
                      GET STARTED{" "}
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-8 px-6 md:px-8 bg-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold">
              <GlitchText text="EMPIRE OF BITS" />
            </span>
          </div>
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Empire of Bits. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
