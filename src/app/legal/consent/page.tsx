'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function ConsentPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-parchment/80 backdrop-blur-sm rounded-2xl cabin-shadow parchment-texture border-2 border-wood-light/30 p-8 md:p-10">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="text-wood-medium hover:text-wood-dark text-sm flex items-center font-semibold transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-wood-dark mb-3">
              Consent Disclosure
            </h1>
            <p className="text-muted-foreground">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Purpose of This Disclosure</h2>
            <p className="text-gray-700 mb-4">
              This Consent Disclosure explains what information we collect when you use our bankruptcy assessment questionnaire, how we use that information, and your rights regarding your data. Please read this carefully before providing any information.
            </p>
            <div className="bg-wood-light/20 border-l-4 border-wood-dark p-6 mb-4 rounded">
              <p className="text-wood-dark">
                <strong>By submitting our questionnaire, you explicitly consent to the collection, use, and disclosure of your information as described in this document.</strong>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Required Information</h3>
            <p className="text-gray-700 mb-4">
              To provide you with preliminary bankruptcy guidance, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Contact Information:</strong> Your email address for communication</li>
              <li><strong>Location:</strong> Your state and optionally your county (Utah only for this service)</li>
              <li><strong>Household Information:</strong> Household size and marital status</li>
              <li><strong>Financial Snapshot:</strong> Income range, debt range, and employment status</li>
              <li><strong>Situation Details:</strong> Information about missed payments, wage garnishment, and property concerns</li>
              <li><strong>Additional Notes:</strong> Any additional information you choose to provide</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Optional Financial Account Information</h3>
            <p className="text-gray-700 mb-4">
              <strong>With your separate, explicit consent</strong>, we may access limited financial account information through Plaid, Inc. to provide more accurate assessments. This is entirely optional and you may skip this step.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-4">
              <p className="text-amber-900 font-semibold mb-2">Plaid Sandbox Notice</p>
              <p className="text-amber-800">
                Our current Plaid integration operates in Sandbox mode, which means it uses <strong>synthetic test data only</strong>. No real financial account information is accessed or stored. This is for demonstration and testing purposes.
              </p>
            </div>

            <p className="text-gray-700 mb-4">
              If you choose to connect your financial accounts through Plaid, we will access:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Transaction summaries:</strong> Aggregate income and expense data (not individual transactions)</li>
              <li><strong>Identity information:</strong> Name and contact information associated with accounts</li>
              <li><strong>Account balances:</strong> Current balance information</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We do <strong>NOT</strong> access or store:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Your account credentials or passwords</li>
              <li>Individual transaction details</li>
              <li>Social Security numbers</li>
              <li>Account numbers (except as provided by Plaid for identification)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information you provide to:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 mb-4 space-y-2">
              <li>
                <strong>Provide Preliminary Assessment:</strong> Evaluate your potential eligibility for bankruptcy relief based on Utah law
              </li>
              <li>
                <strong>Contact You:</strong> Reach out via email to discuss your situation and next steps
              </li>
              <li>
                <strong>Match You with an Attorney:</strong> Connect you with a qualified bankruptcy attorney in Utah
              </li>
              <li>
                <strong>Send Confirmation:</strong> Email you a confirmation that we received your information
              </li>
              <li>
                <strong>Improve Our Services:</strong> Analyze aggregate data to improve our questionnaire and services
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Minimum Necessary Principle</h2>
            <p className="text-gray-700 mb-4">
              We collect only the <strong>minimum information necessary</strong> to provide meaningful preliminary bankruptcy guidance. We do not request:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Your full name (only email for contact)</li>
              <li>Your physical address (only state/county for jurisdictional purposes)</li>
              <li>Your Social Security number</li>
              <li>Specific account numbers or creditor details</li>
              <li>Exact dollar amounts (we use ranges instead)</li>
            </ul>
            <p className="text-gray-700 mb-4">
              This approach protects your privacy while still allowing us to provide useful preliminary information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who Has Access to Your Information</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Internal Use</h3>
            <p className="text-gray-700 mb-4">
              Your information is accessed by:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Licensed attorneys at Lincoln Law</li>
              <li>Administrative staff necessary for processing your inquiry</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Service Providers</h3>
            <p className="text-gray-700 mb-4">
              We share limited information with trusted service providers who assist in operating our services:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Mailgun:</strong> Email delivery service (receives your email address and name)</li>
              <li><strong>Plaid:</strong> Financial data aggregation (only if you opt-in to connect accounts)</li>
              <li><strong>AWS (Amazon Web Services):</strong> Secure hosting infrastructure</li>
            </ul>
            <p className="text-gray-700 mb-4">
              These providers are contractually bound to protect your information and use it only for the purposes we specify.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">We Do NOT:</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Sell your information to third parties</li>
              <li>Share your information with marketers or advertisers</li>
              <li>Use your information for purposes unrelated to legal services</li>
              <li>Disclose your information without your consent (except as required by law)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Encryption:</strong> All data is encrypted in transit (TLS/SSL) and at rest</li>
              <li><strong>Access Controls:</strong> Strict access controls limit who can view your information</li>
              <li><strong>Secure Storage:</strong> Data is stored on secure, access-controlled servers</li>
              <li><strong>Logging:</strong> We maintain audit logs but redact personally identifiable information</li>
              <li><strong>Regular Security Reviews:</strong> Our systems are regularly assessed for vulnerabilities</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Special protections for Plaid data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Plaid access tokens are stored server-side only and never exposed to your browser</li>
              <li>Tokens are encrypted at rest</li>
              <li>We never log or store raw financial transaction data</li>
              <li>Only summary statistics are retained</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Consent and Rights</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">What You're Consenting To</h3>
            <p className="text-gray-700 mb-4">
              By checking the consent boxes and submitting the questionnaire, you consent to:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 mb-4 space-y-2">
              <li>Collection of the information described above</li>
              <li>Use of your information to provide preliminary bankruptcy assessments</li>
              <li>Storage of your information in accordance with our Privacy Policy</li>
              <li>Contact from Lincoln Law regarding your inquiry</li>
              <li>Sharing of information with service providers as described</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Your Rights</h3>
            <p className="text-gray-700 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Withdraw Consent:</strong> Contact us at any time to withdraw your consent</li>
              <li><strong>Access Your Data:</strong> Request a copy of the information we have about you</li>
              <li><strong>Correct Information:</strong> Request correction of inaccurate information</li>
              <li><strong>Delete Information:</strong> Request deletion of your information</li>
              <li><strong>Revoke Plaid Access:</strong> Disconnect your Plaid link at any time</li>
              <li><strong>Opt Out of Communications:</strong> Unsubscribe from our emails at any time</li>
            </ul>
            <p className="text-gray-700 mb-4">
              To exercise these rights, contact us at privacy@lincolnlaw.example.com or (123) 456-7890.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Disclaimers</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 border-l-4 border-gray-400 p-6">
                <p className="text-gray-900 font-semibold mb-2">No Attorney-Client Relationship</p>
                <p className="text-gray-700">
                  Submitting the questionnaire does NOT create an attorney-client relationship. An attorney-client relationship is formed only after you sign a formal engagement agreement with our firm.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-gray-400 p-6">
                <p className="text-gray-900 font-semibold mb-2">Informational Only</p>
                <p className="text-gray-700">
                  Any preliminary eligibility assessment we provide is <strong>informational only</strong> and does not constitute legal advice. Final determination of bankruptcy eligibility requires a detailed consultation with an attorney.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-gray-400 p-6">
                <p className="text-gray-900 font-semibold mb-2">No Guarantee of Results</p>
                <p className="text-gray-700">
                  Our preliminary assessments do not guarantee that you qualify for bankruptcy or predict the outcome of any legal proceedings. Individual circumstances vary significantly.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your information for as long as necessary to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Provide you with our services</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Resolve disputes</li>
              <li>Maintain an ongoing relationship with you</li>
            </ul>
            <p className="text-gray-700 mb-4">
              If you request deletion of your information, we will delete it within 30 days, except where retention is required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions or Concerns</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this consent disclosure or how we handle your information, please contact us:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-900 font-semibold mb-2">Lincoln Law</p>
              <p className="text-gray-700">Email: help@lincolnlaw.com</p>
              <p className="text-gray-700">Phone: (385) 438-8161</p>
              <p className="text-gray-700">Address: 921 West Center St., Orem, UT 84057</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Consent Acknowledgment</h2>
            <div className="bg-wood-light/20 border border-wood-medium/30 rounded-lg p-6">
              <p className="text-wood-dark mb-4">
                By checking the consent boxes in our questionnaire, you acknowledge that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You have read and understood this Consent Disclosure</li>
                <li>You have read and agree to our Privacy Policy and Terms of Service</li>
                <li>You voluntarily provide your information</li>
                <li>You consent to the collection, use, and disclosure of your information as described</li>
                <li>You understand this creates no attorney-client relationship</li>
                <li>You understand all assessments are informational only</li>
              </ul>
            </div>
          </section>
        </div>

          {/* Footer Navigation */}
          <div className="mt-12 pt-8 border-t border-wood-light/30">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link href="/legal/privacy" className="text-wood-medium hover:text-wood-dark font-semibold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className="text-wood-medium hover:text-wood-dark font-semibold transition-colors">
                Terms of Service
              </Link>
              <Link href="/faq" className="text-wood-medium hover:text-wood-dark font-semibold transition-colors">
                FAQ
              </Link>
              <Link href="/" className="text-wood-medium hover:text-wood-dark font-semibold transition-colors">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
