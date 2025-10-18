import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SkipButtonProps {
  onSkip: () => void;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Skip button for optional steps in the questionnaire flow
 * Uses secondary/ghost styling to de-emphasize compared to primary action
 */
export function SkipButton({
  onSkip,
  label = 'Skip This Step',
  description = "I'll provide details manually",
  className,
  disabled = false,
}: SkipButtonProps) {
  return (
    <div className={cn('text-center', className)}>
      <Button
        onClick={onSkip}
        variant="ghost"
        size="lg"
        disabled={disabled}
        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        {label}
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
      {description && (
        <p className="text-xs text-gray-500 mt-1">
          {description}
        </p>
      )}
    </div>
  );
}
