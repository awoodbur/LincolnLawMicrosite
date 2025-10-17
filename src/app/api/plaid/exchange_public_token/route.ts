import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { exchangePublicToken } from '@/lib/plaid/client';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { withRateLimit } from '@/lib/rateLimit';

const schema = z.object({
  publicToken: z.string(),
  leadId: z.string(),
});

async function handleExchangePublicToken(req: NextRequest) {
  try {
    const body = await req.json();
    const { publicToken, leadId } = schema.parse(body);

    // Exchange token
    const result = await exchangePublicToken(publicToken);

    // Store access token with lead (server-side only)
    await db.lead.update({
      where: { id: leadId },
      data: {
        plaidAccessToken: result.access_token,
      },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        leadId,
        actor: 'user',
        event: 'plaid_linked',
        payloadJson: JSON.stringify({
          itemId: result.item_id,
          // Never log the access_token
        }),
      },
    });

    logger.info('Plaid account linked', { leadId });

    return NextResponse.json({
      success: true,
      itemId: result.item_id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    logger.error('Failed to exchange Plaid token', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { error: 'Failed to link account' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return withRateLimit(req, handleExchangePublicToken, {
    interval: 60000,
    uniqueTokenPerInterval: 10,
  });
}
