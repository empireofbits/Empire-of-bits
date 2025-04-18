"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useSolanaWallet } from "../components/solana-provider"

interface AccountContextType {
  isInitialized: boolean
  balance: number | null
  initialize: () => Promise<void>
}

const defaultAccountContext: AccountContextType = {
  isInitialized: false,
  balance: null,
  initialize: async () => {},
}

const AccountContext = createContext<AccountContextType>(defaultAccountContext)

export function useAccount() {
  return useContext(AccountContext)
}

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const wallet = useSolanaWallet()
  const [account, setAccount] = useState<AccountContextType>({
    ...defaultAccountContext,
    initialize: async () => {
      // Mock implementation - replace with actual account initialization
      setAccount((prev) => ({ ...prev, isInitialized: true, balance: 5.0 }))
    },
  })

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      // Mock fetching account data when wallet is connected
      setAccount((prev) => ({ ...prev, isInitialized: true, balance: 5.0 }))
    } else {
      setAccount((prev) => ({ ...prev, isInitialized: false, balance: null }))
    }
  }, [wallet.connected, wallet.publicKey])

  return <AccountContext.Provider value={account}>{children}</AccountContext.Provider>
}

export function AccountChecker() {
  const wallet = useSolanaWallet()
  const account = useAccount()

  useEffect(() => {
    // This is a placeholder for any account checking logic
    // You would implement actual account verification here
  }, [wallet.connected, account.isInitialized])

  // This component doesn't render anything visible
  // It just performs checks in the background
  return null
}
