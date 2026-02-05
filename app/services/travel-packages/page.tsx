import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, DollarSign, Users, CheckCircle, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

export const metadata = {
      title: "Travel Packages - We-Of-You Travel & Experiences",
      description: "Curated travel packages for every budget and interest. Customizable itineraries for individuals, families, and groups with expert local knowledge.",
}

export default function TravelPackagesPage() {
      const packages = [
            {
                  name: "Rwanda Adventure",
                  destination: "Rwanda",
                  duration: "5 Days / 4 Nights",
                  price: "From $1,200",
                  rating: 4.8,
                  highlights: ["Volcanoes National Park", "Gorilla Trekking", "Kigali City Tour"],
                  includes: ["Flights", "Accommodation", "Guided Tours", "Meals"]
            },
            {
                  name: "Kenya Safari",
                  destination: "Kenya",
                  duration: "7 Days / 6 Nights",
                  price: "From $2,500",
                  rating: 4.9,
                  highlights: ["Masai Mara", "Amboseli National Park", "Maasai Cultural Visit"],
                  includes: ["Flights", "Safari Lodge", "Game Drives", "All Meals"]
            },
            {
                  name: "Tanzania Northern Circuit",
                  destination: "Tanzania",
                  duration: "8 Days / 7 Nights",
                  price: "From $3,200",
                  rating: 4.7,
                  highlights: ["Serengeti", "Ngorongoro Crater", "Tarangire National Park"],
                  includes: ["Flights", "Luxury Camping", "Professional Guide", "All Meals"]
            },
            {
                  name: "Uganda Wildlife Tour",
                  destination: "Uganda",
                  duration: "6 Days / 5 Nights",
                  price: "From $1,800",
                  rating: 4.6,
                  highlights: ["Bwindi Forest", "Gorilla Tracking", "Queen Elizabeth Park"],
                  includes: ["Flights", "Lodges", "Guided Tours", "Meals"]
            }
      ]

      const customization = [
            {
                  title: "Personalized Itineraries",
                  description: "Tailored travel plans based on your interests, budget, and schedule preferences."
            },
            {
                  title: "Flexible Durations",
                  description: "Choose from short weekend getaways to extended multi-week adventures."
            },
            {
                  title: "Group Sizes",
                  description: "Perfect for solo travelers, couples, families, or large organized groups."
            },
            {
                  title: "Budget Options",
                  description: "From budget-friendly adventures to luxury experiences for every traveler."
            }
      ]

      const whyChooseUs = [
            {
                  icon: MapPin,
                  title: "Local Expertise",
                  description: "Deep knowledge of destinations with insider access and authentic experiences."
            },
            {
                  icon: Users,
                  title: "Small Groups",
                  description: "Intimate group sizes ensuring personalized attention and meaningful connections."
            },
            {
                  icon: DollarSign,
                  title: "Best Value",
                  description: "Competitive pricing with no hidden fees and maximum value for your investment."
            },
            {
                  icon: Star,
                  title: "Premium Service",
                  description: "Dedicated trip coordinators and 24/7 support throughout your journey."
            }
      ]

      const bookingProcess = [
            {
                  step: "01",
                  title: "Choose Package",
                  description: "Select from our curated packages or request a custom itinerary."
            },
            {
                  step: "02",
                  title: "Customize & Quote",
                  description: "Work with our experts to personalize your trip and get a detailed quote."
            },
            {
                  step: "03",
                  title: "Book & Pay",
                  description: "Secure your booking with flexible payment options and instant confirmation."
            },
            {
                  step: "04",
                  title: "Travel & Enjoy",
                  description: "Embark on your journey with our comprehensive pre-departure support."
            }
      ]

      return (
            <>
                  <Navbar />

                  <div className="min-h-screen">
                        {/* Hero Section */}
                        <section className="bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-12">
                                          <Badge variant="secondary" className="mb-4">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                Travel Packages
                                          </Badge>
                                          <h1 className="section-header mb-6">Curated Travel Experiences</h1>
                                          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                                Discover East Africa through expertly crafted travel packages. From wildlife safaris to cultural experiences, we create unforgettable journeys.
                                          </p>
                                    </div>

                                    <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                                          <Card className="text-center">
                                                <CardContent className="pt-6">
                                                      <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                                                      <h3 className="font-semibold mb-2">Expert Guides</h3>
                                                      <p className="text-sm text-muted-foreground">Local knowledge and authentic experiences</p>
                                                </CardContent>
                                          </Card>
                                          <Card className="text-center">
                                                <CardContent className="pt-6">
                                                      <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                                                      <h3 className="font-semibold mb-2">Small Groups</h3>
                                                      <p className="text-sm text-muted-foreground">Intimate travel with personalized attention</p>
                                                </CardContent>
                                          </Card>
                                          <Card className="text-center">
                                                <CardContent className="pt-6">
                                                      <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                                                      <h3 className="font-semibold mb-2">Best Value</h3>
                                                      <p className="text-sm text-muted-foreground">Competitive pricing with no hidden costs</p>
                                                </CardContent>
                                          </Card>
                                          <Card className="text-center">
                                                <CardContent className="pt-6">
                                                      <Star className="w-12 h-12 text-primary mx-auto mb-4" />
                                                      <h3 className="font-semibold mb-2">Premium Service</h3>
                                                      <p className="text-sm text-muted-foreground">24/7 support and dedicated coordinators</p>
                                                </CardContent>
                                          </Card>
                                    </div>
                              </div>
                        </section>

                        {/* Popular Packages */}
                        <section className="py-20 md:py-28">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                          <h2 className="section-header mb-6">Popular Travel Packages</h2>
                                          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                Handpicked itineraries offering the best of East African wildlife, culture, and adventure
                                          </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                          {packages.map((pkg, idx) => (
                                                <Card key={idx} className="card-hover">
                                                      <CardHeader>
                                                            <div className="flex items-start justify-between">
                                                                  <div>
                                                                        <CardTitle className="text-xl mb-2">{pkg.name}</CardTitle>
                                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                                              <MapPin className="w-4 h-4" />
                                                                              <span>{pkg.destination}</span>
                                                                        </div>
                                                                  </div>
                                                                  <div className="text-right">
                                                                        <div className="flex items-center gap-1 mb-1">
                                                                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                                              <span className="text-sm font-medium">{pkg.rating}</span>
                                                                        </div>
                                                                        <div className="text-lg font-bold text-primary">{pkg.price}</div>
                                                                  </div>
                                                            </div>
                                                      </CardHeader>
                                                      <CardContent>
                                                            <div className="space-y-4">
                                                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                        <Calendar className="w-4 h-4" />
                                                                        <span>{pkg.duration}</span>
                                                                  </div>

                                                                  <div>
                                                                        <h4 className="font-medium mb-2">Highlights:</h4>
                                                                        <ul className="text-sm text-muted-foreground space-y-1">
                                                                              {pkg.highlights.map((highlight, i) => (
                                                                                    <li key={i} className="flex items-center gap-2">
                                                                                          <span className="text-primary">•</span>
                                                                                          {highlight}
                                                                                    </li>
                                                                              ))}
                                                                        </ul>
                                                                  </div>

                                                                  <div>
                                                                        <h4 className="font-medium mb-2">Includes:</h4>
                                                                        <div className="flex flex-wrap gap-2">
                                                                              {pkg.includes.map((item, i) => (
                                                                                    <Badge key={i} variant="secondary" className="text-xs">
                                                                                          {item}
                                                                                    </Badge>
                                                                              ))}
                                                                        </div>
                                                                  </div>

                                                                  <Button className="w-full mt-4">
                                                                        View Details
                                                                  </Button>
                                                            </div>
                                                      </CardContent>
                                                </Card>
                                          ))}
                                    </div>
                              </div>
                        </section>

                        {/* Customization */}
                        <section className="py-20 md:py-28 bg-muted/30">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                          <h2 className="section-header mb-6">Fully Customizable</h2>
                                          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                Every aspect of your journey can be tailored to your preferences and requirements
                                          </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                          {customization.map((item, idx) => (
                                                <Card key={idx}>
                                                      <CardHeader>
                                                            <CardTitle className="text-lg">{item.title}</CardTitle>
                                                      </CardHeader>
                                                      <CardContent>
                                                            <p className="text-muted-foreground">{item.description}</p>
                                                      </CardContent>
                                                </Card>
                                          ))}
                                    </div>
                              </div>
                        </section>

                        {/* Why Choose Us */}
                        <section className="py-20 md:py-28">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                          <h2 className="section-header mb-6">Why Choose Our Packages</h2>
                                          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                Experience the difference with our expert-led, locally-focused travel experiences
                                          </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                          {whyChooseUs.map((reason, idx) => {
                                                const Icon = reason.icon
                                                return (
                                                      <Card key={idx} className="text-center">
                                                            <CardContent className="pt-6">
                                                                  <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                                                                  <h3 className="font-semibold mb-2">{reason.title}</h3>
                                                                  <p className="text-sm text-muted-foreground">{reason.description}</p>
                                                            </CardContent>
                                                      </Card>
                                                )
                                          })}
                                    </div>
                              </div>
                        </section>

                        {/* Booking Process */}
                        <section className="py-20 md:py-28 bg-muted/30">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                          <h2 className="section-header mb-6">Simple Booking Process</h2>
                                          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                From selection to departure, we make planning your trip effortless
                                          </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                          {bookingProcess.map((step, idx) => (
                                                <div key={idx} className="text-center">
                                                      <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                                            {step.step}
                                                      </div>
                                                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                                      <p className="text-muted-foreground">{step.description}</p>
                                                      {idx < bookingProcess.length - 1 && (
                                                            <ArrowRight className="w-6 h-6 text-primary mx-auto mt-4 hidden lg:block" />
                                                      )}
                                                </div>
                                          ))}
                                    </div>
                              </div>
                        </section>

                        {/* Services Included */}
                        <section className="py-20 md:py-28">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="grid lg:grid-cols-2 gap-12">
                                          <div>
                                                <h2 className="subsection-header mb-6">What&apos;s Included</h2>
                                                <div className="space-y-4">
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">Expert Local Guides</h4>
                                                                  <p className="text-sm text-muted-foreground">Professional guides with deep destination knowledge</p>
                                                            </div>
                                                      </div>
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">Premium Accommodations</h4>
                                                                  <p className="text-sm text-muted-foreground">Carefully selected hotels and lodges for comfort</p>
                                                            </div>
                                                      </div>
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">All Meals Included</h4>
                                                                  <p className="text-sm text-muted-foreground">Local and international cuisine experiences</p>
                                                            </div>
                                                      </div>
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">Transportation</h4>
                                                                  <p className="text-sm text-muted-foreground">Private vehicles and domestic flights included</p>
                                                            </div>
                                                      </div>
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">Park Fees & Permits</h4>
                                                                  <p className="text-sm text-muted-foreground">All national park and conservation fees covered</p>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>

                                          <div>
                                                <h2 className="subsection-header mb-6">Additional Services</h2>
                                                <div className="space-y-6">
                                                      <div className="bg-primary/5 p-6 rounded-lg">
                                                            <h4 className="font-semibold mb-2">Optional Extensions</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                  Add extra nights, side trips, or special experiences to your itinerary.
                                                            </p>
                                                      </div>
                                                      <div className="bg-primary/5 p-6 rounded-lg">
                                                            <h4 className="font-semibold mb-2">Photography Services</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                  Professional photography packages to capture your memories.
                                                            </p>
                                                      </div>
                                                      <div className="bg-primary/5 p-6 rounded-lg">
                                                            <h4 className="font-semibold mb-2">Travel Insurance</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                  Comprehensive coverage for peace of mind during your travels.
                                                            </p>
                                                      </div>
                                                      <div className="bg-primary/5 p-6 rounded-lg">
                                                            <h4 className="font-semibold mb-2">Special Interests</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                  Birdwatching, photography, or cultural immersion focused trips.
                                                            </p>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </section>

                        {/* CTA Section */}
                        <section className="py-20 md:py-28 bg-primary text-primary-foreground">
                              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Adventure?</h2>
                                    <p className="text-xl mb-8 opacity-90">
                                          Discover East Africa with our expertly crafted travel packages
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                          <Link href="/request-service">
                                                <Button size="lg" variant="secondary" className="min-w-[200px]">
                                                      Browse Packages
                                                </Button>
                                          </Link>
                                          <Link href="/contact">
                                                <Button size="lg" variant="outline" className="min-w-[200px] border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                                      Custom Quote
                                                </Button>
                                          </Link>
                                    </div>
                              </div>
                        </section>
                  </div>

                  <Footer />
            </>
      )
}