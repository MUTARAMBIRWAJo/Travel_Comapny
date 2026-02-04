'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Download, Trash2, Send, FileCheck2 as FileCheckmark } from 'lucide-react'

export default function DocumentManagementPage() {
  const [selectedRequestId, setSelectedRequestId] = useState('')
  const [processingStatus, setProcessingStatus] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [documents, setDocuments] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('submitted')

  const handleGenerateReport = async () => {
    if (!selectedRequestId || !processingStatus) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/documents/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceRequestId: selectedRequestId,
          processingStatus,
          adminNotes
        })
      })

      if (response.ok) {
        const data = await response.json()
        alert('Report generated successfully!')

        // Download the PDF
        const link = document.createElement('a')
        link.href = `data:text/html;base64,${btoa(data.html)}`
        link.download = data.filename
        link.click()

        // Reset form
        setSelectedRequestId('')
        setProcessingStatus('')
        setAdminNotes('')
      }
    } catch (error) {
      console.log('[v0] Error generating report:', error)
      alert('Error generating report')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadDocument = async (docPath: string) => {
    try {
      const response = await fetch(`/api/documents/download?path=${encodeURIComponent(docPath)}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = docPath.split('/').pop() || 'document.pdf'
        a.click()
      }
    } catch (error) {
      console.log('[v0] Error downloading document:', error)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Document Management</h2>
        <p className="text-muted-foreground">Manage service request documents and generate reports</p>
      </div>

      <Tabs defaultValue="submitted" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="submitted">Submitted Documents</TabsTrigger>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="reports">Sent Reports</TabsTrigger>
        </TabsList>

        {/* Submitted Documents Tab */}
        <TabsContent value="submitted" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traveller Submitted Documents</CardTitle>
              <CardDescription>View and download documents uploaded by travellers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Document List */}
                <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 transition">
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">passport_copy_req_001.pdf</p>
                          <p className="text-xs text-muted-foreground">Request ID: req_001 • Traveller: John Doe</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generate Reports Tab */}
        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Processing Report</CardTitle>
              <CardDescription>Create and send PDF report to traveller with processing status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="request-id">Service Request ID *</Label>
                <Input
                  id="request-id"
                  placeholder="req_001"
                  value={selectedRequestId}
                  onChange={(e) => setSelectedRequestId(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="status">Processing Status *</Label>
                <select
                  id="status"
                  value={processingStatus}
                  onChange={(e) => setProcessingStatus(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">Select status...</option>
                  <option value="Your request has been approved. We will now proceed with the visa application process. Documents have been verified and are ready for submission.">Approved - Ready for Processing</option>
                  <option value="Your request is under review. Our team is verifying your documents and will contact you if any additional information is needed.">Pending - Under Review</option>
                  <option value="Additional documents are required to proceed. Please submit the following items within 5 business days.">More Documents Needed</option>
                  <option value="Your request has been processed. The visa has been approved by the relevant authorities.">Approved - Visa Granted</option>
                </select>
              </div>

              <div>
                <Label htmlFor="notes">Admin Notes (Optional)</Label>
                <textarea
                  id="notes"
                  placeholder="Add any additional notes for the traveller..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border rounded-md bg-background min-h-32"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  The report will be generated as a PDF and automatically sent to the traveller&apos;s email. They will receive a notification to download the report.
                </p>
              </div>

              <Button
                className="btn-primary gap-2 w-full"
                onClick={handleGenerateReport}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin">⏳</div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileCheckmark className="w-4 h-4" />
                    Generate & Send Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sent Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sent Reports</CardTitle>
              <CardDescription>Reports that have been generated and sent to travellers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 transition">
                      <div className="flex items-center gap-3 flex-1">
                        <FileCheckmark className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium">Processing_Report_req_00{i}.pdf</p>
                          <p className="text-xs text-muted-foreground">
                            Sent to: traveller{i}@example.com • {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Document Management Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="text-amber-900 space-y-2">
          <p>• Review all traveller documents before approving requests</p>
          <p>• Generate reports for each service request with clear status updates</p>
          <p>• Reports are automatically sent to traveller email addresses</p>
          <p>• Travellers can download reports from their account dashboard</p>
          <p>• Keep detailed notes for audit and reference purposes</p>
          <p>• All documents are securely stored in the system</p>
        </CardContent>
      </Card>
    </div>
  )
}
