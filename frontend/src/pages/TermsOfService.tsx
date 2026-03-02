import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export function TermsOfService() {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-background font-sans text-foreground antialiased">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <Container className="max-w-3xl">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Terms and Conditions
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US")}
          </p>

          <div className="mt-10 space-y-10 text-muted-foreground [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
            <section>
              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing or using the services provided by Receivly (“we,” “us,” or “our”), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you may not use our services. These terms apply to all users of our platform, including visitors, registered users, and organizations.
              </p>
            </section>

            <section>
              <h2>2. Description of Service</h2>
              <p>
                Receivly provides an invoicing and payment-tracking platform designed for small businesses. Our service allows you to create and send invoices, track payment status, set payment terms, and manage customer and invoice data through a web-based dashboard. We may update, suspend, or discontinue features with reasonable notice where practicable.
              </p>
            </section>

            <section>
              <h2>3. Account Registration and Eligibility</h2>
              <p>
                You must create an account to use certain features. You agree to provide accurate, current, and complete information during registration and to update such information as needed. You must be at least 18 years of age and have the authority to bind your organization (if applicable) to these terms. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.
              </p>
            </section>

            <section>
              <h2>4. Acceptable Use</h2>
              <p>
                You agree to use our services only for lawful purposes and in accordance with these terms. You may not:
              </p>
              <ul>
                <li>Use the service in any way that violates applicable laws or regulations</li>
                <li>Infringe on the intellectual property or other rights of others</li>
                <li>Transmit harmful, offensive, or fraudulent content</li>
                <li>Attempt to gain unauthorized access to our systems, other accounts, or third-party data</li>
                <li>Use the service to send spam or unsolicited communications</li>
                <li>Resell or sublicense the service without our prior written consent</li>
              </ul>
              <p>
                We reserve the right to suspend or terminate accounts that violate these requirements.
              </p>
            </section>

            <section>
              <h2>5. Fees and Payment</h2>
              <p>
                Certain features may be subject to fees as described on our pricing page or in your plan. You agree to pay all applicable fees when due. Fees are generally billed in advance (e.g., monthly or annually). We may change our fees with reasonable notice; continued use after a change constitutes acceptance. All fees are non-refundable unless otherwise stated or required by law.
              </p>
            </section>

            <section>
              <h2>6. Intellectual Property</h2>
              <p>
                We own all rights in our platform, including the software, design, branding, and content we provide. You receive a limited, non-exclusive, non-transferable license to use our services for your internal business use in accordance with these terms. You retain ownership of the data you upload (e.g., invoices, customer information). You grant us a license to use that data only as necessary to provide and improve our services and as described in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2>7. Disclaimer of Warranties</h2>
              <p>
                Our services are provided “as is” and “as available.” To the fullest extent permitted by law, we disclaim all warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the service will be uninterrupted, error-free, or free of harmful components.
              </p>
            </section>

            <section>
              <h2>8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, we and our affiliates, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, data, or business opportunities, arising out of or related to your use of our services. Our total liability for any claims arising from or related to these terms or the service shall not exceed the amount you paid us in the twelve (12) months preceding the claim, or one hundred dollars (100 USD), whichever is greater.
              </p>
            </section>

            <section>
              <h2>9. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Receivly and its affiliates, officers, directors, employees, and agents from and against any claims, damages, losses, liabilities, and expenses (including reasonable legal fees) arising out of or related to your use of the service, your violation of these terms, or your violation of any third-party rights or applicable law.
              </p>
            </section>

            <section>
              <h2>10. Termination</h2>
              <p>
                You may close your account at any time through your account settings or by contacting us. We may suspend or terminate your access to the service at any time, with or without cause or notice, including for violation of these terms. Upon termination, your right to use the service ceases immediately. Provisions that by their nature should survive (including intellectual property, disclaimers, limitation of liability, and indemnification) will survive termination.
              </p>
            </section>

            <section>
              <h2>11. Governing Law and Disputes</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Receivly operates, without regard to its conflict of law provisions. Any dispute arising from these terms or the service shall be resolved in the courts of that jurisdiction, and you consent to the personal jurisdiction of such courts.
              </p>
            </section>

            <section>
              <h2>12. Changes to Terms</h2>
              <p>
                We may modify these Terms and Conditions from time to time. We will notify you of material changes by posting the updated terms on our website and updating the “Last updated” date, or by sending you an email or in-app notice where appropriate. Your continued use of the service after the effective date of changes constitutes acceptance of the revised terms. If you do not agree, you must stop using the service.
              </p>
            </section>

            <section>
              <h2>13. Contact</h2>
              <p>
                For questions about these Terms and Conditions, please contact us at{" "}
                <a
                  href="mailto:startwithleo@gmail.com"
                  className="text-primary-600 underline underline-offset-4 hover:text-primary-700"
                >
                  startwithleo@gmail.com
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
              ← Back
            </Link>
          </p>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
