import { logger } from './logger';

export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

/**
 * Analytics helper for server-side event tracking.
 * Logs events for debugging and can be extended to send to GA4 or other services.
 */
export function trackEvent(event: AnalyticsEvent) {
  logger.info('Analytics event', {
    event: event.name,
    properties: event.properties,
  });

  // TODO: Send to GA4 Measurement Protocol if needed
  // https://developers.google.com/analytics/devguides/collection/protocol/ga4
}

/**
 * Client-side analytics helper (for use in components)
 */
export function trackClientEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;

  // Send to Google Analytics if available
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', event.name, event.properties);
  }

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Client event:', event);
  }
}

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
  }
}
