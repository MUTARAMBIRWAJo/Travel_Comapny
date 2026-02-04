'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { ConversationChat } from '@/components/ConversationChat'
import { MessageCircle, Plus, Loader2, Users } from 'lucide-react'

interface Conversation {
  id: string
  title: string
  status: string
  created_at: string
  last_message_at: string | null
  traveler: { full_name: string; email: string }
  officer: { full_name: string; email: string } | null
  service_request_id: string
}

interface Officer {
  id: string
  full_name: string
  email: string
  specializations: Array<{ specialization: string }>
}

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [officers, setOfficers] = useState<Officer[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [selectedOfficer, setSelectedOfficer] = useState<string>('')
  const [assigningOfficer, setAssigningOfficer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [userId] = useState('admin-id')

  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch(`/api/conversations?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch conversations')
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('[v0] Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const fetchOfficers = useCallback(async () => {
    try {
      const response = await fetch('/api/officers')
      if (!response.ok) throw new Error('Failed to fetch officers')
      const data = await response.json()
      setOfficers(data.officers || [])
    } catch (error) {
      console.error('[v0] Error fetching officers:', error)
    }
  }, [])

  useEffect(() => {
    fetchConversations()
    fetchOfficers()
  }, [fetchConversations, fetchOfficers])

  const handleAssignOfficer = async () => {
    if (!selectedConversation || !selectedOfficer) return

    setAssigningOfficer(true)
    try {
      const conv = conversations.find((c) => c.id === selectedConversation)
      if (!conv) return

      const response = await fetch('/api/officers/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceRequestId: conv.service_request_id,
          officerId: selectedOfficer,
          assignedBy: userId,
          notes: `Assigned to handle ${conv.title}`
        })
      })

      if (!response.ok) throw new Error('Failed to assign officer')

      // Update conversation with officer
      setConversations(
        conversations.map((c) =>
          c.id === selectedConversation
            ? {
              ...c,
              officer: officers.find((o) => o.id === selectedOfficer) || null
            }
            : c
        )
      )

      setSelectedOfficer('')
    } catch (error) {
      console.error('[v0] Error assigning officer:', error)
    } finally {
      setAssigningOfficer(false)
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.traveler.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const selectedConv = conversations.find((c) => c.id === selectedConversation)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Conversations
          </CardTitle>
          <CardDescription>All traveler inquiries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${selectedConversation === conv.id
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent hover:bg-muted'
                    }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm truncate">
                      {conv.traveler.full_name}
                    </h4>
                    <Badge
                      variant="outline"
                      className={`text-xs whitespace-nowrap ${getStatusColor(
                        conv.status
                      )}`}
                    >
                      {conv.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {conv.title}
                  </p>
                  {conv.officer && (
                    <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {conv.officer.full_name}
                    </p>
                  )}
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat and Officer Assignment */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Conversation Details</CardTitle>
          <CardDescription>
            {selectedConv ? `Chat with ${selectedConv.traveler.full_name}` : 'Select a conversation'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedConv && (
            <>
              {/* Officer Assignment Section */}
              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Assign Officer
                </h4>
                <div className="flex gap-2">
                  <Select value={selectedOfficer} onValueChange={setSelectedOfficer}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select an officer" />
                    </SelectTrigger>
                    <SelectContent>
                      {officers.map((officer) => (
                        <SelectItem key={officer.id} value={officer.id}>
                          {officer.full_name}
                          {officer.specializations && officer.specializations.length > 0
                            ? ` - ${officer.specializations[0].specialization}`
                            : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleAssignOfficer}
                    disabled={!selectedOfficer || assigningOfficer}
                    className="btn-primary"
                  >
                    {assigningOfficer ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {selectedConv.officer && (
                  <p className="text-sm text-green-600 mt-2">
                    Assigned to: {selectedConv.officer.full_name}
                  </p>
                )}
              </div>

              {/* Chat Component */}
              <ConversationChat
                conversationId={selectedConversation}
                userId={userId}
                userRole="admin"
                onNewMessage={() => fetchConversations()}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
