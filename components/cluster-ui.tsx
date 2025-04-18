"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define cluster types
type ClusterType = "mainnet-beta" | "testnet" | "devnet" | "localnet"

interface ClusterContextType {
  cluster: ClusterType
  setCluster: (cluster: ClusterType) => void
  endpoint: string
}

const endpoints = {
  "mainnet-beta": "https://api.mainnet-beta.solana.com",
  testnet: "https://api.testnet.solana.com",
  devnet: "https://api.devnet.solana.com",
  localnet: "http://localhost:8899",
}

const defaultClusterContext: ClusterContextType = {
  cluster: "devnet",
  setCluster: () => {},
  endpoint: endpoints["devnet"],
}

const ClusterContext = createContext<ClusterContextType>(defaultClusterContext)

export function useCluster() {
  return useContext(ClusterContext)
}

export function ClusterProvider({ children }: { children: ReactNode }) {
  const [cluster, setClusterState] = useState<ClusterType>("devnet")

  const setCluster = (newCluster: ClusterType) => {
    setClusterState(newCluster)
    // You might want to save this to localStorage in a real implementation
    localStorage.setItem("solana-cluster", newCluster)
  }

  useEffect(() => {
    // Load saved cluster from localStorage if available
    const savedCluster = localStorage.getItem("solana-cluster") as ClusterType | null
    if (savedCluster && Object.keys(endpoints).includes(savedCluster)) {
      setClusterState(savedCluster)
    }
  }, [])

  const value = {
    cluster,
    setCluster,
    endpoint: endpoints[cluster],
  }

  return <ClusterContext.Provider value={value}>{children}</ClusterContext.Provider>
}

export function ClusterUiSelect() {
  const { cluster, setCluster } = useCluster()

  return (
    <select
      className="select select-bordered select-sm md:select-md"
      value={cluster}
      onChange={(e) => setCluster(e.target.value as ClusterType)}
      aria-label="Select Solana cluster"
    >
      <option value="mainnet-beta">Mainnet Beta</option>
      <option value="testnet">Testnet</option>
      <option value="devnet">Devnet</option>
      <option value="localnet">Localnet</option>
    </select>
  )
}

export function ClusterChecker({ children }: { children: ReactNode }) {
  const { cluster, endpoint } = useCluster()
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    // Mock cluster connection check
    // In a real implementation, you would check if the endpoint is reachable
    const checkConnection = async () => {
      try {
        // Simulate network request
        setIsConnected(true)
      } catch (error) {
        setIsConnected(false)
      }
    }

    checkConnection()
  }, [endpoint])

  if (!isConnected) {
    return (
      <div className="alert alert-error">
        Cannot connect to {cluster} cluster at {endpoint}
      </div>
    )
  }

  return <>{children}</>
}

export function ExplorerLink({
  path,
  label,
  className,
}: {
  path: string
  label: string
  className?: string
}) {
  const { cluster } = useCluster()

  // Determine the explorer URL based on the cluster
  const baseUrl =
    cluster === "localnet"
      ? "http://localhost:8899"
      : `https://explorer.solana.com/${cluster !== "mainnet-beta" ? cluster : ""}`

  const url = `${baseUrl}/${path}`

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
    </a>
  )
}
