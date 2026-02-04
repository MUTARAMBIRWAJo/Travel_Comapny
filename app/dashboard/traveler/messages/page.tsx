'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConversationChat } from '@/components/ConversationChat'
import { MessageCircle, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Conversation {
  id: string
  title: string
  status: string
  created_at: string
  last_message_at: string | null
  admin: { full_name: string; email: string }
  officer: { full_name: string; email: string } | null
}

export default function TravelerMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId] = useState('user-id') // This should come from auth context

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

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Conversations</CardTitle>
            <Link href="/dashboard/traveler/requests">
              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                <Plus className="w-4 h-4" />
                New Request
              </Button>
            </Link>
          </div>
          <CardDescription>
            Messages with admin and assigned officers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No conversations yet.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Create a service request to start
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${selectedConversation === conv.id
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent hover:bg-muted'
                  }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {conv.title}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {conv.officer?.full_name || conv.admin?.full_name}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs whitespace-nowrap ${getStatusColor(
                      conv.status
                    )}`}
                  >
                    {conv.status}
                  </Badge>
                </div>
              </button>
            ))
          )}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
          <CardDescription>
            {selectedConversation
              ? 'Respond to your assigned officer or admin'
              : 'Select a conversation to start chatting'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedConversation ? (
            <ConversationChat
              conversationId={selectedConversation}
              userId={userId}
              userRole="traveler"
              onNewMessage={() => fetchConversations()}
            />
          ) : (
            <div className="flex items-center justify-center h-96 text-muted-foreground">
              <p>Select a conversation to begin</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
