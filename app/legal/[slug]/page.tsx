import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"

const LEGAL_PAGES: Record<string, { title: string; description: string }> = {
  "travel-liability-disclaimer": {
    title: "Travel Liability Disclaimer",
    description: "We-Of-You Travel & Experiences provides travel planning and assistance. Travel involves inherent risks. We are not liable for events outside our control including but not limited to visa refusals, flight changes, natural disasters, or government actions. Travelers are responsible for their own travel insurance and compliance with destination requirements.",
  },
  "data-protection-notice": {
    title: "Data Protection Notice",
    description: "We process your personal data in accordance with applicable data protection laws. We collect only what is necessary to provide our services, process bookings, and communicate with you. We do not sell your data. You have rights to access, correct, and request deletion of your data. For full details see our Privacy Policy.",
  },
  "cookies-policy": {
    title: "Cookies Policy",
    description: "Our website uses cookies to improve your experience, remember your preferences, and understand how the site is used. Essential cookies are required for the site to function. Optional cookies may be used for analytics. You can manage cookie preferences in your browser settings.",
  },
  "corporate-travel-policy-template": {
    title: "Corporate Travel Policy Template",
    description: "We can help your organization define or refine a corporate travel policy. Our template covers approval workflows, booking channels, expense limits, duty of care, and sustainability guidelines. Contact us for a tailored template for your company.",
  },
  "government-regulatory-notice": {
    title: "Government & Regulatory Notice",
    description: "We operate in compliance with applicable travel, tourism, and business regulations. Travelers are responsible for obtaining required visas, vaccinations, and complying with entry requirements of their destination. We provide assistance and information but do not guarantee approval by any government or authority.",
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = LEGAL_PAGES[slug]
  if (!page) return { title: "Page not found" }
  return {
    title: `${page.title} - We-Of-You Travel & Experiences`,
    description: page.description.slice(0, 160),
  }
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = LEGAL_PAGES[slug]
  if (!page) notFound()

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="section-header mb-8">{page.title}</h1>
          <div className="space-y-6 text-muted-foreground">
            <p className="text-lg">{page.description}</p>
            <p>
              For more information, please see our{" "}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> and{" "}
              <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a>, or{" "}
              <a href="/contact" className="text-primary hover:underline">contact us</a>.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
