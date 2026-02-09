'use client'

import React from "react"
import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Upload, FileText, Send, MapPin, Calendar, Users, DollarSign } from 'lucide-react'
import { DocumentUploader } from '@/components/DocumentUploader'
import Link from "next/link"

export default function RequestTravelPage() {
      const [step, setStep] = useState(1)
      const [loading, setLoading] = useState(false)
      const [uploadedDocs, setUploadedDocs] = useState<string[]>([])
      const [travelRequestId, setTravelRequestId] = useState<string | null>(null)
      const [draftSaving, setDraftSaving] = useState(false)
      const [formData, setFormData] = useState({
            traveller_name: '',
            traveller_email: '',
            traveller_phone: '',
            traveller_country: '',
            destination: '',
            departure_city: '',
            travel_date: '',
            return_date: '',
            travelers_count: '1',
            accommodation_type: 'hotel',
            budget_usd: '',
            special_requirements: '',
            trip_purpose: 'leisure'
      })

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target
            setFormData(prev => ({
                  ...prev,
                  [name]: value
            }))
      }

      const handleSelectChange = (name: string, value: string) => {
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

      const handleCreateDraft = async () => {
            if (travelRequestId) {
                  setStep(2)
                  return
            }

            if (!formData.traveller_name || !formData.traveller_email || !formData.destination) {
                  alert('Please fill in your name, email, and destination')
                  return
            }

            setDraftSaving(true)
            try {
                  const response = await fetch('/api/travel-requests', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                              ...formData,
                              status: 'draft',
                              travelers_count: parseInt(formData.travelers_count),
                              budget_usd: parseFloat(formData.budget_usd) || 0
                        })
                  })

                  if (response.ok) {
                        const data = await response.json()
                        setTravelRequestId(data.request.id)
                        setStep(2)
                        alert('Draft saved successfully!')
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

      const handleSubmit = async () => {
            if (!formData.traveller_name || !formData.traveller_email || !formData.destination) {
                  alert('Please fill in all required fields')
                  return
            }

            if (!travelRequestId) {
                  alert('Please save your request before submitting')
                  return
            }

            setLoading(true)
            try {
                  const response = await fetch('/api/travel-requests', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                              id: travelRequestId,
                              status: 'submitted',
                              ...formData,
                              travelers_count: parseInt(formData.travelers_count),
                              budget_usd: parseFloat(formData.budget_usd) || 0,
                              documents: uploadedDocs
                        })
                  })

                  if (response.ok) {
                        const data = await response.json()
                        alert('Travel request submitted successfully! Your request ID is: ' + (data.request?.id || travelRequestId))
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

      const renderStep1 = () => (
            <Card>
                  <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                              <MapPin className="w-5 h-5" />
                              Travel Details
                        </CardTitle>
                        <CardDescription>
                              Tell us about your travel plans and preferences
                        </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                    <Label htmlFor="traveller_name">Full Name *</Label>
                                    <Input
                                          id="traveller_name"
                                          name="traveller_name"
                                          value={formData.traveller_name}
                                          onChange={handleInputChange}
                                          placeholder="Enter your full name"
                                          required
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
                                          placeholder="your.email@example.com"
                                          required
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
                                    />
                              </div>
                              <div>
                                    <Label htmlFor="traveller_country">Country of Residence</Label>
                                    <Input
                                          id="traveller_country"
                                          name="traveller_country"
                                          value={formData.traveller_country}
                                          onChange={handleInputChange}
                                          placeholder="United States"
                                    />
                              </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                    <Label htmlFor="departure_city">Departure City</Label>
                                    <Input
                                          id="departure_city"
                                          name="departure_city"
                                          value={formData.departure_city}
                                          onChange={handleInputChange}
                                          placeholder="New York, NY"
                                    />
                              </div>
                              <div>
                                    <Label htmlFor="destination">Destination *</Label>
                                    <Input
                                          id="destination"
                                          name="destination"
                                          value={formData.destination}
                                          onChange={handleInputChange}
                                          placeholder="Paris, France"
                                          required
                                    />
                              </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                              <div>
                                    <Label htmlFor="travel_date">Travel Date</Label>
                                    <Input
                                          id="travel_date"
                                          name="travel_date"
                                          type="date"
                                          value={formData.travel_date}
                                          onChange={handleInputChange}
                                    />
                              </div>
                              <div>
                                    <Label htmlFor="return_date">Return Date</Label>
                                    <Input
                                          id="return_date"
                                          name="return_date"
                                          type="date"
                                          value={formData.return_date}
                                          onChange={handleInputChange}
                                    />
                              </div>
                              <div>
                                    <Label htmlFor="travelers_count">Number of Travelers</Label>
                                    <Select value={formData.travelers_count} onValueChange={(value) => handleSelectChange('travelers_count', value)}>
                                          <SelectTrigger>
                                                <SelectValue placeholder="Select count" />
                                          </SelectTrigger>
                                          <SelectContent>
                                                <SelectItem value="1">1 Person</SelectItem>
                                                <SelectItem value="2">2 People</SelectItem>
                                                <SelectItem value="3">3 People</SelectItem>
                                                <SelectItem value="4">4 People</SelectItem>
                                                <SelectItem value="5">5+ People</SelectItem>
                                          </SelectContent>
                                    </Select>
                              </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                    <Label htmlFor="trip_purpose">Trip Purpose</Label>
                                    <Select value={formData.trip_purpose} onValueChange={(value) => handleSelectChange('trip_purpose', value)}>
                                          <SelectTrigger>
                                                <SelectValue placeholder="Select purpose" />
                                          </SelectTrigger>
                                          <SelectContent>
                                                <SelectItem value="leisure">Leisure/Vacation</SelectItem>
                                                <SelectItem value="business">Business</SelectItem>
                                                <SelectItem value="family">Family Visit</SelectItem>
                                                <SelectItem value="education">Education</SelectItem>
                                                <SelectItem value="medical">Medical</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                          </SelectContent>
                                    </Select>
                              </div>
                              <div>
                                    <Label htmlFor="accommodation_type">Preferred Accommodation</Label>
                                    <Select value={formData.accommodation_type} onValueChange={(value) => handleSelectChange('accommodation_type', value)}>
                                          <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                          </SelectTrigger>
                                          <SelectContent>
                                                <SelectItem value="hotel">Hotel</SelectItem>
                                                <SelectItem value="resort">Resort</SelectItem>
                                                <SelectItem value="apartment">Apartment</SelectItem>
                                                <SelectItem value="villa">Villa</SelectItem>
                                                <SelectItem value="hostel">Hostel</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                          </SelectContent>
                                    </Select>
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
                              />
                        </div>

                        <div>
                              <Label htmlFor="special_requirements">Special Requirements</Label>
                              <Textarea
                                    id="special_requirements"
                                    name="special_requirements"
                                    value={formData.special_requirements}
                                    onChange={handleInputChange}
                                    placeholder="Any special accommodations, dietary restrictions, accessibility needs, etc."
                                    rows={4}
                              />
                        </div>

                        <div className="flex gap-4">
                              <Button onClick={handleCreateDraft} disabled={draftSaving} className="flex-1">
                                    {draftSaving ? 'Saving...' : 'Save as Draft'}
                              </Button>
                              <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                                    Continue to Documents
                              </Button>
                        </div>
                  </CardContent>
            </Card>
      )

      const renderStep2 = () => (
            <Card>
                  <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                              <FileText className="w-5 h-5" />
                              Supporting Documents
                        </CardTitle>
                        <CardDescription>
                              Upload any relevant documents for your travel request
                        </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                        <DocumentUploader onUploadSuccess={handleDocumentUpload} serviceRequestId={travelRequestId || undefined} />

                        {uploadedDocs.length > 0 && (
                              <div>
                                    <h4 className="font-medium mb-3">Uploaded Documents</h4>
                                    <div className="space-y-2">
                                          {uploadedDocs.map((doc, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                                      <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4" />
                                                            <span className="text-sm">{doc.split('/').pop()}</span>
                                                      </div>
                                                      <Button
                                                            variant="outline"
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

                        <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-medium text-blue-900 mb-2">Common Documents</h4>
                              <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Passport copy (if available)</li>
                                    <li>• Visa requirements or current visa</li>
                                    <li>• Travel itinerary preferences</li>
                                    <li>• Medical information (if applicable)</li>
                                    <li>• Special accommodation requests</li>
                              </ul>
                        </div>

                        <div className="flex gap-4">
                              <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                                    Back to Details
                              </Button>
                              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                                    {loading ? 'Submitting...' : 'Submit Request'}
                              </Button>
                        </div>
                  </CardContent>
            </Card>
      )

      const renderStep3 = () => (
            <Card>
                  <CardHeader>
                        <CardTitle className="text-center text-green-600">Request Submitted Successfully!</CardTitle>
                        <CardDescription className="text-center">
                              Thank you for your travel request. Our team will review it and get back to you soon.
                        </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                              <Send className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-muted-foreground">
                              You will receive a confirmation email shortly with your request details.
                        </p>
                        <div className="flex gap-4 justify-center">
                              <Link href="/">
                                    <Button variant="outline">Return Home</Button>
                              </Link>
                              <Link href="/dashboard/traveler">
                                    <Button>View My Requests</Button>
                              </Link>
                        </div>
                  </CardContent>
            </Card>
      )

      return (
            <>
                  <Navbar />

                  <div className="min-h-screen bg-gray-50 py-12">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Request Travel Services</h1>
                                    <p className="text-lg text-gray-600">
                                          Tell us about your travel plans and we&apos;ll help make your journey unforgettable
                                    </p>
                              </div>

                              {/* Progress Steps */}
                              <div className="flex items-center justify-center mb-8">
                                    <div className="flex items-center">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
                                                }`}>
                                                1
                                          </div>
                                          <span className={`ml-2 ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>Details</span>
                                    </div>
                                    <div className={`w-16 h-0.5 mx-4 ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`} />
                                    <div className="flex items-center">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
                                                }`}>
                                                2
                                          </div>
                                          <span className={`ml-2 ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>Documents</span>
                                    </div>
                                    <div className={`w-16 h-0.5 mx-4 ${step >= 3 ? 'bg-primary' : 'bg-gray-300'}`} />
                                    <div className="flex items-center">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
                                                }`}>
                                                3
                                          </div>
                                          <span className={`ml-2 ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>Complete</span>
                                    </div>
                              </div>

                              {step === 1 && renderStep1()}
                              {step === 2 && renderStep2()}
                              {step === 3 && renderStep3()}
                        </div>
                  </div>

                  <Footer />
            </>
      )
}