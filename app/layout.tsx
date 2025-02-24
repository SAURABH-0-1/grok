import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { LoadingScreen } from "@/components/loading-screen"

export const metadata: Metadata = {
  title: "SnapyX | AI Agent by Grok",
  description: "Your AI-powered conversation assistant designed to revolutionize the way you chat & tweet.",
  icons: {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SnapyX%20logo-UDjUArnULJB91ffPJhJRsDvbehsNdS.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Zenovaxeno&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LoadingScreen />
        {children}
      </body>
    </html>
  )
}



import './globals.css'