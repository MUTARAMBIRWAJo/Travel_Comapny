'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Clock, AlertCircle, FileText, Download, MessageSquare } from 'lucide-react'
import { ConversationChat } from '@/components/ConversationChat'
import { IntelligenceSummary } from '@/components/intelligence-summary'

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [conversationLoading, setConversationLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null)
  const [unreadByRequest, setUnreadByRequest] = useState<Record<string, number>>({})

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/service-requests?status=${filter === 'all' ? '' : filter}`)
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (error) {
      console.log('[v0] Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const statusConfig = {
    draft: { icon: Clock, color: 'bg-slate-100 text-slate-800', label: 'Draft' },
    submitted: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Submitted' },
    approved: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Approved' },
    fulfilled: { icon: CheckCircle, color: 'bg-blue-100 text-blue-800', label: 'Fulfilled' },
    completed: { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-800', label: 'Completed' },
    cancelled: { icon: AlertCircle, color: 'bg-red-100 text-red-800', label: 'Cancelled' },
  }

  const getStatusConfig = (status: string) => statusConfig[status as keyof typeof statusConfig] || statusConfig.submitted

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true
    return req.status === filter
  })

  const loadCurrentUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session')
      if (!response.ok) return
      const data = await response.json()
      if (data?.user?.id) {
        setCurrentUser({ id: data.user.id, role: data.user.role || 'admin' })
      }
    } catch (error) {
      console.log('[v0] Error loading session:', error)
    }
  }, [])

  useEffect(() => {
    loadCurrentUser()
  }, [loadCurrentUser])

  const loadUnreadCounts = useCallback(async () => {
    if (!currentUser?.id) return
    try {
      const response = await fetch(`/api/conversations?userId=${currentUser.id}&includeUnread=1`)
      const data = await response.json()
      if (!response.ok) return

      const counts: Record<string, number> = {}
        ; (data.conversations || []).forEach((conversation: any) => {
          if (conversation.service_request_id) {
            counts[conversation.service_request_id] = conversation.unread_count || 0
          }
        })
      setUnreadByRequest(counts)
    } catch (error) {
      console.log('[v0] Error loading unread counts:', error)
    }
  }, [currentUser?.id])

  useEffect(() => {
    loadUnreadCounts()
  }, [loadUnreadCounts])

  const updateRequestStatus = async (requestId: string, action: 'approve' | 'reject' | 'fulfill', nextStatus?: string) => {
    setActionLoading(true)
    try {
      const rejectionReason = action === 'reject' ? window.prompt('Rejection reason (optional):') : undefined
      const response = await fetch('/api/service-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: requestId,
          action: action === 'fulfill' ? undefined : action,
          status: action === 'fulfill' ? nextStatus : undefined,
          rejectionReason: rejectionReason || undefined,
          actorId: currentUser?.id || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data?.error || 'Failed to update request')
        return
      }

      await fetchRequests()
    } catch (error) {
      console.log('[v0] Error updating request:', error)
      alert('Failed to update request')
    } finally {
      setActionLoading(false)
    }
  }

  const ensureConversation = useCallback(async (requestId: string, travelerId?: string | null) => {
    if (!currentUser?.id) return
    setConversationLoading(true)
    try {
      const existingResp = await fetch(`/api/conversations?serviceRequestId=${requestId}`)
      const existingData = await existingResp.json()
      if (existingResp.ok && existingData?.conversation?.id) {
        setConversationId(existingData.conversation.id)
        return
      }

      const createResp = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelerId,
          adminId: currentUser.id,
          serviceRequestId: requestId,
          title: `Service Request #${requestId.slice(0, 8)}`,
        }),
      })
      const created = await createResp.json()
      if (createResp.ok && created?.conversation?.id) {
        setConversationId(created.conversation.id)
      }
    } catch (error) {
      console.log('[v0] Error loading conversation:', error)
    } finally {
      setConversationLoading(false)
    }
  }, [currentUser?.id])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Service Requests</h2>
        <p className="text-muted-foreground">Manage travel service requests and applications from users</p>
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" onValueChange={setFilter}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({requests.filter(r => r.status === 'draft').length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({requests.filter(r => r.status === 'submitted').length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({requests.filter(r => r.status === 'approved').length})</TabsTrigger>
          <TabsTrigger value="fulfilled">Fulfilled ({requests.filter(r => r.status === 'fulfilled').length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({requests.filter(r => r.status === 'completed').length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({requests.filter(r => r.status === 'cancelled').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Loading requests...</p>
              </CardContent>
            </Card>
          ) : filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No service requests found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const statusConfig = getStatusConfig(request.status)
                const StatusIcon = statusConfig.icon

                return (
                  <Card key={request.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{request.service_type}</h3>
                            <Badge className={statusConfig.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Traveller Name</p>
                              <p className="font-medium">{request.traveller_name}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Email</p>
                              <p className="font-medium">{request.traveller_email}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Destination</p>
                              <p className="font-medium">{request.destination}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Travel Date</p>
                              <p className="font-medium">{new Date(request.travel_date).toLocaleDateString()}</p>
                            </div>
                          </div>

                          {request.description && (
                            <div className="pt-2">
                              <p className="text-sm text-muted-foreground">Description</p>
                              <p className="text-sm">{request.description}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request)
                              setConversationId(null)
                              if (request.id) {
                                ensureConversation(request.id, request.user_id)
                              }
                            }}
                            className="w-full sm:w-auto"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Details
                          </Button>

                          {unreadByRequest[request.id] > 0 && (
                            <Badge className="bg-blue-100 text-blue-800 w-fit">
                              {unreadByRequest[request.id]} unread
                            </Badge>
                          )}

                          {request.documents && request.documents.length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto bg-transparent"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              {request.documents.length} Docs
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>{selectedRequest.service_type}</CardTitle>
                <CardDescription>Request ID: {selectedRequest.id}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRequest(null)}
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Traveller Info */}
              <div>
                <h3 className="font-semibold mb-3">Traveller Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p>{selectedRequest.traveller_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p>{selectedRequest.traveller_email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p>{selectedRequest.traveller_phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Country</p>
                    <p>{selectedRequest.traveller_country}</p>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Request Details</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Destination</p>
                    <p>{selectedRequest.destination}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Travel Date</p>
                    <p>{new Date(selectedRequest.travel_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Budget (USD)</p>
                    <p>${selectedRequest.budget_usd}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p>{selectedRequest.status}</p>
                  </div>
                </div>
              </div>

              {/* Intelligence Summary */}
              <IntelligenceSummary
                request={{
                  id: selectedRequest.id,
                  destination: selectedRequest.destination,
                  travel_date: selectedRequest.travel_date,
                  budget_usd: selectedRequest.budget_usd,
                  user_id: selectedRequest.user_id,
                  company_id: selectedRequest.company_id,
                }}
              />

              {/* Documents */}
              {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Uploaded Documents</h3>
                  <div className="space-y-2">
                    {selectedRequest.documents.map((doc: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">{doc.file_name || doc.filename}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="border-t pt-4 flex flex-wrap gap-2">
                <Button
                  className="btn-primary"
                  onClick={() => updateRequestStatus(selectedRequest.id, 'approve')}
                  disabled={actionLoading || selectedRequest.status !== 'submitted'}
                >
                  Approve Request
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateRequestStatus(selectedRequest.id, 'fulfill', 'fulfilled')}
                  disabled={actionLoading || selectedRequest.status !== 'approved'}
                >
                  Mark Fulfilled
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateRequestStatus(selectedRequest.id, 'fulfill', 'completed')}
                  disabled={actionLoading || selectedRequest.status !== 'fulfilled'}
                >
                  Mark Completed
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => updateRequestStatus(selectedRequest.id, 'reject')}
                  disabled={actionLoading || selectedRequest.status === 'cancelled'}
                >
                  Cancel
                </Button>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold">Messages</h3>
                </div>
                {conversationLoading ? (
                  <p className="text-sm text-muted-foreground">Loading conversation...</p>
                ) : conversationId && currentUser ? (
                  <ConversationChat
                    conversationId={conversationId}
                    userId={currentUser.id}
                    userRole={currentUser.role}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">No conversation available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
