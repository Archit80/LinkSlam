"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Globe, Shuffle, Settings, Tag, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "My Slam Zone",
    icon: Lock,
    description: "Your private vault for links. Save anything, keep it secret, keep it safe.",
  },
  {
    title: "Slam Stream",
    icon: Globe,
    description: "Discover public links shared by other users. Dive into the stream!",
  },
  {
    title: "Randomizer",
    icon: Shuffle,
    description: "Feeling adventurous? Hit the randomizer for a curated selection of links.",
  },
  {
    title: "NSFW Toggle",
    icon: Settings,
    description: "Control your viewing experience. Toggle NSFW content on or off.",
  },
  {
    title: "Tag Filter",
    icon: Tag,
    description: "Filter links by tags to find exactly what you're looking for.",
  },
  {
    title: "Sleek, Modern Interface",
    icon: Sparkles,
    description: "Dark mode default. Built to be intuitive and elegant for your links collection.",
  },
];

const MotionCard = motion(Card);

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-[#060606] text-white">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-primary mb-12">
          Features That Deserve a Slam!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <MotionCard
                whileHover={{
                  rotateX: -5,
                  rotateY: 5,
                  scale: 1.04,
                  boxShadow: "0px 15px 30px rgba(255, 0, 85, 0.15)",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="bg-gray-900/30 border border-gray-800 text-white shadow-lg hover:border-red-primary transition-all duration-300 rounded-xl cursor-pointer overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-20 transition-opacity pointer-events-none" />

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-2xl font-bold">
                    {feature.title}
                  </CardTitle>
                  <feature.icon className="h-8 w-8 text-red-400" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-gray-300 text-lg">
                    {feature.description}
                  </p>
                </CardContent>
              </MotionCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
