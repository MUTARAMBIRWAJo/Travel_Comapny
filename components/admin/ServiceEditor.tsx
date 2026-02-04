'use client'

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Upload } from "lucide-react"

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

interface ServiceEditorProps {
  service?: Service
  onSave: (data: Service) => void
  onClose: () => void
}

export function ServiceEditor({ service, onSave, onClose }: ServiceEditorProps) {
  const [formData, setFormData] = useState<Service>(
    service || {
      id: crypto.randomUUID(),
      title_en: "",
      slug: "",
      short_description_en: "",
      status: "active",
    }
  )
  const [imagePreview, setImagePreview] = useState<string | null>(service?.image_url || null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setFormData({ ...formData, image_url: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-background border-b">
          <CardTitle>{service ? "Edit Service" : "Create Service"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-3">Service Image</label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview(null)
                      setFormData({ ...formData, image_url: undefined })
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload image</p>
                  <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title (English)</label>
            <input
              type="text"
              value={formData.title_en}
              onChange={(e) => {
                const title = e.target.value
                setFormData({
                  ...formData,
                  title_en: title,
                  slug: generateSlug(title),
                })
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Service title"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-2">URL Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="service-name"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Short Description</label>
            <textarea
              value={formData.short_description_en}
              onChange={(e) => setFormData({ ...formData, short_description_en: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-20"
              placeholder="Brief description shown in cards"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Full Description (Optional)</label>
            <textarea
              value={formData.full_description_en || ""}
              onChange={(e) => setFormData({ ...formData, full_description_en: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24"
              placeholder="Detailed description for service page"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 sticky bottom-0 bg-background pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="btn-primary" onClick={() => onSave(formData)}>
              {service ? "Update" : "Create"} Service
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
