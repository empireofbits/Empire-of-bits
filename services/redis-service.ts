export async function storeWalletInRedis(walletAddress: string): Promise<boolean> {
    try {
      const response = await fetch("/api/redis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
      })
  
      const data = await response.json()
      return data.success
    } catch (error) {
      console.error("Error storing wallet in Redis:", error)
      return false
    }
  }
  