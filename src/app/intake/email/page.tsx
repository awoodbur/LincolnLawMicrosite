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
      consentPrivacy: false as any,
      consentTerms: false as any,
      consentData: false as any,
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
        intakeData.monthlyIncome !== undefined &&
        intakeData.monthlyExpenses !== undefined &&
        intakeData.homeEquity !== undefined &&
        intakeData.vehicleEquity !== undefined &&
        intakeData.hasValuableAssets !== undefined
      ) {
        // Call eligibility evaluation endpoint
        const evaluationData = {
          householdSize: intakeData.householdSize,
          monthlyIncome: intakeData.monthlyIncome,
          monthlyExpenses: intakeData.monthlyExpenses,
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
      const leadData = {
        ...intakeData,
        ...data,
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

      // Store lead ID for Plaid page
      localStorage.setItem('lincoln-law-lead-id', result.leadId);
      localStorage.setItem('lincoln-law-email', data.email);

      // Clear intake data
      localStorage.removeItem(STORAGE_KEY);

      // Navigate to Plaid link page (optional step to add Plaid data)
      router.push('/intake/link');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
              Almost Done
            </h1>
            <p className="text-gray-600">
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

            {/* Consent Checkboxes */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <h3 className="font-semibold text-gray-900">Required Consents</h3>
              </div>

              <div className="space-y-3">
                {/* Privacy Policy */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consentPrivacy"
                    checked={watch('consentPrivacy')}
                    onCheckedChange={(checked) => setValue('consentPrivacy', checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="consentPrivacy"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      I have read and agree to the{' '}
                      <Link href="/legal/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                      {' *'}
                    </label>
                    {errors.consentPrivacy && (
                      <p className="text-xs text-red-600">{String(errors.consentPrivacy.message)}</p>
                    )}
                  </div>
                </div>

                {/* Terms of Service */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consentTerms"
                    checked={watch('consentTerms')}
                    onCheckedChange={(checked) => setValue('consentTerms', checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="consentTerms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      I agree to the{' '}
                      <Link href="/legal/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>
                      {' *'}
                    </label>
                    {errors.consentTerms && (
                      <p className="text-xs text-red-600">{String(errors.consentTerms.message)}</p>
                    )}
                  </div>
                </div>

                {/* Data Collection */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consentData"
                    checked={watch('consentData')}
                    onCheckedChange={(checked) => setValue('consentData', checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="consentData"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      I consent to the collection and use of my information as described in the{' '}
                      <Link href="/legal/consent" className="text-blue-600 hover:underline">
                        Consent Disclosure
                      </Link>
                      {' *'}
                    </label>
                    {errors.consentData && (
                      <p className="text-xs text-red-600">{String(errors.consentData.message)}</p>
                    )}
                  </div>
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
            <div className="flex flex-col space-y-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-600"
              >
                {isSubmitting ? 'Submitting...' : 'Submit & Continue'}
              </Button>

              <Link href="/intake" className="text-center text-sm text-gray-600 hover:text-gray-900">
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
