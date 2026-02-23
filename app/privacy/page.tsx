import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] mb-8"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-[var(--foreground)]">
          <p className="text-[var(--muted)]">Last updated: February 2025</p>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p className="text-[var(--muted)]">
              Read Fast ("we," "our," or "us") is committed to protecting your privacy. This Privacy
              Policy explains how we collect, use, and safeguard your information when you use our
              speed reading application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Information We Collect</h2>

            <h3 className="text-lg font-medium mt-4 mb-2">Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-1 text-[var(--muted)]">
              <li>Email address (when subscribing to Pro)</li>
              <li>Payment information (processed securely by Stripe)</li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-1 text-[var(--muted)]">
              <li>Usage data (reading speed preferences, document count)</li>
              <li>Device information (browser type, operating system)</li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">Information We Do NOT Collect</h3>
            <ul className="list-disc pl-6 space-y-1 text-[var(--muted)]">
              <li>The content of documents you read — all text processing happens locally in your browser</li>
              <li>Your uploaded files are not stored on our servers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-[var(--muted)]">We use your information to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-[var(--muted)]">
              <li>Provide and maintain the Service</li>
              <li>Process your subscription payments</li>
              <li>Send transactional emails (receipts, subscription updates)</li>
              <li>Improve and optimize the Service</li>
              <li>Respond to your support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Storage</h2>
            <p className="text-[var(--muted)]">
              Your preferences and subscription status are stored locally in your browser using
              localStorage. This means your data stays on your device. We use Stripe for payment
              processing, which stores payment information securely according to PCI-DSS standards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Third-Party Services</h2>
            <p className="text-[var(--muted)]">We use the following third-party services:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-[var(--muted)]">
              <li><strong>Stripe</strong> — for secure payment processing</li>
              <li><strong>Vercel</strong> — for hosting the application</li>
            </ul>
            <p className="text-[var(--muted)] mt-2">
              These services have their own privacy policies governing their use of your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">6. Cookies</h2>
            <p className="text-[var(--muted)]">
              Read Fast uses localStorage to store your preferences and subscription status.
              We do not use tracking cookies or third-party analytics cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">7. Your Rights</h2>
            <p className="text-[var(--muted)]">You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-[var(--muted)]">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Cancel your subscription at any time</li>
            </ul>
            <p className="text-[var(--muted)] mt-2">
              To exercise these rights, please contact us at support@readfast.app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">8. Data Security</h2>
            <p className="text-[var(--muted)]">
              We implement appropriate security measures to protect your information. However, no
              method of transmission over the Internet is 100% secure. We cannot guarantee absolute
              security of your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">9. Children's Privacy</h2>
            <p className="text-[var(--muted)]">
              The Service is not intended for children under 13 years of age. We do not knowingly
              collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">10. Changes to This Policy</h2>
            <p className="text-[var(--muted)]">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">11. Contact Us</h2>
            <p className="text-[var(--muted)]">
              If you have any questions about this Privacy Policy, please contact us at
              support@readfast.app.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
