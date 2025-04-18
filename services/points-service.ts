import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { storeWalletInRedis } from "./redis-service"

const POINTS_PER_TRANSACTION = 150
const SOL_PER_TRANSACTION = 0.01

const TREASURY_WALLET = "JCsFjtj6tem9Dv83Ks4HxsL7p8GhdLtokveqW7uWjGyi"

export class PointsService {
  private connection: Connection

  constructor(rpcEndpoint: string) {
    this.connection = new Connection(rpcEndpoint, "confirmed")
  }

  async buyPoints(
    walletAddress: string,
    sendTransaction: (toAddress: string, amount: number) => Promise<string>,
  ): Promise<{ success: boolean; txId?: string; error?: string }> {
    try {
      if (!walletAddress) {
        return { success: false, error: "Wallet not connected" }
      }

      const balance = await this.connection.getBalance(new PublicKey(walletAddress))
      const balanceInSol = balance / LAMPORTS_PER_SOL

      if (balanceInSol < SOL_PER_TRANSACTION) {
        return {
          success: false,
          error: `Insufficient balance. You need at least ${SOL_PER_TRANSACTION} SOL.`,
        }
      }

      const txId = await sendTransaction(TREASURY_WALLET, SOL_PER_TRANSACTION)

      try {
        await storeWalletInRedis(walletAddress)
      } catch (redisError) {
        console.error("Redis storage error (non-critical):", redisError)
      }

      return {
        success: true,
        txId,
      }
    } catch (error: any) {
      console.error("Error buying points:", error)
      return {
        success: false,
        error: error.message || "Failed to buy points",
      }
    }
  }

  async sellPoints(
    walletAddress: string,
    receiveTransaction: (fromAddress: string, amount: number) => Promise<string>,
  ): Promise<{ success: boolean; txId?: string; error?: string }> {
    try {
      if (!walletAddress) {
        return { success: false, error: "Wallet not connected" }
      }

      const txId = await receiveTransaction(TREASURY_WALLET, SOL_PER_TRANSACTION)

      try {
        await storeWalletInRedis(walletAddress)
      } catch (redisError) {
        console.error("Redis storage error (non-critical):", redisError)
      }

      return {
        success: true,
        txId,
      }
    } catch (error: any) {
      console.error("Error selling points:", error)
      return {
        success: false,
        error: error.message || "Failed to sell points",
      }
    }
  }
}

export const pointsService = new PointsService(
  "https://devnet.helius-rpc.com/?api-key=a969d395-9864-418f-8a64-65c1ef2107f9",
)
