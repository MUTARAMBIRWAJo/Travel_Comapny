'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Phone, MapPin, Calendar, Save, Edit, Settings, FileText } from 'lucide-react'

export default function TravelerProfilePage() {
      const [loading, setLoading] = useState(true)
      const [saving, setSaving] = useState(false)
      const [isEditing, setIsEditing] = useState(false)
      const [profile, setProfile] = useState({
            id: '',
            name: '',
            email: '',
            phone: '',
            country: '',
            date_of_birth: '',
            passport_number: '',
            passport_expiry: '',
            emergency_contact_name: '',
            emergency_contact_phone: '',
            preferred_airline: '',
            seat_preference: '',
            dietary_restrictions: '',
            medical_conditions: '',
            frequent_traveler_number: ''
      })

      useEffect(() => {
            fetchProfile()
      }, [])

      const fetchProfile = async () => {
            try {
                  const response = await fetch('/api/users/profile')
                  const data = await response.json()
                  if (data.user) {
                        setProfile(prev => ({
                              ...prev,
                              ...data.user,
                              // Map database fields to form fields
                              name: data.user.name || '',
                              email: data.user.email || '',
                              phone: data.user.phone || '',
                              country: data.user.country || '',
                              date_of_birth: data.user.date_of_birth || '',
                              passport_number: data.user.passport_number || '',
                              passport_expiry: data.user.passport_expiry || '',
                              emergency_contact_name: data.user.emergency_contact_name || '',
                              emergency_contact_phone: data.user.emergency_contact_phone || '',
                              preferred_airline: data.user.preferred_airline || '',
                              seat_preference: data.user.seat_preference || '',
                              dietary_restrictions: data.user.dietary_restrictions || '',
                              medical_conditions: data.user.medical_conditions || '',
                              frequent_traveler_number: data.user.frequent_traveler_number || ''
                        }))
                  }
            } catch (error) {
                  console.log('[v0] Error fetching profile:', error)
            } finally {
                  setLoading(false)
            }
      }

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target
            setProfile(prev => ({
                  ...prev,
                  [name]: value
            }))
      }

      const handleSave = async () => {
            setSaving(true)
            try {
                  const response = await fetch('/api/users/profile', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(profile)
                  })

                  if (response.ok) {
                        setIsEditing(false)
                        alert('Profile updated successfully!')
                  } else {
                        alert('Error updating profile')
                  }
            } catch (error) {
                  console.log('[v0] Error updating profile:', error)
                  alert('Error updating profile')
            } finally {
                  setSaving(false)
            }
      }

      if (loading) {
            return (
                  <div className="space-y-8">
                        <div>
                              <h2 className="text-3xl font-bold">My Profile</h2>
                              <p className="text-muted-foreground">Manage your personal information and travel preferences</p>
                        </div>
                        <Card>
                              <CardContent className="pt-6">
                                    <p className="text-center text-muted-foreground">Loading your profile...</p>
                              </CardContent>
                        </Card>
                  </div>
            )
      }

      return (
            <div className="space-y-8">
                  <div className="flex items-center justify-between">
                        <div>
                              <h2 className="text-3xl font-bold">My Profile</h2>
                              <p className="text-muted-foreground">Manage your personal information and travel preferences</p>
                        </div>
                        <Button
                              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                              disabled={saving}
                        >
                              {saving ? (
                                    'Saving...'
                              ) : isEditing ? (
                                    <>
                                          <Save className="w-4 h-4 mr-2" />
                                          Save Changes
                                    </>
                              ) : (
                                    <>
                                          <Edit className="w-4 h-4 mr-2" />
                                          Edit Profile
                                    </>
                              )}
                        </Button>
                  </div>

                  {/* Profile Header */}
                  <Card>
                        <CardContent className="pt-6">
                              <div className="flex items-center gap-6">
                                    <Avatar className="w-20 h-20">
                                          <AvatarImage src="" />
                                          <AvatarFallback className="text-lg">
                                                {profile.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                          </AvatarFallback>
                                    </Avatar>
                                    <div>
                                          <h3 className="text-2xl font-bold">{profile.name || 'Your Name'}</h3>
                                          <p className="text-muted-foreground">{profile.email}</p>
                                          <div className="flex items-center gap-4 mt-2">
                                                <Badge variant="secondary">
                                                      <MapPin className="w-3 h-3 mr-1" />
                                                      {profile.country || 'Country not set'}
                                                </Badge>
                                                {profile.passport_number && (
                                                      <Badge variant="outline">
                                                            Passport: {profile.passport_number}
                                                      </Badge>
                                                )}
                                          </div>
                                    </div>
                              </div>
                        </CardContent>
                  </Card>

                  {/* Personal Information */}
                  <Card>
                        <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Personal Information
                              </CardTitle>
                              <CardDescription>
                                    Your basic personal details and contact information
                              </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                              <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                          <Label htmlFor="name">Full Name</Label>
                                          <Input
                                                id="name"
                                                name="name"
                                                value={profile.name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter your full name"
                                          />
                                    </div>
                                    <div>
                                          <Label htmlFor="email">Email Address</Label>
                                          <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={profile.email}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="your.email@example.com"
                                          />
                                    </div>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                          <Label htmlFor="phone">Phone Number</Label>
                                          <Input
                                                id="phone"
                                                name="phone"
                                                value={profile.phone}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="+1 (555) 123-4567"
                                          />
                                    </div>
                                    <div>
                                          <Label htmlFor="country">Country of Residence</Label>
                                          <Input
                                                id="country"
                                                name="country"
                                                value={profile.country}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="United States"
                                          />
                                    </div>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                          <Label htmlFor="date_of_birth">Date of Birth</Label>
                                          <Input
                                                id="date_of_birth"
                                                name="date_of_birth"
                                                type="date"
                                                value={profile.date_of_birth}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                          />
                                    </div>
                                    <div>
                                          <Label htmlFor="frequent_traveler_number">Frequent Traveler Number</Label>
                                          <Input
                                                id="frequent_traveler_number"
                                                name="frequent_traveler_number"
                                                value={profile.frequent_traveler_number}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Your frequent flyer number"
                                          />
                                    </div>
                              </div>
                        </CardContent>
                  </Card>

                  {/* Travel Documents */}
                  <Card>
                        <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Travel Documents
                              </CardTitle>
                              <CardDescription>
                                    Passport and identification information
                              </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                              <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                          <Label htmlFor="passport_number">Passport Number</Label>
                                          <Input
                                                id="passport_number"
                                                name="passport_number"
                                                value={profile.passport_number}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter passport number"
                                          />
                                    </div>
                                    <div>
                                          <Label htmlFor="passport_expiry">Passport Expiry Date</Label>
                                          <Input
                                                id="passport_expiry"
                                                name="passport_expiry"
                                                type="date"
                                                value={profile.passport_expiry}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                          />
                                    </div>
                              </div>
                        </CardContent>
                  </Card>

                  {/* Travel Preferences */}
                  <Card>
                        <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    Travel Preferences
                              </CardTitle>
                              <CardDescription>
                                    Your preferred travel options and requirements
                              </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                              <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                          <Label htmlFor="preferred_airline">Preferred Airline</Label>
                                          <Input
                                                id="preferred_airline"
                                                name="preferred_airline"
                                                value={profile.preferred_airline}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="e.g., Delta, United, Emirates"
                                          />
                                    </div>
                                    <div>
                                          <Label htmlFor="seat_preference">Seat Preference</Label>
                                          <Input
                                                id="seat_preference"
                                                name="seat_preference"
                                                value={profile.seat_preference}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="e.g., Window, Aisle, Middle"
                                          />
                                    </div>
                              </div>

                              <div>
                                    <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
                                    <Textarea
                                          id="dietary_restrictions"
                                          name="dietary_restrictions"
                                          value={profile.dietary_restrictions}
                                          onChange={handleInputChange}
                                          disabled={!isEditing}
                                          placeholder="Any dietary restrictions or preferences"
                                          rows={3}
                                    />
                              </div>

                              <div>
                                    <Label htmlFor="medical_conditions">Medical Conditions</Label>
                                    <Textarea
                                          id="medical_conditions"
                                          name="medical_conditions"
                                          value={profile.medical_conditions}
                                          onChange={handleInputChange}
                                          disabled={!isEditing}
                                          placeholder="Any medical conditions we should be aware of"
                                          rows={3}
                                    />
                              </div>
                        </CardContent>
                  </Card>

                  {/* Emergency Contact */}
                  <Card>
                        <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                    <Phone className="w-5 h-5" />
                                    Emergency Contact
                              </CardTitle>
                              <CardDescription>
                                    Person to contact in case of emergency
                              </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                              <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                          <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                                          <Input
                                                id="emergency_contact_name"
                                                name="emergency_contact_name"
                                                value={profile.emergency_contact_name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Full name of emergency contact"
                                          />
                                    </div>
                                    <div>
                                          <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                                          <Input
                                                id="emergency_contact_phone"
                                                name="emergency_contact_phone"
                                                value={profile.emergency_contact_phone}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="+1 (555) 123-4567"
                                          />
                                    </div>
                              </div>
                        </CardContent>
                  </Card>
            </div>
      )
}