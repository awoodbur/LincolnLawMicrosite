/**
 * Plaid-related types and interfaces
 */

export interface PlaidLinkTokenResponse {
  link_token: string;
  expiration: string;
}

export interface PlaidExchangeResponse {
  access_token: string;
  item_id: string;
}

export interface PlaidTransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  monthlyAverageIncome: number;
  monthlyAverageExpenses: number;
  cashflowMonthly: number;
  periodMonths: number;
}

export interface PlaidIdentitySummary {
  names: string[];
  emails: string[];
  phoneNumbers: string[];
  addresses: string[];
}

export interface PlaidFinancialSummary {
  transactions: PlaidTransactionSummary;
  identity: PlaidIdentitySummary;
}
