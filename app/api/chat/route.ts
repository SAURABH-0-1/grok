import { NextResponse } from "next/server"

const COINGECKO_PRO_API_URL = "https://pro-api.coingecko.com/api/v3"
const BIRDEYE_API_URL = "https://public-api.birdeye.so"

// Token mapping for different APIs
const TOKEN_MAPPING: { [key: string]: { coingecko_id: string; birdeye_address?: string } } = {
  sol: {
    coingecko_id: "solana",
    birdeye_address: "So11111111111111111111111111111111111111112",
  },
  btc: {
    coingecko_id: "bitcoin",
  },
  eth: {
    coingecko_id: "ethereum",
  },
}

async function getCryptoPrice(symbol: string): Promise<string | null> {
  try {
    console.log(`Fetching price for symbol: ${symbol}`)

    const tokenInfo = TOKEN_MAPPING[symbol.toLowerCase()]
    if (!tokenInfo) {
      console.log(`Token not found in mapping: ${symbol}`)
      return null
    }

    // Try CoinGecko first
    console.log("Attempting CoinGecko API call...")
    const coingeckoResponse = await fetch(
      `${COINGECKO_PRO_API_URL}/simple/price?ids=${tokenInfo.coingecko_id}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          "x-cg-pro-api-key": process.env.COINGECKO_API_KEY!,
          "Content-Type": "application/json",
        },
      },
    )

    console.log(`CoinGecko response status: ${coingeckoResponse.status}`)

    if (coingeckoResponse.ok) {
      const coingeckoData = await coingeckoResponse.json()
      console.log("CoinGecko data:", coingeckoData)

      if (coingeckoData[tokenInfo.coingecko_id]?.usd) {
        const price = coingeckoData[tokenInfo.coingecko_id].usd
        const change = coingeckoData[tokenInfo.coingecko_id].usd_24h_change
        return `Current price: $${price.toFixed(2)} (${change >= 0 ? "+" : ""}${change.toFixed(2)}% 24h)`
      }
    } else {
      console.log("CoinGecko API failed, trying Birdeye...")
    }

    // If CoinGecko fails and we have a Birdeye address, try Birdeye
    if (tokenInfo.birdeye_address) {
      console.log("Attempting Birdeye API call...")
      const birdeyeResponse = await fetch(`${BIRDEYE_API_URL}/public/price?address=${tokenInfo.birdeye_address}`, {
        headers: {
          "x-api-key": process.env.BIRDEYE_API_KEY!,
        },
      })

      console.log(`Birdeye response status: ${birdeyeResponse.status}`)

      if (birdeyeResponse.ok) {
        const birdeyeData = await birdeyeResponse.json()
        console.log("Birdeye data:", birdeyeData)

        if (birdeyeData.success && birdeyeData.data?.value) {
          return `Current price: $${birdeyeData.data.value.toFixed(2)}`
        }
      }
    }

    throw new Error("Failed to fetch price from both APIs")
  } catch (error) {
    console.error("Error in getCryptoPrice:", error)
    return null
  }
}

export async function POST(req: Request) {
  try {
    console.log("Received POST request to /api/chat")

    if (!process.env.GROK_API_KEY) {
      console.error("Missing Grok API key")
      throw new Error("Configuration error")
    }

    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1].content.toLowerCase()

    console.log("Processing message:", lastMessage)

    let priceData = null

    // Simple pattern matching first
    if (lastMessage.includes("price")) {
      for (const symbol of Object.keys(TOKEN_MAPPING)) {
        if (lastMessage.includes(symbol.toLowerCase())) {
          console.log(`Detected token symbol: ${symbol}`)
          priceData = await getCryptoPrice(symbol)
          break
        }
      }
    }

    // If simple matching fails, try more complex patterns
    if (!priceData) {
      const tokenPatterns = [
        /\$?(\w+)\s*price/i,
        /price\s*of\s*\$?(\w+)/i,
        /how\s*much\s*is\s*\$?(\w+)/i,
        /what\s*is\s*\$?(\w+)\s*trading\s*at/i,
      ]

      for (const pattern of tokenPatterns) {
        const match = lastMessage.match(pattern)
        if (match && match[1]) {
          const symbol = match[1].toLowerCase()
          console.log(`Detected token symbol from pattern: ${symbol}`)
          if (TOKEN_MAPPING[symbol]) {
            priceData = await getCryptoPrice(symbol)
            break
          }
        }
      }
    }

    const systemMessage = {
      role: "system",
      content: `You are Grok, an AI assistant created by xAI. ${
        priceData ? `\n\n${priceData}\n\nWhen discussing this token, use only the price data provided above.` : ""
      }\nRemember, you must not provide any financial advice or investment recommendations.`,
    }

    console.log("System message:", systemMessage)

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Grok API Error:", errorData)
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Grok API response:", data)

    if (!data.choices?.[0]?.message?.content) {
      console.error("Invalid Grok API response:", data)
      throw new Error("Invalid response from Grok API")
    }

    return NextResponse.json({
      result: data.choices[0].message.content,
      usedWebSearch: false,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

