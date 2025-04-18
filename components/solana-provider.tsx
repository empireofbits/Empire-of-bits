"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Mock wallet interface - you would replace this with actual Solana wallet adapter
interface Wallet {
  publicKey: string | null
  connected: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const defaultWallet: Wallet = {
  publicKey: null,
  connected: false,
  connect: async () => {},
  disconnect: async () => {},
}

const WalletContext = createContext<Wallet>(defaultWallet)

export function useSolanaWallet() {
  return useContext(WalletContext)
}

export function SolanaProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet>({
    ...defaultWallet,
    connect: async () => {
      // Mock implementation - replace with actual wallet connection
      setWallet((prev) => ({
        ...prev,
        connected: true,
        publicKey: "DummyPublicKey123456789",
      }))
    },
    disconnect: async () => {
      setWallet((prev) => ({
        ...prev,
        connected: false,
        publicKey: null,
      }))
    },
  })

  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
}

export function WalletButton() {
  const wallet = useSolanaWallet()

  const handleClick = async () => {
    if (wallet.connected) {
      await wallet.disconnect()
    } else {
      await wallet.connect()
    }
  }

  return (
    <button className="btn btn-primary btn-sm md:btn-md" onClick={handleClick}>
      {wallet.connected
        ? `Disconnect ${wallet.publicKey ? wallet.publicKey.substring(0, 4) + "..." : ""}`
        : "Connect Wallet"}
    </button>
  )
}
