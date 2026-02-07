import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-primary mb-4">We-Of-You</h3>
            <p className="text-muted-foreground text-sm">Your partner for seamless, sustainable travel management.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/packages" className="nav-link">
                  Packages
                </Link>
              </li>
              <li>
                <Link href="/services" className="nav-link">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="nav-link">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="nav-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="nav-link">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="nav-link">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="nav-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="nav-link">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/legal/travel-liability-disclaimer" className="nav-link">
                  Travel Liability Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/legal/data-protection-notice" className="nav-link">
                  Data Protection Notice
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies-policy" className="nav-link">
                  Cookies Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/corporate-travel-policy-template" className="nav-link">
                  Corporate Travel Policy Template
                </Link>
              </li>
              <li>
                <Link href="/legal/government-regulatory-notice" className="nav-link">
                  Government & Regulatory Notice
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2026 We-Of-You Travel & Experiences Ltd. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="nav-link text-sm">
              Twitter
            </a>
            <a href="#" className="nav-link text-sm">
              LinkedIn
            </a>
            <a href="#" className="nav-link text-sm">
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
