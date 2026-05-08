export type TransactionType = "CREDIT" | "DEBIT";
export type LoanType = "HOME" | "PERSONAL" | "AUTO" | "EDUCATION" | "BUSINESS";
export type LoanStatus = "ACTIVE" | "CLOSED" | "OVERDUE";
export type FDStatus = "ACTIVE" | "MATURED" | "BROKEN" | "RENEWED";
export type InvestmentType = "MUTUAL_FUND" | "STOCK" | "BOND" | "GOLD" | "PPF" | "NPS";

export interface FinancialData {
  transactions: any[];
  loans: any[];
  fdAccounts: any[];
  investments: any[];
}
