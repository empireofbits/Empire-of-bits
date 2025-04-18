import { NextResponse } from "next/server"
import { createClient } from "redis"

// Redis configuration
const REDIS_CONFIG = {
  url: "redis://redis-12665.c81.us-east-1-2.ec2.redns.redis-cloud.com:12665",
  database: "empireofbits",
}

export async function POST(request: Request) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ success: false, error: "Wallet address is required" }, { status: 400 })
    }

    // Create Redis client
    const client = createClient({
      url: REDIS_CONFIG.url,
    })

    // Handle connection errors
    client.on("error", (err) => {
      console.error("Redis Client Error:", err)
    })

    // Connect to Redis
    await client.connect()

    // Store wallet address with timestamp
    const timestamp = new Date().toISOString()
    await client.set(`wallet:${walletAddress}`, timestamp)

    // Add to a set of all wallets
    await client.sAdd("wallets", walletAddress)

    // Disconnect from Redis
    await client.disconnect()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error storing wallet in Redis:", error)
    return NextResponse.json({ success: false, error: "Failed to store wallet address" }, { status: 500 })
  }
}
