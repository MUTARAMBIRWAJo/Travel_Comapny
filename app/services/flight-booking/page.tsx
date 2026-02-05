import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plane, Clock, DollarSign, Shield, CheckCircle, ArrowRight, MapPin } from "lucide-react"
import Link from "next/link"

export const metadata = {
      title: "Flight Booking - We-Of-You Travel & Experiences",
      description: "Book flights worldwide with the best rates and flexible options. Expert flight booking services from Kigali to destinations across the globe.",
}

export default function FlightBookingPage() {
      const airlines = [
            { name: "RwandAir", routes: "Africa, Europe, Middle East", features: "Direct flights from Kigali" },
            { name: "Ethiopian Airlines", routes: "Africa, Europe, Asia", features: "Star Alliance member" },
            { name: "Kenya Airways", routes: "Africa, Europe, Asia", features: "Premium economy options" },
            { name: "Turkish Airlines", routes: "Europe, Asia, Americas", features: "Excellent connections" },
            { name: "Emirates", routes: "Middle East, Asia, Americas", features: "Luxury experience" },
            { name: "Qatar Airways", routes: "Middle East, Asia, Europe", features: "5-star airline" }
      ]

      const bookingProcess = [
            {
                  step: "01",
                  title: "Search & Compare",
                  description: "We search multiple airlines and compare prices to find the best deals for your route and dates."
            },
            {
                  step: "02",
                  title: "Select & Customize",
                  description: "Choose your preferred flight with our expert recommendations based on your needs and budget."
            },
            {
                  step: "03",
                  title: "Book & Confirm",
                  description: "Secure your booking with instant confirmation and e-ticket delivery."
            },
            {
                  step: "04",
                  title: "Support & Changes",
                  description: "24/7 support for any changes, cancellations, or travel modifications needed."
            }
      ]

      const popularRoutes = [
            { from: "Kigali (KGL)", to: "Nairobi (NBO)", duration: "1h 30m", airlines: "RwandAir, Kenya Airways" },
            { from: "Kigali (KGL)", to: "Addis Ababa (ADD)", duration: "2h 15m", airlines: "Ethiopian Airlines" },
            { from: "Kigali (KGL)", to: "Dubai (DXB)", duration: "7h 30m", airlines: "Emirates, RwandAir" },
            { from: "Kigali (KGL)", to: "Istanbul (IST)", duration: "8h 45m", airlines: "Turkish Airlines" },
            { from: "Kigali (KGL)", to: "Paris (CDG)", duration: "9h 15m", airlines: "RwandAir, Air France" },
            { from: "Kigali (KGL)", to: "London (LHR)", duration: "10h 30m", airlines: "RwandAir, British Airways" }
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
                                                <Plane className="w-4 h-4 mr-2" />
                                                Flight Booking Service
                                          </Badge>
                                          <h1 className="section-header mb-6">Expert Flight Booking</h1>
                                          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                                Find the best flight deals from Kigali to destinations worldwide. Professional booking service with 24/7 support and flexible options.
                                          </p>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                          <Card className="text-center">
                                                <CardContent className="pt-6">
                                                      <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                                                      <h3 className="font-semibold mb-2">Best Rates</h3>
                                                      <p className="text-sm text-muted-foreground">Guaranteed lowest prices with no hidden fees</p>
                                                </CardContent>
                                          </Card>
                                          <Card className="text-center">
                                                <CardContent className="pt-6">
                                                      <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                                                      <h3 className="font-semibold mb-2">Instant Booking</h3>
                                                      <p className="text-sm text-muted-foreground">Real-time availability and instant confirmation</p>
                                                </CardContent>
                                          </Card>
                                          <Card className="text-center">
                                                <CardContent className="pt-6">
                                                      <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                                                      <h3 className="font-semibold mb-2">Secure Payment</h3>
                                                      <p className="text-sm text-muted-foreground">Protected transactions and flexible payment options</p>
                                                </CardContent>
                                          </Card>
                                    </div>
                              </div>
                        </section>

                        {/* Popular Routes */}
                        <section className="py-20 md:py-28">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                          <h2 className="section-header mb-6">Popular Routes from Kigali</h2>
                                          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                Direct and connecting flights to major destinations worldwide
                                          </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                          {popularRoutes.map((route, idx) => (
                                                <Card key={idx} className="card-hover">
                                                      <CardHeader>
                                                            <div className="flex items-center justify-between">
                                                                  <div className="flex items-center gap-2">
                                                                        <MapPin className="w-4 h-4 text-primary" />
                                                                        <span className="text-sm font-medium">{route.from}</span>
                                                                  </div>
                                                                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                                                  <span className="text-sm font-medium">{route.to}</span>
                                                            </div>
                                                      </CardHeader>
                                                      <CardContent>
                                                            <div className="space-y-2">
                                                                  <div className="flex justify-between text-sm">
                                                                        <span className="text-muted-foreground">Duration:</span>
                                                                        <span className="font-medium">{route.duration}</span>
                                                                  </div>
                                                                  <div className="text-sm">
                                                                        <span className="text-muted-foreground">Airlines: </span>
                                                                        <span className="font-medium">{route.airlines}</span>
                                                                  </div>
                                                            </div>
                                                      </CardContent>
                                                </Card>
                                          ))}
                                    </div>
                              </div>
                        </section>

                        {/* Airlines */}
                        <section className="py-20 md:py-28 bg-muted/30">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                          <h2 className="section-header mb-6">Partner Airlines</h2>
                                          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                Access to all major airlines through our partnerships and consolidator agreements
                                          </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                          {airlines.map((airline, idx) => (
                                                <Card key={idx}>
                                                      <CardHeader>
                                                            <CardTitle className="text-lg">{airline.name}</CardTitle>
                                                      </CardHeader>
                                                      <CardContent>
                                                            <div className="space-y-2">
                                                                  <div className="text-sm">
                                                                        <span className="text-muted-foreground">Routes: </span>
                                                                        <span className="font-medium">{airline.routes}</span>
                                                                  </div>
                                                                  <div className="text-sm">
                                                                        <span className="text-muted-foreground">Features: </span>
                                                                        <span className="font-medium">{airline.features}</span>
                                                                  </div>
                                                            </div>
                                                      </CardContent>
                                                </Card>
                                          ))}
                                    </div>
                              </div>
                        </section>

                        {/* Booking Process */}
                        <section className="py-20 md:py-28">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                          <h2 className="section-header mb-6">Our Booking Process</h2>
                                          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                Simple, transparent process from search to confirmation
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
                        <section className="py-20 md:py-28 bg-muted/30">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="grid lg:grid-cols-2 gap-12">
                                          <div>
                                                <h2 className="subsection-header mb-6">What&apos;s Included</h2>
                                                <div className="space-y-4">
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">Best Price Guarantee</h4>
                                                                  <p className="text-sm text-muted-foreground">We match or beat any competitor&apos;s price</p>
                                                            </div>
                                                      </div>
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">Flexible Booking</h4>
                                                                  <p className="text-sm text-muted-foreground">Easy changes and cancellations with minimal fees</p>
                                                            </div>
                                                      </div>
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">24/7 Support</h4>
                                                                  <p className="text-sm text-muted-foreground">Round-the-clock assistance for all your travel needs</p>
                                                            </div>
                                                      </div>
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">Travel Insurance</h4>
                                                                  <p className="text-sm text-muted-foreground">Optional comprehensive travel protection</p>
                                                            </div>
                                                      </div>
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">Mobile Tickets</h4>
                                                                  <p className="text-sm text-muted-foreground">Digital tickets delivered instantly to your phone</p>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>

                                          <div>
                                                <h2 className="subsection-header mb-6">Additional Services</h2>
                                                <div className="space-y-6">
                                                      <div className="bg-primary/5 p-6 rounded-lg">
                                                            <h4 className="font-semibold mb-2">Airport Transfers</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                  Arranged pickup and drop-off services at airports worldwide.
                                                            </p>
                                                      </div>
                                                      <div className="bg-primary/5 p-6 rounded-lg">
                                                            <h4 className="font-semibold mb-2">Seat Selection</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                  Preferred seating arrangements and extra legroom options.
                                                            </p>
                                                      </div>
                                                      <div className="bg-primary/5 p-6 rounded-lg">
                                                            <h4 className="font-semibold mb-2">Special Assistance</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                  Support for passengers with special needs or requirements.
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
                                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Book Your Flight?</h2>
                                    <p className="text-xl mb-8 opacity-90">
                                          Get the best deals on flights worldwide with expert assistance
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                          <Link href="/request-service">
                                                <Button size="lg" variant="secondary" className="min-w-[200px]">
                                                      Search Flights
                                                </Button>
                                          </Link>
                                          <Link href="/contact">
                                                <Button size="lg" variant="outline" className="min-w-[200px] border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                                      Get Quote
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