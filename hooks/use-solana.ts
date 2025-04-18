"use client"

import { useSolanaWallet } from "@/components/solana-wallet-provider"

export function useSolana() {
  return useSolanaWallet()
}
