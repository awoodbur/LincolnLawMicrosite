'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePlaidLink } from 'react-plaid-link';
import { PlaidLinkButton } from '@/components/PlaidLinkButton';
import { SkipButton } from '@/components/SkipButton';
import { InfoCard } from '@/components/InfoCard';
import { Building2 } from 'lucide-react';

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
      <div className="py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing secure connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
              Refine Your Assessment
            </h1>
            <p className="text-gray-600">
              Connect your bank to provide more accurate financial insights.
            </p>
          </div>

          {/* Sandbox Notice with Credentials */}
          <InfoCard variant="info" title="Sandbox Mode - Test Data Only" className="mb-6">
            <p className="mb-3">
              This connection uses Plaid's Sandbox environment with synthetic test data.
              No real financial information is accessed in this demo.
            </p>
            <div className="bg-blue-100 rounded-md p-3 mt-3">
              <p className="text-sm font-semibold text-blue-900 mb-2">Test Credentials:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li><strong>Username:</strong> user_good</li>
                <li><strong>Password:</strong> pass_good</li>
              </ul>
              <p className="text-xs text-blue-700 mt-2">
                Use these credentials when prompted by Plaid Link to connect a test account.
              </p>
            </div>
          </InfoCard>

          {/* Error Message */}
          {error && (
            <InfoCard variant="error" title="Connection Error" className="mb-6">
              <p>{error}</p>
            </InfoCard>
          )}

          {/* Plaid Link Button with built-in benefits messaging */}
          <div className="mb-6">
            <PlaidLinkButton
              onClick={() => open()}
              disabled={!ready || !!error}
            />
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Skip Button */}
          <SkipButton
            onSkip={handleSkip}
            label="Continue Without Connecting"
            description="We'll work with the information you've already provided"
          />

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Your financial data is encrypted and securely stored. We never share your information
              with third parties without your explicit consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
