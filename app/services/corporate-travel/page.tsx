import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, Shield, TrendingUp, CheckCircle, ArrowRight, Building } from "lucide-react"
import Link from "next/link"

export const metadata = {
      title: "Corporate Travel Management - We-Of-You Travel & Experiences",
      description: "Professional corporate travel management services. Streamline business travel with policy compliance, cost optimization, and comprehensive support.",
}

export default function CorporateTravelPage() {
      const corporateFeatures = [
            {
                  icon: Shield,
                  title: "Policy Compliance",
                  description: "Ensure all travel adheres to your company's travel policy and budget guidelines."
            },
            {
                  icon: TrendingUp,
                  title: "Cost Optimization",
                  description: "Reduce travel expenses through negotiated rates and smart booking strategies."
            },
            {
                  icon: Users,
                  title: "Group Management",
                  description: "Handle complex group travel arrangements for meetings, conferences, and events."
            },
            {
                  icon: Building,
                  title: "Enterprise Integration",
                  description: "Seamless integration with your existing HR, ERP, and expense management systems."
            }
      ]

      const industries = [
            "Technology & IT",
            "Financial Services",
            "Manufacturing",
            "Healthcare",
            "Consulting",
            "NGOs & Government",
            "Education",
            "Retail & Hospitality"
      ]

      const process = [
            {
                  step: "01",
                  title: "Policy Setup",
                  description: "We work with you to establish or optimize your corporate travel policy."
            },
            {
                  step: "02",
                  title: "System Integration",
                  description: "Connect our platform with your existing HR and expense management systems."
            },
            {
                  step: "03",
                  title: "Employee Training",
                  description: "Train your staff on the booking platform and travel procedures."
            },
            {
                  step: "04",
                  title: "Ongoing Support",
                  description: "Provide 24/7 support and regular reporting on travel spend and compliance."
            }
      ]

      const benefits = [
            {
                  title: "Cost Savings",
                  value: "Up to 30%",
                  description: "Average savings on travel expenses through negotiated rates and optimization"
            },
            {
                  title: "Time Efficiency",
                  value: "5x Faster",
                  description: "Booking process compared to traditional travel agencies"
            },
            {
                  title: "Compliance Rate",
                  value: "99%",
                  description: "Policy compliance with automated approval workflows"
            },
            {
                  title: "Traveler Satisfaction",
                  value: "95%",
                  description: "Employee satisfaction with travel experience and support"
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
                                                <Briefcase className="w-4 h-4 mr-2" />
                                                Corporate Travel Solutions
                                          </Badge>
                                          <h1 className="section-header mb-6">Corporate Travel Management</h1>
                                          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                                Streamline your business travel with comprehensive corporate solutions. From policy management to expense tracking, we handle everything.
                                          </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                                          {benefits.map((benefit, idx) => (
                                                <Card key={idx} className="text-center">
                                                      <CardContent className="pt-6">
                                                            <div className="text-3xl font-bold text-primary mb-2">{benefit.value}</div>
                                                            <h3 className="font-semibold mb-2">{benefit.title}</h3>
                                                            <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                                      </CardContent>
                                                </Card>
                                          ))}
                                    </div>
                              </div>
                        </section>

                        {/* Features */}
                        <section className="py-20 md:py-28">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                          <h2 className="section-header mb-6">Comprehensive Corporate Features</h2>
                                          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                Everything you need to manage business travel efficiently and compliantly
                                          </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                          {corporateFeatures.map((feature, idx) => {
                                                const Icon = feature.icon
                                                return (
                                                      <Card key={idx} className="card-hover">
                                                            <CardHeader>
                                                                  <Icon className="w-12 h-12 text-primary mb-4" />
                                                                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                                                            </CardHeader>
                                                            <CardContent>
                                                                  <p className="text-muted-foreground">{feature.description}</p>
                                                            </CardContent>
                                                      </Card>
                                                )
                                          })}
                                    </div>
                              </div>
                        </section>

                        {/* Industries */}
                        <section className="py-20 md:py-28 bg-muted/30">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                          <h2 className="section-header mb-6">Industries We Serve</h2>
                                          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                Trusted by companies across all sectors for their business travel needs
                                          </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                          {industries.map((industry, idx) => (
                                                <Card key={idx} className="text-center">
                                                      <CardContent className="pt-6">
                                                            <Building className="w-8 h-8 text-primary mx-auto mb-3" />
                                                            <h3 className="font-medium">{industry}</h3>
                                                      </CardContent>
                                                </Card>
                                          ))}
                                    </div>
                              </div>
                        </section>

                        {/* Process */}
                        <section className="py-20 md:py-28">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                          <h2 className="section-header mb-6">Implementation Process</h2>
                                          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                                Smooth transition to managed corporate travel in four simple steps
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

                        {/* Services Included */}
                        <section className="py-20 md:py-28 bg-muted/30">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="grid lg:grid-cols-2 gap-12">
                                          <div>
                                                <h2 className="subsection-header mb-6">Core Services</h2>
                                                <div className="space-y-4">
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">Travel Policy Management</h4>
                                                                  <p className="text-sm text-muted-foreground">Custom policies tailored to your organization&apos;s needs</p>
                                                            </div>
                                                      </div>
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">Automated Approvals</h4>
                                                                  <p className="text-sm text-muted-foreground">Multi-level approval workflows for all bookings</p>
                                                            </div>
                                                      </div>
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">Expense Integration</h4>
                                                                  <p className="text-sm text-muted-foreground">Seamless connection with expense management systems</p>
                                                            </div>
                                                      </div>
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">Real-time Reporting</h4>
                                                                  <p className="text-sm text-muted-foreground">Comprehensive analytics and spend tracking</p>
                                                            </div>
                                                      </div>
                                                      <div className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                  <h4 className="font-medium">24/7 Support</h4>
                                                                  <p className="text-sm text-muted-foreground">Dedicated account management and traveler support</p>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>

                                          <div>
                                                <h2 className="subsection-header mb-6">Additional Benefits</h2>
                                                <div className="space-y-6">
                                                      <div className="bg-primary/5 p-6 rounded-lg">
                                                            <h4 className="font-semibold mb-2">Duty of Care</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                  Comprehensive traveler safety monitoring and emergency support worldwide.
                                                            </p>
                                                      </div>
                                                      <div className="bg-primary/5 p-6 rounded-lg">
                                                            <h4 className="font-semibold mb-2">Sustainability Tracking</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                  Carbon footprint monitoring and ESG reporting for sustainable travel.
                                                            </p>
                                                      </div>
                                                      <div className="bg-primary/5 p-6 rounded-lg">
                                                            <h4 className="font-semibold mb-2">Preferred Rates</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                  Negotiated corporate rates with airlines, hotels, and car rental companies.
                                                            </p>
                                                      </div>
                                                      <div className="bg-primary/5 p-6 rounded-lg">
                                                            <h4 className="font-semibold mb-2">Mobile App</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                  Dedicated mobile app for easy booking and trip management on the go.
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
                                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Optimize Your Corporate Travel?</h2>
                                    <p className="text-xl mb-8 opacity-90">
                                          Join hundreds of companies saving time and money on business travel
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                          <Link href="/request-service">
                                                <Button size="lg" variant="secondary" className="min-w-[200px]">
                                                      Get Started
                                                </Button>
                                          </Link>
                                          <Link href="/contact">
                                                <Button size="lg" variant="outline" className="min-w-[200px] border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                                      Schedule Demo
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