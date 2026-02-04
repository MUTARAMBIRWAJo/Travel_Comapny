import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Terms & Conditions - We-Of-You Travel & Experiences",
  description: "Terms and conditions for We-Of-You Travel & Experiences Ltd",
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="section-header mb-8">Terms & Conditions</h1>

          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="subsection-header mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using We-Of-You Travel & Experiences, you accept and agree to be bound by the terms and
                provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="subsection-header mb-4">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on
                We-Of-You&apos;s web site for personal, non-commercial transitory viewing only. This is the grant of a
                license, not a transfer of title.
              </p>
            </section>

            <section>
              <h2 className="subsection-header mb-4">3. Disclaimer</h2>
              <p>
                The materials on We-Of-You&apos;s web site are provided &quot;as is&quot;. We-Of-You makes no warranties, expressed or
                implied, and hereby disclaims and negates all other warranties including, without limitation, implied
                warranties or conditions of merchantability, fitness for a particular purpose.
              </p>
            </section>

            <section>
              <h2 className="subsection-header mb-4">4. Limitations</h2>
              <p>
                In no event shall We-Of-You or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on We-Of-You&apos;s web site.
              </p>
            </section>

            <section>
              <h2 className="subsection-header mb-4">5. Accuracy of Materials</h2>
              <p>
                The materials appearing on We-Of-You&apos;s web site could include technical, typographical, or photographic
                errors. We-Of-You does not warrant that any of the materials on our web site are accurate, complete, or
                current.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
