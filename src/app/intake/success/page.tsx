'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { InfoCard } from '@/components/InfoCard';
import { CheckCircle, Mail, Phone, Calendar, Home, FileText, Shield, TrendingUp } from 'lucide-react';

interface EligibilityResult {
  summary: string;
  chapter7Eligibility: 'Low' | 'Medium' | 'High';
  recommendedChapter: '7' | '13';
  reasons: string[];
  flags: {
    incomePass: boolean;
    budgetPass: boolean;
    assetRisk: boolean;
  };
  disclaimer: string;
}

export default function SuccessPage() {
  const [email, setEmail] = useState<string>('');
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);

  useEffect(() => {
    // Get email from localStorage
    const savedEmail = localStorage.getItem('lincoln-law-email');
    if (savedEmail) {
      setEmail(savedEmail);
    }

    // Get eligibility results from localStorage
    const savedEligibility = localStorage.getItem('lincoln-law-eligibility');
    if (savedEligibility) {
      try {
        setEligibility(JSON.parse(savedEligibility));
      } catch (e) {
        console.error('Failed to parse eligibility results', e);
      }
    }

    // Clean up localStorage (optional - keep for debugging)
    // localStorage.removeItem('lincoln-law-lead-id');
    // localStorage.removeItem('lincoln-law-email');
    // localStorage.removeItem('lincoln-law-eligibility');
  }, []);

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-parchment/80 backdrop-blur-sm rounded-2xl cabin-shadow parchment-texture border-2 border-wood-light/30 p-8 md:p-10">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-forest-medium/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-forest-medium/40">
              <CheckCircle className="w-14 h-14 text-forest-dark" strokeWidth={2} />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-wood-dark mb-3">
              Thank You!
            </h1>
            <p className="text-xl text-foreground/80 leading-relaxed">
              We've received your information and will be in touch shortly.
            </p>
            {email && (
              <p className="text-sm text-muted-foreground mt-3">
                Confirmation sent to: <span className="font-semibold text-wood-dark">{email}</span>
              </p>
            )}
          </div>

          {/* Eligibility Results (if available) */}
          {eligibility && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-wood-light/20 to-parchment rounded-lg p-6 border-2 border-wood-light/40 cabin-shadow">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-forest-dark mr-2" />
                  <h2 className="font-serif font-semibold text-xl text-wood-dark">
                    Preliminary Eligibility Assessment
                  </h2>
                </div>

                {/* Summary */}
                <div className="mb-4">
                  <p className="text-foreground/80 mb-2">{eligibility.summary}</p>

                  {/* Eligibility Badge */}
                  <div className="inline-flex items-center px-4 py-2 rounded-full font-semibold text-sm mt-2"
                    style={{
                      backgroundColor:
                        eligibility.chapter7Eligibility === 'High' ? '#DEF7EC' :
                        eligibility.chapter7Eligibility === 'Medium' ? '#FEF3C7' :
                        '#FEE2E2',
                      color:
                        eligibility.chapter7Eligibility === 'High' ? '#03543F' :
                        eligibility.chapter7Eligibility === 'Medium' ? '#92400E' :
                        '#991B1B'
                    }}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Chapter 7 Eligibility: {eligibility.chapter7Eligibility}
                  </div>

                  {/* Recommended Chapter */}
                  <div className="mt-3">
                    <p className="text-sm text-foreground/70">
                      <strong className="text-wood-dark">Recommended Chapter:</strong> Chapter {eligibility.recommendedChapter}
                    </p>
                  </div>
                </div>

                {/* Assessment Breakdown */}
                <div className="space-y-3 mb-4">
                  <h3 className="font-semibold text-wood-dark text-sm uppercase tracking-wide">
                    Assessment Details
                  </h3>

                  {/* Income Assessment */}
                  <div className="flex items-start space-x-3 bg-parchment/50 rounded-md p-3 border border-wood-light/30">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      eligibility.flags.incomePass ? 'bg-forest-medium/20 text-forest-dark' : 'bg-burgundy/20 text-burgundy'
                    }`}>
                      {eligibility.flags.incomePass ? '✓' : '✗'}
                    </div>
                    <div>
                      <p className="font-medium text-wood-dark text-sm">Income Assessment</p>
                      <p className="text-xs text-foreground/70">{eligibility.reasons[0]}</p>
                    </div>
                  </div>

                  {/* Budget Assessment */}
                  <div className="flex items-start space-x-3 bg-parchment/50 rounded-md p-3 border border-wood-light/30">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      eligibility.flags.budgetPass ? 'bg-forest-medium/20 text-forest-dark' : 'bg-burgundy/20 text-burgundy'
                    }`}>
                      {eligibility.flags.budgetPass ? '✓' : '✗'}
                    </div>
                    <div>
                      <p className="font-medium text-wood-dark text-sm">Budget Assessment</p>
                      <p className="text-xs text-foreground/70">{eligibility.reasons[1]}</p>
                    </div>
                  </div>

                  {/* Asset Assessment */}
                  <div className="flex items-start space-x-3 bg-parchment/50 rounded-md p-3 border border-wood-light/30">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      !eligibility.flags.assetRisk ? 'bg-forest-medium/20 text-forest-dark' : 'bg-burgundy/20 text-burgundy'
                    }`}>
                      {!eligibility.flags.assetRisk ? '✓' : '✗'}
                    </div>
                    <div>
                      <p className="font-medium text-wood-dark text-sm">Asset Assessment</p>
                      <p className="text-xs text-foreground/70">{eligibility.reasons[2]}</p>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-parchment/60 rounded-md p-3 border border-wood-medium/30">
                  <p className="text-xs text-foreground/70 italic">
                    <Shield className="inline w-3 h-3 mr-1" />
                    {eligibility.disclaimer}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* What Happens Next */}
          <div className="mb-8">
            <h2 className="font-serif font-semibold text-xl text-wood-dark mb-4 text-center">
              What Happens Next?
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-wood-light/10 rounded-lg border border-wood-light/30">
                <div className="w-8 h-8 bg-forest-dark rounded-full flex items-center justify-center flex-shrink-0 text-parchment font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-wood-dark mb-1">
                    <Mail className="inline w-4 h-4 mr-1 text-forest-dark" />
                    Review Your Submission
                  </h3>
                  <p className="text-sm text-foreground/70">
                    Our team will carefully review your financial information and situation within the next 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-wood-light/10 rounded-lg border border-wood-light/30">
                <div className="w-8 h-8 bg-forest-dark rounded-full flex items-center justify-center flex-shrink-0 text-parchment font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-wood-dark mb-1">
                    <Phone className="inline w-4 h-4 mr-1 text-forest-dark" />
                    Personalized Assessment
                  </h3>
                  <p className="text-sm text-foreground/70">
                    A Utah bankruptcy attorney will reach out to discuss your options and answer any questions you may have.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-wood-light/10 rounded-lg border border-wood-light/30">
                <div className="w-8 h-8 bg-forest-dark rounded-full flex items-center justify-center flex-shrink-0 text-parchment font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-wood-dark mb-1">
                    <Calendar className="inline w-4 h-4 mr-1 text-forest-dark" />
                    Next Steps
                  </h3>
                  <p className="text-sm text-foreground/70">
                    If bankruptcy is right for you, we'll guide you through each step of the process with clarity and compassion.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <InfoCard variant="warning" title="Important Note" className="mb-8">
            <p>
              The information you provided is for preliminary assessment only and does not constitute legal advice.
              Final determination of bankruptcy eligibility and options requires a detailed consultation with a licensed attorney.
            </p>
          </InfoCard>

          {/* CTAs */}
          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full" variant="outline">
                <Home className="mr-2 w-4 h-4" />
                Return to Homepage
              </Button>
            </Link>

            <div className="text-center pt-4">
              <p className="text-sm text-foreground/70 mb-4">
                Have questions? Need to speak with us immediately?
              </p>
              <a href="tel:+13854388161" className="inline-flex items-center bg-wood-dark hover:bg-wood-dark/90 text-parchment px-6 py-3 rounded-lg font-semibold transition-colors">
                <Phone className="mr-2 w-5 h-5" />
                Call Us: (385) 438-8161
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Lincoln Law • Justice • Fairness • Honesty
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Serving Utah with compassion and expertise
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
