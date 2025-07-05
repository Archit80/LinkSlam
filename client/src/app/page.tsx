import SiteHeader from "@/components/landing page/site-header"
import HeroSection from "@/components/landing page/hero-section"
import FeaturesSection from "@/components/landing page/features-section"
import VisualTeaserSection from "@/components/landing page/visual-teaser-section"
import CommunityPunchlineSection from "@/components/landing page/community-punchline-section"
import SiteFooter from "@/components/landing page/site-footer"
import { Particles } from "@/components/magicui/particles";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060606] overflow-x-hidden text-white flex flex-col selection:bg-red-100 selection:text-red-700">
       <Particles 
         className="absolute top-0 inset-0 z-0 h-screen w-full  "
        quantity={125}
        ease={35}
        color={"#ffffff"}
        refresh = {false} 
        size={0.6}
        staticity={35}
        vx={0.05}
        vy={-0.05}
        />
      <SiteHeader />
      
      <main className="flex-1 md:px-14">
        <HeroSection />
        <FeaturesSection />
        <VisualTeaserSection />
        <CommunityPunchlineSection />
      </main>
      <SiteFooter />
    </div>
  )
}
