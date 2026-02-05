'use client'

import React from "react"

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, FileText, Send } from 'lucide-react'
import { DocumentUploader } from '@/components/DocumentUploader'

export default function RequestServicePage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([])
  const [serviceRequestId, setServiceRequestId] = useState<string | null>(null)
  const [draftSaving, setDraftSaving] = useState(false)
  const [formData, setFormData] = useState({
    service_type: 'visa',
    traveller_name: '',
    traveller_email: '',
    traveller_phone: '',
    traveller_country: '',
    destination: '',
    travel_date: '',
    budget_usd: '',
    description: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDocumentUpload = (docPath: string) => {
    setUploadedDocs(prev => [...prev, docPath])
  }

  const handleRemoveDoc = (docPath: string) => {
    setUploadedDocs(prev => prev.filter(d => d !== docPath))
  }

  const handleSubmit = async () => {
    if (!formData.traveller_name || !formData.traveller_email || !formData.destination) {
      alert('Please fill in all required fields')
      return
    }

    if (!serviceRequestId) {
      alert('Please save your request before submitting')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/service-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: serviceRequestId,
          status: 'submitted',
          ...formData,
          documents: uploadedDocs,
          budget_usd: parseFloat(formData.budget_usd) || 0
        })
      })

      if (response.ok) {
        const data = await response.json()
        alert('Service request submitted successfully! Your request ID is: ' + (data.request?.id || serviceRequestId))
        setStep(3)
      } else {
        alert('Error submitting request')
      }
    } catch (error) {
      console.log('[v0] Error submitting request:', error)
      alert('Error submitting request')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDraft = async () => {
    if (serviceRequestId) {
      setStep(2)
      return
    }

    setDraftSaving(true)
    try {
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'draft',
          budget_usd: parseFloat(formData.budget_usd) || 0
        })
      })

      if (response.ok) {
        const data = await response.json()
        setServiceRequestId(data.id)
        setStep(2)
      } else {
        alert('Error saving draft')
      }
    } catch (error) {
      console.log('[v0] Error saving draft:', error)
      alert('Error saving draft')
    } finally {
      setDraftSaving(false)
    }
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-muted/20 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Request Travel Service</h1>
            <p className="text-lg text-muted-foreground">
              Submit your travel service request and upload required documents
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1">
                  <div className={`h-2 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'
                    }`}></div>
                  <p className="text-xs text-center mt-2 text-muted-foreground">
                    {s === 1 ? 'Your Info' : s === 2 ? 'Documents' : 'Confirmation'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Your Information</CardTitle>
                <CardDescription>Tell us about yourself and your travel needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Service Type */}
                <div>
                  <Label htmlFor="service_type">Service Type *</Label>
                  <select
                    id="service_type"
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleInputChange}
                    className="w-full mt-2 px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="visa">Visa Assistance</option>
                    <option value="flight">Flight Booking</option>
                    <option value="hotel">Hotel & Accommodation</option>
                    <option value="guide">Tour Guide Services</option>
                    <option value="other">Other Services</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="traveller_name">Full Name *</Label>
                    <Input
                      id="traveller_name"
                      name="traveller_name"
                      value={formData.traveller_name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="traveller_email">Email Address *</Label>
                    <Input
                      id="traveller_email"
                      name="traveller_email"
                      type="email"
                      value={formData.traveller_email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="traveller_phone">Phone Number</Label>
                    <Input
                      id="traveller_phone"
                      name="traveller_phone"
                      value={formData.traveller_phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="traveller_country">Country *</Label>
                    <Input
                      id="traveller_country"
                      name="traveller_country"
                      value={formData.traveller_country}
                      onChange={handleInputChange}
                      placeholder="Rwanda"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="destination">Destination Country *</Label>
                    <Input
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="France"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="travel_date">Travel Date *</Label>
                    <Input
                      id="travel_date"
                      name="travel_date"
                      type="date"
                      value={formData.travel_date}
                      onChange={handleInputChange}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="budget_usd">Budget (USD)</Label>
                  <Input
                    id="budget_usd"
                    name="budget_usd"
                    type="number"
                    value={formData.budget_usd}
                    onChange={handleInputChange}
                    placeholder="5000"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Additional Information</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your requirements..."
                    className="w-full mt-2 px-3 py-2 border rounded-md bg-background min-h-24"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    className="btn-primary ml-auto"
                    onClick={handleCreateDraft}
                    disabled={draftSaving}
                  >
                    {draftSaving ? 'Saving Draft...' : 'Next: Upload Documents'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Document Upload */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Upload Documents</CardTitle>
                <CardDescription>Upload required PDF documents (passport, visa pages, etc.)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <DocumentUploader
                  onUploadSuccess={handleDocumentUpload}
                  serviceRequestId={serviceRequestId || undefined}
                />

                {uploadedDocs.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Uploaded Documents</h3>
                    <div className="space-y-2">
                      {uploadedDocs.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">{doc.split('/').pop()}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDoc(doc)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    className="btn-primary ml-auto"
                    onClick={() => setStep(3)}
                  >
                    Review & Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review & Confirmation */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Review & Submit</CardTitle>
                <CardDescription>Review your information before submitting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted p-4 rounded-lg space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Service Type</p>
                      <p className="font-semibold capitalize">{formData.service_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-semibold">{formData.traveller_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold">{formData.traveller_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Destination</p>
                      <p className="font-semibold">{formData.destination}</p>
                    </div>
                  </div>
                </div>

                {uploadedDocs.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="font-semibold mb-2">Attached Documents ({uploadedDocs.length})</p>
                    <div className="space-y-2">
                      {uploadedDocs.map((doc, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {doc.split('/').pop()}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    By submitting this form, you agree to share the provided information with our travel experts who will process your request and contact you shortly.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    className="btn-primary ml-auto gap-2"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin">⏳</div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
