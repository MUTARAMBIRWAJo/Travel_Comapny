/**
 * Default legal content for CMS-managed legal pages.
 * Used when no published CMS version exists. Content is professional, neutral,
 * and does not claim legal certification or guarantee outcomes.
 * Last Updated: 2026-02-08
 */

export const LEGAL_PAGE_SLUGS = [
  "privacy-policy",
  "terms-and-conditions",
  "travel-liability-disclaimer",
  "data-protection-notice",
  "cookies-policy",
  "corporate-travel-policy-template",
  "government-regulatory-notice",
] as const

export type LegalSlug = (typeof LEGAL_PAGE_SLUGS)[number]

export interface LegalDefault {
  title: string
  seoTitle: string
  seoDescription: string
  content: string
}

export const LEGAL_DEFAULTS: Record<LegalSlug, LegalDefault> = {
  "privacy-policy": {
    title: "Privacy Policy",
    seoTitle: "Privacy Policy - We-Of-You Travel & Experiences",
    seoDescription: "How we collect, use, and protect your personal data when you use our travel services.",
    content: `
This Privacy Policy describes how We-Of-You Travel & Experiences Ltd ("we", "us", "our") collects, uses, and protects your personal information when you use our platform and services. We operate as an intermediary for travel-related services and do not provide legal advice.

**Information we collect**
We collect information you provide directly (name, email, phone, travel preferences, documents necessary for bookings) and technical data (IP address, browser type) to operate our services and improve the platform.

**How we use your information**
We use your information to process travel requests, communicate with you, comply with legal obligations, and improve our services. We do not sell your personal data to third parties.

**Data retention**
We retain your data for as long as necessary to fulfil the purposes described in this policy and to comply with applicable laws. You may request access, correction, or deletion of your data subject to legal and contractual constraints.

**Security**
We implement appropriate technical and organisational measures to protect your data. No method of transmission over the internet is 100% secure.

**Changes**
We may update this policy from time to time. The "Last Updated" date on this page will reflect the latest version.

**Disclaimer**
This document is for informational purposes. It does not constitute legal advice. We recommend that you seek independent legal advice for questions about your rights or our practices.
    `.trim(),
  },
  "terms-and-conditions": {
    title: "Terms & Conditions",
    seoTitle: "Terms & Conditions - We-Of-You Travel & Experiences",
    seoDescription: "Terms of use for our corporate travel management platform and services.",
    content: `
These Terms and Conditions ("Terms") govern your use of the We-Of-You Travel & Experiences Ltd platform and related services. By using our services, you agree to these Terms.

**Services**
We provide travel management, booking assistance, visa support, and related intermediary services. We do not operate airlines, hotels, or government visa offices. Our role is to facilitate and coordinate; actual travel and visa outcomes depend on third parties and applicable regulations.

**User obligations**
You agree to provide accurate information, comply with applicable laws, and use the platform only for lawful purposes. You are responsible for obtaining any required visas, vaccinations, and travel documents.

**Limitation of liability**
To the fullest extent permitted by law, we are not liable for indirect, incidental, or consequential damages, or for outcomes outside our control (including visa refusals, flight changes, or third-party actions). Our liability is limited as set out in our agreements and applicable law.

**Governing law**
These Terms are governed by the laws of Rwanda. Disputes are subject to the exclusive jurisdiction of the courts of Rwanda, save where otherwise required by mandatory law.

**Changes**
We may amend these Terms. Continued use after changes constitutes acceptance. Please review this page periodically.

**Disclaimer**
This is a summary of key terms. The full contractual terms may be set out in separate agreements. This document does not constitute legal advice. We recommend independent legal review.
    `.trim(),
  },
  "travel-liability-disclaimer": {
    title: "Travel Liability Disclaimer",
    seoTitle: "Travel Liability Disclaimer - We-Of-You Travel & Experiences",
    seoDescription: "Disclaimer of liability for travel risks and third-party services.",
    content: `
**Travel involves inherent risks.** We-Of-You Travel & Experiences Ltd acts as an intermediary between you and travel suppliers (airlines, hotels, visa authorities, etc.). We are not liable for:

- Visa refusals, delays, or decisions by any government or consulate
- Changes or cancellations by carriers, hotels, or other third parties
- Natural disasters, pandemics, political unrest, or other force majeure events
- Loss or damage to luggage, personal belongings, or documents
- Personal injury, illness, or other harm during travel
- Actions or omissions of third-party suppliers

You are responsible for obtaining adequate travel insurance, complying with destination requirements (visas, vaccinations, health regulations), and for your own conduct while travelling.

Our services are provided "as is" to the extent permitted by law. Nothing in this disclaimer excludes or limits liability that cannot be excluded or limited under applicable law.

**Recommendation:** Seek independent legal advice if you have questions about your rights or our liability.
    `.trim(),
  },
  "data-protection-notice": {
    title: "Data Protection Notice",
    seoTitle: "Data Protection Notice - We-Of-You Travel & Experiences",
    seoDescription: "How we process and protect your personal data in line with applicable data protection law.",
    content: `
We-Of-You Travel & Experiences Ltd processes your personal data in accordance with applicable data protection laws, including where relevant the GDPR for individuals in the European Union and the laws of Rwanda.

**Data controller**
We are the data controller for the personal data we collect in connection with our platform and services.

**Purposes and legal basis**
We process your data to perform our contract with you, to comply with legal obligations, and where appropriate for our legitimate interests (e.g. improving services, security). We may also process data with your consent where required.

**Your rights**
Depending on your location, you may have the right to: access your data, rectify inaccuracies, erase data in certain cases, restrict processing, object to processing, data portability, and to lodge a complaint with a supervisory authority. To exercise these rights, contact us using the details on our Contact page.

**International transfers**
Where we transfer data outside Rwanda or the EEA, we ensure appropriate safeguards are in place as required by law.

**Retention**
We retain personal data only for as long as necessary for the purposes described and in line with our retention policy and legal obligations.

**Disclaimer**
This notice is for information only and does not constitute legal advice. We recommend that you seek independent advice on your data protection rights.
    `.trim(),
  },
  "cookies-policy": {
    title: "Cookies Policy",
    seoTitle: "Cookies Policy - We-Of-You Travel & Experiences",
    seoDescription: "How we use cookies and similar technologies on our website.",
    content: `
This Cookies Policy explains how We-Of-You Travel & Experiences Ltd uses cookies and similar technologies on our website.

**What are cookies**
Cookies are small text files stored on your device when you visit our site. They help us provide, secure, and improve our services.

**Types we use**
- **Strictly necessary:** Required for the site to function (e.g. session, security). These do not require consent where the law allows.
- **Functional:** Remember your preferences (e.g. language, currency).
- **Analytics:** Help us understand how the site is used (e.g. page views). We use these in a way that respects your privacy.

**Your choices**
You can control or delete cookies via your browser settings. Disabling certain cookies may affect site functionality.

**Updates**
We may update this policy from time to time. The "Last Updated" date indicates the latest version.

**More information**
For details on how we use personal data, see our Privacy Policy and Data Protection Notice.

**Disclaimer**
This policy is for information only. It does not constitute legal advice.
    `.trim(),
  },
  "corporate-travel-policy-template": {
    title: "Corporate Travel Policy Template",
    seoTitle: "Corporate Travel Policy Template - We-Of-You Travel & Experiences",
    seoDescription: "Guidance and template structure for corporate travel policies.",
    content: `
We-Of-You Travel & Experiences Ltd can support your organisation in defining or refining a corporate travel policy. The following is a non-exhaustive template structure. It is not legal advice and should be reviewed by your legal, HR, and finance teams.

**Suggested sections**
1. **Scope:** Who the policy applies to (employees, contractors, etc.).
2. **Booking channel:** Use of approved agents or platforms (e.g. our platform) for consistency and duty of care.
3. **Approval workflow:** Who must approve trips, by value or type (e.g. line manager, finance).
4. **Spend and class:** Budget limits, class of travel, accommodation standards.
5. **Duty of care:** Emergency contacts, travel risk assessments, insurance requirements.
6. **Sustainability:** Carbon considerations, preferred options where feasible.
7. **Expenses and reimbursement:** Required documentation and compliance.

**Disclaimer**
We act as an intermediary and do not provide legal, tax, or HR advice. Your policy must be tailored to your organisation and jurisdiction. We recommend independent legal review before adoption.
    `.trim(),
  },
  "government-regulatory-notice": {
    title: "Government & Regulatory Compliance Notice",
    seoTitle: "Government & Regulatory Notice - We-Of-You Travel & Experiences",
    seoDescription: "Our approach to regulatory and government compliance in travel services.",
    content: `
We-Of-You Travel & Experiences Ltd operates in compliance with applicable travel, tourism, and business regulations in Rwanda and in the jurisdictions where we facilitate services. This notice is for general information only.

**Our role**
We are an intermediary. We assist with travel planning, visa application support, and bookings. We do not issue visas, operate flights, or guarantee approval by any government or authority. Visa and entry decisions are made solely by the relevant authorities.

**Rwanda**
We are based in Rwanda and comply with Rwandan law governing travel agencies and data protection. References to "regulations" in our materials are at a high level and do not constitute a full statement of applicable law.

**Your responsibilities**
Travellers are responsible for obtaining required visas, vaccinations, and complying with entry and exit requirements of each destination. Regulations change; we recommend checking official government sources before travel.

**No guarantee**
We do not promise regulatory immunity, visa approval, or any particular outcome from any government or regulatory body. Our services are subject to third-party terms and applicable law.

**Disclaimer**
This notice does not constitute legal or regulatory advice. For questions about your obligations or our compliance, we recommend independent legal advice.
    `.trim(),
  },
}
