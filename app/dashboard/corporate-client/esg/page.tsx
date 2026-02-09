import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Leaf, Recycle, TreePine, Building2, Globe, Award } from "lucide-react"

export const metadata = {
  title: "ESG Dashboard - We-Of-You Corporate Travel",
  description: "Environmental, Social, and Governance sustainability metrics for your corporate travel program.",
}

export default function CorporateESGPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-foreground">ESG Dashboard</h1>
        </div>
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Sustainability & ESG Tracking</h1>
            <p className="text-muted-foreground">
              Monitor your organization&apos;s environmental impact and sustainability initiatives in corporate travel.
            </p>
          </div>

          {/* ESG Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Carbon Footprint</CardTitle>
                <Leaf className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4 tons</div>
                <p className="text-xs text-muted-foreground">CO₂e this quarter</p>
                <Progress value={65} className="mt-2 h-2" />
                <p className="text-xs text-green-500 mt-1">-12% vs last quarter</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sustainable Choices</CardTitle>
                <TreePine className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">Eco-friendly bookings</p>
                <Progress value={78} className="mt-2 h-2" />
                <p className="text-xs text-emerald-500 mt-1">+8% improvement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Paper Reduced</CardTitle>
                <Recycle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-xs text-muted-foreground">Digital documents saved</p>
                <Progress value={82} className="mt-2 h-2" />
                <p className="text-xs text-blue-500 mt-1">Paperless initiative</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">ESG Score</CardTitle>
                <Award className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">A+</div>
                <p className="text-xs text-muted-foreground">Company rating</p>
                <Progress value={92} className="mt-2 h-2" />
                <p className="text-xs text-amber-500 mt-1">Top 5% globally</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Environmental Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-500" />
                  Environmental Impact
                </CardTitle>
                <CardDescription>
                  Breakdown of your travel-related environmental footprint
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Air Travel Emissions</span>
                    <span className="font-medium">1,850 kg CO₂e</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ground Transport</span>
                    <span className="font-medium">420 kg CO₂e</span>
                  </div>
                  <Progress value={28} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Hotel Stays</span>
                    <span className="font-medium">130 kg CO₂e</span>
                  </div>
                  <Progress value={12} className="h-2" />
                </div>
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    <strong>Tip:</strong> Choose direct flights and eco-certified hotels to reduce emissions by up to 30%.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sustainable Travel Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  Sustainable Travel Options
                </CardTitle>
                <CardDescription>
                  Recommended eco-friendly alternatives for your trips
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                      <Leaf className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Rail Travel</p>
                      <p className="text-sm text-muted-foreground">90% lower emissions than air</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50">Recommended</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Eco-Certified Hotels</p>
                      <p className="text-sm text-muted-foreground">Green Key or LEED certified</p>
                    </div>
                  </div>
                  <Badge variant="outline">Available</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded">
                      <Globe className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Carbon Offset Program</p>
                      <p className="text-sm text-muted-foreground">Offset emissions at checkout</p>
                    </div>
                  </div>
                  <Badge variant="outline">Optional</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ESG Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Corporate ESG Goals</CardTitle>
              <CardDescription>
                Your organization&apos;s sustainability targets and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Reduce carbon footprint by 50% by 2028</p>
                    <p className="text-sm text-muted-foreground">Baseline: 2024 emissions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">-35%</p>
                    <p className="text-xs text-muted-foreground">On track</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">100% digital document processing</p>
                    <p className="text-sm text-muted-foreground">Phase out paper invoices and tickets</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">82%</p>
                    <p className="text-xs text-muted-foreground">Near completion</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">80% sustainable bookings by 2026</p>
                    <p className="text-sm text-muted-foreground">Eco-certified options preferred</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">78%</p>
                    <p className="text-xs text-muted-foreground">Almost there</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
