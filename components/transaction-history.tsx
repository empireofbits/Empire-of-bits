"use client"

import { useState, useEffect } from "react"
import { useSolanaWallet } from "@/components/solana-wallet-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from "lucide-react"

interface Transaction {
  id: string
  type: "buy" | "sell"
  amount: number
  points: number
  timestamp: string
  txId: string
}

export default function TransactionHistory() {
  const { walletAddress, connected } = useSolanaWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch transaction history
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!connected || !walletAddress) return

      setIsLoading(true)
      try {
        // In a real app, you would fetch this from your API
        // For demo purposes, we'll use localStorage
        const storedTxs = localStorage.getItem(`txs_${walletAddress}`)
        if (storedTxs) {
          setTransactions(JSON.parse(storedTxs))
        }
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [connected, walletAddress])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  // Get Solana explorer URL for transaction
  const getExplorerUrl = (txId: string) => {
    return `https://explorer.solana.com/tx/${txId}?cluster=devnet`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Your recent point transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-6">
            <p>Loading transactions...</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  {tx.type === "buy" ? (
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mr-3">
                      <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  ) : (
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full mr-3">
                      <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {tx.type === "buy" ? "Bought" : "Sold"} {tx.points} points
                    </p>
                    <p className="text-sm text-foreground/70">{formatDate(tx.timestamp)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-bold mr-2">{tx.amount} SOL</span>
                  <a
                    href={getExplorerUrl(tx.txId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[hsl(var(--accent-yellow))] hover:text-[hsl(var(--accent-yellow))/80]"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-foreground/70">
            <p>No transactions yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
