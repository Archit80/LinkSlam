import Image from "next/image"
import { Sparkles } from "lucide-react"

export default function VisualTeaserSection() {
  return (
    <section className="w-full py-12 md:py-24 bg-[#060606] text-white overflow-hidden">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-primary mb-12">
          A Glimpse into the Chaos
        </h2>
        <div className="relative flex justify-center items-center h-[400px] md:h-[500px] lg:h-[600px]">
          {/* Background image for context */}
          <Image
            src="/logo.png"
            width={1000}
            height={600}
            alt="Slam Stream Dashboard Background"
            className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-xl"
          />

          {/* Floating Card 1 (Public View) */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] md:rotate-[-15deg] z-10">
            <Image
              src="/logo.png"
              width={450}
              height={300}
              alt="Slam Stream Public View Screenshot"
              className="rounded-lg shadow-2xl border border-gray-700 transform hover:scale-105 transition-transform duration-300"
            />
            <p className="text-sm text-gray-400 mt-2">Public Stream with Tag Search</p>
          </div>

          {/* Floating Card 2 (Personal View) */}
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 rotate-[8deg] md:rotate-[10deg] z-20">
            <Image
              src="/logo.png"
              width={450}
              height={300}
              alt="Slam Stream Personal View Screenshot"
              className="rounded-lg shadow-2xl border border-gray-700 transform hover:scale-105 transition-transform duration-300"
            />
            <p className="text-sm text-gray-400 mt-2">My Slam Zone (Private)</p>
          </div>

            <div className="absolute z-30">
            <Sparkles className="h-16 w-16 text-red-primary animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
