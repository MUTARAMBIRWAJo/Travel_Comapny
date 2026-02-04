import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Privacy Policy - We-Of-You Travel & Experiences",
  description: "Privacy policy for We-Of-You Travel & Experiences Ltd",
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="section-header mb-8">Privacy Policy</h1>

          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="subsection-header mb-4">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, make a booking,
                or contact us. This includes name, email, phone number, payment information, and travel preferences.
              </p>
            </section>

            <section>
              <h2 className="subsection-header mb-4">2. How We Use Your Information</h2>
              <p>
                We use your information to provide, maintain, and improve our services, process transactions, send
                transactional emails, and comply with legal obligations.
              </p>
            </section>

            <section>
              <h2 className="subsection-header mb-4">3. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="subsection-header mb-4">4. Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal data. Please contact us at
                privacy@weofyou.com to exercise these rights.
              </p>
            </section>

            <section>
              <h2 className="subsection-header mb-4">5. Contact Us</h2>
              <p>If you have questions about this privacy policy, please contact us at privacy@weofyou.com</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
