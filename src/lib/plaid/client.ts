import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  Products,
  CountryCode,
  LinkTokenCreateRequest,
  TransactionsGetRequest,
  IdentityGetRequest,
} from 'plaid';
import { env } from '../env';
import { logger } from '../logger';
import type {
  PlaidLinkTokenResponse,
  PlaidExchangeResponse,
  PlaidTransactionSummary,
  PlaidIdentitySummary,
  PlaidFinancialSummary,
} from './types';

/**
 * Plaid client configuration (lazy-initialized)
 */
let _plaidClient: PlaidApi | null = null;

function getPlaidClient(): PlaidApi {
  if (!env.PLAID_CLIENT_ID || !env.PLAID_SECRET) {
    throw new Error('Plaid credentials not configured. Please set PLAID_CLIENT_ID and PLAID_SECRET environment variables.');
  }

  if (!_plaidClient) {
    const configuration = new Configuration({
      basePath: PlaidEnvironments[env.PLAID_ENV as keyof typeof PlaidEnvironments],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': env.PLAID_CLIENT_ID,
          'PLAID-SECRET': env.PLAID_SECRET,
        },
      },
    });
    _plaidClient = new PlaidApi(configuration);
  }

  return _plaidClient;
}

// Export plaidClient as a getter for backward compatibility
export const plaidClient = new Proxy({} as PlaidApi, {
  get(_target, prop) {
    const client = getPlaidClient();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});

/**
 * Create a Plaid Link token for the client-side integration
 */
export async function createLinkToken(userId: string): Promise<PlaidLinkTokenResponse> {
  try {
    const client = getPlaidClient();
    const request: LinkTokenCreateRequest = {
      user: {
        client_user_id: userId,
      },
      client_name: 'Lincoln Law',
      products: env.PLAID_PRODUCTS.split(',') as Products[],
      country_codes: [CountryCode.Us],
      language: 'en',
    };

    const response = await client.linkTokenCreate(request);

    logger.info('Plaid link token created', { userId });

    return {
      link_token: response.data.link_token,
      expiration: response.data.expiration,
    };
  } catch (error) {
    logger.error('Failed to create Plaid link token', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId,
    });
    throw new Error('Failed to create link token');
  }
}

/**
 * Exchange a public token for an access token
 */
export async function exchangePublicToken(publicToken: string): Promise<PlaidExchangeResponse> {
  try {
    const client = getPlaidClient();
    const response = await client.itemPublicTokenExchange({
      public_token: publicToken,
    });

    logger.info('Plaid public token exchanged');

    return {
      access_token: response.data.access_token,
      item_id: response.data.item_id,
    };
  } catch (error) {
    logger.error('Failed to exchange public token', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw new Error('Failed to exchange public token');
  }
}

/**
 * Get transaction summary from Plaid
 * Returns aggregated data only, not individual transactions
 */
export async function getTransactionSummary(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<PlaidTransactionSummary> {
  try {
    const client = getPlaidClient();
    const request: TransactionsGetRequest = {
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
    };

    const response = await client.transactionsGet(request);
    const transactions = response.data.transactions;

    // Calculate summary statistics
    let totalIncome = 0;
    let totalExpenses = 0;

    for (const txn of transactions) {
      if (txn.amount < 0) {
        // Negative amount = income/credit in Plaid
        totalIncome += Math.abs(txn.amount);
      } else {
        // Positive amount = expense/debit
        totalExpenses += txn.amount;
      }
    }

    // Calculate monthly averages
    const start = new Date(startDate);
    const end = new Date(endDate);
    const monthsDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
    const periodMonths = Math.max(monthsDiff, 1);

    const monthlyAverageIncome = totalIncome / periodMonths;
    const monthlyAverageExpenses = totalExpenses / periodMonths;
    const cashflowMonthly = monthlyAverageIncome - monthlyAverageExpenses;

    logger.info('Transaction summary calculated', {
      transactionCount: transactions.length,
      periodMonths: periodMonths.toFixed(1),
      monthlyAverageIncome,
      monthlyAverageExpenses,
    });

    return {
      totalIncome,
      totalExpenses,
      monthlyAverageIncome,
      monthlyAverageExpenses,
      cashflowMonthly,
      periodMonths,
    };
  } catch (error) {
    logger.error('Failed to get transaction summary', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw new Error('Failed to get transaction summary');
  }
}

/**
 * Get identity information from Plaid
 * Returns summarized data only
 */
export async function getIdentitySummary(accessToken: string): Promise<PlaidIdentitySummary> {
  try {
    const client = getPlaidClient();
    const request: IdentityGetRequest = {
      access_token: accessToken,
    };

    const response = await client.identityGet(request);
    const accounts = response.data.accounts;

    // Extract unique values across all accounts
    const names: string[] = [];
    const emails: string[] = [];
    const phoneNumbers: string[] = [];
    const addresses: string[] = [];

    for (const account of accounts) {
      if (account.owners) {
        for (const owner of account.owners) {
          // Names
          if (owner.names) {
            names.push(...owner.names);
          }

          // Emails
          if (owner.emails) {
            emails.push(...owner.emails.map((e) => e.data));
          }

          // Phone numbers
          if (owner.phone_numbers) {
            phoneNumbers.push(...owner.phone_numbers.map((p) => p.data));
          }

          // Addresses
          if (owner.addresses) {
            addresses.push(
              ...owner.addresses.map((a) => {
                const parts = [a.data.street, a.data.city, a.data.region, a.data.postal_code].filter(
                  Boolean
                );
                return parts.join(', ');
              })
            );
          }
        }
      }
    }

    logger.info('Identity summary retrieved', {
      namesCount: names.length,
      emailsCount: emails.length,
    });

    return {
      names: Array.from(new Set(names)),
      emails: Array.from(new Set(emails)),
      phoneNumbers: Array.from(new Set(phoneNumbers)),
      addresses: Array.from(new Set(addresses)),
    };
  } catch (error) {
    logger.error('Failed to get identity summary', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw new Error('Failed to get identity summary');
  }
}

/**
 * Get comprehensive financial summary
 */
export async function getFinancialSummary(accessToken: string): Promise<PlaidFinancialSummary> {
  // Get transactions from the last 3 months
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);
  const startDateStr = startDate.toISOString().split('T')[0];

  const [transactions, identity] = await Promise.all([
    getTransactionSummary(accessToken, startDateStr, endDate),
    getIdentitySummary(accessToken),
  ]);

  return {
    transactions,
    identity,
  };
}
