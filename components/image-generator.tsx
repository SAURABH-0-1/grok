"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Wand2, Loader2, TwitterIcon } from "lucide-react"
import Image from "next/image"

export function ImageGenerator() {
  const [input, setInput] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/generateImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: input }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image")
      }

      setImageUrl(data.imageUrl)
    } catch (error) {
      console.error("Image generation error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTweet = () => {
    if (!imageUrl) return

    const tweetText = encodeURIComponent(`Check out this AI-generated image!`)
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(imageUrl)}`
    window.open(tweetUrl, "_blank")
  }

  return (
    <Card className="bg-black/40 border-white/10 p-4 flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-white">🎨 AI Tweet Image Generator</h2>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your tweet idea..."
        className="min-h-[100px] bg-white/5 border-white/10 resize-none text-white"
      />
      <Button
        onClick={handleGenerate}
        disabled={isLoading || !input.trim()}
        className="bg-purple-600 hover:bg-purple-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Image
          </>
        )}
      </Button>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      {imageUrl && (
        <div className="flex flex-col items-center gap-4">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt="Generated AI"
            width={300}
            height={300}
            className="rounded-lg"
          />
          <Button onClick={handleTweet} className="bg-blue-500 hover:bg-blue-600">
            <TwitterIcon className="w-4 h-4 mr-2" />
            Post to Twitter
          </Button>
        </div>
      )}
    </Card>
  )
}

