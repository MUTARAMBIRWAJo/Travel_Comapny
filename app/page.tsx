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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, idx) => (
                <Card key={service.id} className="card-hover flex flex-col overflow-hidden group">
                  {/* Image at top of card */}
                  <div className="relative h-48 overflow-hidden">
                    {service.image_url ? (
                      <Image
                        src={service.image_url}
                        alt={service.title_en || service.title || 'Service'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-3xl">✈️</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg">{service.title_en}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground text-sm mb-4">{service.short_description_en}</p>
                    <Link href={`/services/${service.slug}`}>
                      <Button variant="ghost" size="sm" className="text-primary">
                        Learn More →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Packages Section */}
      {packages.length > 0 && (
        <section className="py-20 md:py-28 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-header mb-4">Featured Travel Packages</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Curated travel experiences for unforgettable journeys
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.slice(0, 3).map((pkg, idx) => (
                <Card key={pkg.id} className="overflow-hidden card-hover flex flex-col shadow-lg hover:shadow-2xl transition-shadow group">
                  {/* Image at top of card */}
                  <div className="relative h-64 overflow-hidden">
                    {pkg.image_url ? (
                      <Image
                        src={pkg.image_url}
                        alt={pkg.title_en || pkg.title || 'Package'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-4xl">🌍</span>
                        </div>
                      </div>
                    )}
                    {pkg.duration_days && (
                      <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        {pkg.duration_days} Days
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg">{pkg.title_en}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span className="flex items-center gap-1">📍 {pkg.destination_country || pkg.destination || 'Various Destinations'}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pb-6 flex flex-col justify-between">
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{pkg.short_description_en || pkg.description_en}</p>

                    <div className="space-y-3">
                      <PriceDisplay
                        priceUSD={Number(pkg.base_price) || 0}
                        className="justify-center"
                      />

                      <Link href="/request-service">
                        <Button className="w-full btn-primary">Book Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/packages">
                <Button size="lg" variant="outline" className="group bg-transparent">
                  View All Packages
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 md:py-28 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-header mb-4">What Our Travelers Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Real stories from travelers who experienced Rwanda and beyond with us
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="card-hover">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                        {testimonial.customer_avatar_url ? (
                          <Image
                            src={testimonial.customer_avatar_url}
                            alt={testimonial.customer_name}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                        ) : (
                          <span>{testimonial.customer_initials || '👤'}</span>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{testimonial.customer_name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{testimonial.customer_role}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic">"{testimonial.testimonial_text_en}"</p>
                    <div className="flex mt-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < (testimonial.rating || 5) ? 'text-yellow-500' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Currency Converter Section */}
      <CurrencyConverter />

      {/* Footer */}
      <Footer />
    </>
  )
}
