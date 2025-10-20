import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

interface RateLimitOptions {
  interval: number; // milliseconds
  uniqueTokenPerInterval: number;
}

/**
 * Simple in-memory rate limiter.
 * For production, use Redis or a dedicated service.
 */
class RateLimiter {
  private cache = new Map<string, number[]>();

  async check(
    identifier: string,
    options: RateLimitOptions = { interval: 60000, uniqueTokenPerInterval: 10 }
  ): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    const now = Date.now();
    const { interval, uniqueTokenPerInterval } = options;

    // Get or create token bucket
    let timestamps = this.cache.get(identifier) || [];

    // Remove expired timestamps
    timestamps = timestamps.filter((ts) => now - ts < interval);

    // Check if limit exceeded
    if (timestamps.length >= uniqueTokenPerInterval) {
      const oldestTimestamp = timestamps[0];
      const reset = oldestTimestamp + interval;

      return {
        success: false,
        limit: uniqueTokenPerInterval,
        remaining: 0,
        reset,
      };
    }

    // Add new timestamp
    timestamps.push(now);
    this.cache.set(identifier, timestamps);

    // Clean up old entries periodically
    if (this.cache.size > 10000) {
      this.cleanup();
    }

    return {
      success: true,
      limit: uniqueTokenPerInterval,
      remaining: uniqueTokenPerInterval - timestamps.length,
      reset: now + interval,
    };
  }

  private cleanup() {
    const now = Date.now();
    const maxAge = 300000; // 5 minutes

    const entriesToDelete: string[] = [];
    this.cache.forEach((timestamps, key) => {
      if (timestamps.length === 0 || now - timestamps[timestamps.length - 1] > maxAge) {
        entriesToDelete.push(key);
      }
    });

    entriesToDelete.forEach((key) => this.cache.delete(key));
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Rate limit middleware for API routes
 */
export async function withRateLimit(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  options?: RateLimitOptions
): Promise<NextResponse> {
  // Get identifier from IP or X-Forwarded-For
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';

  const identifier = `${ip}:${req.nextUrl.pathname}`;

  const result = await rateLimiter.check(identifier, options);

  if (!result.success) {
    logger.warn('Rate limit exceeded', { identifier, path: req.nextUrl.pathname });

    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  const response = await handler(req);

  // Add rate limit headers to successful responses
  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', result.reset.toString());

  return response;
}
