"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { useToast } from "@/components/ui/use-toast";

// Define the wallet provider interface
interface WalletProvider {
  name: string;
  icon: string;
  provider: any;
}

// Define the context interface
interface SolanaWalletContextType {
  walletAddress: string | null;
  connecting: boolean;
  connected: boolean;
  connectWallet: (walletProvider?: any) => Promise<void>;
  disconnectWallet: () => void;
  balance: string;
  sendTransaction: (toAddress: string, amount: number) => Promise<string>;
  receiveTransaction: (fromAddress: string, amount: number) => Promise<string>;
  availableWallets: WalletProvider[];
}

// Create the context
const SolanaWalletContext = createContext<SolanaWalletContextType>({
  walletAddress: null,
  connecting: false,
  connected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  balance: "0.00",
  sendTransaction: async () => "",
  receiveTransaction: async () => "",
  availableWallets: [],
});

// RPC endpoint from Helius
const HELIUS_RPC_ENDPOINT =
  "https://devnet.helius-rpc.com/?api-key=a969d395-9864-418f-8a64-65c1ef2107f9";

// Provider component
export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState("0.00");
  const [availableWallets, setAvailableWallets] = useState<WalletProvider[]>(
    []
  );
  const [connection, setConnection] = useState<Connection | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);

  const { toast } = useToast();

  // Initialize connection and check for wallet
  useEffect(() => {
    // Initialize Solana connection
    const conn = new Connection(HELIUS_RPC_ENDPOINT, "confirmed");
    setConnection(conn);

    // Check for wallet providers
    const detectWallets = () => {
      const wallets: WalletProvider[] = [];

      // Check for Phantom
      if ("phantom" in window && window.phantom?.solana?.isPhantom) {
        wallets.push({
          name: "Phantom",
          icon: "/metamask.png", // Using existing icon for simplicity
          provider: window.phantom.solana,
        });
      }

      // Check for Solflare
      if ("solflare" in window && window.solflare?.isSolflare) {
        wallets.push({
          name: "Solflare",
          icon: "/walletconnect.png", // Using existing icon for simplicity
          provider: window.solflare,
        });
      }

      setAvailableWallets(wallets);
    };

    detectWallets();

    // Check for stored wallet address
    const storedWalletAddress = localStorage.getItem("walletAddress");
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
      setConnected(true);
      fetchBalance(conn, storedWalletAddress);
    }

    // Set up event listeners for wallet changes
    window.addEventListener("load", detectWallets);

    return () => {
      window.removeEventListener("load", detectWallets);
    };
  }, []);

  // Fetch wallet balance
  const fetchBalance = async (conn: Connection, address: string) => {
    try {
      const publicKey = new PublicKey(address);
      const balance = await conn.getBalance(publicKey);
      setBalance((balance / LAMPORTS_PER_SOL).toFixed(4));
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("0.00");
    }
  };

  // Update balance when wallet address changes
  useEffect(() => {
    if (!walletAddress || !connection) return;

    fetchBalance(connection, walletAddress);

    // Set up interval to refresh balance
    const intervalId = setInterval(
      () => fetchBalance(connection, walletAddress),
      10000
    );

    return () => clearInterval(intervalId);
  }, [walletAddress, connection]);

  // Connect wallet function
  const connectWallet = async (walletProvider?: any) => {
    try {
      setConnecting(true);

      let provider = walletProvider;

      if (!provider && availableWallets.length > 0) {
        provider = availableWallets[0].provider;
      }

      if (!provider) {
        toast({
          title: "Wallet not found",
          description: "Please install a Solana wallet extension like Phantom",
          variant: "destructive",
        });
        return;
      }

      // Request connection
      const resp = await provider.connect();
      const address = resp.publicKey.toString();
      setSelectedWallet(provider);

      // Store wallet address
      setWalletAddress(address);
      localStorage.setItem("walletAddress", address);
      setConnected(true);

      // Fetch initial balance
      if (connection) {
        await fetchBalance(connection, address);
      }

      toast({
        title: "Wallet Connected",
        description: "Your Solana wallet has been connected successfully!",
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description:
          error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    try {
      // Disconnect from provider if available
      if (selectedWallet?.disconnect) {
        selectedWallet.disconnect();
      }

      // Clear stored data
      setWalletAddress(null);
      localStorage.removeItem("walletAddress");
      setConnected(false);
      setSelectedWallet(null);
      setBalance("0.00");

      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  // Send transaction function (for buying points)
  const sendTransaction = async (
    toAddress: string,
    amount: number
  ): Promise<string> => {
    if (!walletAddress || !connection || !selectedWallet) {
      throw new Error("Wallet not connected");
    }

    try {
      // Create a new transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(walletAddress),
          toPubkey: new PublicKey(toAddress),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(walletAddress);

      // Sign and send the transaction
      const signed = await selectedWallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());

      // Wait for confirmation
      await connection.confirmTransaction(signature);

      // Update balance after transaction
      await fetchBalance(connection, walletAddress);

      toast({
        title: "Transaction Sent",
        description: `Successfully sent ${amount} SOL`,
      });

      return signature;
    } catch (error: any) {
      console.error("Error sending transaction:", error);
      toast({
        title: "Transaction Failed",
        description:
          error.message || "Failed to send transaction. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Receive transaction function (for selling points)
  // Note: In a real application, this would be handled by a backend service
  const receiveTransaction = async (
    fromAddress: string,
    amount: number
  ): Promise<string> => {
    if (!walletAddress) {
      throw new Error("Wallet not connected");
    }

    try {
      // This is a simulated transaction ID
      // In a real app, this would be the signature of a transaction from the treasury to the user
      const simulatedTxId =
        "simulated_" + Math.random().toString(36).substring(2, 15);

      // Simulate a balance update
      if (connection) {
        // Fetch the current balance and add the amount
        const publicKey = new PublicKey(walletAddress);
        const currentBalance = await connection.getBalance(publicKey);
        const newBalance = (currentBalance / LAMPORTS_PER_SOL + amount).toFixed(
          4
        );
        setBalance(newBalance);
      }

      toast({
        title: "Points Sold",
        description: `Successfully received ${amount} SOL`,
      });

      return simulatedTxId;
    } catch (error: any) {
      console.error("Error in receive transaction:", error);
      toast({
        title: "Transaction Failed",
        description:
          error.message || "Failed to process transaction. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <SolanaWalletContext.Provider
      value={{
        walletAddress,
        connecting,
        connected,
        connectWallet,
        disconnectWallet,
        balance,
        sendTransaction,
        receiveTransaction,
        availableWallets,
      }}
    >
      {children}
    </SolanaWalletContext.Provider>
  );
}

// Custom hook to use the wallet context
export function useSolanaWallet() {
  return useContext(SolanaWalletContext);
}

// Add type definitions for window
declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom: boolean;
        connect: () => Promise<{ publicKey: { toString: () => string } }>;
        disconnect: () => Promise<void>;
        signTransaction: (transaction: Transaction) => Promise<Transaction>;
      };
    };
    solflare?: {
      isSolflare: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
    };
  }
}
