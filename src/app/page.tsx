import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Shield, Scale, Heart, CheckCircle, Phone, Award, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Log Cabin Inspired */}
      <section className="relative overflow-hidden">
        {/* Warm cabin background with subtle texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-wood-light/20 via-parchment to-background wood-texture"></div>

        {/* Decorative top border - log cabin roof line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-wood-dark via-wood-medium to-wood-dark"></div>

        <div className="container mx-auto px-4 pt-24 pb-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Lincoln Portrait */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="bg-wood-light/20 p-2 rounded-full border-4 border-wood-medium/40 cabin-shadow">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-parchment">
                    <Image
                      src="/lincoln.jfif"
                      alt="Abraham Lincoln"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
              </div>
            </div>

            {/* Lincoln Brand Name */}
            <div className="mb-6">
              <p className="text-wood-medium/70 text-sm font-semibold tracking-wider uppercase mb-2">
                Inspired by Honest Abe
              </p>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-wood-dark mb-6 leading-tight">
              A Fresh Financial Start
              <br />
              <span className="text-wood-medium">Is Within Reach</span>
            </h1>

            <p className="text-xl md:text-2xl text-foreground/80 mb-10 max-w-3xl mx-auto font-sans leading-relaxed">
              If you're struggling with debt in Utah, you're not alone. Lincoln Law helps individuals find relief through bankruptcy, guided by principles of justice, fairness, and honesty.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link href="/intake">
                <Button
                  size="xl"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-10 py-6 cabin-shadow transition-all duration-200 hover:scale-105"
                >
                  Check Your Options
                </Button>
              </Link>

              <a href="tel:+13854388161">
                <Button
                  size="xl"
                  variant="outline"
                  className="border-2 border-wood-medium text-wood-dark hover:bg-wood-medium/10 font-semibold text-lg px-10 py-6 cabin-shadow transition-all duration-200 hover:scale-105"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  (385) 438-8161
                </Button>
              </a>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Free confidential assessment • No obligation • Utah residents only
            </p>
          </div>
        </div>

        {/* Decorative bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-wood-medium/30 to-transparent"></div>
      </section>

      {/* Trust Indicators - Lincoln's Values */}
      <section className="py-16 border-y border-wood-light/30">
        <div className="container mx-auto px-4">
          {/* Impressive Stats Banner */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-forest-dark via-wood-dark to-forest-dark rounded-2xl p-8 md:p-10 cabin-shadow text-center">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                <div className="flex flex-col items-center">
                  <Users className="w-12 h-12 text-gold mb-3" strokeWidth={1.5} />
                  <p className="text-4xl md:text-5xl font-bold text-parchment mb-2 font-display">10,000+</p>
                  <p className="text-parchment/80 text-lg">People Helped</p>
                  <p className="text-gold text-xl font-semibold mt-2">$3+ Billion Recovered</p>
                </div>
                <div className="flex flex-col items-center md:border-l border-parchment/20 md:pl-8">
                  <Award className="w-12 h-12 text-gold mb-3" strokeWidth={1.5} />
                  <p className="text-2xl md:text-3xl font-bold text-parchment mb-2 font-display">Certified Expert</p>
                  <p className="text-parchment/80 text-lg">Only Board-Certified</p>
                  <p className="text-gold text-xl font-semibold mt-2">Bankruptcy Attorney in Utah</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section header with Lincoln quote inspiration */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-wood-dark mb-3">
              Our Guiding Principles
            </h2>
            <p className="text-muted-foreground italic">
              "I have always found that mercy bears richer fruits than strict justice."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {/* Justice */}
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-forest-medium/10 rounded-full scale-150 blur-xl group-hover:bg-forest-medium/20 transition-all duration-300"></div>
                <div className="relative bg-parchment p-5 rounded-full cabin-shadow">
                  <Shield className="w-12 h-12 text-forest-dark mx-auto" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-wood-dark mb-3">Justice</h3>
              <p className="text-foreground/70 leading-relaxed">
                Fair treatment and protection under the law, ensuring your rights are upheld
              </p>
            </div>

            {/* Fairness */}
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-accent/10 rounded-full scale-150 blur-xl group-hover:bg-accent/20 transition-all duration-300"></div>
                <div className="relative bg-parchment p-5 rounded-full cabin-shadow">
                  <Scale className="w-12 h-12 text-wood-dark mx-auto" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-wood-dark mb-3">Fairness</h3>
              <p className="text-foreground/70 leading-relaxed">
                Honest assessments and transparent guidance every step of the way
              </p>
            </div>

            {/* Compassion */}
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-burgundy/10 rounded-full scale-150 blur-xl group-hover:bg-burgundy/20 transition-all duration-300"></div>
                <div className="relative bg-parchment p-5 rounded-full cabin-shadow">
                  <Heart className="w-12 h-12 text-burgundy mx-auto" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-wood-dark mb-3">Compassion</h3>
              <p className="text-foreground/70 leading-relaxed">
                Understanding your unique financial situation with empathy and care
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Parchment Style */}
      <section className="py-20 relative">
        <div className="absolute inset-0 wood-texture opacity-30"></div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-16 text-wood-dark">
              Why Utah Residents Choose Lincoln Law
            </h2>

            <div className="bg-parchment/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 cabin-shadow parchment-texture border-2 border-wood-light/30">
              <div className="space-y-5">
                {[
                  'Experienced in Utah bankruptcy law and procedures',
                  'Personalized assessment of your specific situation',
                  'Clear explanation of Chapter 7 and Chapter 13 options',
                  'Protection from creditors and wage garnishment',
                  'Guidance through every step of the process',
                  'Free initial consultation to discuss your options',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start group hover:translate-x-2 transition-transform duration-200">
                    <div className="flex-shrink-0 mt-1 mr-4">
                      <CheckCircle className="w-7 h-7 text-forest-medium group-hover:text-forest-dark transition-colors" strokeWidth={2} />
                    </div>
                    <p className="text-lg text-foreground font-sans leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Rich Wood Background */}
      <section className="relative py-20 overflow-hidden">
        {/* Wood-inspired background */}
        <div className="absolute inset-0 bg-gradient-to-br from-wood-dark via-wood-medium to-wood-dark wood-texture"></div>
        <div className="absolute inset-0 bg-forest-dark/20"></div>

        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-gold/30"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-gold/30"></div>

        <div className="container mx-auto px-4 text-center relative">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-parchment drop-shadow-lg">
            Take the First Step Today
          </h2>

          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-parchment/90 leading-relaxed font-sans">
            Our confidential questionnaire helps us understand your situation and provide preliminary guidance on your bankruptcy options.
          </p>

          <Link href="/intake">
            <Button
              size="xl"
              className="bg-parchment text-wood-dark hover:bg-parchment/90 font-semibold text-lg px-12 py-7 cabin-shadow transition-all duration-200 hover:scale-105"
            >
              Start Your Assessment
            </Button>
          </Link>

          <p className="text-parchment/70 mt-6 text-sm">
            Join the many Utah families we've helped find financial freedom
          </p>
        </div>
      </section>

      {/* Footer - Dark Cabin Foundation */}
      <footer className="relative bg-gradient-to-b from-wood-dark to-forest-dark text-parchment py-16 border-t-4 border-wood-medium">
        <div className="absolute inset-0 wood-texture opacity-20"></div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo/Brand */}
            <div className="mb-8">
              <h3 className="font-serif text-3xl font-bold mb-3 text-parchment">
                Lincoln Law
              </h3>
              <div className="flex justify-center items-center space-x-3 text-gold/80 mb-4">
                <span className="text-lg">Justice</span>
                <span className="text-2xl">•</span>
                <span className="text-lg">Fairness</span>
                <span className="text-2xl">•</span>
                <span className="text-lg">Honesty</span>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-parchment/10 backdrop-blur-sm rounded-xl border border-gold/20 p-6 mb-8 max-w-md mx-auto">
              <h4 className="font-semibold text-gold mb-4 text-lg">Contact Us</h4>
              <div className="space-y-3 text-left">
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-parchment/70">Phone</p>
                    <a href="tel:+13854388161" className="text-parchment hover:text-gold transition-colors font-semibold">
                      (385) 438-8161
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-parchment/70">Email</p>
                    <a href="mailto:help@lincolnlaw.com" className="text-parchment hover:text-gold transition-colors font-semibold">
                      help@lincolnlaw.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-parchment/70">Address</p>
                    <p className="text-parchment">921 West Center St.<br />Orem, UT 84057</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm mb-10 mt-8">
              <Link
                href="/legal/privacy"
                className="text-parchment/70 hover:text-parchment transition-colors duration-200 hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/legal/terms"
                className="text-parchment/70 hover:text-parchment transition-colors duration-200 hover:underline"
              >
                Terms of Service
              </Link>
              <Link
                href="/faq"
                className="text-parchment/70 hover:text-parchment transition-colors duration-200 hover:underline"
              >
                Bankruptcy FAQ
              </Link>
            </div>

            {/* Legal Disclaimer */}
            <div className="pt-10 border-t border-parchment/20">
              <p className="text-parchment/60 text-sm leading-relaxed mb-4">
                This website provides general information only and does not constitute legal advice.
                Bankruptcy laws and eligibility vary by individual circumstances.
                Consult with a licensed attorney for specific guidance.
              </p>
              <p className="text-parchment/50 text-sm">
                © {new Date().getFullYear()} Lincoln Law. All rights reserved. Serving Utah.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
