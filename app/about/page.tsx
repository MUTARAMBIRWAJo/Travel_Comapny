import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Lightbulb, Users, Globe } from "lucide-react"

export const metadata = {
  title: "About Us - We-Of-You Travel & Experiences",
  description:
    "Learn about We-Of-You Travel & Experiences Ltd, our mission, values, and commitment to sustainable travel",
}

export default function AboutPage() {
  const values = [
    { icon: Heart, title: "Integrity", description: "Honest and transparent business practices" },
    { icon: Lightbulb, title: "Innovation", description: "Cutting-edge travel technology and solutions" },
    { icon: Globe, title: "Sustainability", description: "Responsible travel for a better planet" },
    { icon: Users, title: "Client-First", description: "Your needs drive our decisions" },
  ]

  return (
    <>
      <Navbar />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="section-header mb-6">About We-Of-You</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transforming global travel through innovative technology and human-centered service
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="subsection-header mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  We-Of-You is a modern travel management organization delivering seamless, ethical, and data-driven
                  travel experiences for individuals, corporations, and organizations worldwide.
                </p>
                <p className="text-lg text-muted-foreground">
                  To simplify global travel through technology, expertise, and human-centered service, making every
                  journey remarkable and responsible.
                </p>
              </div>
              <div className="h-96 bg-gradient-to-br from-primary to-secondary rounded-lg opacity-10"></div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-header text-center mb-16">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, idx) => {
                const Icon = value.icon
                return (
                  <Card key={idx}>
                    <CardHeader>
                      <Icon className="w-8 h-8 text-secondary mb-3" />
                      <CardTitle className="text-lg">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
