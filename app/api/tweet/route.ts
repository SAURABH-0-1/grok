import { NextResponse } from "next/server"

export async function POST(req: Request) {
  if (!process.env.GROK_API_KEY) {
    console.error("Missing Grok API key")
    return NextResponse.json({ error: "Grok API key not configured" }, { status: 500 })
  }

  try {
    const { prompt, isPremium } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
    }

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        messages: [
          {
            role: "system",
            content: "You are a tweet generator that creates natural, human-like tweets.",
          },
          {
            role: "user",
            content: `Generate a natural, human-like tweet based on: "${prompt}". 
                     The tweet should sound like it's written by a real person, not AI. 
                     Avoid hashtags, emojis, and robotic phrasing. 
                     Keep it short and engaging.`,
          },
        ],
        max_tokens: isPremium ? 500 : 280,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Grok API Error:", errorData)
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.choices?.[0]?.message?.content) {
      console.error("Invalid Grok API response:", data)
      throw new Error("Invalid response from Grok API")
    }

    return NextResponse.json({
      tweet: data.choices[0].message.content.trim(),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Tweet generation error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

