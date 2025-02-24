import { NextResponse } from "next/server"

const COINGECKO_API_URL = "https://pro-api.coingecko.com/api/v3/simple/price"
const BIRDEYE_API_URL = "https://public-api.birdeye.so/public/price"

// Token mapping for different APIs
const TOKEN_MAPPING = {
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
  // Add more tokens as needed
}

async function getCryptoPrice(symbol: string) {
  try {
    const tokenInfo = TOKEN_MAPPING[symbol.toLowerCase()]
    if (!tokenInfo) {
      throw new Error(`Unsupported token: ${symbol}`)
    }

    // Fetch price from CoinGecko
    const coingeckoResponse = await fetch(`${COINGECKO_API_URL}?ids=${tokenInfo.coingecko_id}&vs_currencies=usd`, {
      headers: {
        "x-cg-api-key": process.env.COINGECKO_API_KEY!,
      },
    })

    if (!coingeckoResponse.ok) {
      throw new Error(`CoinGecko API error: ${coingeckoResponse.status}`)
    }

    const coingeckoData = await coingeckoResponse.json()
    const coingeckoPrice = coingeckoData[tokenInfo.coingecko_id]?.usd

    // Fetch Birdeye price if address is available
    let birdeyePrice = null
    if (tokenInfo.birdeye_address) {
      const birdeyeResponse = await fetch(`${BIRDEYE_API_URL}?address=${tokenInfo.birdeye_address}`, {
        headers: {
          "x-api-key": process.env.BIRDEYE_API_KEY!,
        },
      })

      if (!birdeyeResponse.ok) {
        throw new Error(`Birdeye API error: ${birdeyeResponse.status}`)
      }

      const birdeyeData = await birdeyeResponse.json()
      if (birdeyeData.success && birdeyeData.data?.value) {
        birdeyePrice = birdeyeData.data.value
      }
    }

    return {
      coingeckoPrice: coingeckoPrice ? `$${coingeckoPrice.toFixed(2)}` : "N/A",
      birdeyePrice: birdeyePrice ? `$${birdeyePrice.toFixed(2)}` : "N/A",
      success: true,
    }
  } catch (error) {
    console.error("Error fetching crypto price:", error)
    return {
      coingeckoPrice: "N/A",
      birdeyePrice: "N/A",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function POST(req: Request) {
  if (!process.env.GROK_API_KEY) {
    console.error("Missing Grok API key")
    return NextResponse.json({ error: "Grok API key not configured" }, { status: 500 })
  }

  try {
    const { userInput, isPremium } = await req.json()

    if (!userInput) {
      return NextResponse.json({ error: "Missing user input" }, { status: 400 })
    }

    let realTimeData = ""

    // Enhanced token price pattern matching
    const tokenPatterns = [
      /\$?(\w+)\s*price/i,
      /price\s*of\s*\$?(\w+)/i,
      /how\s*much\s*is\s*\$?(\w+)/i,
      /what\s*is\s*\$?(\w+)\s*trading\s*at/i,
    ]

    let tokenSymbol = null
    for (const pattern of tokenPatterns) {
      const match = userInput.match(pattern)
      if (match) {
        tokenSymbol = match[1]
        break
      }
    }

    if (tokenSymbol) {
      const priceData = await getCryptoPrice(tokenSymbol)

      if (priceData.success) {
        realTimeData = `🔹 Real-time ${tokenSymbol.toUpperCase()} Price Update:
- CoinGecko: ${priceData.coingeckoPrice}
${priceData.birdeyePrice !== "N/A" ? `- Birdeye: ${priceData.birdeyePrice}` : ""}`
      } else {
        realTimeData = `Unable to fetch real-time price for ${tokenSymbol.toUpperCase()}: ${priceData.error}`
      }
    }

    // Ensure Grok does not provide financial advice
    if (/financial advice|investment|should I buy|should I sell/i.test(userInput)) {
      return NextResponse.json({ error: "❌ Financial advice is strictly prohibited." }, { status: 400 })
    }

    const prompt = isPremium
      ? `Generate a detailed, engaging tweet based on: "${userInput}". 
         Since this is for X Premium, you can exceed 280 characters.
         Make it natural and conversational, avoiding hashtags and excessive emojis.
         Focus on providing value and engaging content.
         ${realTimeData ? `\n\nInclude this real-time data in the tweet:\n${realTimeData}` : ""}
         Remember, do not provide any financial advice or investment recommendations.`
      : `Generate a natural, human-like tweet based on: "${userInput}". 
         Keep it under 280 characters.
         The tweet should sound like it's written by a real person, not AI. 
         Avoid hashtags, emojis, and robotic phrasing.
         ${realTimeData ? `\n\nInclude this real-time data in the tweet:\n${realTimeData}` : ""}
         Remember, do not provide any financial advice or investment recommendations.`

    const grokResponse = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        messages: [
          { role: "system", content: "You are a tweet generator that creates natural, human-like tweets." },
          { role: "user", content: prompt },
        ],
        max_tokens: isPremium ? 500 : 280,
        temperature: 0.7,
      }),
    })

    if (!grokResponse.ok) {
      const errorData = await grokResponse.json()
      console.error("Grok API Error:", errorData)
      throw new Error(`Grok API error: ${grokResponse.status}. ${JSON.stringify(errorData)}`)
    }

    const data = await grokResponse.json()

    if (!data?.choices?.[0]?.message?.content) {
      console.error("Invalid response from Grok API:", data)
      throw new Error("Invalid response from Grok API")
    }

    return NextResponse.json({
      tweet: data.choices[0].message.content.trim(),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

