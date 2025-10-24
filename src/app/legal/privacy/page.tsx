'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 mb-4">
              Lincoln Law ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services, including our bankruptcy assessment questionnaire.
            </p>
            <p className="text-gray-700 mb-4">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Personal Information You Provide</h3>
            <p className="text-gray-700 mb-4">
              We collect information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Complete our bankruptcy assessment questionnaire</li>
              <li>Request a consultation or contact us</li>
              <li>Subscribe to our newsletter or communications</li>
            </ul>
            <p className="text-gray-700 mb-4">
              This information may include:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Name and contact information (email address, phone number, mailing address)</li>
              <li>Location information (state, county)</li>
              <li>Household information (household size, marital status)</li>
              <li>Financial information (income range, debt range, employment status)</li>
              <li>Situation details (missed payments, wage garnishment, property concerns)</li>
              <li>Any additional notes you provide</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Financial Account Information (Optional)</h3>
            <p className="text-gray-700 mb-4">
              With your explicit consent, we may access limited financial account information through Plaid, Inc. ("Plaid") to provide more accurate financial assessments. This integration:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Is completely optional and requires your explicit authorization</li>
              <li>Currently uses Plaid's Sandbox environment with test data only</li>
              <li>Accesses only summary transaction and identity information</li>
              <li>Does not store raw transaction details or account credentials</li>
              <li>Is secured with industry-standard encryption</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Automatically Collected Information</h3>
            <p className="text-gray-700 mb-4">
              When you visit our website, we automatically collect certain information about your device, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referring website</li>
              <li>Pages viewed and time spent on pages</li>
              <li>Access times and dates</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Provide preliminary bankruptcy eligibility assessments</li>
              <li>Contact you regarding your inquiry and potential legal services</li>
              <li>Match you with appropriate legal representation</li>
              <li>Send you confirmation emails and follow-up communications</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations and protect our rights</li>
              <li>Analyze usage patterns and optimize user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Share Your Information</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">With Your Consent</h3>
            <p className="text-gray-700 mb-4">
              We may share your information when you have given us explicit permission to do so.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Service Providers</h3>
            <p className="text-gray-700 mb-4">
              We may share your information with trusted third-party service providers who assist us in operating our website and services, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Email service providers (Mailgun)</li>
              <li>Financial data aggregation services (Plaid)</li>
              <li>Hosting and infrastructure providers (AWS)</li>
              <li>Analytics providers</li>
            </ul>
            <p className="text-gray-700 mb-4">
              These service providers are contractually obligated to keep your information confidential and use it only for the purposes we specify.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Legal Requirements</h3>
            <p className="text-gray-700 mb-4">
              We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., court orders, subpoenas).
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Business Transfers</h3>
            <p className="text-gray-700 mb-4">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure server infrastructure with restricted access</li>
              <li>Regular security assessments and updates</li>
              <li>Staff training on data protection practices</li>
              <li>Logging and monitoring of system access</li>
            </ul>
            <p className="text-gray-700 mb-4">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Factors we consider in determining retention periods include:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>The nature of the services provided</li>
              <li>Legal and regulatory requirements</li>
              <li>Potential or actual disputes</li>
              <li>Your ongoing relationship with our firm</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Restriction:</strong> Request restriction of processing of your information</li>
              <li><strong>Objection:</strong> Object to our processing of your information</li>
              <li><strong>Portability:</strong> Request transfer of your information to another service</li>
              <li><strong>Withdraw Consent:</strong> Withdraw previously given consent at any time</li>
            </ul>
            <p className="text-gray-700 mb-4">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 mb-4">
              Our website may use cookies and similar tracking technologies to enhance user experience and analyze site usage. You can control cookies through your browser settings, though disabling cookies may affect site functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links</h2>
            <p className="text-gray-700 mb-4">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-900 font-semibold mb-2">Lincoln Law</p>
              <p className="text-gray-700">Email: help@lincolnlaw.com</p>
              <p className="text-gray-700">Phone: (385) 438-8161</p>
              <p className="text-gray-700">Address: 921 West Center St., Orem, UT 84057</p>
            </div>
          </section>
        </div>

          {/* Footer Navigation */}
          <div className="mt-12 pt-8 border-t border-wood-light/30">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link href="/legal/terms" className="text-wood-medium hover:text-wood-dark font-semibold transition-colors">
                Terms of Service
              </Link>
              <Link href="/legal/consent" className="text-wood-medium hover:text-wood-dark font-semibold transition-colors">
                Consent Disclosure
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
