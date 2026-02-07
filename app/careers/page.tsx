import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Careers - We-Of-You Travel & Experiences",
  description: "Join the We-Of-You team. Explore career opportunities in travel and experiences.",
}

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="section-header mb-6">Careers at We-Of-You</h1>
          <p className="text-lg text-muted-foreground mb-8">
            We are always looking for talented people to join our team. If you are passionate about travel,
            customer service, and making journeys memorable, we would love to hear from you.
          </p>
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="subsection-header mb-4">Current Openings</h2>
              <p>
                Open positions will be listed here. Please check back regularly or get in touch to register
                your interest for future roles.
              </p>
            </section>
            <section>
              <h2 className="subsection-header mb-4">How to Apply</h2>
              <p>
                Send your CV and a short cover letter to our contact email. Specify the role or area you are
                interested in. We review applications and respond to shortlisted candidates.
              </p>
            </section>
          </div>
          <div className="mt-10">
            <Link href="/contact">
              <Button className="btn-primary">Get in Touch</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
