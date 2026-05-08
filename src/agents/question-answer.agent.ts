import { runCopilotPrompt, MODELS } from "./github-models.client";
import { CoreSummary } from "../types/agent.types";

const SYSTEM_PROMPT = `
You are a helpful financial assistant AI at a bank called StatementIQ.
You will be given:
1. A customer's financial health summary
2. A specific question the customer is asking

Your job is to provide a clear, actionable answer to their question based on their actual financial data.

Rules:
- Reference specific numbers and patterns from their financial data
- Provide actionable recommendations
- Keep the answer concise (2-3 paragraphs max)
- Write in a friendly, conversational tone
- Return ONLY a valid JSON object in this format:

{
  "answer": "<your detailed answer here>",
  "keyPoints": [
    "<key point 1>",
    "<key point 2>",
    "<key point 3>"
  ],
  "recommendation": "<specific action the user should take>"
}

Return ONLY the JSON. No extra text, no markdown, no code blocks.
`.trim();

export interface QuestionAnswerOutput {
  answer: string;
  keyPoints: string[];
  recommendation: string;
}

export async function runQuestionAnswerAgent(
  summary: CoreSummary,
  question: string
): Promise<QuestionAnswerOutput> {
  console.log("[QuestionAnswerAgent] Answering question:", question);

  const payload = {
    financialSummary: summary,
    customerQuestion: question,
  };

  const raw = await runCopilotPrompt(
    SYSTEM_PROMPT,
    JSON.stringify(payload),
    MODELS.FAST
  );

  // Strip markdown code fences if present
  const jsonStr = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(jsonStr);

  const result: QuestionAnswerOutput = {
    answer: parsed.answer ?? "",
    keyPoints: parsed.keyPoints ?? [],
    recommendation: parsed.recommendation ?? "",
  };

  console.log("[QuestionAnswerAgent] Question answered successfully");
  return result;
}
