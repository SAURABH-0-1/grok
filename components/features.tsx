import { Card } from "@/components/ui/card"

const features = [
  {
    title: "AI-Powered Tweeting",
    subtitle: "🚀 Generate & Optimize Tweets",
    description:
      "SnapyX, powered by Grok 3, lets you craft, refine, and optimize tweets effortlessly. Say goodbye to writer's block—AI does the work for you!",
  },
  {
    title: "Real-Time AI Chat",
    subtitle: "💬 Intelligent Conversations",
    description:
      "Engage in smart, real-time AI-driven conversations with SnapyX. Powered by Grok 3, it adapts, learns, and provides context-aware responses instantly.",
  },
  {
    title: "Adaptive Tweet Formatting",
    subtitle: "📢 Smart Tweet Structuring",
    description:
      "Whether you're a Twitter Premium user or not, SnapyX auto-adjusts tweet length and formatting for maximum engagement, ensuring your tweets always fit.",
  },
  {
    title: "Instant Twitter Integration",
    subtitle: "🔗 One-Click Tweet Posting",
    description:
      "Seamlessly post AI-generated tweets with a single click. No copy-paste hassle—just generate, approve, and tweet instantly.",
  },
  {
    title: "Personalized AI Experience",
    subtitle: "🎯 Your AI, Your Way",
    description:
      "SnapyX adapts to your tweeting style, ensuring your AI-generated tweets feel natural and personalized—like they were written by you.",
  },
  {
    title: "Powered by Grok 3 (xAI)",
    subtitle: "⚡ Next-Gen AI Technology",
    description:
      "Built on the latest Grok AI (xAI) advancements, SnapyX delivers cutting-edge AI intelligence for smarter, faster, and more human-like interactions.",
  },
]

export function Features() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="card-gradient p-4 sm:p-6 border-none transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-gradient mb-2">{feature.title}</h3>
              <p className="text-purple-300 mb-3 sm:mb-4 font-medium text-sm sm:text-base">{feature.subtitle}</p>
              <p className="text-gray-300 text-sm sm:text-base">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

