"use client"

import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14123A] transition-opacity duration-500">
      <div className="relative flex flex-col items-center">
        <div className="mb-8 relative">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SnapyX%20logo-UDjUArnULJB91ffPJhJRsDvbehsNdS.png"
            alt="SnapyX Logo"
            className="w-24 h-24 animate-float"
          />
          <div className="absolute -inset-4 bg-purple-500/20 blur-2xl rounded-full animate-pulse" />
        </div>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}

