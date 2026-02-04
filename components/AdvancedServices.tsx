"use client"

import React from "react"

import { useLanguage } from "./LanguageProvider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Plane,
  FileCheck,
  Briefcase,
  MapPin,
  Globe,
  Shield,
  Clock,
  Users,
} from "lucide-react"

interface Service {
  id: string
  titleKey: string
  descriptionKey: string
  icon: React.ReactNode
  slug: string
  features: string[]
}

const defaultServices: Service[] = [
  {
    id: "visa",
    titleKey: "services.visa",
    descriptionKey: "services.visa",
    icon: <FileCheck className="w-12 h-12" />,
    slug: "visa-assistance",
    features: [
      "Schengen Visa Guidance",
      "UK & US Applications",
      "Document Review",
      "Interview Preparation",
    ],
  },
  {
    id: "flights",
    titleKey: "services.flights",
    descriptionKey: "services.flights",
    icon: <Plane className="w-12 h-12" />,
    slug: "flight-booking",
    features: ["Best Rates", "Flexible Options", "24/7 Support", "Instant Confirmation"],
  },
  {
    id: "corporate",
    titleKey: "services.corporate",
    descriptionKey: "services.corporate",
    icon: <Briefcase className="w-12 h-12" />,
    slug: "corporate-travel",
    features: [
      "Policy Compliance",
      "Group Discounts",
      "Expense Tracking",
      "Duty of Care",
    ],
  },
  {
    id: "packages",
    titleKey: "services.packages",
    descriptionKey: "services.packages",
    icon: <MapPin className="w-12 h-12" />,
    slug: "travel-packages",
    features: [
      "Customizable Itineraries",
      "All-Inclusive Options",
      "Group Rates",
      "Local Expertise",
    ],
  },
]

interface AdvancedServicesProps {
  services?: Service[]
  showAll?: boolean
  limit?: number
}

export function AdvancedServices({
  services = defaultServices,
  showAll = false,
  limit = 4,
}: AdvancedServicesProps) {
  const { t } = useLanguage()
  const displayServices = showAll ? services : services.slice(0, limit)

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-background via-muted/50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <p className="text-sm font-semibold text-primary">Complete Solutions</p>
          </div>
          <h2 className="section-header mb-4">{t("services.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("services.subtitle")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayServices.map((service) => (
            <Card
              key={service.id}
              className="card-hover group flex flex-col overflow-hidden border-0 shadow-md hover:shadow-xl transition-all"
            >
              {/* Icon Background */}
              <div className="h-24 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                <div className="text-primary group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight">{t(service.titleKey)}</CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link href={`/services/${service.slug}`}>
                  <Button variant="ghost" className="w-full text-primary hover:bg-primary/10">
                    Learn More →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 grid md:grid-cols-4 gap-8 bg-white/50 dark:bg-black/20 rounded-2xl p-8 backdrop-blur">
          <div className="text-center">
            <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="font-semibold mb-1">Global Network</p>
            <p className="text-sm text-muted-foreground">200+ destinations worldwide</p>
          </div>
          <div className="text-center">
            <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="font-semibold mb-1">Secure & Trusted</p>
            <p className="text-sm text-muted-foreground">20 years experience</p>
          </div>
          <div className="text-center">
            <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="font-semibold mb-1">24/7 Support</p>
            <p className="text-sm text-muted-foreground">Always available for you</p>
          </div>
          <div className="text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="font-semibold mb-1">Expert Team</p>
            <p className="text-sm text-muted-foreground">50+ travel professionals</p>
          </div>
        </div>
      </div>
    </section>
  )
}
