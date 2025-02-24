"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TwitterIcon as BrandTwitter, Users, LifeBuoy, CheckCircle } from "lucide-react"

export function ContactDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-white hover:text-purple-400 transition-colors text-sm sm:text-base">Contact</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#14123A] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">Contact SnapyX</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Card className="p-4 bg-purple-900/20 border-purple-500/20">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Join Our Community
            </h3>
            <p className="text-sm mb-4">
              Connect with fellow SnapyX users, share insights, and get the latest updates.
            </p>
            <div className="flex space-x-2">
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                onClick={() => window.open("https://t.me/SnapyxAI", "_blank")}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-removebg-preview-YS1ojjgoj4DF10xQfGDl8b7iMZREwY.png"
                  alt="Telegram"
                  className="w-4 h-4 mr-2 brightness-0 invert"
                />
                Join Telegram
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => window.open("https://x.com/SnapyxAI", "_blank")}
              >
                <BrandTwitter className="w-4 h-4 mr-2" />
                Follow on X
              </Button>
            </div>
          </Card>
          <Card className="p-4 bg-purple-900/20 border-purple-500/20">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <LifeBuoy className="w-5 h-5 mr-2" />
              24/7 Support
            </h3>
            <p className="text-sm mb-4">Need help? Our support team is available 24/7 to assist you.</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                Quick response time
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                Community-driven support
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                Regular updates and improvements
              </li>
            </ul>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

