'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Clock, AlertCircle, FileText, Download } from 'lucide-react'

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState<any>(null)

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
    pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    approved: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Approved' },
    rejected: { icon: AlertCircle, color: 'bg-red-100 text-red-800', label: 'Rejected' },
    in_progress: { icon: Clock, color: 'bg-blue-100 text-blue-800', label: 'In Progress' }
  }

  const getStatusConfig = (status: string) => statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true
    return req.status === filter
  })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Service Requests</h2>
        <p className="text-muted-foreground">Manage travel service requests and applications from users</p>
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" onValueChange={setFilter}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({requests.filter(r => r.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({requests.filter(r => r.status === 'approved').length})</TabsTrigger>
          <TabsTrigger value="in_progress">Processing ({requests.filter(r => r.status === 'in_progress').length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({requests.filter(r => r.status === 'rejected').length})</TabsTrigger>
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
                            onClick={() => setSelectedRequest(request)}
                            className="w-full sm:w-auto"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Details
                          </Button>

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

              {/* Documents */}
              {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Uploaded Documents</h3>
                  <div className="space-y-2">
                    {selectedRequest.documents.map((doc: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">{doc.filename}</span>
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
              <div className="border-t pt-4 flex gap-2">
                <Button className="btn-primary">Approve Request</Button>
                <Button variant="outline">Send to Processing</Button>
                <Button variant="destructive">Reject</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
