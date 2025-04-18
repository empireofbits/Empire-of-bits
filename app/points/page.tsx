"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSolanaWallet } from "@/components/solana-wallet-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Coins, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function PointsPage() {
  const { connected, walletAddress } = useSolanaWallet()
  const [userPoints, setUserPoints] = useState(0)

  // Fetch user points
  useEffect(() => {
    if (connected && walletAddress) {
      const storedPoints = localStorage.getItem(`points_${walletAddress}`)
      if (storedPoints) {
        setUserPoints(Number.parseInt(storedPoints))
      }
    } else {
      setUserPoints(0)
    }
  }, [connected, walletAddress])

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Solana Points Exchange</h1>
        <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
          Buy and sell points using your Solana wallet on devnet. Exchange 150 points for 0.01 SOL.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </CardTitle>
              <CardDescription>Connect your Solana wallet to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Use Phantom or Solflare wallet to connect to the Solana devnet network.</p>
              <Link href="/points-exchange">
                <Button className="w-full">
                  {connected ? "Wallet Connected" : "Connect Wallet"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Coins className="mr-2 h-5 w-5" />
                Buy Points
              </CardTitle>
              <CardDescription>Purchase points with SOL</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Buy 150 points for 0.01 SOL. Points can be used in games and other platform features.
              </p>
              <Link href="/points-exchange">
                <Button className="w-full">
                  Buy Points
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Coins className="mr-2 h-5 w-5" />
                Sell Points
              </CardTitle>
              <CardDescription>Convert points back to SOL</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Sell 150 points to receive 0.01 SOL. Convert your earned points back to cryptocurrency.
              </p>
              <Link href="/points-exchange">
                <Button className="w-full">
                  Sell Points
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {connected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Your Points Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <Coins className="h-8 w-8 mr-3 text-[hsl(var(--accent-yellow))]" />
                <span className="text-4xl font-bold">{userPoints}</span>
              </div>
              <Link href="/points-exchange" className="block mt-4">
                <Button variant="outline" className="w-full">
                  Manage Points
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
