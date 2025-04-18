"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="relative h-12 w-12 rounded-full border-3 border-current overflow-hidden p-0"
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            background: isDark
              ? "linear-gradient(to bottom right, #6b21a8, #3730a3)"
              : "linear-gradient(to bottom right, #fef9c3, #facc15)",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Stars for dark mode */}
        {isDark && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.3,
                  repeatType: "reverse",
                }}
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                }}
              />
            ))}
          </>
        )}

        {/* Sun rays for light mode */}
        {!isDark && isHovering && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-yellow-500 origin-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  width: "2px",
                  height: "30%",
                  left: "50%",
                  top: "50%",
                  transformOrigin: "center",
                  transform: `translate(-50%, -50%) rotate(${
                    i * 45
                  }deg) translateY(-150%)`,
                }}
              />
            ))}
          </>
        )}

        {/* Icon with rotation animation */}
        <motion.div
          className="relative z-10 flex items-center justify-center"
          initial={false}
          animate={{
            rotate: isDark ? 0 : 180,
          }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          {isDark ? (
            <Moon className="h-[1.2rem] w-[1.2rem] text-white" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem] text-black" />
          )}
        </motion.div>
      </Button>
    </motion.div>
  )
}