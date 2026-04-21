"use client";

import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <>

      {/* Hero */}
      <section className="dark-gradient-bg py-16 md:py-20" style={{ background: "linear-gradient(135deg, #0F1B3F 0%, #1A2B5F 100%)" }}>
        <div className="container-custom text-center">
          <h1 className="text-white text-4xl font-extrabold">Terms of Service</h1>
          <p className="mt-3 text-blue-100/60">Last updated: April 2026</p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom max-w-3xl">
          <div className="prose-eduwave">
            <h2>1. Acceptance of Terms</h2>
            <p>
              Welcome to Eduwave Educational Consultancy. These Terms of Service (&ldquo;Terms&rdquo;) govern your use of our website <strong>theeduwave.com</strong> and our educational consultancy services. By accessing our website or engaging our services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our website or services.
            </p>

            <h2>2. About Our Services</h2>
            <p>
              Eduwave Educational Consultancy provides educational consultancy services to students from Bangladesh seeking admission to universities primarily in Malaysia and internationally. Our services include, but are not limited to:
            </p>
            <ul>
              <li>University selection and admission counselling</li>
              <li>Application processing and document preparation</li>
              <li>Visa consultation and application assistance</li>
              <li>Accommodation arrangement support</li>
              <li>Airport pickup coordination</li>
              <li>Medical check-up guidance</li>
              <li>University registration accompaniment</li>
              <li>Ongoing local guardian support in Malaysia</li>
              <li>24/7 virtual counselling</li>
            </ul>

            <h2>3. No-Fee Service Policy</h2>
            <p>
              <strong>All Eduwave consultancy services are provided free of charge to students.</strong> We do not charge consultation fees, processing fees, service fees, or any hidden costs. Our operations are funded through partnerships with our partner universities. This no-fee policy applies to all services listed on our website and in these Terms.
            </p>
            <p>
              Please note: While Eduwave&apos;s services are free, you are responsible for all university tuition fees, visa fees, accommodation costs, travel expenses, medical examination fees, and other costs directly associated with your education and living in Malaysia, which are paid directly to the respective institutions or service providers.
            </p>

            <h2>4. Eligibility</h2>
            <p>
              To use our services, you must be at least 16 years of age. If you are under 18, you must have the consent of a parent or legal guardian. By using our services, you represent and warrant that you meet these eligibility requirements.
            </p>

            <h2>5. User Responsibilities</h2>
            <p>When using our services, you agree to:</p>
            <ul>
              <li><strong>Provide Accurate Information:</strong> All personal, academic, and financial information you provide must be truthful, accurate, complete, and current. Providing false or misleading information may result in application rejection by universities or visa denial by immigration authorities, for which Eduwave bears no responsibility.</li>
              <li><strong>Cooperate in a Timely Manner:</strong> Respond promptly to requests for documents, information, or actions required for your application and visa processing.</li>
              <li><strong>Respect Deadlines:</strong> Adhere to university, visa, and other relevant deadlines communicated by our team.</li>
              <li><strong>Comply with Laws:</strong> Comply with all applicable laws and regulations of both Bangladesh and Malaysia.</li>
              <li><strong>Maintain Respectful Communication:</strong> Treat our staff and counsellors with respect and professionalism in all interactions.</li>
            </ul>

            <h2>6. No Guarantee of Admission or Visa Approval</h2>
            <p>
              While Eduwave provides expert guidance and support throughout the application and visa process, <strong>we do not and cannot guarantee</strong>:
            </p>
            <ul>
              <li>Admission to any university or program</li>
              <li>Approval of any student visa application</li>
              <li>Scholarship awards or financial aid</li>
              <li>Specific accommodation arrangements</li>
              <li>Any particular outcome of the application process</li>
            </ul>
            <p>
              Admission decisions are made solely by the universities, and visa decisions are made by the relevant immigration authorities. Eduwave acts in an advisory and assistance capacity only.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              All content on our website — including text, graphics, logos, images, videos, and software — is the property of Eduwave Educational Consultancy or its content suppliers and is protected by Malaysian and international copyright, trademark, and intellectual property laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, display, or create derivative works from any content on our website without our prior written permission.
            </p>

            <h2>8. Website Use Restrictions</h2>
            <p>You agree NOT to:</p>
            <ul>
              <li>Use our website for any unlawful purpose</li>
              <li>Attempt to access restricted areas of the website or systems</li>
              <li>Use automated systems, bots, or scraping tools on our website</li>
              <li>Post or transmit any harmful, threatening, or defamatory content</li>
              <li>Impersonate any person or entity or falsely represent your affiliation</li>
              <li>Interfere with the proper functioning of the website</li>
            </ul>

            <h2>9. Third-Party Links and Services</h2>
            <p>
              Our website may contain links to third-party websites, including university websites, social media platforms, and other resources. These links are provided for your convenience and information only. Eduwave does not endorse, control, or assume responsibility for the content, privacy policies, or practices of any third-party website.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, Eduwave Educational Consultancy shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to:
            </p>
            <ul>
              <li>Your use of or inability to use our website or services</li>
              <li>Any university&apos;s decision regarding your application</li>
              <li>Any immigration authority&apos;s decision regarding your visa</li>
              <li>Delays in processing caused by third parties</li>
              <li>Loss of documents by postal services or third parties</li>
              <li>Changes in university policies, tuition fees, or visa requirements</li>
              <li>Any personal loss, injury, or expense during travel or while residing abroad</li>
            </ul>

            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Eduwave Educational Consultancy, its founders, employees, and agents from any claims, damages, losses, liabilities, or expenses arising from your violation of these Terms, your misrepresentation, or your use of our services.
            </p>

            <h2>12. Modification of Terms</h2>
            <p>
              Eduwave reserves the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our website or services after any changes constitutes acceptance of the revised Terms. We encourage you to review these Terms periodically.
            </p>

            <h2>13. Termination</h2>
            <p>
              Eduwave may suspend or terminate your access to our services at any time if you breach these Terms or engage in conduct that we determine, in our sole discretion, to be harmful to Eduwave, its partners, or other students.
            </p>

            <h2>14. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Malaysia. Any disputes arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of Malaysia.
            </p>

            <h2>15. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>

            <h2>16. Contact Information</h2>
            <p>For questions or concerns about these Terms of Service, please contact:</p>
            <ul>
              <li><strong>Eduwave Educational Consultancy</strong></li>
              <li><strong>Email:</strong> <a href="mailto:ceo.eduwave@gmail.com">ceo.eduwave@gmail.com</a></li>
              <li><strong>WhatsApp:</strong> <a href="https://wa.me/601124103692">+60112-4103692</a> (Malaysia)</li>
              <li><strong>Office:</strong> Akhteruzzaman Center (7th Floor), 21/22, Agrabad CIA, Chattogram, Bangladesh</li>
              <li><strong>Website:</strong> <a href="https://theeduwave.com">theeduwave.com</a></li>
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
