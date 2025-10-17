import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Scale, Heart, CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            A Fresh Financial Start
            <br />
            <span className="text-blue-600">Is Within Reach</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            If you're struggling with debt in Utah, you're not alone. Lincoln Law helps individuals find relief through bankruptcy, guided by principles of justice, fairness, and honesty.
          </p>
          <Link href="/intake">
            <Button size="xl" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg">
              Check Your Options
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Free confidential assessment • No obligation • Utah residents only
          </p>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white py-12 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Justice</h3>
              <p className="text-gray-600 text-sm">
                Fair treatment and protection under the law
              </p>
            </div>
            <div className="text-center">
              <Scale className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Fairness</h3>
              <p className="text-gray-600 text-sm">
                Honest assessments and transparent guidance
              </p>
            </div>
            <div className="text-center">
              <Heart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Compassion</h3>
              <p className="text-gray-600 text-sm">
                Understanding your unique financial situation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">
            Why Utah Residents Choose Lincoln Law
          </h2>
          <div className="space-y-4">
            {[
              'Experienced in Utah bankruptcy law and procedures',
              'Personalized assessment of your specific situation',
              'Clear explanation of Chapter 7 and Chapter 13 options',
              'Protection from creditors and wage garnishment',
              'Guidance through every step of the process',
              'Free initial consultation to discuss your options',
            ].map((benefit, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Take the First Step Today
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Our confidential questionnaire helps us understand your situation and provide preliminary guidance on your bankruptcy options.
          </p>
          <Link href="/intake">
            <Button size="xl" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-lg">
              Start Your Assessment
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="font-serif text-2xl font-bold mb-4">Lincoln Law</h3>
            <p className="text-gray-400 mb-6">
              Justice • Fairness • Honesty
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link href="/legal/privacy" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className="text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/faq" className="text-gray-400 hover:text-white">
                Bankruptcy FAQ
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500 text-sm">
              <p>
                This website provides general information only and does not constitute legal advice.
                Bankruptcy laws and eligibility vary by individual circumstances.
                Consult with a licensed attorney for specific guidance.
              </p>
              <p className="mt-4">
                © {new Date().getFullYear()} Lincoln Law. All rights reserved. Serving Utah.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
