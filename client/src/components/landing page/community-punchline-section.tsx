import Link from "next/link"
import { Github, Instagram } from "lucide-react"

export default function CommunityPunchlineSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-[#060606] text-white text-center">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-primary mb-6">
          Where your links actually belong.
        </h2>
        <p className="max-w-[800px] mx-auto text-lg md:text-xl text-gray-300 mb-8">
          Built with care, curiosity, and way too many open tabs. I'm crafting this project to
rethink how we collect and revisit the links that actually stick.
        </p>
        <div className="flex justify-center space-x-6">
          <Link href="https://github.com/Archit80" target="main" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
            <Github className="h-8 w-8" />
            <span className="text-lg font-medium">GitHub</span>
          </Link>
          <Link href="https://instagram.com/archit.mp4" target="main"  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
            <Instagram className="h-8 w-8" />
            <span className="text-lg font-medium">Instagram</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
