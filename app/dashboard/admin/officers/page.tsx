'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Users, Plus, Loader2, Mail, Phone } from 'lucide-react'

interface Officer {
  id: string
  full_name: string
  email: string
  phone: string
  avatar_url: string
  specializations: Array<{ id: string; specialization: string; experience_level: string }>
}

const SPECIALIZATIONS = [
  'Visa Processing',
  'Flight Booking',
  'Hotel Arrangements',
  'Travel Insurance',
  'Documentation',
  'Corporate Travel',
  'Safari Tours',
  'Adventure Planning'
]

const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert']

export default function OfficerManagementPage() {
  const [officers, setOfficers] = useState<Officer[]>([])
  const [loading, setLoading] = useState(true)
  const [addingSpecialization, setAddingSpecialization] = useState(false)
  const [selectedOfficer, setSelectedOfficer] = useState<string | null>(null)
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [selectedExperience, setSelectedExperience] = useState('intermediate')

  useEffect(() => {
    fetchOfficers()
  }, [])

  const fetchOfficers = async () => {
    try {
      const response = await fetch('/api/officers')
      if (!response.ok) throw new Error('Failed to fetch officers')
      const data = await response.json()
      setOfficers(data.officers || [])
    } catch (error) {
      console.error('[v0] Error fetching officers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSpecialization = async (officerId: string) => {
    if (!selectedSpecialization) return

    setAddingSpecialization(true)
    try {
      const response = await fetch('/api/officers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officerId,
          specialization: selectedSpecialization,
          experienceLevel: selectedExperience
        })
      })

      if (!response.ok) throw new Error('Failed to add specialization')

      // Update officer
      setOfficers(
        officers.map((officer) =>
          officer.id === officerId
            ? {
                ...officer,
                specializations: [
                  ...officer.specializations,
                  {
                    id: Math.random().toString(),
                    specialization: selectedSpecialization,
                    experience_level: selectedExperience
                  }
                ]
              }
            : officer
        )
      )

      setSelectedSpecialization('')
      setSelectedExperience('intermediate')
    } catch (error) {
      console.error('[v0] Error adding specialization:', error)
    } finally {
      setAddingSpecialization(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Officer Management</h1>
        <p className="text-muted-foreground">
          Manage officers, their specializations, and availability
        </p>
      </div>

      {/* Officers Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : officers.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No officers found</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {officers.map((officer) => (
            <Card key={officer.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{officer.full_name}</CardTitle>
                    <CardDescription className="flex flex-col gap-1 mt-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-xs">{officer.email}</span>
                      </div>
                      {officer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span className="text-xs">{officer.phone}</span>
                        </div>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Specializations */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-1">
                    {officer.specializations && officer.specializations.length > 0 ? (
                      officer.specializations.map((spec) => (
                        <Badge
                          key={spec.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {spec.specialization}
                          <span className="ml-1 text-xs opacity-70">
                            ({spec.experience_level})
                          </span>
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        No specializations added
                      </p>
                    )}
                  </div>
                </div>

                {/* Add Specialization */}
                {selectedOfficer === officer.id ? (
                  <div className="space-y-2 p-3 border rounded-lg bg-muted/30">
                    <Select
                      value={selectedSpecialization}
                      onValueChange={setSelectedSpecialization}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPECIALIZATIONS.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedExperience}
                      onValueChange={setSelectedExperience}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddSpecialization(officer.id)}
                        disabled={!selectedSpecialization || addingSpecialization}
                        className="flex-1 btn-primary"
                      >
                        {addingSpecialization ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          'Add'
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedOfficer(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setSelectedOfficer(officer.id)}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Specialization
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
