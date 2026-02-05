import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from 'next/image'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getGlobalSettings, getServices, getPackages, getTestimonials, formatCurrency, convertCurrency } from "@/lib/supabaseClient"
import { CurrencyConverter } from "@/components/CurrencyConverter"
import { PriceDisplay } from "@/components/PriceDisplay"

export default async function Home() {
  // Fetch data from CMS with error handling
  let settings, services, packages, testimonials
  try {
    [settings, services, packages, testimonials] = await Promise.all([
      getGlobalSettings(),
      getServices(),
      getPackages(),
      getTestimonials(true), // featured only
    ])
  } catch (error) {
    console.log('[v0] Database connection failed, using fallback defaults:', error)
    // Fallback defaults
    settings = {
      brand_name: { en: "We-Of-You Travel Company" },
      tagline: { en: "Your Trusted Travel Partner from Rwanda to the World" }
    }
    services = []
    packages = []
    testimonials = []
  }

  const brandName = settings.brand_name?.en || "We-Of-You Travel Company"
  const tagline = settings.tagline?.en || "Your Trusted Travel Partner from Rwanda to the World"

  return (
    <>
      <Navbar />

      {/* Hero Section with Background Video */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          {/*
            NOTE:
            We intentionally avoid using a remote background video here.
            Some networks/DNS setups fail to resolve `videos.unsplash.com`, which causes noisy console errors
            (net::ERR_NAME_NOT_RESOLVED). A local, optimized image keeps the hero reliable.
          */}
          <Image
            src="/paris-cityscape.png"
            alt="Travel hero background"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-20 md:py-32">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance drop-shadow-lg">{tagline}</h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow-md">
            {brandName} helps Rwandan travelers, families, and organizations plan safe, affordable, and well-guided international journeys — from visa support to complete travel management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="btn-primary">
                Get Travel Assistance
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="bg-white/20 text-white hover:bg-white/30 border-white">
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section with Background Pattern */}
      {services.length > 0 && (
        <section className="relative py-20 md:py-28 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 1200 600">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="1200" height="600" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-header mb-4">Our Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Complete international travel solutions designed for Rwandan travelers and organizations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, idx) => {
                const backgroundImages = [
                  "https://images.unsplash.com/photo-1569163139394-de4798aa62b1?w=400&h=300&fit=crop",
                  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
                  "https://images.unsplash.com/photo-1552410260-7ad93519e72a?w=400&h=300&fit=crop",
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
                ]

                return (
                  <Card key={service.id} className="card-hover flex flex-col overflow-hidden group">
                    <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                      <div className="absolute inset-0">
                        <Image
                          src={backgroundImages[idx % backgroundImages.length] || "/placeholder.svg"}
                          alt={service.title_en}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                          priority={idx < 2}
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{service.title_en}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground mb-4">{service.short_description_en}</p>
                      <Link href={`/services/${service.slug}`}>
                        <Button variant="ghost" size="sm" className="text-primary">
                          Learn More →
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Packages Section with Gradient Background */}
      {packages.length > 0 && (
        <section className="relative py-20 md:py-28 bg-gradient-to-b from-muted/30 via-background to-muted/20">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
              <defs>
                <linearGradient id="wavegradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="currentColor" />
                  <stop offset="100%" stopColor="currentColor" />
                </linearGradient>
              </defs>
              <path d="M0,300 Q300,150 600,300 T1200,300 L1200,600 L0,600 Z" fill="url(#wavegradient)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-header mb-4">Featured Packages</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our carefully planned travel packages for individuals and groups
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {packages.slice(0, 3).map((pkg, idx) => {
                const packageImages = [
                  "https://images.unsplash.com/photo-1512453475868-a34c61444ccd?w=500&h=300&fit=crop",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop",
                  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop",
                ]

                return (
                  <Card key={pkg.id} className="overflow-hidden card-hover flex flex-col shadow-lg hover:shadow-2xl transition-shadow group">
                    <div className="w-full h-48 bg-muted relative overflow-hidden">
                      <Image
                        src={pkg.image_url || packageImages[idx % packageImages.length]}
                        alt={pkg.title_en}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        priority={idx === 0}
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{pkg.title_en}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.5a1 1 0 10-2 0V13h-3.5z" />
                        </svg>
                        {pkg.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-6 flex flex-col justify-between">
                      <p className="text-sm text-muted-foreground mb-4">{pkg.includes_en}</p>
                      <div>
                        <PriceDisplay
                          priceUSD={pkg.price_usd}
                          priceRWF={pkg.price_rwf}
                          className="mb-4"
                        />
                        <Button className="w-full btn-primary">Book Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="text-center mt-12">
              <Link href="/packages">
                <Button size="lg" variant="outline" className="group bg-transparent">
                  View All Packages
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-header mb-4">Client Testimonials</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hear from travelers and organizations who trusted us with their journeys
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="card-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{testimonial.customer_name}</CardTitle>
                        {testimonial.customer_title && (
                          <CardDescription>{testimonial.customer_title}</CardDescription>
                        )}
                        {testimonial.customer_location && (
                          <CardDescription className="text-xs">{testimonial.customer_location}</CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="italic text-muted-foreground">&quot;{testimonial.message_en}&quot;</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust & Pride Section */}
      <section className="py-20 md:py-28 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">Rwanda-Based</h3>
              <p className="text-muted-foreground">Proudly serving travelers from Kigali and across Rwanda</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">Professional Service</h3>
              <p className="text-muted-foreground">Expert guidance you can trust for every journey</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">Global Reach</h3>
              <p className="text-muted-foreground">Connections to destinations worldwide and trusted partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Currency Converter Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-header mb-4">Plan Your Budget</h2>
            <p className="text-muted-foreground">
              Use our currency converter to see prices in your local currency
            </p>
          </div>
          <CurrencyConverter />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Let {brandName} help you plan a safe, affordable, and memorable international travel experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                Get in Touch
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
