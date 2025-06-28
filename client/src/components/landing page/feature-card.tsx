"use client"

import { motion } from "framer-motion"
import React, { useState } from "react"
import Image from "next/image"

type FeatureCardProps = {
  title: string
  icon: React.ReactNode
  description: string
}

export function FeatureCard({ title, icon, description }: FeatureCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = -((y - centerY) / centerY) * 10
    const rotateY = ((x - centerX) / centerX) * 10

    setRotate({ x: rotateX, y: rotateY })
  }

  const resetRotation = () => {
    setRotate({ x: 0, y: 0 })
  }

  return (
    <div className="relative group perspective-[1000px]">
      {/* Background Dragon */}
      <motion.div
        initial={{ x: -50, opacity: 0.3 }}
        animate={{ x: 50 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 10,
          ease: "easeInOut",
        }}
        className="absolute inset-0 z-0 pointer-events-none blur-sm"
      >
        <Image
          src="/dragon-flying.gif" // 🐉 Place this gif in your public/ folder
          alt="flying dragon"
          fill
          className="object-cover opacity-30"
        />
      </motion.div>

      {/* Foreground Card */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={resetRotation}
        animate={{ rotateX: rotate.x, rotateY: rotate.y }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="relative z-10 rounded-2xl bg-[#111] p-6 border border-red-500/30 text-white shadow-md hover:shadow-red-500/50"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div className="text-red-400 mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-red-200">{description}</p>
      </motion.div>
    </div>
  )
}
