'use client'

import React from "react"

import { useState } from "react"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, File, Trash2, ImageIcon, Video } from "lucide-react"

interface MediaItem {
  id: string
  name: string
  type: "image" | "video" | "document"
  size: number
  url: string
  uploadedAt: Date
}

export function MediaUploader() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  React.useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth-check')
      if (res.ok) {
        setAuthenticated(true)
        fetchMedia()
      } else {
        setAuthenticated(false)
      }
    } catch (err) {
      setAuthenticated(false)
    }
  }

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media')
      const json = await res.json()
      if (res.ok) {
        const items = (json.media || []).map((m: any) => ({
          id: m.id,
          name: m.filename,
          type: m.mime_type?.startsWith('image/') ? 'image' : m.mime_type?.startsWith('video/') ? 'video' : 'document',
          size: m.size,
          url: m.url,
          uploadedAt: new Date(m.created_at)
        }))
        setMedia(items)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files: FileList) => {
    Array.from(files).forEach(async (file) => {
      const id = crypto.randomUUID()
      setUploadProgress((prev) => ({ ...prev, [id]: 0 }))

      // Upload to API
      const formData = new FormData()
      formData.append('file', file)

      try {
        const res = await fetch('/api/admin/media/upload', { method: 'POST', body: formData })
        const json = await res.json()
        if (res.ok) {
          const mediaItem: MediaItem = {
            id: json.media.id,
            name: file.name,
            type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document",
            size: file.size,
            url: json.media.url,
            uploadedAt: new Date(),
          }
          setMedia((prev) => [mediaItem, ...prev])
          setUploadProgress((prev) => ({ ...prev, [id]: 100 }))
        } else {
          alert(json.error || 'Upload failed')
          setUploadProgress((prev) => {
            const newProgress = { ...prev }
            delete newProgress[id]
            return newProgress
          })
        }
      } catch (err) {
        alert('Upload failed')
        setUploadProgress((prev) => {
          const newProgress = { ...prev }
          delete newProgress[id]
          return newProgress
        })
      }
    })
  }

  const deleteMedia = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== id))
      } else {
        alert('Failed to delete')
      }
    } catch (err) {
      alert('Failed to delete')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  if (authenticated === null) return <div>Checking authentication...</div>
  if (authenticated === false) return <div>You must be logged in as an admin to upload media.</div>

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground"
              }`}
          >
            <label className="cursor-pointer space-y-3">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-semibold">Drag and drop files here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
              <p className="text-xs text-muted-foreground">Supports images, videos, and documents</p>
              <input
                type="file"
                multiple
                onChange={handleFileInput}
                accept="image/*,video/*,.pdf,.doc,.docx"
                hidden
              />
            </label>
          </div>
        </CardContent>
      </Card>

      return (
      <div className="space-y-6">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground"
                }`}
            >
              <label className="cursor-pointer space-y-3">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-semibold">Drag and drop files here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                </div>
                <p className="text-xs text-muted-foreground">Supports images, videos, and documents</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  hidden
                />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Media Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Media Library ({media.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading media...</div>
            ) : media.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No media uploaded yet</div>
            ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {media.map((item) => {
                  const progress = uploadProgress[item.id] || 100
                  const isUploading = progress < 100

                  return (
                    <div key={item.id} className="border rounded-lg overflow-hidden group hover:shadow-lg transition">
                      {/* Media Preview */}
                      <div className="relative w-full aspect-square bg-muted flex items-center justify-center overflow-hidden">
                        {item.type === "image" ? (
                          <Image src={item.url || "/placeholder.svg"} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                        ) : item.type === "video" ? (
                          <>
                            <Video className="w-8 h-8 text-muted-foreground" />
                            {item.url && <video src={item.url} className="w-full h-full object-cover absolute" />}
                          </>
                        ) : (
                          <File className="w-8 h-8 text-muted-foreground" />
                        )}

                        {/* Upload Progress */}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="text-center text-white">
                              <div className="text-sm font-medium">{Math.round(progress)}%</div>
                              <div className="w-16 h-1 bg-white/30 rounded-full mt-1 overflow-hidden">
                                <div
                                  className="h-full bg-white transition-all"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Delete Button */}
                        {!isUploading && (
                          <button
                            onClick={() => deleteMedia(item.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="p-3">
                        <p className="text-xs font-medium truncate" title={item.name}>
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(item.size)}</p>
                        {!isUploading && (
                          <Button variant="outline" size="sm" className="w-full mt-2 text-xs bg-transparent" onClick={() => navigator.clipboard.writeText(item.url)}>
                            Copy Link
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      )
    </div>
  )
}
