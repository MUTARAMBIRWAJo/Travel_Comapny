"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConversationChat } from "@/components/ConversationChat"
import { MessageCircle, Plus, Loader2 } from "lucide-react"
import Link from "next/link"

interface Conversation {
  id: string
  title: string
  status: string
  created_at: string
  last_message_at: string | null
  admin?: { full_name: string; email: string }
  officer?: { full_name: string; email: string } | null
}

export default function AgentMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.id) setUserId(data.user.id)
      })
      .catch(() => {})
  }, [])

  const fetchConversations = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const response = await fetch(`/api/conversations?userId=${userId}`, { credentials: "include" })
      if (!response.ok) throw new Error("Failed to fetch conversations")
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error("[v0] Error fetching conversations:", error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) fetchConversations()
    else setLoading(false)
  }, [userId, fetchConversations])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Conversations</CardTitle>
            <Link href="/dashboard/agent/requests">
              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                <Plus className="w-4 h-4" />
                Requests
              </Button>
            </Link>
          </div>
          <CardDescription>Messages with travelers and admin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No conversations yet.</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedConversation === conv.id
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:bg-muted"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-sm truncate">{conv.title || "Conversation"}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(conv.status)}`}>
                    {conv.status}
                  </span>
                </div>
                {conv.last_message_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(conv.last_message_at).toLocaleDateString()}
                  </p>
                )}
              </button>
            ))
          )}
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
          <CardDescription>
            {selectedConversation ? "View and reply to messages" : "Select a conversation"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!userId ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>Loading session...</p>
            </div>
          ) : selectedConversation ? (
            <ConversationChat
              conversationId={selectedConversation}
              userId={userId}
              userRole="agent"
              onNewMessage={() => fetchConversations()}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mb-4" />
              <p>Select a conversation to view messages</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
