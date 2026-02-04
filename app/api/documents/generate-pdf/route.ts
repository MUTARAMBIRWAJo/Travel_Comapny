import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Simple HTML to PDF conversion (in production use a library like jsPDF or pdfkit)
function generatePdfContent(requestData: any, processingStatus: string): string {
  const date = new Date().toLocaleDateString()
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          h1 { color: #1a56db; border-bottom: 3px solid #1a56db; padding-bottom: 10px; }
          .section { margin: 30px 0; page-break-inside: avoid; }
          .section-title { font-size: 18px; font-weight: bold; color: #1a56db; margin-top: 20px; margin-bottom: 10px; }
          .content { background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 10px 0; }
          .field { display: flex; margin: 8px 0; }
          .label { font-weight: bold; width: 200px; }
          .value { flex: 1; }
          .status { padding: 10px 15px; border-radius: 5px; display: inline-block; font-weight: bold; }
          .status.approved { background: #d1fae5; color: #065f46; }
          .status.pending { background: #fef3c7; color: #92400e; }
          .status.in_progress { background: #dbeafe; color: #0c4a6e; }
          footer { border-top: 1px solid #d1d5db; margin-top: 40px; padding-top: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>Travel Service Request - Processing Report</h1>
        
        <div class="section">
          <div class="section-title">Request Information</div>
          <div class="content">
            <div class="field"><div class="label">Request ID:</div><div class="value">${requestData.id}</div></div>
            <div class="field"><div class="label">Service Type:</div><div class="value">${requestData.service_type}</div></div>
            <div class="field"><div class="label">Status:</div><div class="value"><span class="status ${requestData.status}">${requestData.status.replace('_', ' ').toUpperCase()}</span></div></div>
            <div class="field"><div class="label">Submitted:</div><div class="value">${new Date(requestData.created_at).toLocaleDateString()}</div></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Traveller Information</div>
          <div class="content">
            <div class="field"><div class="label">Name:</div><div class="value">${requestData.traveller_name}</div></div>
            <div class="field"><div class="label">Email:</div><div class="value">${requestData.traveller_email}</div></div>
            <div class="field"><div class="label">Phone:</div><div class="value">${requestData.traveller_phone || 'N/A'}</div></div>
            <div class="field"><div class="label">Country:</div><div class="value">${requestData.traveller_country}</div></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Travel Details</div>
          <div class="content">
            <div class="field"><div class="label">Destination:</div><div class="value">${requestData.destination}</div></div>
            <div class="field"><div class="label">Travel Date:</div><div class="value">${new Date(requestData.travel_date).toLocaleDateString()}</div></div>
            <div class="field"><div class="label">Budget (USD):</div><div class="value">$${requestData.budget_usd.toLocaleString()}</div></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Processing Status</div>
          <div class="content">
            <p>${processingStatus}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Next Steps</div>
          <div class="content">
            <p>Our travel experts will contact you within 2-3 business days with further details and requirements.</p>
            <p>Please keep your documents ready for submission if requested.</p>
          </div>
        </div>

        <footer>
          <p>Document generated on ${date}</p>
          <p>We-Of-You Travel Company - Travel, Built Around You</p>
        </footer>
      </body>
    </html>
  `
  return html
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceRequestId, processingStatus, adminNotes } = body

    // Fetch service request
    const { data: requestData, error: fetchError } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', serviceRequestId)
      .single()

    if (fetchError || !requestData) {
      return NextResponse.json(
        { error: 'Service request not found' },
        { status: 404 }
      )
    }

    // Generate PDF HTML
    const pdfHtml = generatePdfContent(requestData, processingStatus)

    // In production, use a PDF library to convert HTML to PDF
    // For now, we'll store the HTML and provide a link
    const timestamp = Date.now()
    const filename = `request-${serviceRequestId}-report-${timestamp}.pdf`
    const filepath = `service-reports/${serviceRequestId}/${filename}`

    // Store in database
    const { error: saveError } = await supabase
      .from('service_documents')
      .insert({
        service_request_id: serviceRequestId,
        document_path: filepath,
        document_type: 'report',
        uploaded_by: 'admin',
        filename,
        created_at: new Date().toISOString()
      })

    if (saveError) {
      console.log('[v0] Error saving report:', saveError)
      return NextResponse.json(
        { error: 'Failed to generate report' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      filePath: filepath,
      filename,
      html: pdfHtml, // Return HTML for client-side PDF generation
      message: 'Report generated successfully'
    }, { status: 201 })
  } catch (error) {
    console.log('[v0] Error in POST /api/documents/generate-pdf:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}
