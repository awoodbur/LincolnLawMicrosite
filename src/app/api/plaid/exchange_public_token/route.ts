import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { exchangePublicToken, getFinancialSummary, plaidClient } from '@/lib/plaid/client';
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
    const accessToken = result.access_token;

    // Fetch sandbox financial data (transactions, identity, liabilities)
    logger.info('Fetching Plaid sandbox data', { leadId });

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    const startDateStr = startDate.toISOString().split('T')[0];

    const [transactionsResponse, identityResponse, liabilitiesResponse] = await Promise.all([
      plaidClient.transactionsGet({
        access_token: accessToken,
        start_date: startDateStr,
        end_date: endDate,
      }),
      plaidClient.identityGet({
        access_token: accessToken,
      }),
      plaidClient.liabilitiesGet({
        access_token: accessToken,
      }).catch(() => null), // Liabilities might not be available for all accounts
    ]);

    // Extract summary data
    const transactionsSummary = {
      total: transactionsResponse.data.total_transactions,
      accounts: transactionsResponse.data.accounts.length,
      transactions: transactionsResponse.data.transactions.slice(0, 10), // First 10 for sample
    };

    const identitySummary = {
      name: identityResponse.data.accounts?.[0]?.owners?.[0]?.names?.[0] || 'Unknown',
      email: identityResponse.data.accounts?.[0]?.owners?.[0]?.emails?.[0]?.data || null,
      accounts: identityResponse.data.accounts.length,
    };

    const liabilitiesSummary = liabilitiesResponse
      ? {
          credit: liabilitiesResponse.data.liabilities?.credit?.map((c) => ({
            name: c.account_id,
            balance: c.aprs?.[0]?.balance_subject_to_apr || 0,
          })) || [],
          student: liabilitiesResponse.data.liabilities?.student || [],
        }
      : null;

    // Log sandbox summary (for dev purposes)
    logger.info('🔍 Plaid Sandbox Data Summary', {
      leadId,
      identity: identitySummary.name,
      transactions: transactionsSummary.total,
      liabilities: liabilitiesSummary ? 'Available' : 'Not available',
      sandbox: true,
    });

    // Store access token in PlaidSummary (server-side only)
    // Check if PlaidSummary already exists
    const existingSummary = await db.plaidSummary.findUnique({
      where: { leadId },
    });

    const summaryData = {
      accessToken, // ONLY stored server-side, never sent to client
      itemId: result.item_id,
      transactionsCount: transactionsSummary.total,
      accountsCount: transactionsSummary.accounts,
      identity: identitySummary,
      liabilities: liabilitiesSummary,
      estimatedMonthlyIncome: transactionsSummary.total > 0 ? 3500 : 0, // Sandbox estimate
      estimatedMonthlyExpenses: transactionsSummary.total > 0 ? 2800 : 0,
      sandbox: true,
      fetchedAt: new Date().toISOString(),
    };

    if (existingSummary) {
      // Update existing
      await db.plaidSummary.update({
        where: { leadId },
        data: {
          summaryJson: JSON.stringify(summaryData),
        },
      });
    } else {
      // Create new
      await db.plaidSummary.create({
        data: {
          leadId,
          summaryJson: JSON.stringify(summaryData),
        },
      });
    }

    // Financial snapshot data is now stored in PlaidSummary.summaryJson
    // For production, you may want to create a separate FinancialSnapshot model

    // Create audit log
    await db.auditLog.create({
      data: {
        leadId,
        actor: 'user',
        event: 'plaid_linked',
        payloadJson: JSON.stringify({
          itemId: result.item_id,
          sandbox: true,
          transactionsCount: transactionsSummary.total,
          accountsCount: transactionsSummary.accounts,
          // Never log the access_token
        }),
      },
    });

    logger.info('Plaid account linked successfully', { leadId, sandbox: true });

    return NextResponse.json({
      success: true,
      itemId: result.item_id,
      sandbox: true,
      summary: {
        transactions: transactionsSummary.total,
        accounts: transactionsSummary.accounts,
        identity: identitySummary.name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    logger.error('Failed to exchange Plaid token', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
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
