# We-Of-You Travel Company - Business Logic Flows

## 1. Complete User Registration & Onboarding Flow

```
START: User visits https://domain.com
│
├─→ Browse homepage (/page.tsx)
│   ├─ View hero section with video background
│   ├─ Explore services (6 service cards with images)
│   ├─ View featured packages (3 packages with pricing)
│   └─ See currency converter (8 currencies)
│
├─→ Click "Get Travel Assistance" CTA
│   └─→ Redirected to /signup
│
├─→ Sign Up Form (/signup/page.tsx)
│   ├─ Input: Full Name
│   ├─ Input: Email (validated)
│   ├─ Input: Password (strength check)
│   ├─ Confirm Password
│   ├─ Role Selection Dropdown:
│   │   ├─ Individual Traveler (default)
│   │   ├─ Travel Agent
│   │   ├─ Corporate Client
│   │   ├─ Corporate Employee
│   │   └─ Administrator
│   └─ Submit Button
│
├─→ POST /api/auth/signup
│   ├─ Validate all fields
│   ├─ Check email uniqueness
│   ├─ Hash password with bcrypt
│   ├─ Create user record in database
│   ├─ Create user profile based on role
│   └─ Return success response
│
├─→ Redirect to /login with success=true
│   └─ Show success message
│
├─→ Login Page (/login/page.tsx)
│   ├─ Input: Email
│   ├─ Input: Password
│   └─ Submit Button
│
├─→ POST /api/auth/login
│   ├─ Validate email exists
│   ├─ Compare password with hash
│   ├─ Create session token
│   ├─ Store session in database
│   ├─ Determine user role
│   └─ Return user data + session
│
└─→ Role-Based Dashboard Redirect
    ├─ INDIVIDUAL_TRAVELER → /dashboard/traveler
    ├─ TRAVEL_AGENT → /dashboard/agent
    ├─ CORPORATE_CLIENT → /dashboard/corporate-client
    ├─ CORPORATE_EMPLOYEE → /dashboard/employee
    └─ ADMIN → /dashboard/admin

END: User logged in and on dashboard
```

---

## 2. Service Request Submission & Approval Flow

```
START: Traveler clicks "Request Service"
│
├─→ Navigate to /request-service/page.tsx
│   └─ Display 3-step wizard interface
│
├─→ STEP 1: Service Details
│   ├─ Select Service Type (Dropdown):
│   │   ├─ Visa Assistance
│   │   ├─ Flight Booking
│   │   ├─ Hotel Booking
│   │   ├─ Corporate Travel
│   │   └─ Custom Package
│   ├─ Enter Travel Destination
│   ├─ Select Travel Date (Calendar)
│   └─ Enter Budget (USD or Local Currency)
│
├─→ STEP 2: Personal Information
│   ├─ Full Name (required)
│   ├─ Email (required, validated)
│   ├─ Phone Number (optional)
│   ├─ Country of Residence
│   ├─ Travel Purpose (dropdown)
│   └─ Additional Notes (textarea)
│
├─→ STEP 3: Document Upload
│   ├─ DocumentUploader Component
│   ├─ Drag & drop PDF files
│   ├─ File validation:
│   │   ├─ Format: PDF only
│   │   ├─ Size: Max 10MB per file
│   │   └─ Multiple files allowed
│   ├─ Progress bar during upload
│   └─ List uploaded documents
│
├─→ Review & Submit
│   ├─ Display summary of all data
│   ├─ Show uploaded documents list
│   └─ Final confirmation button
│
├─→ POST /api/service-requests
│   ├─ Validate all required fields
│   ├─ Verify budget is numeric
│   ├─ Check documents exist
│   ├─ Create service_request record:
│   │   ├─ traveler_id: from session
│   │   ├─ service_type: selected type
│   │   ├─ destination: input value
│   │   ├─ travel_date: selected date
│   │   ├─ budget_usd: converted to USD
│   │   ├─ status: "pending"
│   │   ├─ created_at: current timestamp
│   │   └─ description: additional notes
│   │
│   ├─ Link documents:
│   │   └─ Create service_documents records for each file
│   │
│   ├─ Create service_request_processing record:
│   │   ├─ status_history: ["pending"]
│   │   ├─ current_step: 1
│   │   └─ admin_notes: ""
│   │
│   ├─ Send confirmation email to traveler
│   └─ Return request_id
│
├─→ Success Page (Step 4)
│   ├─ Display: "Request Submitted Successfully!"
│   ├─ Show Request ID (ticket number)
│   ├─ Show next steps
│   └─ CTA: "View Your Request" → /dashboard/traveler/requests
│
├─→ Email Notification
│   ├─ To: traveler email
│   ├─ Subject: "Your Travel Request #[ID] Received"
│   └─ Body: Request details + tracking link
│

ADMIN SIDE:
│
├─→ Admin logs in → /dashboard/admin
│   └─ Sees "5 New Service Requests" badge
│
├─→ Navigate to /dashboard/admin/service-requests
│   ├─ View table with all requests
│   ├─ Filter by status:
│   │   ├─ Pending (waiting for review)
│   │   ├─ In Progress (assigned to officer)
│   │   ├─ Approved (moving forward)
│   │   └─ Rejected (not proceeding)
│   └─ Sort by date (newest first)
│
├─→ Click Request → Modal Opens
│   ├─ Display traveler details
│   ├─ Show destination & budget
│   ├─ List uploaded documents (downloadable)
│   ├─ View request description
│   ├─ Show creation timestamp
│   │
│   ├─ ACTION SECTION:
│   │   ├─ Officer Assignment Dropdown:
│   │   │   └─ Select best-fit officer by specialization
│   │   │
│   │   ├─ Status Buttons:
│   │   │   ├─ "Approve" → changes status to "in_progress"
│   │   │   ├─ "More Info" → sends message to traveler
│   │   │   └─ "Reject" → status to "rejected" with reason
│   │   │
│   │   └─ Notes Section (add processing notes)
│   │
│   └─ Save Changes
│
├─→ POST /api/officers/assign
│   ├─ Create officer_assignment record:
│   │   ├─ request_id: service request ID
│   │   ├─ officer_id: selected officer
│   │   ├─ assigned_at: current timestamp
│   │   ├─ status: "active"
│   │   └─ notes: admin notes
│   │
│   └─ Create conversation between:
│       ├─ Officer ↔ Traveler
│       └─ Send notification to both parties
│
├─→ Status Update
│   ├─ PATCH service_request:
│   │   └─ status: "in_progress"
│   │
│   └─ Add to service_request_processing history:
│       ├─ timestamp: when status changed
│       ├─ changed_by: admin_id
│       ├─ old_status: "pending"
│       └─ new_status: "in_progress"
│
├─→ Email Notification to Traveler
│   ├─ To: traveler email
│   ├─ Subject: "Your Request #[ID] Has Been Assigned"
│   ├─ Body: Officer details + next steps
│   └─ CTA: "Chat with Officer"
│
└─→ Officer Receives Assignment
    ├─ Notification in /dashboard/agent
    ├─ New conversation appears
    └─ Can start communication with traveler

END: Service request approved and assigned
```

---

## 3. Real-Time Messaging & Officer Communication Flow

```
START: Traveler navigates to /dashboard/traveler/messages
│
├─→ Load Conversations List
│   ├─ GET /api/conversations (user_id filter)
│   ├─ Display list of active conversations:
│   │   ├─ With Admin
│   │   ├─ With Assigned Officer
│   │   └─ Sorted by last message timestamp
│   └─ Show unread message count badge
│
├─→ Click Conversation → Open Chat
│   ├─ Load ConversationChat Component
│   ├─ GET /api/conversations/messages?id=[conversation_id]
│   ├─ Display chat interface:
│   │   ├─ Message history (oldest → newest)
│   │   ├─ Message bubbles with:
│   │   │   ├─ Sender name
│   │   │   ├─ Message content
│   │   │   ├─ Timestamp
│   │   │   └─ Read receipt (checkmark)
│   │   │
│   │   ├─ MessageBubble Component:
│   │   │   ├─ Different styling for sent vs received
│   │   │   ├─ Highlight important info
│   │   │   └─ Show attachments if any
│   │   │
│   │   └─ Input Area:
│   │       ├─ Text input field
│   │       ├─ Send button
│   │       └─ Attachment button (ready)
│   │
│   └─ Auto-scroll to latest message
│
├─→ Traveler Types Message
│   └─ Real-time character count
│
├─→ Click Send
│   ├─ Validate message not empty
│   └─ POST /api/conversations/messages
│       ├─ Create message record:
│       │   ├─ conversation_id: current conversation
│       │   ├─ sender_id: traveler_id
│       │   ├─ message_content: text
│       │   ├─ sent_at: current timestamp
│       │   ├─ is_read: false
│       │   └─ read_at: null
│       │
│       └─ Return message with ID
│
├─→ Message Appears in Chat
│   ├─ Optimistic UI update (show immediately)
│   ├─ Mark as "sending..." with spinner
│   ├─ Once confirmed, remove spinner
│   └─ Add timestamp
│
├─→ Polling for New Messages (Every 3 seconds)
│   ├─ GET /api/conversations/messages?since=[last_timestamp]
│   ├─ Check for new messages from officer/admin
│   ├─ Auto-add to chat if found
│   └─ Update last_message_timestamp
│
├─→ Officer Receives Message
│   ├─ In /dashboard/admin/messages
│   ├─ Conversation shows unread badge
│   ├─ Open and view message
│   ├─ PATCH message with is_read=true
│   └─ Checkmark appears for traveler
│
├─→ Officer Replies
│   ├─ Types response
│   ├─ POST /api/conversations/messages
│   ├─ Message appears in their chat
│   └─ Traveler receives via polling
│
├─→ When Request Complete
│   ├─ Admin marks status as "completed"
│   ├─ Generates PDF report
│   ├─ Sends report via message
│   ├─ Marks conversation as resolved
│   └─ Archive option becomes available

END: Full conversation cycle complete
```

---

## 4. Document Management & PDF Generation Flow

```
START: Document Upload in /request-service
│
├─→ Step 3: Document Upload
│   ├─ DocumentUploader Component
│   ├─ User drags/drops PDF files
│   ├─ Client-side validation:
│   │   ├─ Check file type: application/pdf
│   │   ├─ Check file size: < 10MB
│   │   └─ Prevent duplicates
│   │
│   └─ Start Upload
│       └─ Show progress bar
│
├─→ POST /api/documents/upload
│   ├─ Server-side validation:
│   │   ├─ Verify MIME type
│   │   ├─ Scan file size
│   │   └─ Virus scan (ready for integration)
│   │
│   ├─ Generate unique file path:
│   │   └─ /service-docs/[request_id]/[timestamp]-[filename]
│   │
│   ├─ Upload to Supabase storage:
│   │   ├─ Use service_documents bucket
│   │   ├─ Set encryption enabled
│   │   └─ Return storage URL
│   │
│   ├─ Create database record:
│   │   ├─ service_documents table:
│   │   │   ├─ request_id: service request ID
│   │   │   ├─ document_type: passport, visa, etc
│   │   │   ├─ file_name: original filename
│   │   │   ├─ file_path: storage path
│   │   │   ├─ file_size: in bytes
│   │   │   ├─ uploaded_at: timestamp
│   │   │   ├─ uploaded_by: traveler_id
│   │   │   └─ is_verified: false
│   │   │
│   │   └─ service_request_processing:
│   │       └─ Add to audit trail
│   │
│   └─ Return success + document_id
│
├─→ Traveler Sees Upload Complete
│   ├─ Progress bar shows 100%
│   ├─ Document added to list
│   ├─ Show file name & size
│   └─ Option to remove if needed

ADMIN SIDE - Document Review:
│
├─→ Admin navigates to /dashboard/admin/documents
│   └─ Three tabs visible:
│       ├─ Submitted Documents
│       ├─ Generate Reports
│       └─ Sent Reports
│
├─→ Tab 1: Submitted Documents
│   ├─ Table showing all uploaded documents:
│   │   ├─ Document name
│   │   ├─ Request ID
│   │   ├─ Upload date
│   │   ├─ Uploaded by (traveler name)
│   │   ├─ Status (pending, verified, rejected)
│   │   │
│   │   └─ Actions:
│   │       ├─ Download button → GET /api/documents/[doc_id]
│   │       ├─ Preview button → Opens PDF viewer
│   │       ├─ Verify button → Mark as verified
│   │       └─ Reject button → Needs resubmission
│   │
│   ├─ Click Download
│   │   └─ File streamed with proper headers
│   │       ├─ Content-Type: application/pdf
│   │       ├─ Content-Disposition: attachment
│   │       └─ Log download in audit trail
│   │
│   └─ Log: [document_download] table records access
│       ├─ who_accessed: admin_id
│       ├─ document_id: doc ID
│       ├─ accessed_at: timestamp
│       └─ action: download

ADMIN SIDE - PDF Report Generation:
│
├─→ Tab 2: Generate Reports
│   ├─ Select service request from dropdown
│   ├─ Show traveler name & destination
│   ├─ Show current status
│   │
│   ├─ Form to generate report:
│   │   ├─ Status selection (Approved, In Progress, Needs Info, Rejected)
│   │   ├─ Officer notes (textarea)
│   │   ├─ Next steps description
│   │   ├─ Timeline/deadline
│   │   ├─ Required actions from traveler
│   │   └─ Signature field (admin signs PDF)
│   │
│   └─ "Generate PDF Report" button
│
├─→ POST /api/documents/generate-pdf
│   ├─ Fetch all request details
│   ├─ Fetch all related documents
│   ├─ Generate PDF using jsPDF library:
│   │   ├─ Header with company logo
│   │   ├─ Title: "Travel Service Status Report"
│   │   │
│   │   ├─ Section 1: Traveler Details
│   │   │   ├─ Name
│   │   │   ├─ Email
│   │   │   ├─ Phone
│   │   │   └─ Request ID
│   │   │
│   │   ├─ Section 2: Request Details
│   │   │   ├─ Service Type
│   │   │   ├─ Destination
│   │   │   ├─ Travel Date
│   │   │   ├─ Budget
│   │   │   └─ Original submitted date
│   │   │
│   │   ├─ Section 3: Document Review
│   │   │   ├─ List of documents received
│   │   │   └─ Verification status for each
│   │   │
│   │   ├─ Section 4: Current Status
│   │   │   └─ [APPROVED/IN PROGRESS/NEEDS INFO/REJECTED]
│   │   │
│   │   ├─ Section 5: Officer Notes
│   │   │   └─ Admin-provided notes
│   │   │
│   │   ├─ Section 6: Next Steps
│   │   │   └─ Detailed action items
│   │   │
│   │   ├─ Section 7: Timeline
│   │   │   └─ Expected completion date
│   │   │
│   │   └─ Footer with:
│   │       ├─ Generated date
│   │       ├─ Generated by (admin name)
│   │       └─ Company contact info
│   │
│   ├─ Save PDF to temporary storage
│   ├─ Create service_report record:
│   │   ├─ request_id
│   │   ├─ report_type: "status"
│   │   ├─ generated_at: timestamp
│   │   ├─ generated_by: admin_id
│   │   ├─ file_path: storage path
│   │   └─ status: "pending_send"
│   │
│   └─ Return download link
│
├─→ Admin sees success message
│   ├─ Option to Download (for own records)
│   ├─ Option to Send to Traveler
│   └─ Moved to "Sent Reports" tab

SEND TO TRAVELER:
│
├─→ Admin clicks "Send Report to Traveler"
│   ├─ Create message in conversation:
│   │   ├─ From: Admin
│   │   ├─ To: Traveler
│   │   ├─ Content: "Please find your status report attached"
│   │   ├─ Attachment: PDF file
│   │   └─ Type: automated message
│   │
│   ├─ Update service_report:
│   │   └─ status: "sent"
│   │   └─ sent_at: timestamp
│   │
│   ├─ Send email to traveler:
│   │   ├─ Subject: "Your Travel Service Status Report #[ID]"
│   │   ├─ Body: Status update + next steps
│   │   ├─ Attachment: PDF file
│   │   └─ CTA: "View in Dashboard"
│   │
│   └─ Log audit entry:
│       └─ [document_sent] - who, when, document_id

TRAVELER SIDE:
│
├─→ Traveler receives email notification
│   └─ Downloads PDF or views in dashboard
│
├─→ Navigate to /dashboard/traveler/requests
│   ├─ View service request
│   ├─ See new status from report
│   ├─ View report file in Documents section
│   ├─ Download button → GET /api/documents/[report_id]
│   └─ Preview PDF in browser
│
└─→ Download Logged
    ├─ Record in audit trail
    ├─ Track for compliance
    └─ Create activity log entry

END: Complete document lifecycle logged and secured
```

---

## 5. Currency Exchange & Pricing Flow

```
START: Admin manages currency rates
│
├─→ Admin navigates to /dashboard/admin/currency
│   ├─ Display current rates table:
│   │   ├─ Currency Code | Rate | Last Updated | Action
│   │   ├─ USD  | 1.00 | Feb 3 | Edit
│   │   ├─ RWF  | 1300 | Feb 3 | Edit
│   │   ├─ EUR  | 0.95 | Feb 3 | Edit
│   │   ├─ GBP  | 0.85 | Feb 3 | Edit
│   │   ├─ KES  | 135  | Feb 3 | Edit
│   │   ├─ UGX  | 4200 | Feb 3 | Edit
│   │   ├─ ZAR  | 18.5 | Feb 3 | Edit
│   │   └─ TZS  | 2650 | Feb 3 | Edit
│   │
│   └─ Information section:
│       ├─ Last auto-sync: [timestamp]
│       ├─ Data source: [Manual/API]
│       └─ Next update: [time]
│
├─→ Click Edit for currency
│   ├─ Modal opens
│   ├─ Input current exchange rate (vs USD)
│   ├─ Show previous rate for comparison
│   ├─ Calculate % change
│   ├─ Add notes (optional): "Market adjustment"
│   └─ Save button
│
├─→ POST /api/currency/rates
│   ├─ Validate rate is numeric & positive
│   ├─ Compare with previous rate:
│   │   ├─ Calculate % change
│   │   ├─ Flag if > 5% change
│   │   └─ Require admin confirmation
│   │
│   ├─ Update currency_rates table:
│   │   ├─ currency_code: code
│   │   ├─ rate_to_usd: exchange rate
│   │   ├─ updated_at: current timestamp
│   │   ├─ updated_by: admin_id
│   │   └─ notes: admin notes
│   │
│   ├─ Create audit log:
│   │   ├─ old_rate: previous value
│   │   ├─ new_rate: new value
│   │   ├─ % change: calculated
│   │   └─ timestamp: when changed
│   │
│   └─ Return success message
│
├─→ Update Success
│   ├─ Show new rate in table
│   ├─ Display "Updated X seconds ago"
│   └─ Toast notification: "Currency rate updated"

PUBLIC SIDE - Price Display:
│
├─→ User visits /packages
│   ├─ GET /api/currency/rates
│   ├─ Fetch all current rates
│   ├─ Cache rates (5-minute TTL)
│   └─ Pass to PriceDisplay component
│
├─→ PriceDisplay Component
│   ├─ Props:
│   │   ├─ priceUSD: 5000
│   │   └─ priceRWF: 6500000
│   │
│   ├─ Display dual pricing:
│   │   ├─ Primary: $5,000 USD
│   │   └─ Secondary: 6,500,000 RWF
│   │
│   └─ Localize formatting:
│       ├─ USD: $ prefix, comma separators
│       ├─ RWF: FRw prefix, comma separators
│       └─ All read-friendly

CURRENCY CONVERTER FEATURE:
│
├─→ Home page includes CurrencyConverter component
│   ├─ Input 1: Amount field
│   ├─ Input 2: "From" currency dropdown
│   ├─ Input 3: "To" currency dropdown
│   ├─ Swap button (↔)
│   └─ Output: Converted amount
│
├─→ User enters amount
│   ├─ Real-time calculation
│   ├─ convertCurrency function:
│   │   ├─ Get fromCurrency rate
│   │   ├─ Get toCurrency rate
│   │   ├─ Formula: (amount / fromRate) * toRate
│   │   └─ Format with proper decimals
│   │
│   └─ Display result immediately
│
├─→ User selects "To" currency
│   └─ Instant conversion shown
│
├─→ Click Swap Button
│   ├─ Exchange "From" ↔ "To"
│   ├─ Recalculate conversion
│   └─ Update display
│
└─→ User checks budget in local currency
    └─ Helps with travel planning

CHECKOUT/BOOKING FLOW:
│
├─→ User books package with price: $5,000
│   ├─ Select payment currency
│   ├─ System fetches current rate
│   ├─ Calculate local amount:
│   │   └─ $5,000 USD × 1300 (RWF rate) = 6,500,000 RWF
│   │
│   ├─ Display to user:
│   │   ├─ "Price: 6,500,000 RWF"
│   │   └─ "(Equivalent to $5,000 USD)"
│   │
│   ├─ Create invoice with:
│   │   ├─ amount_usd: 5000
│   │   ├─ amount_local: 6500000
│   │   ├─ currency_code: RWF
│   │   ├─ exchange_rate_used: 1300
│   │   ├─ rate_locked_at: current timestamp
│   │   └─ locked_for_days: 7 (rates don't change booking)
│   │
│   └─ Proceed to payment gateway

END: Complete currency flow from management to checkout
```

---

## 6. Analytics & Reporting Dashboard Flow

```
ADMIN ANALYTICS DASHBOARD (/dashboard/admin/analytics):

Automatic Data Aggregation (Every 30 seconds):
├─ Total Users Count
├─ Active Trips Count
├─ Total Revenue (USD)
├─ Completed Bookings
├─ Pending Requests
├─ Officer Workload (avg requests per officer)
├─ Customer Satisfaction Score
└─ Month-over-month growth %

Key Metrics Displayed:
├─ User Growth Trend Chart
│   ├─ X-axis: Last 30 days
│   ├─ Y-axis: New users registered
│   └─ Shows growth trajectory
│
├─ Revenue Chart
│   ├─ X-axis: Last 12 months
│   ├─ Y-axis: Revenue in USD
│   └─ Shows seasonal trends
│
├─ Service Request Status Pie Chart
│   ├─ Pending (blue)
│   ├─ Approved (green)
│   ├─ In Progress (orange)
│   ├─ Completed (checkmark green)
│   └─ Rejected (red)
│
├─ Top Destinations Bar Chart
│   ├─ Rank destinations by request count
│   ├─ Show request volume per destination
│   └─ Identify popular routes
│
├─ Officer Performance Leaderboard
│   ├─ Officer Name | Requests Completed | Avg Response Time | Rating
│   ├─ Sorted by completion count
│   └─ Identify top performers
│
└─ Customer Satisfaction Trends
    ├─ Monthly NPS scores
    ├─ Review sentiment analysis
    └─ Feedback themes

END: Real-time business intelligence available
```

---

## Summary

All business logic flows are:
✅ Well-defined and documented
✅ End-to-end from start to finish
✅ Include both user and system perspectives
✅ Show data persistence and verification
✅ Include error handling (not shown for brevity)
✅ Follow security best practices
✅ Production-ready implementation

The system is designed for scalability, security, and user experience.
