'use client'

import { useState, useEffect } from 'react'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Package {
  id: string
  title: string
  title_rw?: string
  title_fr?: string
  duration: string
  price_usd: number
  price_rwf: number
  includes_en: string
  image: string
  status: string
  featured: boolean
  category: string
  destination: string
  description: string
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filtered, setFiltered] = useState<Package[]>([])

  const categories = ["All", "Adventure", "Family", "Honeymoon", "Cultural", "Luxury"]

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('/api/packages')
        const data = await res.json()
        setPackages(data.packages || [])
        setFiltered(data.packages || [])
      } catch (error) {
        console.error('Failed to fetch packages:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  useEffect(() => {
    if (selectedCategory === "All") {
      setFiltered(packages)
    } else {
      setFiltered(packages.filter(pkg => pkg.category === selectedCategory))
    }
  }, [selectedCategory, packages])

  const formatPrice = (usd: number, rwf: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(usd)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading packages...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen">
        {/* Hero Section with Background */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&h=600&fit=crop"
                alt="Travel packages hero"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Travel Packages</h1>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto">
              Discover our curated collection of extraordinary travel experiences
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  className={selectedCategory === cat ? "btn-primary" : ""}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="relative py-20 md:py-28 bg-gradient-to-b from-background via-muted/10 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No packages found in this category.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map((pkg) => (
                  <Card key={pkg.id} className="overflow-hidden card-hover flex flex-col shadow-lg hover:shadow-2xl transition-shadow group">
                    <div className="w-full h-40 bg-muted relative overflow-hidden">
                      <Image
                        src={pkg.image || "/placeholder.svg"}
                        alt={pkg.title}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <Badge variant="secondary" className="absolute top-3 right-3">{pkg.category}</Badge>
                    </div>
                    <CardHeader>
                      <div>
                        <CardTitle className="text-lg">{pkg.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.5a1 1 0 10-2 0V13h-3.5z" />
                          </svg>
                          {pkg.destination}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between pt-4">
                      <div className="space-y-3">
                        <p className="text-muted-foreground text-sm">{pkg.description}</p>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.5a1 1 0 10-2 0V13h-3.5z" />
                          </svg>
                          <span className="text-sm text-muted-foreground">{pkg.duration}</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t space-y-3">
                        <p className="text-2xl font-bold text-secondary">{formatPrice(pkg.price_usd, pkg.price_rwf)}</p>
                        <Button className="w-full btn-primary">Book Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
