import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Blog - We-Of-You Travel & Experiences",
  description: "Read travel tips, destination guides, sustainability insights, and travel industry news",
}

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "Top 10 Sustainable Travel Tips",
      slug: "sustainable-travel-tips",
      excerpt: "Learn how to travel responsibly and reduce your carbon footprint",
      category: "Sustainability",
      author: "Admin Team",
      date: "2025-12-15",
      image: "/sustainable-living.png",
    },
    {
      id: 2,
      title: "Rwanda: The Land of a Thousand Hills",
      slug: "rwanda-destination-guide",
      excerpt: "Your complete guide to Rwanda's breathtaking landscapes and culture",
      category: "Destination Guide",
      author: "Sarah Johnson",
      date: "2025-12-10",
      image: "/rwanda.jpg",
    },
    {
      id: 3,
      title: "Corporate Travel Trends in 2026",
      slug: "corporate-travel-trends",
      excerpt: "What's shaping the future of business travel this year",
      category: "Corporate News",
      author: "Team Lead",
      date: "2025-12-05",
      image: "/corporate-teamwork.png",
    },
  ]

  return (
    <>
      <Navbar />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="section-header mb-6">Travel Blog</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights, tips, and stories from the world of travel
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden card-hover flex flex-col">
                  <div className="w-full h-48 bg-muted relative overflow-hidden">
                    <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  </div>
                  <CardHeader className="flex-grow">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.author}</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
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
