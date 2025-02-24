"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  alpha: number
  color: string
  connection: number
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const colors = ["#8A2BE2", "#4834D4", "#FF6B6B"]
    const connectionDistance = 150
    const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 20000))

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        connection: 0,
      })
    }

    function drawConnections(particle: Particle, particles: Particle[]) {
      particles.forEach((p) => {
        const distance = Math.hypot(particle.x - p.x, particle.y - p.y)
        if (distance < connectionDistance && distance > 0) {
          const alpha = (1 - distance / connectionDistance) * 0.2
          ctx!.beginPath()
          ctx!.strokeStyle = `rgba(138, 43, 226, ${alpha})`
          ctx!.lineWidth = 0.5
          ctx!.moveTo(particle.x, particle.y)
          ctx!.lineTo(p.x, p.y)
          ctx!.stroke()
        }
      })
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Draw connections
        drawConnections(particle, particles.slice(i + 1))

        // Draw particle
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius)
        gradient.addColorStop(0, `${particle.color}`)
        gradient.addColorStop(1, "rgba(138, 43, 226, 0)")
        ctx.fillStyle = gradient
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ background: "linear-gradient(to bottom right, #000111, #1a1a2e)" }}
    />
  )
}

