import { LucideIcon, Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type InfoCardVariant = 'info' | 'success' | 'warning' | 'error';

interface InfoCardProps {
  variant?: InfoCardVariant;
  icon?: LucideIcon;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantConfig: Record<InfoCardVariant, {
  containerClass: string;
  iconClass: string;
  titleClass: string;
  defaultIcon: LucideIcon;
}> = {
  info: {
    containerClass: 'bg-blue-50 border-blue-200',
    iconClass: 'text-blue-600',
    titleClass: 'text-blue-900',
    defaultIcon: Info,
  },
  success: {
    containerClass: 'bg-green-50 border-green-200',
    iconClass: 'text-green-600',
    titleClass: 'text-green-900',
    defaultIcon: CheckCircle,
  },
  warning: {
    containerClass: 'bg-amber-50 border-amber-200',
    iconClass: 'text-amber-600',
    titleClass: 'text-amber-900',
    defaultIcon: AlertTriangle,
  },
  error: {
    containerClass: 'bg-red-50 border-red-200',
    iconClass: 'text-red-600',
    titleClass: 'text-red-900',
    defaultIcon: AlertCircle,
  },
};

/**
 * InfoCard component for displaying contextual information, trust signals,
 * and important notices throughout the intake flow
 */
export function InfoCard({
  variant = 'info',
  icon,
  title,
  children,
  className,
}: InfoCardProps) {
  const config = variantConfig[variant];
  const IconComponent = icon || config.defaultIcon;

  return (
    <div
      className={cn(
        'border rounded-lg p-4',
        config.containerClass,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <IconComponent
          className={cn('h-5 w-5 mt-0.5 flex-shrink-0', config.iconClass)}
          aria-hidden="true"
        />
        <div className="flex-1">
          {title && (
            <h3 className={cn('text-sm font-semibold mb-1', config.titleClass)}>
              {title}
            </h3>
          )}
          <div className="text-sm text-gray-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
