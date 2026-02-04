'use client'

import { formatDistanceToNow } from 'date-fns'
import { CheckCheck, Check } from 'lucide-react'

interface MessageBubbleProps {
  message: {
    id: string
    message_text: string
    sender_type: string
    is_read: boolean
    created_at: string
    sender?: {
      id: string
      full_name: string
      email: string
      role: string
    }
  }
  isOwn: boolean
  currentUserRole: string
}

export function MessageBubble({ message, isOwn, currentUserRole }: MessageBubbleProps) {
  const senderName = message.sender?.full_name || 'Unknown User'
  const roleLabel = message.sender?.role === 'officer' ? '(Officer)' : 
                   message.sender?.role === 'admin' ? '(Admin)' : 
                   '(Traveler)'

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`flex flex-col max-w-sm ${
          isOwn
            ? 'items-end'
            : 'items-start'
        }`}
      >
        {!isOwn && (
          <p className="text-xs font-semibold text-muted-foreground mb-1">
            {senderName} {roleLabel}
          </p>
        )}
        <div
          className={`px-4 py-3 rounded-lg ${
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-none'
              : 'bg-muted text-foreground rounded-bl-none'
          }`}
        >
          <p className="text-sm break-words">{message.message_text}</p>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <span>
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </span>
          {isOwn && (
            <>
              {message.is_read ? (
                <CheckCheck className="w-3 h-3 text-blue-500" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
