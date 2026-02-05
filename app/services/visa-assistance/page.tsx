import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileCheck, Clock, Shield, Users, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata = {
      title: "Visa Assistance - We-Of-You Travel & Experiences",
      description: "Expert visa application assistance for all destinations. Get your visa approved with our professional guidance and document preparation services.",
}

export default function VisaAssistancePage() {
      const visaTypes = [
            {
                  name: "Schengen Visa",
                  countries: "France, Germany, Italy, Spain, Netherlands",
                  processing: "5-15 days",
                  validity: "90 days",
                  price: "From $85"
            },
            {
                  name: "UK Visa",
                  countries: "United Kingdom",
                  processing: "3-8 weeks",
                  validity: "Up to 5 years",
                  price: "From $120"
            },
            {
                  name: "US Visa",
                  countries: "United States",
                  processing: "2-4 weeks",
                  validity: "Up to 10 years",
                  price: "From $160"
            },
            {
                  name: "East African Tourist",
                  countries: "Kenya, Tanzania, Uganda",
                  processing: "1-3 days",
                  validity: "90 days",
                  price: "From $50"
            }
      ]

      const process = [
            {
                  step: "01",
                  title: "Consultation",
                  description: "We assess your travel plans and determine the appropriate visa type for your needs."
            },
            {
                  step: "02",
                  title: "Document Preparation",
                  description: "Our experts help you gather and prepare all required documents according to embassy requirements."
            },
            {
                  step: "03",
                  title: "Application Submission",
                  description: "We submit your application to the appropriate embassy or consulate on your behalf."
            },
            {
                  step: "04",
                  title: "Follow-up & Collection",
                  description: "We monitor your application status and collect your passport with visa once approved."
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
                                                <FileCheck className="w-4 h-4 mr-2" />
                                                Visa Assistance Service
                                          </Badge>
                                          <h1 className="section-header mb-6">Visa Application Support</h1>
                                          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                                Expert guidance through the entire visa application process. From document preparation to embassy submission, we ensure your visa is approved efficiently.
                                          </p>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                          <Card className="text-center">
                                                <CardContent className="pt-6">
                                                      <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                                                      <h3 className="font-semibold mb-2">99% Success Rate</h3>
                                                      <p className="text-sm text-muted-foreground">Proven track record of visa approvals</p>
                                                </CardContent>
                                          </Card>
                                          <Card className="text-center">
                                                <CardContent className="pt-6">
                                                      <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                                                      <h3 className="font-semibold mb-2">Fast Processing</h3>
                                                      <p className="text-sm text-muted-foreground">Expedited application processing</p>
                                                </CardContent>
                                          </Card>
                                          <Card className="text-center">
                                                <CardContent className="pt-6">
                                                      <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                                                      <h3 className="font-semibold mb-2">Expert Support</h3>
                                                      <p className="text-sm text-muted-foreground">Dedicated visa consultants</p>
                                                </CardContent>
                                          </Card>
                                    </div>
                              </div>
                        </section>

                        {/* Visa Types */}
                        <section className="py-20 md:py-28">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                          <h2 className="section-header mb-6">Visa Types We Support</h2>
                                          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                Comprehensive visa assistance for all major destinations worldwide
                                          </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                          {visaTypes.map((visa, idx) => (
                                                <Card key={idx} className="card-hover">
                                                      <CardHeader>
                                                            <CardTitle className="text-lg">{visa.name}</CardTitle>
                                                            <p className="text-sm text-muted-foreground">{visa.countries}</p>
                                                      </CardHeader>
                                                      <CardContent>
                                                            <div className="space-y-2 text-sm">
                                                                  <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Processing:</span>
                                                                        <span className="font-medium">{visa.processing}</span>
                                                                  </div>
                                                                  <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Validity:</span>
                                                                        <span className="font-medium">{visa.validity}</span>
                                                                  </div>
                                                                  <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Price:</span>
                                                                        <span className="font-medium text-primary">{visa.price}</span>
                                                                  </div>
                                                            </div>
                                                      </CardContent>
                                                </Card>
                                          ))}
                                    </div>
                              </div>
                        </section>

                        {/* Process */}
                        <section className="py-20 md:py-28 bg-muted/30">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                          <h2 className="section-header mb-6">Our Visa Process</h2>
                                          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                Step-by-step guidance through your visa application journey
                                          </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                          {process.map((step, idx) => (
                                                <div key={idx} className="text-center">
                                                      <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                                            {step.step}
                                                      </div>
                                                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                                      <p className="text-muted-foreground">{step.description}</p>
                                                      {idx < process.length - 1 && (
                                                            <ArrowRight className="w-6 h-6 text-primary mx-auto mt-4 hidden lg:block" />
                                                      )}
                                                </div>
                                          ))}
                                    </div>
                              </div>
                        </section>

                        {/* Required Documents */}
                        <section className="py-20 md:py-28">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="grid lg:grid-cols-2 gap-12">
                                          <div>
                                                <h2 className="subsection-header mb-6">Required Documents</h2>
                                                <div className="space-y-4">
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">Valid Passport</h4>
                                                                  <p className="text-sm text-muted-foreground">With at least 6 months validity beyond travel dates</p>
                                                            </div>
                                                      </div>
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">Application Form</h4>
                                                                  <p className="text-sm text-muted-foreground">Completed and signed visa application form</p>
                                                            </div>
                                                      </div>
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">Photos</h4>
                                                                  <p className="text-sm text-muted-foreground">Recent passport-sized photographs</p>
                                                            </div>
                                                      </div>
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">Financial Proof</h4>
                                                                  <p className="text-sm text-muted-foreground">Bank statements, employment letters, or sponsorship</p>
                                                            </div>
                                                      </div>
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">Travel Itinerary</h4>
                                                                  <p className="text-sm text-muted-foreground">Flight bookings, hotel reservations, or invitation letters</p>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>

                                          <div>
                                                <h2 className="subsection-header mb-6">Why Choose Our Service?</h2>
                                                <div className="space-y-6">
                                                      <div className="bg-primary/5 p-6 rounded-lg">
                                                            <h4 className="font-semibold mb-2">Expert Guidance</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                  Our visa experts stay updated with the latest embassy requirements and procedures.
                                                            </p>
                                                      </div>
                                                      <div className="bg-primary/5 p-6 rounded-lg">
                                                            <h4 className="font-semibold mb-2">Error Prevention</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                  We review all documents multiple times to prevent costly mistakes and delays.
                                                            </p>
                                                      </div>
                                                      <div className="bg-primary/5 p-6 rounded-lg">
                                                            <h4 className="font-semibold mb-2">Priority Processing</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                  Fast-track your application with our embassy relationships and priority handling.
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
                                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Visa Application?</h2>
                                    <p className="text-xl mb-8 opacity-90">
                                          Get expert assistance and increase your chances of visa approval
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                          <Link href="/request-service">
                                                <Button size="lg" variant="secondary" className="min-w-[200px]">
                                                      Start Application
                                                </Button>
                                          </Link>
                                          <Link href="/contact">
                                                <Button size="lg" variant="outline" className="min-w-[200px] border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                                      Contact Us
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