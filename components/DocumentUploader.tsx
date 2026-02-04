'use client'

import React from "react"

import { useState, useRef } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DocumentUploaderProps {
  onUploadSuccess: (docPath: string) => void
  serviceRequestId: string
}

export function DocumentUploader({ onUploadSuccess, serviceRequestId }: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.pdf')) {
      setMessage({ type: 'error', text: 'Only PDF files are allowed' })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 10MB' })
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('serviceRequestId', serviceRequestId)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setMessage({ type: 'success', text: 'Document uploaded successfully' })
        onUploadSuccess(data.filePath)
        setUploadProgress(0)
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: 'Upload failed' })
      }
    } catch (error) {
      console.log('[v0] Upload error:', error)
      setMessage({ type: 'error', text: 'Error uploading document' })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    for (let i = 0; i < files.length; i++) {
      await processFile(files[i])
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    for (let i = 0; i < (files?.length || 0); i++) {
      await processFile(files![i])
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Drag and drop PDF files here</p>
            <p className="text-sm text-muted-foreground">or click to select files</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Maximum file size: 10MB. Only PDF format allowed.
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="mt-4"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Select PDF File'}
        </Button>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading document...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700'
            : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <p className="font-semibold">Accepted Documents:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Passport or ID copy</li>
          <li>Visa pages (if applicable)</li>
          <li>Travel insurance documentation</li>
          <li>Bank statements or financial proof</li>
          <li>Invitation letter (if required)</li>
          <li>Other supporting documents</li>
        </ul>
      </div>
    </div>
  )
}
