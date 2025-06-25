import Link from "next/link"
import { Button } from "@/components/ui/button"
// import { Rocket } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center p-4">
      <div className="relative mb-8">
        <h1 className="text-9xl font-extrabold text-red-600 tracking-widest drop-shadow-[0_0_10px_rgba(220,38,38,0.7)] md:text-[12rem] lg:text-[15rem]">
          404
        </h1>
        {/* <div className="absolute inset-0 flex items-center justify-center">
          <Rocket className="h-24 w-24 text-gray-700 animate-pulse opacity-50 md:h-32 md:w-32 lg:h-48 lg:w-48" />
        </div> */}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Page Not Found</h2>
      <p className="text-lg md:text-xl text-gray-300 max-w-md mb-8">
        Either this page doesn’t exist, or you just broke the internet. (It’s probably the first one.)
      </p>
      <Button
        asChild
        className="bg-red-600 text-white hover:bg-red-700 text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-red-500/50 transition-all duration-300"
      >
        <Link href="/">Return to Homepage</Link>
      </Button>
    </div>
  )
}
