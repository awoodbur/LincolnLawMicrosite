'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from '@/components/ui/button';
import { Building2, ArrowRight, Shield } from 'lucide-react';

export default function PlaidLinkPage() {
  const router = useRouter();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get lead ID from localStorage
  const leadId = typeof window !== 'undefined' ? localStorage.getItem('lincoln-law-lead-id') : null;

  // Fetch link token on mount
  useEffect(() => {
    if (!leadId) {
      router.push('/intake');
      return;
    }

    const fetchLinkToken = async () => {
      try {
        const response = await fetch('/api/plaid/create_link_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: leadId }),
        });

        if (!response.ok) {
          throw new Error('Failed to create link token');
        }

        const data = await response.json();
        setLinkToken(data.link_token);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize');
        setIsLoading(false);
      }
    };

    fetchLinkToken();
  }, [leadId, router]);

  const onSuccess = useCallback(async (publicToken: string) => {
    try {
      // Exchange public token for access token
      const response = await fetch('/api/plaid/exchange_public_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicToken,
          leadId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to link account');
      }

      // Navigate to success page
      router.push('/intake/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to link account');
    }
  }, [leadId, router]);

  const onExit = useCallback(() => {
    // User closed the Plaid Link modal
    // This is fine, they can skip
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit,
  });

  const handleSkip = () => {
    router.push('/intake/success');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing secure connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
              Optional: Connect Your Bank
            </h1>
            <p className="text-gray-600">
              Securely connect your bank account to provide more accurate financial insights.
            </p>
          </div>

          {/* Info Cards */}
          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Sandbox Mode - Test Data Only</h3>
                  <p className="text-sm text-blue-800">
                    This connection uses Plaid's Sandbox environment with synthetic test data. No real financial information is accessed.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Why connect?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>More accurate debt-to-income calculation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Better understanding of your monthly cashflow</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Helps us provide more tailored guidance</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900">
                <strong>Note:</strong> This step is completely optional. You can skip it and still receive our full assistance.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => open()}
              disabled={!ready || !!error}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Connect Bank Account (Sandbox)
            </Button>

            <Button
              onClick={handleSkip}
              variant="outline"
              className="w-full"
            >
              Skip this step <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Your financial data is encrypted and securely stored. We never share your information with third parties without your explicit consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
