"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Send, Globe, BookOpen, AlertCircle, MoreHorizontal } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp?: string
  usedWebSearch?: boolean
}

interface ChatResponse {
  result?: string
  error?: string
  usedWebSearch?: boolean
  timestamp?: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data: ChatResponse = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.result) {
        throw new Error("No response received from the server")
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.result,
        timestamp: data.timestamp,
        usedWebSearch: data.usedWebSearch,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setError(errorMessage)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I apologize, but I encountered an error: ${errorMessage}. Please try again.`,
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-black/40 border-white/10 h-[500px] sm:h-[600px] flex flex-col">
      <div className="flex-1 overflow-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="flex flex-col gap-1 sm:gap-2 max-w-[85%] sm:max-w-[80%]">
              <div
                className={`rounded-lg px-3 sm:px-4 py-2 ${
                  message.role === "user" ? "bg-purple-600 text-white" : "bg-white/10 text-gray-100"
                }`}
              >
                <p className="text-sm sm:text-base">{message.content}</p>
              </div>
              {message.role === "assistant" && message.usedWebSearch !== undefined && (
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  {message.usedWebSearch ? (
                    <>
                      <Globe className="w-3 h-3" />
                      <span>Based on real-time web search</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-3 h-3" />
                      <span>Based on AI knowledge base</span>
                    </>
                  )}
                </div>
              )}
              {message.timestamp && (
                <div className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-white/10 text-gray-100">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
                </div>
                <span>SnapyX is thinking...</span>
              </div>
            </div>
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {messages.length === 0 && (
          <div className="flex justify-center items-center h-full px-6">
            <p className="text-gray-400 text-lg text-center">
              Ask anything! I'll search the web for real-time data when needed.
              <br />
              <span className="text-sm opacity-75">
                Try asking about crypto prices, news, or any topic you're curious about
              </span>
            </p>
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4 border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3 items-center">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="min-h-[40px] sm:min-h-[48px] bg-white/5 border-white/10 resize-none text-white text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3"
          />
          <Button
            type="submit"
            size="icon"
            className="h-[40px] w-[40px] sm:h-[48px] sm:w-[48px] bg-purple-600 hover:bg-purple-700 hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-purple-600/25 rounded-xl"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
            ) : (
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  )
}

