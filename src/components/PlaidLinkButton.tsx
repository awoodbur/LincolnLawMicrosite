'use client';

import { useState } from 'react';
import { Building2, Sparkles, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PlaidLinkButtonProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

/**
 * Plaid Link button component
 * Clearly communicates optional nature while encouraging connection
 * for more accurate eligibility assessment
 */
export function PlaidLinkButton({
  onClick,
  className,
  disabled = false,
  isLoading = false,
}: PlaidLinkButtonProps) {

  return (
    <div className={cn('space-y-4', className)}>
      {/* Optional but recommended banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-amber-900">
              Optional: Connect Your Bank for Better Results
            </h3>
            <p className="text-sm text-amber-800 mt-1">
              Linking your bank account gives us a clearer picture of your finances,
              helping us provide a more accurate preliminary assessment. This step is
              completely optional, but highly recommended.
            </p>
          </div>
        </div>
      </div>

      {/* Main Plaid Link button */}
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        size="xl"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
      >
        <Building2 className="mr-2 h-5 w-5" />
        {isLoading ? 'Connecting...' : 'Connect Your Bank Securely'}
        <ChevronRight className="ml-2 h-5 w-5" />
      </Button>

      {/* Trust signals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-600" />
          <span>Bank-level encryption</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-600" />
          <span>Read-only access</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-600" />
          <span>We never store credentials</span>
        </div>
      </div>

      {/* What we'll look at */}
      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 list-none flex items-center gap-2">
          <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
          What information will we access?
        </summary>
        <div className="mt-2 pl-6 text-sm text-gray-600 space-y-1">
          <p>We only access summary information to help with your assessment:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Account balances (checking, savings)</li>
            <li>Recent transaction patterns (last 30 days)</li>
            <li>Monthly income deposits</li>
            <li>Recurring expenses</li>
          </ul>
          <p className="mt-2 text-xs text-gray-500">
            We never see your login credentials, and we cannot move money or make changes
            to your accounts. All data is encrypted and stored securely.
          </p>
        </div>
      </details>
    </div>
  );
}
