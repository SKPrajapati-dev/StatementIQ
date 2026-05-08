// ─── User / Auth ───────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  accountNumber: string;
  phone?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  accountNumber: string;
  phone?: string;
}

// ─── Financial ─────────────────────────────────────────────────────────────
export type TransactionType = "CREDIT" | "DEBIT";
export type LoanStatus = "ACTIVE" | "CLOSED" | "OVERDUE";
export type FDStatus = "ACTIVE" | "MATURED" | "BROKEN" | "RENEWED";
export type InvestmentType = "MUTUAL_FUND" | "STOCK" | "BOND" | "GOLD" | "PPF" | "NPS";

export interface Transaction {
  id: string;
  userId: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string | null;
  merchant: string | null;
  balance: number;
  reference: string | null;
}

export interface Loan {
  id: string;
  userId: string;
  loanType: string;
  loanAccountNumber: string;
  principalAmount: number;
  outstandingAmount: number;
  interestRate: number;
  emiAmount: number;
  tenureMonths: number;
  startDate: string;
  endDate: string;
  nextEmiDate: string | null;
  status: LoanStatus;
  bankName: string;
}

export interface FDAccount {
  id: string;
  userId: string;
  fdNumber: string;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  startDate: string;
  maturityDate: string;
  maturityAmount: number;
  interestEarned: number;
  autoRenew: boolean;
  status: FDStatus;
  bankName: string;
}

export interface Investment {
  id: string;
  userId: string;
  type: InvestmentType;
  name: string;
  folio: string | null;
  units: number;
  buyPrice: number;
  currentPrice: number;
  investedAmount: number;
  currentValue: number;
  purchaseDate: string;
}

// ─── Agent / AI ────────────────────────────────────────────────────────────
export interface SpendingCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface UnusualTransaction {
  date: string;
  description: string;
  amount: number;
  reason: string;
}

export interface CoreSummary {
  monthlyAvgIncome: number;
  monthlyAvgExpense: number;
  savingsRate: number;
  topSpendingCategories: SpendingCategory[];
  unusualTransactions: UnusualTransaction[];
  loanBurdenRatio: number;
  fdHealthStatus: "good" | "moderate" | "poor";
  investmentReturns: number;
  overallFinancialHealthScore: number;
  keyInsights: string[];
  warningFlags: string[];
}

export interface FinancialGoal {
  title: string;
  description: string;
  targetAmount: number;
  timeline: "short" | "medium" | "long";
  monthlySavings: number;
  priority: number;
}

export interface AgentResult {
  summary: CoreSummary;
  goals: FinancialGoal[];
  questions: string[];
}

export interface QuestionAnswer {
  question: string;
  answer: string;
  keyPoints: string[];
  recommendation: string;
  timestamp: string;
}

export interface AgentStatus {
  hasData: boolean;
  message: string;
}
