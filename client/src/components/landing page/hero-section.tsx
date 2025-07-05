"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Variants for character animation
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.2,
    },
  },
};

// const wordContainer = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.15, // slower stagger between words
//       delayChildren: 0.5, // start a little after line 2
//     },
//   },
// };

const letter = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HeroSection() {
  const line1 = "Because links deserve ";
  const line2 = "to be remembered.";
  const line3 = `Discover. Save. Slam.`;

  return (
    <section className="w-full py-12 px-2 md:px-0 md:py-24 mt-2 bg-[#060606] text-white">
      <div className="container px-4 text-center md:px-6">
        <div className="flex flex-col text-center w-full lg:flex-row gap-4 items-center">
          {/* Left content: animate from left */}
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 60,
              damping: 18,
              delay: 0.1,
            }}
            className="flex flex-col justify-center lg:w-2/3 space-y-6 text-center lg:text-left"
          >
            {/* Letter-by-letter animated h1 */}
            <motion.h1
              variants={container}
              initial="hidden"
              animate="visible"
              className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-none"
            >
              {line1.split("").map((char, i) => (
                <motion.span key={`l1-${i}`} variants={letter}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              <br />

              {line2.split("").map((char, i) => (
                <motion.span key={`l1-${i}`} variants={letter}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              <br />

              <motion.span
                
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 2.2,
                  staggerChildren: 0.15,
                }}
                className="text-red-primary w-full lg:leading-relaxed lg:text-7xl inline-block"
              >
                {line3.split(" ").map((word, i) => (
                  <motion.span
                    key={`w-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 2.2 + i * 0.25, // word-by-word delay after total delay
                    }}
                    className="inline-block mr-4"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 70,
                damping: 18,
                delay: 0.3,
              }}
              className="max-w-[700px] mx-auto lg:mx-0 text-lg md:text-xl text-gray-300"
            >
              A focused space for saving and slamming the links that deserve
              more than just a browser tab graveyard.
              <br />
              Where the most chaotic, curated, and captivating links find their
              home.
            </motion.p>

            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 70,
                damping: 18,
                delay: 0.4,
              }}
              className="flex flex-col items-center md:items-start w-full sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                asChild
                className="bg-red-500 text-white hover:bg-red-700 text-lg px-8 py-6 rounded-lg"
              >
                <Link href="/auth" aria-label="Get Started">
                  Get Started
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-gray-800 hover:text-white text-gray-200 border-gray-700 hover:bg-gray-900/60 text-lg px-8 py-6 rounded-lg"
              >
                <a href="#features">Learn More</a>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 1.1,
              ease: [0.25, 0.1, 0.25, 1], // cubic-bezier like CSS ease-in-out
              delay: 1.3,
            }}
            className="drop-shadow-xl"
          >

            <Image
              src="/logo.png"
              width={650}
              height={400}
              alt="Slam Stream Demo"
              className="rounded-xl object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
