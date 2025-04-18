"use client"

import { useSolanaWallet } from "@/components/solana-wallet-provider"
import { Button } from "@/components/ui/button"
import { Wallet, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WalletStatus() {
  const { walletAddress, connected, balance, connectWallet, disconnectWallet } = useSolanaWallet()

  // Format wallet address for display
  const formatAddress = (address: string | null) => {
    if (!address) return ""
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  // Get Solana explorer URL
  const getExplorerUrl = (address: string) => {
    return `https://explorer.solana.com/address/${address}?cluster=devnet`
  }

  return (
    <Card className="border-3 border-foreground">
      <CardHeader>
        <CardTitle>Wallet Status</CardTitle>
      </CardHeader>
      <CardContent>
        {connected && walletAddress ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-foreground/70">Address:</span>
              <div className="flex items-center">
                <span className="font-mono">{formatAddress(walletAddress)}</span>
                <a
                  href={getExplorerUrl(walletAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-[hsl(var(--accent-yellow))] hover:text-[hsl(var(--accent-yellow))/80]"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-foreground/70">Balance:</span>
              <span className="font-bold">{balance} SOL</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-foreground/70">Network:</span>
              <span className="text-green-500 font-bold">Devnet</span>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={disconnectWallet}
                variant="outline"
                className="w-full mt-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Disconnect Wallet
              </Button>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-foreground/70">Connect your Solana wallet to buy and sell points</p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => connectWallet()}
                className="w-full bg-[hsl(var(--accent-purple))] hover:bg-[hsl(var(--accent-purple))/80] text-white"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            </motion.div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
