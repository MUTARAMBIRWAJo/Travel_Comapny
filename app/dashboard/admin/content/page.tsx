'use client'

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, FileText, LucideComponent as ImageIconComponent, Video } from "lucide-react"
import { PackageEditor } from "@/components/admin/PackageEditor"
import { ServiceEditor } from "@/components/admin/ServiceEditor"
import { MediaUploader } from "@/components/admin/MediaUploader"

function PagesList() {
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    fetch('/api/admin/pages')
      .then(res => res.json())
      .then(data => setPages(data.pages || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading pages...</div>

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {pages.map((page) => (
        <Card key={page.id} className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle className="text-lg">{page.title}</CardTitle>
            <CardDescription>{page.page_key} • {page.status}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => window.location.href = `/dashboard/admin/pages/${page.id}`}>Edit</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ContentManagementPage() {
  const [showPackageEditor, setShowPackageEditor] = useState(false)
  const [showServiceEditor, setShowServiceEditor] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null)
  const [selectedService, setSelectedService] = useState<any | null>(null)
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  React.useEffect(() => {
    fetch('/api/admin/auth-check')
      .then(res => {
        if (res.ok) {
          setAuthenticated(true)
        } else {
          setAuthenticated(false)
          window.location.href = '/login'
        }
      })
      .catch(() => {
        setAuthenticated(false)
        window.location.href = '/login'
      })
  }, [])

  if (authenticated === null) return <div>Loading...</div>
  if (authenticated === false) return <div>Redirecting to login...</div>

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
              <h3 className="text-2xl font-bold">Pages Management</h3>
              <p className="text-muted-foreground">Manage public page content</p>
            </div>
            <Button onClick={() => window.location.href = '/dashboard/admin/pages/new'}>
              + Create Page
            </Button>
          </div>

          <PagesList />
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
