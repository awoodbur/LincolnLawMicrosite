'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 mb-4">
              These Terms of Service ("Terms") govern your use of the Lincoln Law website and services. By accessing or using our website, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you may not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description of Services</h2>
            <p className="text-gray-700 mb-4">
              Lincoln Law provides:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Information about bankruptcy options in Utah</li>
              <li>A preliminary financial assessment questionnaire</li>
              <li>Preliminary eligibility information (informational only, not legal advice)</li>
              <li>Connection to qualified bankruptcy attorneys</li>
              <li>Educational resources about bankruptcy law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Not Legal Advice</h2>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-4">
              <p className="text-amber-900 font-semibold mb-2">IMPORTANT DISCLAIMER</p>
              <p className="text-amber-800">
                The information provided on this website, including through our assessment questionnaire and any preliminary eligibility determinations, is for informational purposes only and does not constitute legal advice.
              </p>
            </div>
            <p className="text-gray-700 mb-4">
              You acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>No attorney-client relationship is formed by using this website or completing the questionnaire</li>
              <li>Any eligibility assessments are preliminary and informational only</li>
              <li>Final determination of bankruptcy eligibility requires consultation with a licensed attorney</li>
              <li>Bankruptcy laws are complex and vary based on individual circumstances</li>
              <li>You should not rely solely on information from this website for legal decisions</li>
              <li>We strongly recommend consulting with a qualified bankruptcy attorney before taking any action</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Geographic Limitations</h2>
            <p className="text-gray-700 mb-4">
              Our services are currently available only to residents of Utah. The information provided on this website is specific to Utah bankruptcy law and may not be applicable in other states. If you are not a Utah resident, the information and services provided may not be relevant to your situation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              When using our services, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the confidentiality of any account credentials</li>
              <li>Use the services only for lawful purposes</li>
              <li>Not attempt to gain unauthorized access to our systems</li>
              <li>Not transmit any malicious code or harmful content</li>
              <li>Not use automated systems to access the site without permission</li>
              <li>Respect the intellectual property rights of Lincoln Law and others</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Information and Plaid Integration</h2>
            <p className="text-gray-700 mb-4">
              Our optional Plaid integration currently operates in Sandbox mode with test data only. You acknowledge that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Connection to Plaid is entirely optional and requires your explicit consent</li>
              <li>The Sandbox environment uses synthetic test data, not real financial information</li>
              <li>Any financial assessments based on Plaid data are preliminary and informational</li>
              <li>We access only minimum-necessary information to provide our services</li>
              <li>You can revoke Plaid access at any time through your Plaid account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All content on this website, including text, graphics, logos, images, and software, is the property of Lincoln Law or its licensors and is protected by copyright and other intellectual property laws. You may not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Reproduce, distribute, or display our content without permission</li>
              <li>Create derivative works from our content</li>
              <li>Use our trademarks or branding without authorization</li>
              <li>Remove or modify any copyright notices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              To the fullest extent permitted by law, Lincoln Law and its affiliates, officers, employees, and agents shall not be liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or use</li>
              <li>Damages resulting from reliance on information provided on the website</li>
              <li>Damages caused by third-party services or content</li>
              <li>Any claims arising from decisions made based on preliminary assessments</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Our total liability in any matter arising from your use of our services shall not exceed the amount you paid us, if any, for the services in question.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
            <p className="text-gray-700 mb-4">
              You agree to indemnify and hold harmless Lincoln Law, its affiliates, and their respective officers, employees, and agents from any claims, damages, losses, liabilities, and expenses (including attorneys' fees) arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Your use of our services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Any information you provide to us</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dispute Resolution and Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the State of Utah, without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-700 mb-4">
              Any dispute arising from these Terms or your use of our services shall be resolved in the state or federal courts located in Utah, and you consent to the personal jurisdiction of such courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on this page with a new "Last Updated" date. Your continued use of our services after such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to suspend or terminate your access to our services at any time, with or without notice, for any reason, including violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Severability</h2>
            <p className="text-gray-700 mb-4">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Entire Agreement</h2>
            <p className="text-gray-700 mb-4">
              These Terms, together with our Privacy Policy and Consent Disclosure, constitute the entire agreement between you and Lincoln Law regarding the use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about these Terms, please contact us:
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
              <Link href="/legal/privacy" className="text-wood-medium hover:text-wood-dark font-semibold transition-colors">
                Privacy Policy
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
