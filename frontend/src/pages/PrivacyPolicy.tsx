import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export function PrivacyPolicy() {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-background font-sans text-foreground antialiased">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <Container className="max-w-3xl">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US")}
          </p>

          <div className="mt-10 space-y-10 text-muted-foreground [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
            <section>
              <h2>1. Introduction</h2>
              <p>
                Receivly (“we,” “us,” or “our”) is committed to protecting your privacy. This Privacy Policy describes how we collect, use, store, and disclose information when you use our invoicing and payment-tracking platform and related services. It applies to all users of our service, including visitors to our website and registered account holders. By using our services, you consent to the practices described in this policy.
              </p>
            </section>

            <section>
              <h2>2. Information We Collect</h2>
              <p>
                We collect information that you provide directly to us and information we obtain automatically when you use our services.
              </p>
              <p className="mt-3 font-medium text-foreground">Information you provide</p>
              <ul>
                <li>Account information: name, email address, password, and organization details</li>
                <li>Billing information: payment method details and billing address (processed by our payment providers)</li>
                <li>Business data: customer names and contact details, invoice content, payment terms, and notes that you enter into the platform</li>
                <li>Communications: messages you send to us (e.g., support requests or feedback)</li>
              </ul>
              <p className="mt-3 font-medium text-foreground">Information we collect automatically</p>
              <ul>
                <li>Usage data: how you use our platform (e.g., features used, actions taken)</li>
                <li>Device and log data: IP address, browser type, operating system, and access times</li>
                <li>Cookies and similar technologies: as described in the “Cookies and Tracking” section below</li>
              </ul>
            </section>

            <section>
              <h2>3. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Provide, operate, maintain, and improve our services</li>
                <li>Process transactions and send related information (e.g., invoices, reminders)</li>
                <li>Authenticate users and manage accounts</li>
                <li>Send administrative messages, security alerts, and support responses</li>
                <li>Comply with legal obligations and enforce our terms</li>
                <li>Analyze usage patterns to improve our product and user experience</li>
                <li>Communicate with you about updates, offers, and product information (where you have agreed or where permitted by law)</li>
              </ul>
              <p>
                We do not sell your personal information to third parties for their marketing purposes.
              </p>
            </section>

            <section>
              <h2>4. Data Retention</h2>
              <p>
                We retain your information for as long as your account is active or as needed to provide you services. We may retain certain information after account closure as required by law, for legitimate business purposes (e.g., resolving disputes, enforcing agreements), or in anonymized or aggregated form. Invoice and customer data you have created may be retained or deleted in accordance with your choices and our data retention schedule; we will inform you of applicable retention periods where relevant.
              </p>
            </section>

            <section>
              <h2>5. Sharing and Disclosure</h2>
              <p>
                We may share your information in the following circumstances:
              </p>
              <ul>
                <li>Service providers: with vendors who perform services on our behalf (e.g., hosting, analytics, payment processing), under contractual obligations to protect your data</li>
                <li>Legal compliance: when required by law, court order, or government request, or to protect our rights, safety, or property</li>
                <li>Business transfers: in connection with a merger, acquisition, or sale of assets, with notice and continued protection of your information as described in this policy</li>
                <li>With your consent: when you have given us permission to share your information for a specific purpose</li>
              </ul>
              <p>
                We do not share your business data (e.g., invoices, customers) with third parties for their marketing. Data is isolated per workspace as described in our product documentation.
              </p>
            </section>

            <section>
              <h2>6. Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. This includes encryption in transit and at rest where applicable, access controls, and regular review of our security practices. No method of transmission or storage is completely secure; we encourage you to use a strong password and to keep your login details confidential.
              </p>
            </section>

            <section>
              <h2>7. Your Rights</h2>
              <p>
                Depending on your location, you may have the right to:
              </p>
              <ul>
                <li>Access the personal information we hold about you</li>
                <li>Correct or update inaccurate information</li>
                <li>Request deletion of your personal information, subject to legal and operational requirements</li>
                <li>Object to or restrict certain processing of your information</li>
                <li>Data portability: receive a copy of your data in a structured, commonly used format</li>
                <li>Withdraw consent where processing is based on consent</li>
                <li>Lodge a complaint with a supervisory authority in your jurisdiction</li>
              </ul>
              <p>
                To exercise these rights, contact us at the email address below. We will respond in accordance with applicable law. You may also manage certain preferences (e.g., marketing communications) through your account settings.
              </p>
            </section>

            <section>
              <h2>8. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to operate our services, remember your preferences, analyze usage, and improve performance. You can control cookies through your browser settings; disabling certain cookies may affect the functionality of our platform. We may work with analytics providers that use cookies or similar technologies; our use of such data is governed by this policy.
              </p>
            </section>

            <section>
              <h2>9. Children’s Privacy</h2>
              <p>
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we learn that we have collected such information, we will take steps to delete it promptly.
              </p>
            </section>

            <section>
              <h2>10. International Transfers</h2>
              <p>
                Your information may be processed in countries other than your country of residence. We take steps to ensure that such transfers are subject to appropriate safeguards (e.g., standard contractual clauses or other mechanisms recognized by applicable law) so that your information remains protected in accordance with this Privacy Policy and applicable data protection laws.
              </p>
            </section>

            <section>
              <h2>11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website and updating the “Last updated” date, or by sending you an email or in-app notice where appropriate. Your continued use of our services after the effective date of changes constitutes acceptance of the revised policy. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2>12. Contact Us</h2>
              <p>
                For questions about this Privacy Policy or our privacy practices, please contact us at{" "}
                <a
                  href="mailto:privacy@receivly.com"
                  className="text-primary-600 underline underline-offset-4 hover:text-primary-700"
                >
                  privacy@receivly.com
                </a>
                .
              </p>
            </section>
          </div>

          <p className="mt-12">
            <Link
              to="/"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              ← Back to home
            </Link>
          </p>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
