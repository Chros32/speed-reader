import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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

        <h1 className="text-3xl font-bold mb-8">Terms of Use</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-[var(--foreground)]">
          <p className="text-[var(--muted)]">Last updated: February 2026</p>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-[var(--muted)]">
              By accessing or using Read Fast ("the Service"), you agree to be bound by these Terms of Use.
              If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Description of Service</h2>
            <p className="text-[var(--muted)]">
              Read Fast is a speed reading application that uses RSVP (Rapid Serial Visual Presentation)
              technology to help users read text content faster. The Service includes both free and
              premium subscription tiers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
            <p className="text-[var(--muted)]">
              You are responsible for maintaining the confidentiality of your account and subscription.
              You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Subscriptions and Payments</h2>
            <p className="text-[var(--muted)]">
              Read Fast Pro is available as a weekly ($1.99/week), annual ($19/year), or lifetime ($49 one-time)
              plan. The weekly plan includes a 3-day free trial. Weekly and annual subscriptions automatically
              renew unless cancelled before the end of the current billing period. The lifetime plan is a
              one-time payment that grants permanent access to all Pro features.
            </p>
            <p className="text-[var(--muted)] mt-2">
              You may cancel your subscription at any time through the Stripe customer portal.
              All paid plans include a 30-day money-back guarantee.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Acceptable Use</h2>
            <p className="text-[var(--muted)]">You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-[var(--muted)]">
              <li>Use the Service for any unlawful purpose</li>
              <li>Upload content that infringes on intellectual property rights</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with the proper functioning of the Service</li>
              <li>Share your subscription access with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">6. Content</h2>
            <p className="text-[var(--muted)]">
              You retain ownership of any content you upload to Read Fast. We do not store your
              uploaded documents on our servers beyond what is necessary to provide the Service.
              Text content is processed locally in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">7. Disclaimer of Warranties</h2>
            <p className="text-[var(--muted)]">
              The Service is provided "as is" without warranties of any kind, either express or implied.
              We do not guarantee that the Service will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
            <p className="text-[var(--muted)]">
              To the fullest extent permitted by law, Read Fast shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising out of your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
            <p className="text-[var(--muted)]">
              We reserve the right to modify these terms at any time. We will notify users of any
              material changes by posting the updated terms on this page. Your continued use of the
              Service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact</h2>
            <p className="text-[var(--muted)]">
              If you have any questions about these Terms of Use, please contact us at
              support@readfast.app.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
