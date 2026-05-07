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

export interface FinancialGoalOutput {
  title: string;
  description: string;
  targetAmount: number;
  timeline: "short" | "medium" | "long";
  monthlySavings: number;
  priority: number;
}

export interface AssetResult {
  summary: CoreSummary;
  goals: FinancialGoalOutput[];
  questions: string[];
}
