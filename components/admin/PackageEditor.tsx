'use client';

import React from "react"

import { useState } from "react"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Upload } from "lucide-react"

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

interface PackageEditorProps {
  package?: Package
  onSave: (data: Package) => void
  onClose: () => void
}

const categories = ["All", "Adventure", "Family", "Honeymoon", "Cultural", "Luxury"]

export function PackageEditor({ package: pkg, onSave, onClose }: PackageEditorProps) {
  const [formData, setFormData] = useState<Package>(
    pkg ? {
      ...pkg,
      price_usd: pkg.price_usd || 0,
      price_rwf: pkg.price_rwf || 0,
    } : {
      id: crypto.randomUUID(),
      title_en: "",
      duration: "",
      price_usd: 0,
      price_rwf: 0,
      includes_en: "",
      short_description_en: "",
      status: "active",
      category: "All",
      featured: false,
    }
  )
  const [imagePreview, setImagePreview] = useState<string | null>(pkg?.image_url || null)

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

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-background border-b">
          <CardTitle>{pkg ? "Edit Package" : "Create Package"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-3">Package Image</label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition">
              {imagePreview ? (
                <div className="relative w-full h-40">
                  <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover rounded-lg" />
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
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Package title"
            />
          </div>

          {/* Category and Destination */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category || "All"}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Destination</label>
              <input
                type="text"
                value={formData.destination || ""}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., UAE, Europe"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-2">Duration</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., 5 Days / 4 Nights"
            />
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price (USD)</label>
              <input
                type="number"
                value={formData.price_usd}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  setFormData({ ...formData, price_usd: isNaN(val) ? 0 : val })
                }}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price (RWF)</label>
              <input
                type="number"
                value={formData.price_rwf}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  setFormData({ ...formData, price_rwf: isNaN(val) ? 0 : val })
                }}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Short Description</label>
            <textarea
              value={formData.short_description_en || ""}
              onChange={(e) => setFormData({ ...formData, short_description_en: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-20"
              placeholder="Brief description shown in cards"
            />
          </div>

          {/* What's Included */}
          <div>
            <label className="block text-sm font-medium mb-2">What's Included</label>
            <textarea
              value={formData.includes_en}
              onChange={(e) => setFormData({ ...formData, includes_en: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24"
              placeholder="List what's included in this package"
            />
          </div>

          {/* Status and Featured */}
          <div className="grid md:grid-cols-2 gap-4">
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
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured || false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="featured" className="text-sm font-medium">Featured Package</label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 sticky bottom-0 bg-background pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="btn-primary" onClick={() => onSave(formData)}>
              {pkg ? "Update" : "Create"} Package
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
