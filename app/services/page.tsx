import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, FileText, AlertTriangle, Leaf } from "lucide-react"

export const metadata = {
  title: "Services - We-Of-You Travel & Experiences",
  description: "Explore our comprehensive travel management services for corporate and individual travelers",
}

export default function ServicesPage() {
  const services = [
    {
      icon: Briefcase,
      title: "Corporate Travel Management",
      description: "Travel policy management, approval workflows, cost optimization, and duty-of-care monitoring",
    },
    {
      icon: Users,
      title: "Leisure & Group Travel",
      description: "Curated holiday packages, group bookings, family experiences, and adventure tours",
    },
    {
      icon: FileText,
      title: "Visa & Documentation Support",
      description: "Complete visa application assistance, document verification, and travel insurance",
    },
    {
      icon: AlertTriangle,
      title: "Travel Risk & Assistance",
      description: "Emergency support, travel risk management, and 24/7 traveler assistance",
    },
    {
      icon: Leaf,
      title: "Sustainable Travel Advisory",
      description: "Carbon footprint tracking, ESG reporting, and eco-friendly travel recommendations",
    },
  ]

  return (
    <>
      <Navbar />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="section-header mb-6">Our Services</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive travel solutions tailored to your needs
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, idx) => {
                const Icon = service.icon
                return (
                  <Card key={idx} className="card-hover">
                    <CardHeader>
                      <Icon className="w-10 h-10 text-secondary mb-3" />
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{service.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Corporate Section */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-header text-center mb-12">Corporate Travel Solutions</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="subsection-header mb-4">Enterprise Features</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>✓ Centralized travel policy management</li>
                  <li>✓ Multi-level approval workflows</li>
                  <li>✓ Real-time cost optimization</li>
                  <li>✓ Traveler duty-of-care monitoring</li>
                  <li>✓ ESG and carbon footprint tracking</li>
                  <li>✓ Advanced analytics and reporting</li>
                </ul>
              </div>
              <div>
                <h3 className="subsection-header mb-4">Who We Serve</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>✓ Multinational Corporations</li>
                  <li>✓ NGOs and Non-Profits</li>
                  <li>✓ Government Institutions</li>
                  <li>✓ Financial Services</li>
                  <li>✓ Technology Companies</li>
                  <li>✓ Professional Services</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
