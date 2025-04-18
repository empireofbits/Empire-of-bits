"use client"

import { useState } from "react"
import { useSolanaWallet } from "@/components/solana-wallet-provider"
import { pointsService } from "@/services/points-service"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Coins, ArrowUpDown } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PointsManagerProps {
  userPoints: number
  onPointsUpdate: (newPoints: number) => void
}

export default function PointsManager({ userPoints, onPointsUpdate }: PointsManagerProps) {
  const { walletAddress, connected, sendTransaction, receiveTransaction } = useSolanaWallet()
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  // Constants
  const POINTS_PER_TRANSACTION = 150
  const SOL_PER_TRANSACTION = 0.01

  // Buy points
  const handleBuyPoints = async () => {
    if (!connected || !walletAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    try {
      setIsProcessing(true)

      // Call points service to buy points
      const result = await pointsService.buyPoints(walletAddress, sendTransaction)

      if (result.success) {
        // Update points in UI
        const newPoints = userPoints + POINTS_PER_TRANSACTION
        onPointsUpdate(newPoints)

        toast({
          title: "Points Purchased!",
          description: `You have successfully purchased ${POINTS_PER_TRANSACTION} points for ${SOL_PER_TRANSACTION} SOL.`,
          duration: 5000,
        })
      } else {
        toast({
          title: "Purchase Failed",
          description: result.error || "Failed to buy points",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error buying points:", error)

      // More specific error messages based on error type
      let errorMessage = "An error occurred during the transaction"

      if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient SOL balance to complete this transaction"
      } else if (error.message?.includes("User rejected")) {
        errorMessage = "Transaction was rejected by the wallet"
      } else if (error.message?.includes("Redis")) {
        errorMessage = "Error storing transaction data, but points were purchased"
      }

      toast({
        title: "Transaction Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Sell points
  const handleSellPoints = async () => {
    if (!connected || !walletAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    if (userPoints < POINTS_PER_TRANSACTION) {
      toast({
        title: "Insufficient Points",
        description: `You need at least ${POINTS_PER_TRANSACTION} points to sell`,
        variant: "destructive",
      })
      return
    }

    try {
      setIsProcessing(true)

      // Call points service to sell points
      const result = await pointsService.sellPoints(walletAddress, receiveTransaction)

      if (result.success) {
        // Update points in UI
        const newPoints = userPoints - POINTS_PER_TRANSACTION
        onPointsUpdate(newPoints)

        toast({
          title: "Points Sold!",
          description: `You have successfully sold ${POINTS_PER_TRANSACTION} points for ${SOL_PER_TRANSACTION} SOL.`,
          duration: 5000,
        })
      } else {
        toast({
          title: "Sale Failed",
          description: result.error || "Failed to sell points",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error selling points:", error)

      // More specific error messages based on error type
      let errorMessage = "An error occurred during the transaction"

      if (error.message?.includes("User rejected")) {
        errorMessage = "Transaction was rejected by the wallet"
      } else if (error.message?.includes("Redis")) {
        errorMessage = "Error storing transaction data, but points were sold"
      }

      toast({
        title: "Transaction Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="border-3 border-foreground">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Coins className="h-6 w-6 mr-2 text-[hsl(var(--accent-yellow))]" />
          Points Exchange
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6 p-4 bg-secondary rounded-lg">
          <div className="flex items-center">
            <Coins className="h-6 w-6 mr-2 text-[hsl(var(--accent-yellow))]" />
            <span className="text-2xl font-bold">{userPoints}</span>
            <span className="ml-2 text-foreground/70">points</span>
          </div>
          <ArrowUpDown className="h-5 w-5 text-foreground/50" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleBuyPoints}
              disabled={isProcessing || !connected}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
            >
              Buy 150 Points
              <span className="ml-2 text-xs">0.01 SOL</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleSellPoints}
              disabled={isProcessing || !connected || userPoints < POINTS_PER_TRANSACTION}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              Sell 150 Points
              <span className="ml-2 text-xs">0.01 SOL</span>
            </Button>
          </motion.div>
        </div>

        {!connected && (
          <p className="text-sm text-foreground/70 text-center mt-4">Connect your wallet to buy and sell points</p>
        )}
      </CardContent>
    </Card>
  )
}
