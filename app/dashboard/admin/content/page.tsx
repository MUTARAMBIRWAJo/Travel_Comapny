'use client'

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, FileText, LucideComponent as ImageIconComponent, Video } from "lucide-react"
import { PackageEditor } from "@/components/admin/PackageEditor"
import { ServiceEditor } from "@/components/admin/ServiceEditor"
import { MediaUploader } from "@/components/admin/MediaUploader"

interface Package {
  id: string
  title_en: string
  title_rw?: string
  title_fr?: string
  duration: string
  price_usd: number
  price_rwf: number
  includes_en: string
  short_description_en?: string
  image_url?: string
  status: "active" | "inactive"
  featured?: boolean
  category?: string
  destination?: string
}

interface Service {
  id: string
  title_en: string
  title_rw?: string
  title_fr?: string
  slug: string
  short_description_en: string
  full_description_en?: string
  icon?: string
  image_url?: string
  status: "active" | "inactive"
}

export default function ContentManagementPage() {
  const [showPackageEditor, setShowPackageEditor] = useState(false)
  const [showServiceEditor, setShowServiceEditor] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch packages
  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/admin/packages')
      const data = await res.json()
      setPackages(data.packages || [])
    } catch (error) {
      console.error('Failed to fetch packages:', error)
    }
  }

  // Fetch services from API
  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services')
      const data = await res.json()
      setServices(data.services || [])
    } catch (error) {
      console.error('Failed to fetch services:', error)
      // Fallback to empty array
      setServices([])
    }
  }

  // Handle package save
  const handlePackageSave = async (data: Package) => {
    try {
      if (selectedPackage) {
        // Update existing package via API
        const res = await fetch('/api/admin/packages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (res.ok) {
          const updated = await res.json()
          setPackages(packages.map(pkg =>
            pkg.id === selectedPackage.id ? updated.package : pkg
          ))
        }
      } else {
        // Create new package via API
        const res = await fetch('/api/admin/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (res.ok) {
          const created = await res.json()
          setPackages([...packages, created.package])
        }
      }
      setShowPackageEditor(false)
      setSelectedPackage(null)
    } catch (error) {
      console.error('Failed to save package:', error)
      // Fallback to local state update for demo
      if (selectedPackage) {
        setPackages(packages.map(pkg =>
          pkg.id === selectedPackage.id ? { ...pkg, ...data } : pkg
        ))
      } else {
        const newPackage = { ...data, id: crypto.randomUUID() }
        setPackages([...packages, newPackage])
      }
      setShowPackageEditor(false)
      setSelectedPackage(null)
    }
  }

  // Handle service save
  const handleServiceSave = async (data: Service) => {
    try {
      if (selectedService) {
        // Update existing service via API
        const res = await fetch('/api/admin/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (res.ok) {
          const updated = await res.json()
          setServices(services.map(svc =>
            svc.id === selectedService.id ? updated.service : svc
          ))
        }
      } else {
        // Create new service via API
        const res = await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (res.ok) {
          const created = await res.json()
          setServices([...services, created.service])
        }
      }
      setShowServiceEditor(false)
      setSelectedService(null)
    } catch (error) {
      console.error('Failed to save service:', error)
      // Fallback to local state update for demo
      if (selectedService) {
        setServices(services.map(svc =>
          svc.id === selectedService.id ? { ...svc, ...data } : svc
        ))
      } else {
        const newService = { ...data, id: crypto.randomUUID() }
        setServices([...services, newService])
      }
      setShowServiceEditor(false)
      setSelectedService(null)
    }
  }

  // Handle delete package
  const handleDeletePackage = async (pkgId: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      try {
        const res = await fetch(`/api/admin/packages?id=${pkgId}`, {
          method: 'DELETE',
        })
        if (res.ok) {
          setPackages(packages.filter(pkg => pkg.id !== pkgId))
        }
      } catch (error) {
        console.error('Failed to delete package:', error)
        // Fallback to local delete for demo
        setPackages(packages.filter(pkg => pkg.id !== pkgId))
      }
    }
  }

  // Handle delete service
  const handleDeleteService = async (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        const res = await fetch(`/api/admin/services?id=${serviceId}`, {
          method: 'DELETE',
        })
        if (res.ok) {
          setServices(services.filter(svc => svc.id !== serviceId))
        }
      } catch (error) {
        console.error('Failed to delete service:', error)
        // Fallback to local delete for demo
        setServices(services.filter(svc => svc.id !== serviceId))
      }
    }
  }

  // Open package editor for edit
  const handleEditPackage = (pkg: Package) => {
    setSelectedPackage(pkg)
    setShowPackageEditor(true)
  }

  // Open service editor for edit
  const handleEditService = (service: Service) => {
    setSelectedService(service)
    setShowServiceEditor(true)
  }

  useEffect(() => {
    fetchPackages()
    fetchServices()
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch('/api/admin/auth-check', { credentials: 'include' })
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

  if (loading) return <div>Loading content...</div>

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
              {packages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No packages found. Click "Add Package" to create one.
                </div>
              ) : (
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="border rounded-lg p-4 hover:bg-muted/50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">{pkg.title_en}</h4>
                          <p className="text-sm text-muted-foreground">{pkg.duration} • ${pkg.price_usd} USD</p>
                          <div className="mt-2 space-x-2">
                            <span className={`text-xs px-2 py-1 rounded ${pkg.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {pkg.status}
                            </span>
                            {pkg.featured && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Featured</span>
                            )}
                          </div>
                        </div>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPackage(pkg)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 bg-transparent"
                            onClick={() => handleDeletePackage(pkg.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              {services.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No services found. Click "Add Service" to create one.
                </div>
              ) : (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4 hover:bg-muted/50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">{service.title_en}</h4>
                          <p className="text-sm text-muted-foreground">{service.short_description_en}</p>
                          <div className="mt-2 space-x-2">
                            <span className={`text-xs px-2 py-1 rounded ${service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {service.status}
                            </span>
                          </div>
                        </div>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditService(service)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 bg-transparent"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>Upload and manage images and files</CardDescription>
            </CardHeader>
            <CardContent>
              <MediaUploader />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CMS Pages</CardTitle>
              <CardDescription>Manage public pages</CardDescription>
            </CardHeader>
            <CardContent>
              <PagesList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Package Editor Modal */}
      {showPackageEditor && (
        <PackageEditor
          package={selectedPackage || undefined}
          onSave={handlePackageSave}
          onClose={() => {
            setShowPackageEditor(false)
            setSelectedPackage(null)
          }}
        />
      )}

      {/* Service Editor Modal */}
      {showServiceEditor && (
        <ServiceEditor
          service={selectedService || undefined}
          onSave={handleServiceSave}
          onClose={() => {
            setShowServiceEditor(false)
            setSelectedService(null)
          }}
        />
      )}
    </div>
  )
}

function PagesList() {
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/pages')
      .then(res => res.json())
      .then(data => setPages(data.pages || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading pages...</div>

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {pages.length === 0 ? (
        <div className="col-span-2 text-center py-8 text-muted-foreground">
          No pages found. Create pages to manage your site content.
        </div>
      ) : (
        pages.map((page) => (
          <Card key={page.id} className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-lg">{page.title || (page as any).title_en}</CardTitle>
              <CardDescription>{page.page_key} • {page.status || 'draft'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `/dashboard/admin/pages/${page.id}`}
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
