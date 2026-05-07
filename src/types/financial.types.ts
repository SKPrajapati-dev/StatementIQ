export type TransactionType = "CREDIT" | "DEBIT";
export type LoanType = "HOME" | "AUTO" | "PERSONAL" | "STUDENT" | "BUSINESS";
export type LoanStatus = "ACTIVE" | "CLOSED" | "OVERDUE";;
export type FDStatus = "ACTIVE" | "MATURED" | "BROKEN" | "RENEWED";
export type InvestmentType = "MUTUAL_FUND" | "STOCK" | "BOND" | "ETF" | "NPS" | "PPF" | "GOLD";

export interface FinancialData {
    transactions: any[];
    loans: any[];
    fdAccounts: any[];
    investments: any[];
}

