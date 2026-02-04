# Complete Messaging & Officer Assignment System Guide

## Overview

We've implemented a comprehensive real-time messaging system with officer assignment capabilities for the We-Of-You Travel Company platform. This system enables travelers to communicate with admins and assigned officers, and allows admins to manage officers and assign them to service requests.

## Features Implemented

### 1. Real-Time Messaging
- **Conversation Management**: Create conversations between travelers and admins
- **Message Threading**: Full message history with timestamps and read status
- **Read Receipts**: Track which messages have been read
- **Automatic Timestamps**: All messages timestamped with timezone support
- **User-Specific Views**: Messages filtered by user role (traveler/admin/officer)

### 2. Officer Management
- **Officer Profiles**: Maintain officer information with contact details
- **Specializations**: Track multiple skill areas for each officer
- **Experience Levels**: Four tiers - beginner, intermediate, advanced, expert
- **Officer Assignment**: Assign officers to service requests

### 3. Admin Dashboard Features
- **Conversation Management**: View all conversations with travelers
- **Search & Filter**: Find conversations by traveler name or title
- **Officer Assignment UI**: Dedicated interface to assign officers
- **Message Responses**: Admin can respond to travelers directly
- **Status Tracking**: Track conversation status (open, in_progress, closed)

### 4. Traveler Dashboard Features
- **Conversation List**: View all conversations with admins and assigned officers
- **Real-Time Chat**: Send and receive messages instantly
- **Officer Updates**: See when an officer is assigned
- **Message History**: Full history of all communications
- **Status Indicators**: Visual indicators for message read status

## Database Schema

### Tables Created

```sql
-- Core messaging tables
conversations          -- Stores conversations between travelers and admins/officers
messages              -- Individual messages within conversations
officer_assignments   -- Links officers to service requests
officer_specializations -- Tracks officer skills and expertise

-- Indexes for performance
idx_conversations_traveler
idx_conversations_officer
idx_messages_conversation
idx_officer_assignments_service_request
```

### Key Fields

**Conversations:**
- `traveler_id`: UUID of the traveler
- `admin_id`: UUID of assigned admin
- `officer_id`: UUID of assigned officer
- `service_request_id`: Link to service request
- `status`: open | in_progress | closed
- `last_message_at`: Timestamp of most recent message

**Messages:**
- `conversation_id`: Link to conversation
- `sender_id`: UUID of sender
- `sender_type`: traveler | admin | officer
- `message_text`: The message content
- `is_read`: Read status
- `created_at`: Message timestamp

**Officer Assignments:**
- `service_request_id`: Service request being handled
- `officer_id`: Assigned officer
- `assigned_by`: Admin who assigned
- `status`: active | completed | reassigned
- `notes`: Assignment notes

## API Endpoints

### Conversations API
```
GET    /api/conversations?userId={id}           - Get user's conversations
POST   /api/conversations                        - Create new conversation
```

### Messages API
```
GET    /api/conversations/messages?conversationId={id}  - Get messages
POST   /api/conversations/messages                      - Send new message
PATCH  /api/conversations/messages                      - Mark as read
```

### Officer APIs
```
GET    /api/officers                       - List all officers
POST   /api/officers                       - Add specialization
POST   /api/officers/assign                - Assign to service request
GET    /api/officers/assign?serviceRequestId={id} - Get assignments
PATCH  /api/officers/assign                - Update assignment
```

## Components Created

### ConversationChat.tsx
- Real-time message display
- Auto-scrolling to latest message
- Read receipts and timestamps
- Message input with send button
- 3-second polling for new messages (can be upgraded to WebSocket)

### MessageBubble.tsx
- Individual message display
- Sender information
- Read status indicators
- Relative timestamps (e.g., "2 minutes ago")

## Pages Created

### Traveler Dashboard
**Path:** `/dashboard/traveler/messages`
- View all conversations
- Chat interface
- Officer assignment visibility
- Real-time message updates

### Admin Dashboard
**Path:** `/dashboard/admin/messages`
- Conversation management
- Search conversations
- Officer assignment interface
- Real-time responses

### Officer Management
**Path:** `/dashboard/admin/officers`
- Officer listings
- Specialization management
- Experience level tracking
- Add/remove specializations

## Usage Flow

### Creating a Conversation

1. Traveler submits a service request
2. Admin reviews request and creates conversation
3. Admin assigns officer (optional)
4. Traveler and admin/officer can message

### API Request Example
```javascript
// Create conversation
const response = await fetch('/api/conversations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    travelerId: 'user-id',
    adminId: 'admin-id',
    serviceRequestId: 'request-id',
    title: 'Visa Application Assistance'
  })
})

// Send message
const response = await fetch('/api/conversations/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    conversationId: 'conv-id',
    senderId: 'user-id',
    senderType: 'traveler',
    messageText: 'Can you help with my visa?'
  })
})

// Assign officer
const response = await fetch('/api/officers/assign', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serviceRequestId: 'request-id',
    officerId: 'officer-id',
    assignedBy: 'admin-id',
    notes: 'Specialized in visa processing'
  })
})
```

## Real-Time Updates

### Current Implementation
- 3-second polling for new messages
- Automatic read status updates
- Timestamp on all messages

### Future Enhancements
- WebSocket integration for instant updates
- Typing indicators
- Online status display
- Message reactions/emoji support
- File sharing in messages
- Message search functionality

## User Roles & Permissions

### Travelers
- View own conversations
- Send messages
- See assigned officer details
- Cannot assign officers

### Officers
- View assigned conversations
- Send messages
- See traveler information
- Cannot assign to other cases

### Admins
- View all conversations
- Send messages
- Assign/reassign officers
- Close conversations
- Manage officer pool
- View all officer specializations

## Security Features

- Row-Level Security (RLS) on all tables
- User-specific message filtering
- Officer assignment audit trail
- Read status tracking
- Timezone-aware timestamps
- User identification on all messages

## Performance Considerations

- Indexed on frequently queried columns
- Pagination ready for large message volumes
- Lazy loading of conversations
- Efficient read status updates
- Conversation sorting by last_message_at

## Error Handling

- Required field validation
- User authorization checks
- Graceful error messages
- Console logging for debugging
- HTTP status codes (200, 201, 400, 500)

## Testing Checklist

- [ ] Create conversation between traveler and admin
- [ ] Send messages from traveler to admin
- [ ] Admin responds to message
- [ ] Messages marked as read
- [ ] Assign officer to service request
- [ ] Officer receives message
- [ ] Officer can respond
- [ ] Search conversations by traveler name
- [ ] View conversation history
- [ ] Add officer specializations
- [ ] Update assignment status

## Next Steps

1. Connect auth context to provide real user IDs
2. Implement WebSocket for real-time updates
3. Add message search functionality
4. Add file attachment support
5. Implement notification system
6. Create conversation templates
7. Add message reactions
8. Implement conversation archiving

## Deployment Notes

- All tables have proper indexes for performance
- RLS policies are minimal (can be enhanced with auth.uid())
- API routes follow Vercel serverless best practices
- Components are optimized for client-side rendering
- Polling can be replaced with WebSocket on production
