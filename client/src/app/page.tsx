import SiteHeader from "@/components/landing page/site-header"
import HeroSection from "@/components/landing page/hero-section"
import FeaturesSection from "@/components/landing page/features-section"
import VisualTeaserSection from "@/components/landing page/visual-teaser-section"
import CommunityPunchlineSection from "@/components/landing page/community-punchline-section"
import SiteFooter from "@/components/landing page/site-footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060606] text-white flex flex-col selection:bg-red-100 selection:text-red-700">
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
