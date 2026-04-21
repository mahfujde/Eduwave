"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <>

      {/* Hero */}
      <section className="dark-gradient-bg py-16 md:py-20" style={{ background: "linear-gradient(135deg, #0F1B3F 0%, #1A2B5F 100%)" }}>
        <div className="container-custom text-center">
          <h1 className="text-white text-4xl font-extrabold">Privacy Policy</h1>
          <p className="mt-3 text-blue-100/60">Last updated: April 2026</p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom max-w-3xl">
          <div className="prose-eduwave">
            <h2>1. Introduction</h2>
            <p>
              Eduwave Educational Consultancy (&ldquo;Eduwave,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>theeduwave.com</strong> and use our educational consultancy services.
            </p>
            <p>
              By using our website or services, you agree to the collection and use of information in accordance with this policy. If you do not agree with this policy, please do not access our website.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>When you submit an inquiry, register for a consultation, or contact us, we may collect:</p>
            <ul>
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number and/or WhatsApp number</li>
              <li>Academic background and qualifications</li>
              <li>Preferred university and program of study</li>
              <li>Nationality and country of residence</li>
              <li>Financial documentation details (for visa guidance purposes only)</li>
              <li>Passport information (for visa processing assistance)</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>When you visit our website, we may automatically collect:</p>
            <ul>
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Pages visited, time spent, and navigation patterns</li>
              <li>Referring website or source</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li><strong>Service Delivery:</strong> To process university applications, provide admission guidance, visa consultation, and all complimentary services listed on our website</li>
              <li><strong>Communication:</strong> To respond to your inquiries, provide updates on your application status, and send relevant information about universities and programs</li>
              <li><strong>Improvement:</strong> To analyze website usage patterns and improve our services, website content, and user experience</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal requirements in Malaysia and Bangladesh</li>
              <li><strong>Marketing:</strong> With your consent, to send information about new university partnerships, scholarship opportunities, and educational resources</li>
            </ul>

            <h2>4. Information Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul>
              <li><strong>Partner Universities:</strong> To process your application and admission. We only share information necessary for your application with the universities you have expressed interest in.</li>
              <li><strong>Immigration Authorities:</strong> When required for visa processing on your behalf and with your explicit consent</li>
              <li><strong>Service Providers:</strong> Trusted third-party service providers who assist us in operating our website and delivering services (such as email service providers)</li>
              <li><strong>Legal Requirements:</strong> When required by law, regulation, legal process, or government request</li>
            </ul>
            <p>
              <strong>We do NOT sell, trade, or rent your personal information to third parties for marketing purposes.</strong>
            </p>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encrypted data transmission (SSL/TLS), secure server infrastructure, access controls, and regular security assessments.
            </p>
            <p>
              However, no method of transmission over the Internet is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. Application-related data is typically retained for a minimum of three (3) years after your last interaction with our services.
            </p>

            <h2>7. Cookies and Tracking</h2>
            <p>
              Our website uses cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files placed on your device. You can control cookies through your browser settings, though disabling cookies may affect website functionality.
            </p>
            <p>We use the following types of cookies:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for website operation</li>
              <li><strong>Analytics Cookies:</strong> Help us understand website usage (Google Analytics)</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
            </ul>

            <h2>8. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
            <ul>
              <li>Right to access your personal information</li>
              <li>Right to correct inaccurate or incomplete data</li>
              <li>Right to request deletion of your data</li>
              <li>Right to withdraw consent for marketing communications</li>
              <li>Right to request a copy of your data in a portable format</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at <a href="mailto:ceo.eduwave@gmail.com">ceo.eduwave@gmail.com</a>.
            </p>

            <h2>9. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites, including partner university websites and social media platforms. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party site you visit.
            </p>

            <h2>10. Children&apos;s Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we discover that we have inadvertently collected such information, we will take steps to delete it promptly.
            </p>

            <h2>11. International Data Transfers</h2>
            <p>
              As Eduwave operates from Malaysia and serves students from Bangladesh, your information may be transferred and processed in Malaysia and stored on servers located in Malaysia. By using our services, you consent to this transfer.
            </p>

            <h2>12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date. We encourage you to review this policy periodically. Continued use of our website after changes constitutes acceptance of the updated policy.
            </p>

            <h2>13. Contact Us</h2>
            <p>For questions about this Privacy Policy or to exercise your data rights, contact:</p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:ceo.eduwave@gmail.com">ceo.eduwave@gmail.com</a></li>
              <li><strong>WhatsApp:</strong> <a href="https://wa.me/601124103692">+60112-4103692</a> (Malaysia)</li>
              <li><strong>Office:</strong> Akhteruzzaman Center (7th Floor), 21/22, Agrabad CIA, Chattogram, Bangladesh</li>
            </ul>
          </div>

          <div className="mt-12 text-center">
            <Link href="/" className="btn-secondary">Back to Home</Link>
          </div>
        </div>
      </section>
    </>
  );
}
