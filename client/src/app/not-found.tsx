import Link from "next/link";
import FuzzyText from "@/components/ui/FuzzyText/FuzzyText";
import { Button } from "@/components/ui/button";
// import { Rocket } from "lucide-react"
import SiteHeader from "@/components/landing page/site-header";
export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#060606] text-white">
      <SiteHeader />
      <div className="flex flex-grow flex-col items-center justify-center p-8 text-center sm:p-12 md:p-20 gap-y-4">
        <div className="-left-2 relative mb-4">
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.5}
            enableHover={true}
            fontSize="clamp(8rem, 20vw, 15rem)"
            fontWeight={800}
            color="#ef4444"
            // className="tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.7)] relative -left-8"
          >
            404
          </FuzzyText>
        </div>

        <div className="-left-1 relative mb-4">
          <FuzzyText
            baseIntensity={0.1}
            hoverIntensity={0.2}
            enableHover={true}
            fontSize="clamp(2rem, 5vw, 2.25rem)"
            fontWeight={700}
            color="#FFFFFF"
            className="mb-4"
          >
            Page Not Found
          </FuzzyText>
        </div>
        <p className="text-lg md:text-xl text-gray-300 max-w-md mb-8">
          Either this page doesn’t exist, or you just broke the internet. (It’s
          probably the first one.)
        </p>
        <Button
          asChild
          className="bg-red-500 text-white hover:bg-red-700 text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-red-700/30 transition-all duration-300"
        >
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
