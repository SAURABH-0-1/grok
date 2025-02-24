"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { TwitterIcon as BrandTwitter, Wand2, Loader2, AlertCircle, HelpCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"

interface GenerateResponse {
  tweet?: string
  error?: string
  timestamp?: string
  imageUrl?: string
}

export function TweetGenerator() {
  const [prompt, setPrompt] = useState("")
  const [generatedTweet, setGeneratedTweet] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{ message: string; details?: string } | null>(null)
  const [generateImage, setGenerateImage] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [contentHeight, setContentHeight] = useState("auto")

  useEffect(() => {
    // Dynamically adjust content height
    const newHeight = generateImage ? "auto" : "0px"
    setContentHeight(newHeight)
  }, [generateImage])

  const generateTweet = async () => {
    if (!prompt.trim() || isLoading) return

    setIsLoading(true)
    setGeneratedTweet("")
    setImageUrl(null)
    setError(null)

    try {
      console.log("Sending tweet generation request:", prompt)

      const response = await fetch("/api/grok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: isPremium
            ? `Generate a detailed tweet (can be longer than 280 characters since this is for X Premium): ${prompt}`
            : `Generate a concise tweet (must be under 280 characters): ${prompt}`,
          isPremium,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Tweet generation failed: ${response.status}`)
      }

      if (!data.tweet) {
        throw new Error("No tweet generated")
      }

      setGeneratedTweet(data.tweet)

      if (generateImage) {
        const imageResponse = await fetch("/api/generateImage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userInput: data.tweet }),
        })

        const imageData = await imageResponse.json()

        if (!imageResponse.ok) {
          if (imageResponse.status === 429) {
            throw new Error(
              `Image generation rate limit exceeded. Please try again in ${imageData.retryAfter} seconds.`,
            )
          }
          throw new Error(imageData.error || `Image generation failed: ${imageResponse.status}`)
        }

        if (!imageData.imageUrl) {
          throw new Error("No image URL received")
        }

        setImageUrl(imageData.imageUrl)
      }
    } catch (error) {
      console.error("Generation error:", error)
      setError({
        message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        details: error instanceof Error && error.stack ? error.stack : undefined,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const postToTwitter = () => {
    if (!generatedTweet) return
    let tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(generatedTweet)}`
    if (imageUrl) {
      tweetUrl += `&url=${encodeURIComponent(imageUrl)}`
    }
    window.open(tweetUrl, "_blank")
  }

  return (
    <Card className="bg-black/40 border-white/10 h-[500px] sm:h-[600px] flex flex-col overflow-hidden">
      <div className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What would you like to tweet? Type your topic with details."
          className="min-h-[80px] sm:min-h-[100px] bg-white/5 border-white/10 resize-none text-white text-sm sm:text-base p-3 sm:p-4 placeholder:text-gray-500"
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Switch id="generate-image" checked={generateImage} onCheckedChange={setGenerateImage} />
            <Label htmlFor="generate-image" className="text-white text-sm sm:text-base">
              Generate Image
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="is-premium" checked={isPremium} onCheckedChange={setIsPremium} />
            <Label htmlFor="is-premium" className="text-white text-sm sm:text-base">
              X Premium User
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs sm:text-sm">X Premium users can post tweets longer than 280 characters.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            className="flex-1 bg-purple-600 hover:bg-purple-700 transition-colors text-sm sm:text-base"
            onClick={generateTweet}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
            Generate Tweet
          </Button>
          <Button
            variant="secondary"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm sm:text-base"
            onClick={postToTwitter}
            disabled={!generatedTweet}
          >
            <BrandTwitter className="w-4 h-4 mr-2" />
            Post to Twitter
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs sm:text-sm">
              {error.message}
              {error.details && (
                <details className="mt-2 text-xs">
                  <summary>Error Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap">{error.details}</pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-3 sm:mt-4">
          <h4 className="text-sm font-medium text-white mb-2">Generated Tweet</h4>
          {generatedTweet ? (
            <Card className="p-2 sm:p-3 bg-white/5 border-white/10">
              <p className="text-white text-sm sm:text-base">{generatedTweet}</p>
            </Card>
          ) : (
            <Card className="p-2 sm:p-3 bg-white/5 border-white/10">
              <p className="text-gray-400 text-sm sm:text-base">Your generated tweet will appear here...</p>
            </Card>
          )}
        </div>

        <div
          className="mt-3 sm:mt-4 overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: generateImage ? "1000px" : "0",
            opacity: generateImage ? "1" : "0",
            visibility: generateImage ? "visible" : "hidden",
          }}
        >
          {generateImage && (
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Generated Image</h4>
              <Card className="p-2 sm:p-3 bg-white/5 border-white/10">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-48 sm:h-64 space-y-3 sm:space-y-4">
                    <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-purple-600" />
                    <p className="text-gray-400 text-center text-sm sm:text-base">
                      Creating your masterpiece...
                      <br />
                      This may take a few moments
                    </p>
                  </div>
                ) : imageUrl ? (
                  <div className="relative h-48 sm:h-64 w-full">
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt="Generated image"
                      fill
                      className="rounded-lg object-cover"
                      onError={() => setError("Failed to load the generated image. Please try again.")}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 sm:h-64 space-y-3 sm:space-y-4 bg-gradient-to-b from-purple-900/10 to-black/20 rounded-lg">
                    <div className="p-3 sm:p-4 rounded-full bg-white/5 backdrop-blur-sm">
                      <Image src="/placeholder.svg" alt="Placeholder" width={24} height={24} className="opacity-50" />
                    </div>
                    <p className="text-gray-400 text-center px-4 sm:px-6 text-sm sm:text-base">
                      Your generated image will appear here
                      <br />
                      <span className="text-xs sm:text-sm opacity-75">
                        We'll create something amazing based on your tweet
                      </span>
                    </p>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

