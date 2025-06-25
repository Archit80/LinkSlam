import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Flame } from "lucide-react"

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#060606]/60 backdrop-blur-sm border-b border-gray-800">
      <div className="container flex w-full h-16 items-center justify-between px-4 md:px-20">
        <Link href="#" className="flex items-center space-x-2">
          <Flame className="h-6 w-6 text-red-primary" />
          <span className="font-bold text-white text-lg">LinkSlam</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="#">
            Login
          </Link>
          
          <Button asChild variant="outline" className="bg-white text-black hover:bg-gray-200">
            <Link href="#">Sign up</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
