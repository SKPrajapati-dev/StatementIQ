import { runCopilotPrompt, MODELS } from "./github-models.client";
import { CoreSummary } from "../types/agent.types";

const SYSTEM_PROMPT = `
You are a helpful financial assistant AI at a bank called StatementIQ.
You will be given a customer's financial health summary.

Based on this summary, generate 6 to 8 insightful questions the customer SHOULD ask
about their personal finances. These questions must be:
- Specific to THEIR actual financial data (mention their real patterns)
- Actionable — asking something that leads to useful advice
- Varied — cover different areas: spending, savings, loans, investments, goals
- Written in first person as if the customer is asking ("Why is my...", "Can I...", etc.)

Return ONLY a valid JSON object in this format:
{
  "questions": [
    "<question 1>",
    "<question 2>",
    ...
  ]
}

Return ONLY the JSON. No extra text, no markdown, no code blocks.
`.trim();

export async function runQuestionSuggestionAgent(
  summary: CoreSummary
): Promise<string[]> {
  console.log("[QuestionSuggestionAgent] Generating suggested questions...");

  const raw = await runCopilotPrompt(
    SYSTEM_PROMPT,
    JSON.stringify(summary),
    MODELS.FAST
  );

  // Strip markdown code fences if present
  const jsonStr = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  const parsed = JSON.parse(jsonStr);
  const questions: string[] = parsed.questions ?? [];

  console.log(`[QuestionSuggestionAgent] Generated ${questions.length} questions`);
  return questions;
}