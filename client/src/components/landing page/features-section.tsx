import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Globe, Shuffle, Settings, Tag, Sparkles } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-[#060606] text-white">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-primary mb-12">
          Features That Deserve a Slam!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-gray-900/30 border-gray-800 text-white shadow-lg hover:border-red-primary transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">My Slam Zone</CardTitle>
              <Lock className="h-8 w-8 text-red-400" />
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-lg">
                Your private vault for links. Save anything, keep it secret,
                keep it safe.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/30 border-gray-800 text-white shadow-lg hover:border-red-primary transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Slam Stream</CardTitle>
              <Globe className="h-8 w-8 text-red-400" />
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-lg">
                Discover public links shared by other users. Dive into the
                stream!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/30 border-gray-800 text-white shadow-lg hover:border-red-primary transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Randomizer</CardTitle>
              <Shuffle className="h-8 w-8 text-red-400" />
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-lg">
                Feeling adventurous? Hit the randomizer for a curated selection
                of links.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/30 border-gray-800 text-white shadow-lg hover:border-red-primary transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">NSFW Toggle</CardTitle>
              <Settings className="h-8 w-8 text-red-400" />
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-lg">
                Control your viewing experience. Toggle NSFW content on or off.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/30 border-gray-800 text-white shadow-lg hover:border-red-primary transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Tag Filter</CardTitle>
              <Tag className="h-8 w-8 text-red-400" />
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-lg">
                Filter links by tags to find exactly what you&apos;re looking
                for.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/30 border-gray-800 text-white shadow-lg hover:border-red-primary transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">
                Sleek, Modern Interface
              </CardTitle>
              <Sparkles className="h-8 w-8 text-red-400" />
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-lg">
                Dark mode default. Built to be intuitive and elegant for your
                links collection.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
