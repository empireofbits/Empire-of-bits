"use client";

import { useState, useEffect } from "react";
import { useSolanaWallet } from "@/components/solana-wallet-provider";
import PointsManager from "@/components/points-manager";
import WalletStatus from "@/components/wallet-status";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Coins, AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";

export default function PointsExchangePage() {
  const { connected, walletAddress } = useSolanaWallet();
  const [userPoints, setUserPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user points from local storage or API
  useEffect(() => {
    const fetchUserPoints = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch this from your API
        // For demo purposes, we'll use localStorage
        if (walletAddress) {
          const storedPoints = localStorage.getItem(`points_${walletAddress}`);
          if (storedPoints) {
            setUserPoints(Number.parseInt(storedPoints));
          } else {
            // Initialize with 0 points
            localStorage.setItem(`points_${walletAddress}`, "0");
            setUserPoints(0);
          }
        }
      } catch (error) {
        console.error("Error fetching points:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (connected && walletAddress) {
      fetchUserPoints();
    } else {
      setUserPoints(0);
      setIsLoading(false);
    }
  }, [connected, walletAddress]);

  // Update user points
  const handlePointsUpdate = (newPoints: number) => {
    setUserPoints(newPoints);
    if (walletAddress) {
      localStorage.setItem(`points_${walletAddress}`, newPoints.toString());
    }
  };

  return (
    <>
      <Header />

      <div className="container mx-auto py-12 px-4 mt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">Points Exchange</h1>
          <p className="text-xl text-foreground/70 mb-8">
            Buy and sell points using your Solana wallet
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Wallet status */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <WalletStatus />
            </motion.div>
          </div>

          {/* Middle column - Points exchange */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Coins className="mr-2 h-6 w-6 text-[hsl(var(--accent-yellow))]" />
                    Points Exchange
                  </CardTitle>
                  <CardDescription>
                    Buy and sell points using your Solana wallet on devnet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!connected ? (
                    <Alert className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Wallet not connected</AlertTitle>
                      <AlertDescription>
                        Please connect your Solana wallet to buy and sell points
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <div className="mb-6">
                        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                          <div className="flex items-center">
                            <Coins className="h-6 w-6 mr-2 text-[hsl(var(--accent-yellow))]" />
                            <span className="text-2xl font-bold">
                              {userPoints}
                            </span>
                            <span className="ml-2 text-foreground/70">
                              points
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <PointsManager
                          userPoints={userPoints}
                          onPointsUpdate={handlePointsUpdate}
                        />

                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertTitle>Exchange Rate</AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc list-inside text-sm">
                              <li>Buy: 150 points for 0.01 SOL</li>
                              <li>Sell: 150 points for 0.01 SOL</li>
                            </ul>
                          </AlertDescription>
                        </Alert>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Transaction history card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Your recent point transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {connected ? (
                    <div className="text-center py-6 text-foreground/70">
                      <p>No transactions yet</p>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-foreground/70">
                      <p>Connect your wallet to view transaction history</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
