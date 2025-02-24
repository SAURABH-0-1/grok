import { NextResponse } from "next/server"

const inappropriateContent = [
  "nude",
  "naked",
  "nsfw",
  "porn",
  "explicit",
  "adult",
  "xxx",
  "sexual",
  "violence",
  "gore",
  "blood",
  "death",
]

function sanitizePrompt(input: string): string {
  const containsInappropriate = inappropriateContent.some((word) => input.toLowerCase().includes(word.toLowerCase()))

  if (containsInappropriate) {
    return "Generate a safe, creative artistic image"
  }

  return `Create a highly detailed, photorealistic image with the following description: ${input}. 
          Focus on creating a lifelike scene with natural lighting, accurate textures, and proper proportions. 
          Pay attention to subtle details that make the image feel authentic and real. 
          Avoid any artificial or computer-generated appearance. 
          Ensure the composition is visually appealing and the elements are well-balanced.`
}

export async function POST(req: Request) {
  console.log("Received image generation request")

  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OpenAI API key")
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
  }

  try {
    const { userInput } = await req.json()
    if (!userInput) {
      return NextResponse.json({ error: "Missing user input" }, { status: 400 })
    }

    const safePrompt = sanitizePrompt(userInput)

    const dalleResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: safePrompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        style: "natural",
      }),
    })

    const dalleData = await dalleResponse.json()

    if (!dalleResponse.ok) {
      console.error("DALL·E API Error:", dalleData)

      if (dalleResponse.status === 429) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded. Please try again later.",
            retryAfter: dalleResponse.headers.get("Retry-After") || "60",
          },
          { status: 429 },
        )
      }

      if (dalleData.error?.code === "content_policy_violation") {
        return NextResponse.json(
          {
            error: "The image couldn't be generated due to content policy restrictions. Please try a different prompt.",
          },
          { status: 400 },
        )
      }

      return NextResponse.json(
        {
          error: "An error occurred while generating the image. Please try again.",
          details: dalleData.error?.message || `DALL·E API error: ${dalleResponse.status}`,
        },
        { status: dalleResponse.status },
      )
    }

    if (!dalleData?.data?.[0]?.url) {
      console.error("Invalid DALL·E response:", dalleData)
      return NextResponse.json({ error: "Invalid response from DALL·E API" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      imageUrl: dalleData.data[0].url,
      prompt: safePrompt,
    })
  } catch (error) {
    console.error("Image generation error:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred during image generation. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

