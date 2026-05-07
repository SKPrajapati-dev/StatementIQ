import { db } from "../lib/db";
import { FinancialData } from "../types/financial.types";
import { subMonths } from "../lib/date-utils";

/**
 * Aggregates all financial data for a user (last 6 months of transactions).
 * This is the input payload for the CoreSummaryAgent.
 */
export async function getFinancialData(userId: string): Promise<FinancialData> {
  const since = subMonths(new Date(), 6);

  const transactions = db.transactions.filter(
    (tx) => tx.userId === userId && new Date(tx.date) >= since
  );
  const loans = db.loans.filter((l) => l.userId === userId);
  const fdAccounts = db.fdAccounts.filter((fd) => fd.userId === userId);
  const investments = db.investments.filter((inv) => inv.userId === userId);

  return { transactions, loans, fdAccounts, investments };
}