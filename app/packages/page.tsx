import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const PACKAGES = [
  {
    id: "1",
    title: "Dubai Holiday",
    category: "Luxury",
    destination: "UAE",
    duration: "5 Days / 4 Nights",
    price: "$2,500",
    image: "https://images.unsplash.com/photo-1512453475868-a34c61444ccd?w=500&h=300&fit=crop",
    description: "Experience luxury in Dubai with desert safari, shopping, and beach relaxation"
  },
  {
    id: "2",
    title: "European Cities",
    category: "Cultural",
    destination: "Europe",
    duration: "10 Days / 9 Nights",
    price: "$5,000",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop",
    description: "Discover the charm of Paris, Rome, and Barcelona in one incredible journey"
  },
  {
    id: "3",
    title: "Family Safari",
    category: "Family",
    destination: "Kenya",
    duration: "7 Days / 6 Nights",
    price: "$3,500",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&h=300&fit=crop",
    description: "Create unforgettable memories with wildlife safari and family activities"
  },
  {
    id: "4",
    title: "Mountain Adventure",
    category: "Adventure",
    destination: "Nepal",
    duration: "8 Days / 7 Nights",
    price: "$2,800",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    description: "Trek through the Himalayas with experienced guides and breathtaking views"
  }
]

export default function PackagesPage() {
  const categories = ["All", "Adventure", "Family", "Honeymoon", "Cultural", "Luxury"]
  const selectedCategory = "All"; // Declare selectedCategory variable
  const filtered = PACKAGES; // Declare filtered variable

  return (
    <>
      <Navbar />

      <div className="min-h-screen">
        {/* Hero Section with Background */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&h=600&fit=crop"
              alt="Travel packages hero"
              className="w-full h-full object-cover"
            />
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PACKAGES.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden card-hover flex flex-col shadow-lg hover:shadow-2xl transition-shadow group">
                  <div className="w-full h-40 bg-muted relative overflow-hidden">
                    <img
                      src={pkg.image || "/placeholder.svg"}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
                      <p className="text-2xl font-bold text-secondary">{pkg.price}</p>
                      <Button className="w-full btn-primary">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
