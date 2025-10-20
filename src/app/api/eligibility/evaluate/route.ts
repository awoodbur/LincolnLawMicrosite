import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { evaluateChapterEligibility } from '@/lib/eligibility/engine';
import { eligibilityEvaluationSchema } from '@/lib/validation/intake';
import { logger } from '@/lib/logger';
import { rateLimiter } from '@/lib/rateLimit';

/**
 * POST /api/eligibility/evaluate
 *
 * Evaluates bankruptcy eligibility based on detailed financial inputs.
 * Returns Chapter 7/13 assessment with eligibility rating and recommendation.
 */
export async function POST(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
  const identifier = `${ip}:${req.nextUrl.pathname}`;

  // Rate limiting
  const rateLimitResult = await rateLimiter.check(identifier);
  if (!rateLimitResult.success) {
    logger.warn('Rate limit exceeded for eligibility evaluation', { ip });
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    // Parse and validate request body
    const body = await req.json();
    const validatedInput = eligibilityEvaluationSchema.parse(body);

    logger.info('Eligibility evaluation request received', {
      householdSize: validatedInput.householdSize,
      ip,
    });

    // Evaluate eligibility
    const result = evaluateChapterEligibility(validatedInput);

    logger.info('Eligibility evaluation completed successfully', {
      chapter7Eligibility: result.chapter7Eligibility,
      recommendedChapter: result.recommendedChapter,
      ip,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Invalid eligibility evaluation input', {
        errors: error.errors,
        ip,
      });
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    logger.error('Error during eligibility evaluation', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip,
    });

    return NextResponse.json(
      {
        error: 'Internal server error. Please try again later.',
      },
      { status: 500 }
    );
  }
}
