/**
 * db.ts – In-memory JSON data store
 *
 * Replaces Prisma + PostgreSQL. Loads all mock data from src/data/*.json
 * at startup and keeps it in memory. No database or Docker required.
 *
 * At startup the demo user's password placeholder is replaced with a real
 * bcrypt hash so login works immediately without a separate seed step.
 */

import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

// ─── Types (mirrors the JSON shapes) ─────────────────────────────────────────
export interface DbUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  accountNumber: string;
  phone: string | null;
  createdAt: string;
}

export interface DbTransaction {
  id: string;
  userId: string;
  date: string;
  description: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  category: string | null;
  merchant: string | null;
  balance: number;
  reference: string | null;
}

export interface DbLoan {
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
  status: string;
  bankName: string;
}

export interface DbFDAccount {
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
  status: string;
  bankName: string;
}

export interface DbInvestment {
  id: string;
  userId: string;
  type: string;
  name: string;
  folio: string | null;
  units: number;
  buyPrice: number;
  currentPrice: number;
  investedAmount: number;
  currentValue: number;
  purchaseDate: string;
}

// ─── Load JSON files ──────────────────────────────────────────────────────────
function loadJson<T>(filename: string): T {
  const filePath = path.join(__dirname, "../data", filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

// ─── In-memory collections ────────────────────────────────────────────────────
export const db = {
  users: loadJson<DbUser[]>("users.json"),
  transactions: loadJson<DbTransaction[]>("transactions.json"),
  loans: loadJson<DbLoan[]>("loans.json"),
  fdAccounts: loadJson<DbFDAccount[]>("fd-accounts.json"),
  investments: loadJson<DbInvestment[]>("investments.json"),
};

// ─── Bootstrap: hash the demo user's password once at startup ────────────────
const DEMO_PASSWORD = "Password@123";
const PLACEHOLDER = "__BCRYPT_PLACEHOLDER__";

export async function initDb(): Promise<void> {
  for (const user of db.users) {
    if (user.passwordHash === PLACEHOLDER) {
      user.passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
      console.log(`✅ [DB] Initialised password hash for demo user: ${user.email}`);
    }
  }
  console.log(`✅ [DB] Loaded ${db.transactions.length} transactions, ${db.loans.length} loans, ${db.fdAccounts.length} FDs, ${db.investments.length} investments`);
}