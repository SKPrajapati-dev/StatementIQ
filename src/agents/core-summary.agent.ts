import { runCopilotPrompt, MODELS } from "./github-models.client";
import { FinancialData } from "../types/financial.types";
import { CoreSummary } from "../types/agent.types";

const SYSTEM_PROMPT = `
You are an expert financial analyst AI for a bank called StatementIQ.
You will be given a customer's financial data for the past 6 months including:
- Bank transactions (credits and debits)
- Active loans
- Fixed deposits (FD)
- Investment portfolio

Your job is to deeply analyze this data and return ONLY a valid JSON object with the following structure:
{
  "monthlyAvgIncome": <number: average monthly credit amount>,
  "monthlyAvgExpense": <number: average monthly debit amount>,
  "savingsRate": <number: percentage of income saved>,
  "topSpendingCategories": [
    { "category": <string>, "amount": <number>, "percentage": <number> }
  ],
  "unusualTransactions": [
    { "date": <string YYYY-MM-DD>, "description": <string>, "amount": <number>, "reason": <string explaining why it is unusual> }
  ],
  "loanBurdenRatio": <number: total monthly EMI divided by monthly income, as a percentage>,
  "fdHealthStatus": <"good" | "moderate" | "poor">,
  "investmentReturns": <number: overall portfolio return percentage>,
  "overallFinancialHealthScore": <number between 0 and 100>,
  "keyInsights": [<string>, ...],
  "warningFlags": [<string>, ...]
}

Rules:
- Return ONLY the JSON object. No explanation text, no markdown, no code blocks.
- keyInsights should have 3 to 5 short actionable bullet points.
- warningFlags should list any concerning patterns (empty array if none).
- Be accurate and conservative in your analysis.
`.trim();

export async function runCoreSummaryAgent(
  _userId: string,
  data: FinancialData
): Promise<CoreSummary> {
  console.log("[CoreSummaryAgent] Starting analysis...");

  // Limit payload size to stay within token limits
  const payload = {
    transactions: data.transactions.slice(0, 200),
    loans: data.loans,
    fdAccounts: data.fdAccounts,
    investments: data.investments,
    analysisPeriod: "last 6 months",
  };

  const raw = await runCopilotPrompt(
    SYSTEM_PROMPT,
    JSON.stringify(payload),
    MODELS.SMART
  );

  console.log("RAW::", raw)
  // Strip markdown code fences if the model wrapped the JSON
  const jsonStr = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  const summary = JSON.parse(jsonStr) as CoreSummary;
  console.log(
    `[CoreSummaryAgent] Done. Health score: ${summary.overallFinancialHealthScore}`
  );

  return summary;
}