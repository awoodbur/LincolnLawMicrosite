import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createLinkToken } from '@/lib/plaid/client';
import { logger } from '@/lib/logger';
import { withRateLimit } from '@/lib/rateLimit';

const schema = z.object({
  userId: z.string(),
});

async function handleCreateLinkToken(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = schema.parse(body);

    const result = await createLinkToken(userId);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    logger.error('Failed to create Plaid link token', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { error: 'Failed to create link token' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return withRateLimit(req, handleCreateLinkToken, {
    interval: 60000,
    uniqueTokenPerInterval: 10,
  });
}
