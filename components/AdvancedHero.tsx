"use client"

import type React from "react"
import { useLanguage } from "./LanguageProvider"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

interface AdvancedHeroProps {
  title?: string
  subtitle?: string
  backgroundVideo?: string
  backgroundImage?: string
  primaryCTA?: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  showScroll?: boolean
}

export function AdvancedHero({
  title,
  subtitle,
  backgroundVideo,
  backgroundImage,
  primaryCTA,
  secondaryCTA,
  showScroll = true,
}: AdvancedHeroProps) {
  const { t, language } = useLanguage()

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      {backgroundVideo && (
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
          poster={backgroundImage}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}

      {/* Image Fallback */}
      {!backgroundVideo && backgroundImage && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6 drop-shadow-lg">
          {title || t("home.hero.title")}
        </h1>

        <p className="text-lg md:text-xl text-balance mb-10 text-gray-100 drop-shadow-md max-w-2xl mx-auto">
          {subtitle || t("home.hero.subtitle")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryCTA && (
            <Link href={primaryCTA.href}>
              <Button size="lg" className="btn-primary min-w-56">
                {primaryCTA.text}
              </Button>
            </Link>
          )}

          {secondaryCTA && (
            <Link href={secondaryCTA.href}>
              <Button size="lg" variant="outline" className="min-w-56 bg-white/10 border-white hover:bg-white/20">
                {secondaryCTA.text}
              </Button>
            </Link>
          )}
        </div>

        {/* Scroll Indicator */}
        {showScroll && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-white" />
          </div>
        )}
      </div>
    </section>
  )
}
