"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { TwitterIcon as BrandTwitter, ChevronDown } from "lucide-react"
import { ChatInterface } from "@/components/chat-interface"
import { TweetGenerator } from "@/components/tweet-generator"
import { Features } from "@/components/features"
import { ParticleBackground } from "@/components/particle-background"
import { MessageSquare, Sparkles, Zap, Users, LifeBuoy, CheckCircle } from "lucide-react"
import { ContactDialog } from "@/components/contact-dialog"

export default function Page() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const handleParallax = (e: React.MouseEvent<HTMLDivElement>) => {
    const parallaxElements = document.querySelectorAll(".parallax")
    const mouseX = e.clientX / window.innerWidth - 0.5
    const mouseY = e.clientY / window.innerHeight - 0.5

    parallaxElements.forEach((el) => {
      const speed = Number.parseFloat(el.getAttribute("data-speed") || "0")
      const x = mouseX * speed
      const y = mouseY * speed
      ;(el as HTMLElement).style.transform = `translate(${x}px, ${y}px)`
    })
  }

  return (
    <div className="min-h-screen relative bg-premium-dark" onMouseMove={handleParallax}>
      <ParticleBackground />

      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10">
        {/* Enhanced Header */}
        <header className="fixed top-0 w-full z-50 glass-effect border-b border-white/10">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SnapyX_logo-removebg-preview-qQuHeoqhig0vjfhYX5chRrkSIEJ69m.png"
              alt="SnapyX Logo"
              className="h-6 sm:h-8 animate-float parallax"
              data-speed="20"
            />
            <div className="flex items-center gap-2 sm:gap-4">
              <a
                href="https://t.me/SnapyxAI"
                target="_blank"
                rel="noopener noreferrer"
                className="social-button rounded-full px-2 sm:px-4 py-1 sm:py-2 text-white flex items-center gap-1 sm:gap-2 hover:text-white text-sm sm:text-base"
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-removebg-preview-XW8npMZkOISf5El0wRxQhdEKltypa2.png"
                  alt="Telegram"
                  className="w-4 h-4 sm:w-5 sm:h-5 icon invert"
                />
                <span className="hidden sm:inline">Telegram</span>
              </a>
              <a
                href="https://x.com/SnapyxAI"
                target="_blank"
                rel="noopener noreferrer"
                className="social-button rounded-full px-2 sm:px-4 py-1 sm:py-2 text-white flex items-center gap-1 sm:gap-2 hover:text-white text-sm sm:text-base"
              >
                <BrandTwitter className="w-4 h-4 sm:w-5 sm:h-5 icon" />
                <span className="hidden sm:inline">Twitter</span>
              </a>
            </div>
          </div>
        </header>

        {/* Enhanced Hero Section */}
        <section
          id="about"
          className="pt-24 sm:pt-32 pb-12 sm:pb-16 text-center relative"
          ref={(el) => (sectionRefs.current[0] = el)}
        >
          <div className="container mx-auto px-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SnapyX%20text%20png-QBs9RUtn9Ck8GzUIxsJNNFcJFKhsQG.png"
              alt="SNAPYX"
              className="h-16 sm:h-24 mx-auto mb-6 sm:mb-8 animate-float parallax"
              data-speed="10"
            />
            <h2
              className="text-xl sm:text-2xl font-medium text-gradient mb-4 sm:mb-6 animate-fadeUp text-reveal"
              style={{ animationDelay: "0.2s" }}
            >
              The First AI Agent Built with Grok 3
            </h2>
            <p
              className="max-w-3xl mx-auto text-gray-300 text-base sm:text-lg leading-relaxed animate-fadeUp text-reveal mb-8 sm:mb-12"
              style={{ animationDelay: "0.4s" }}
            >
              Your AI-powered conversation assistant designed to revolutionize the way you chat & tweet. Powered by Grok
              3, SnapyX enables real-time AI interactions, intelligent tweet generation, and seamless Twitter posting.
            </p>
            <Button
              className="button-primary text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 animate-fadeUp group relative overflow-hidden"
              style={{ animationDelay: "0.6s" }}
              onClick={() => {
                document.getElementById("tweet-generator")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              <span className="relative z-10">Launch App</span>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 opacity-40 group-hover:translate-y-0 transition-transform duration-300">
                <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </Button>
          </div>

          {/* Enhanced Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        </section>

        <Features />

        {/* Enhanced Features Section */}
        <section id="features" className="py-12 sm:py-16" ref={(el) => (sectionRefs.current[1] = el)}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              <div className="animate-scaleIn text-reveal" style={{ animationDelay: "0.6s" }}>
                <h3 className="text-lg sm:text-xl font-bold text-gradient mb-4 sm:mb-6">
                  Talk with SnapyX - Grok Agent
                </h3>
                <ChatInterface />
              </div>
              <div className="animate-scaleIn text-reveal" id="tweet-generator" style={{ animationDelay: "0.8s" }}>
                <h3 className="text-lg sm:text-xl font-bold text-gradient mb-4 sm:mb-6">SnapyX Tweet Generator</h3>
                <TweetGenerator />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 sm:py-16 bg-black/30" ref={(el) => (sectionRefs.current[3] = el)}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient text-center mb-8 sm:mb-12">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <div
                className="text-center p-6 card-gradient rounded-lg animate-fadeUp"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-purple-600/20 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Grok-Powered Chat</h3>
                <p className="text-gray-300">
                  Our AI chat system leverages Grok 3's advanced language model for natural, context-aware conversations
                  and real-time information processing.
                </p>
              </div>
              <div
                className="text-center p-6 card-gradient rounded-lg animate-fadeUp"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-purple-600/20 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Smart Tweet Generation</h3>
                <p className="text-gray-300">
                  Generate engaging tweets with AI that understands context, trends, and your personal style. Includes
                  image generation capabilities.
                </p>
              </div>
              <div
                className="text-center p-6 card-gradient rounded-lg animate-fadeUp"
                style={{ animationDelay: "0.6s" }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-purple-600/20 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Real-Time Processing</h3>
                <p className="text-gray-300">
                  Get instant responses with our optimized AI pipeline. Seamlessly integrate with Twitter for immediate
                  posting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Community & Support Section */}
        <section className="py-12 sm:py-16" ref={(el) => (sectionRefs.current[4] = el)}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              <div
                className="card-gradient p-8 rounded-lg animate-fadeUp bg-[#14123A] relative overflow-hidden group"
                style={{ animationDelay: "0.2s" }}
              >
                {/* Add decorative gradient effects */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>

                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center backdrop-blur-sm">
                      <Users className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">Join Our Community</h3>
                  </div>
                  <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                    Be part of a thriving community of SnapyX enthusiasts! Share insights, get exclusive updates, and
                    connect with fellow users who are revolutionizing their social media presence with AI.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href="https://t.me/SnapyxAI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 transition-all duration-300 text-white group/button"
                    >
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-removebg-preview-YS1ojjgoj4DF10xQfGDl8b7iMZREwY.png"
                        alt="Telegram"
                        className="w-5 h-5 brightness-0 invert opacity-90 group-hover/button:scale-110 transition-transform duration-300"
                      />
                      <span className="font-medium">Join Telegram</span>
                    </a>
                    <a
                      href="https://x.com/SnapyxAI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 transition-all duration-300 text-white group/button"
                    >
                      <BrandTwitter className="w-5 h-5 opacity-90 group-hover/button:scale-110 transition-transform duration-300" />
                      <span className="font-medium">Follow on Twitter</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* 24/7 Support section remains unchanged */}
              <div
                className="card-gradient p-8 rounded-lg animate-fadeUp bg-[#14123A]"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center">
                    <LifeBuoy className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">24/7 Support</h3>
                </div>
                <p className="text-gray-300 mb-8 text-lg">
                  Need help? Our support team is available 24/7 to assist you. Get quick responses through our Telegram
                  channel or reach out via Twitter for public discussions.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600/10">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-200">Quick response time</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600/10">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-200">Community-driven support</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600/10">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-200">Regular updates and improvements</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer
          className="py-6 sm:py-8 border-t border-white/10 relative z-10 glass-effect"
          ref={(el) => (sectionRefs.current[2] = el)}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 sm:gap-8">
                <a href="#features" className="text-white hover:text-purple-400 transition-colors text-sm sm:text-base">
                  Features
                </a>
                <a href="#about" className="text-white hover:text-purple-400 transition-colors text-sm sm:text-base">
                  About
                </a>
                <ContactDialog />
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">© 2024 SnapyX. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

