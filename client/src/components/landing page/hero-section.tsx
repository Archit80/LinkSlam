import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 bg-[#060606] text-white">
      <div className="container px-4 md:px-6">
        <div className="flex  lg:gap-12 items-center">
          <div className="flex flex-col justify-center w-2/3 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-none">
              Because links deserve to be remembered.
              <br />
              <span className="text-red-primary leading-relaxed">
                Discover, Save, Slam.
              </span>
            </h1>
            <p className="max-w-[700px] mx-auto lg:mx-0 text-lg md:text-xl text-gray-300">
              A focused space for saving and slamming the links that deserve
              more than just a browser tab graveyard.
              <br />
              Where the most chaotic, curated, and captivating links find their
              home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                className="bg-red-500 text-white hover:bg-red-primary text-lg px-8 py-6 rounded-lg"
              >
                <Link href="#">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 text-lg px-8 py-6 rounded-lg"
              >
                <Link href="#">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/logo.png"
              width={700}
              height={400}
              alt="Slam Stream Demo"
              className="rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
