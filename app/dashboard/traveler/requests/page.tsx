'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function TravelerRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/traveler/my-requests')
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (error) {
      console.log('[v0] Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusConfig = {
    pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
    approved: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Approved' },
    in_progress: { icon: Clock, color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
    rejected: { icon: AlertCircle, color: 'bg-red-100 text-red-800', label: 'Rejected' }
  }

  const getStatusConfig = (status: string) => statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">My Service Requests</h2>
        <p className="text-muted-foreground">View and manage your travel service requests</p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading your requests...</p>
          </CardContent>
        </Card>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">You haven&apos;t submitted any service requests yet</p>
              <Button className="btn-primary" onClick={() => window.location.href = '/request-service'}>
                Request a Service
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const statusCfg = getStatusConfig(request.status)
            const StatusIcon = statusCfg.icon

            return (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg capitalize">{request.service_type}</h3>
                        <Badge className={statusCfg.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusCfg.label}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Destination</p>
                          <p className="font-medium">{request.destination}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Travel Date</p>
                          <p className="font-medium">{new Date(request.travel_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Submitted</p>
                          <p className="font-medium">{new Date(request.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                      >
                        View Details
                      </Button>

                      {request.documents && request.documents.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {request.documents.length} Docs
                        </Button>
                      )}

                      {request.report_documents && request.report_documents.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200 bg-transparent"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Report
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

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>Request Details</CardTitle>
                <CardDescription>ID: {selectedRequest.id}</CardDescription>
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
              {/* Status */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">Current Status</p>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusConfig(selectedRequest.status).color}>
                    {getStatusConfig(selectedRequest.status).label}
                  </Badge>
                  <p className="text-sm text-blue-900">
                    {selectedRequest.status === 'pending' && 'Your request is being reviewed by our team'}
                    {selectedRequest.status === 'in_progress' && 'Your request is being processed'}
                    {selectedRequest.status === 'approved' && 'Your request has been approved!'}
                    {selectedRequest.status === 'rejected' && 'Your request was not approved'}
                  </p>
                </div>
              </div>

              {/* Request Info */}
              <div>
                <h3 className="font-semibold mb-3">Request Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Service Type</p>
                    <p className="capitalize">{selectedRequest.service_type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Destination</p>
                    <p>{selectedRequest.destination}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Travel Date</p>
                    <p>{new Date(selectedRequest.travel_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p>${selectedRequest.budget_usd?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Your Submitted Documents</h3>
                  <div className="space-y-2">
                    {selectedRequest.documents.map((doc: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">{doc.filename || 'Document'}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Report */}
              {selectedRequest.report_documents && selectedRequest.report_documents.length > 0 && (
                <div className="border-t pt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 text-green-900">Processing Report</h3>
                  <div className="space-y-2">
                    {selectedRequest.report_documents.map((doc: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-700" />
                          <span className="text-sm font-medium text-green-900">{doc.filename}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-green-700">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                className="btn-primary w-full"
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
