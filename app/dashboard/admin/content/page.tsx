'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, FileText, LucideComponent as ImageIconComponent, Video } from "lucide-react"
import { PackageEditor } from "@/components/admin/PackageEditor"
import { ServiceEditor } from "@/components/admin/ServiceEditor"
import { MediaUploader } from "@/components/admin/MediaUploader"

export default function ContentManagementPage() {
  const [showPackageEditor, setShowPackageEditor] = useState(false)
  const [showServiceEditor, setShowServiceEditor] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Content Management</h2>
        <p className="text-muted-foreground">Manage public pages, packages, services, and media</p>
      </div>

      <Tabs defaultValue="packages" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="packages" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Packages
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <ImageIconComponent className="w-4 h-4" />
            Media
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Pages
          </TabsTrigger>
        </TabsList>

        {/* Packages Tab */}
        <TabsContent value="packages" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Travel Packages</h3>
              <p className="text-muted-foreground">Create and manage travel packages</p>
            </div>
            <Button 
              className="btn-primary"
              onClick={() => {
                setSelectedPackage(null)
                setShowPackageEditor(true)
              }}
            >
              + Add Package
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Package List</CardTitle>
              <CardDescription>All travel packages available to customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 hover:bg-muted/50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">Dubai Holiday</h4>
                      <p className="text-sm text-muted-foreground">5 Days / 4 Nights • $2,500 USD</p>
                      <div className="mt-2 space-x-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Featured</span>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-600 bg-transparent">Delete</Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:bg-muted/50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">European Cities Tour</h4>
                      <p className="text-sm text-muted-foreground">10 Days / 9 Nights • $5,000 USD</p>
                      <div className="mt-2 space-x-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-600 bg-transparent">Delete</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Services</h3>
              <p className="text-muted-foreground">Manage service offerings</p>
            </div>
            <Button 
              className="btn-primary"
              onClick={() => {
                setSelectedService(null)
                setShowServiceEditor(true)
              }}
            >
              + Add Service
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service List</CardTitle>
              <CardDescription>All services shown on the public site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Visa Assistance", "Flight Booking", "Corporate Travel", "Travel Packages"].map((service) => (
                  <div key={service} className="border rounded-lg p-4 hover:bg-muted/50 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold">{service}</h4>
                        <p className="text-sm text-muted-foreground">Expert guidance and support</p>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-600 bg-transparent">Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold">Media Library</h3>
            <p className="text-muted-foreground">Upload and manage images and videos</p>
          </div>

          <MediaUploader />
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Page Settings</h3>
              <p className="text-muted-foreground">Configure public page content</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: "Home Page", description: "Hero section, services, testimonials" },
              { name: "Packages Page", description: "Package listings and filters" },
              { name: "Services Page", description: "Service details and descriptions" },
              { name: "Destinations Page", description: "Destination guides" },
              { name: "About Page", description: "Company information" },
              { name: "Contact Page", description: "Contact information" },
            ].map((page) => (
              <Card key={page.name} className="hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle className="text-lg">{page.name}</CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">Edit Content</Button>
                    <Button variant="outline" size="sm">Edit Images</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showPackageEditor && (
        <PackageEditor
          package={selectedPackage}
          onSave={(data) => {
            console.log("Save package:", data)
            setShowPackageEditor(false)
          }}
          onClose={() => setShowPackageEditor(false)}
        />
      )}

      {showServiceEditor && (
        <ServiceEditor
          service={selectedService}
          onSave={(data) => {
            console.log("Save service:", data)
            setShowServiceEditor(false)
          }}
          onClose={() => setShowServiceEditor(false)}
        />
      )}
    </div>
  )
}
