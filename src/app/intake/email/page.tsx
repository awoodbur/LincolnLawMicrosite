'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { emailConsentSchema, type EmailConsentData } from '@/lib/validation/intake';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { InfoCard } from '@/components/InfoCard';
import { Shield, Mail } from 'lucide-react';

const STORAGE_KEY = 'lincoln-law-intake-data';

export default function EmailConsentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(emailConsentSchema),
    defaultValues: {
      email: '',
      phone: '',
      consentAll: false as any,
    },
  });

  const onSubmit = async (data: EmailConsentData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Get intake data from localStorage
      const intakeDataStr = localStorage.getItem(STORAGE_KEY);
      if (!intakeDataStr) {
        throw new Error('Intake data not found. Please start from the beginning.');
      }

      const intakeData = JSON.parse(intakeDataStr);

      // Check if we have detailed financial data for evaluation
      let eligibilityResult = null;
      if (
        intakeData.incomeAboveThreshold !== undefined &&
        intakeData.monthlyExpenses !== undefined &&
        intakeData.homeEquity !== undefined &&
        intakeData.vehicleEquity !== undefined &&
        intakeData.hasValuableAssets !== undefined
      ) {
        // Call eligibility evaluation endpoint
        const evaluationData = {
          householdSize: intakeData.householdSize,
          incomeAboveThreshold: intakeData.incomeAboveThreshold,
          monthlyExpenses: intakeData.monthlyExpenses,
          unsecuredDebt: intakeData.unsecuredDebt,
          homeEquity: intakeData.homeEquity,
          vehicleEquity: intakeData.vehicleEquity,
          hasValuableAssets: intakeData.hasValuableAssets,
        };

        const evalResponse = await fetch('/api/eligibility/evaluate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(evaluationData),
        });

        if (evalResponse.ok) {
          eligibilityResult = await evalResponse.json();
          // Store eligibility results for success page
          localStorage.setItem('lincoln-law-eligibility', JSON.stringify(eligibilityResult));
        } else {
          console.error('Failed to evaluate eligibility, continuing without evaluation');
        }
      }

      // Combine intake data with email/consent and eligibility
      // Convert single consentAll to the 3 separate fields expected by API
      const leadData = {
        ...intakeData,
        email: data.email,
        phone: data.phone || undefined,
        consentPrivacy: data.consentAll,
        consentTerms: data.consentAll,
        consentData: data.consentAll,
        eligibilityResult: eligibilityResult,
        source: 'lincolnlaw-utah-intake',
      };

      // Submit to API (this creates the lead with eligibility)
      const response = await fetch('/api/leads/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit. Please try again.');
      }

      const result = await response.json();

      // Store lead ID and email for confirmation
      localStorage.setItem('lincoln-law-lead-id', result.leadId);
      localStorage.setItem('lincoln-law-email', data.email);

      // Clear intake data
      localStorage.removeItem(STORAGE_KEY);

      // Navigate directly to success page (Plaid integration disabled for production)
      router.push('/intake/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-parchment/80 backdrop-blur-sm rounded-2xl cabin-shadow parchment-texture border-2 border-wood-light/30 p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-wood-light/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-wood-medium/30">
              <Mail className="w-10 h-10 text-wood-dark" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-4xl font-bold text-wood-dark mb-3">
              Almost Done
            </h1>
            <p className="text-foreground/70 text-lg leading-relaxed">
              Enter your email to receive your next steps and personalized guidance.
            </p>
          </div>

          {/* Privacy assurance */}
          <InfoCard variant="info" className="mb-6">
            <p>
              Your email will only be used to send you information about your bankruptcy assessment.
              We will never sell or share your information with third parties.
            </p>
          </InfoCard>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="your.email@example.com"
                className="mt-1"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                We'll send your next steps to this email.
              </p>
            </div>

            {/* Phone Input */}
            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="(555) 123-4567"
                className="mt-1"
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Optional - We may call to discuss your options
              </p>
            </div>

            {/* Consent Checkbox - Single Combined */}
            <div className="border-t border-wood-light/30 pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-wood-dark flex-shrink-0" strokeWidth={1.5} />
                <h3 className="font-serif font-semibold text-lg text-wood-dark">Required Consent</h3>
              </div>

              <div className="flex items-start space-x-3 bg-wood-light/10 p-4 rounded-lg border border-wood-medium/20">
                <Checkbox
                  id="consentAll"
                  checked={watch('consentAll')}
                  onCheckedChange={(checked) => setValue('consentAll', checked as true)}
                />
                <div className="grid gap-1.5 leading-none flex-1">
                  <label
                    htmlFor="consentAll"
                    className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-foreground"
                  >
                    I have read and agree to the{' '}
                    <Link href="/legal/privacy" className="text-wood-dark hover:text-wood-medium underline font-semibold">
                      Privacy Policy
                    </Link>
                    , the{' '}
                    <Link href="/legal/terms" className="text-wood-dark hover:text-wood-medium underline font-semibold">
                      Terms of Service
                    </Link>
                    , and the{' '}
                    <Link href="/legal/consent" className="text-wood-dark hover:text-wood-medium underline font-semibold">
                      Consent Disclosure
                    </Link>
                    . *
                  </label>
                  {errors.consentAll && (
                    <p className="text-xs text-red-600 font-medium mt-1">{String(errors.consentAll.message)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <InfoCard variant="error" title="Submission Error">
                <p>{error}</p>
              </InfoCard>
            )}

            {/* Submit Button */}
            <div className="flex flex-col space-y-4 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg py-6 cabin-shadow"
              >
                {isSubmitting ? 'Submitting...' : 'Submit & Continue'}
              </Button>

              <Link href="/intake" className="text-center text-sm text-wood-medium hover:text-wood-dark font-medium">
                ← Back to questionnaire
              </Link>
            </div>
          </form>

          {/* Disclaimer */}
          <div className="mt-8">
            <InfoCard variant="warning" title="Important Disclaimer">
              <p className="text-sm">
                By submitting this form, you acknowledge that the information provided is for preliminary
                assessment only and does not constitute legal advice. A licensed attorney will review your
                information and contact you to discuss your options.
              </p>
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
}
