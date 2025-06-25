import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SiteFooter() {
  return (
    <footer className="w-full py-12 md:py-16 bg-[#060606] text-white relative overflow-hidden">
      {/* Semi-circle gradient element */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120vw] h-[60vw] rounded-t-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 100%, rgba(240, 25, 25, 0.9) 0%, transparent 70%)",
          transform: "translateX(0%) translateY(64%)", // Increased translateY to push it further down
          zIndex: 0,
        }}
      />
      <div className="container px-4 md:px-6 flex flex-col items-center justify-center text-center space-y-6 relative z-10">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-primary">Ready to Slam?</h2>
          <p className="max-w-[700px] mx-auto text-lg md:text-xl text-gray-300">
            Join the chaos. Discover, save, and share the links that truly deserve it.
          </p>
        </div>
        <Button asChild className="bg-red-500 text-white hover:bg-red-primary text-lg px-8 py-6 rounded-lg">
          <Link href="#">Get Started</Link>
        </Button>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-400">
          <Link href="#" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="#" className="hover:underline">
            Privacy Policy
          </Link>
          <p>&copy; {new Date().getFullYear()} Slam Stream. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
