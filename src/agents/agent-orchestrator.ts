import { runCoreSummaryAgent } from "./core-summary.agent";
import { runFinancialGoalAgent } from "./financial-goal.agent";
import { runQuestionSuggestionAgent } from "./question-suggestion.agent";
import { getFinancialData } from "../services/data.service";
import {
  getCachedAgentOutput,
  setCachedAgentOutput,
} from "../services/cache.service";
import { AgentResult } from "../types/agent.types";

/**
 * Main agent orchestrator.
 *
 * Execution order:
 *  1. CoreSummaryAgent   ← must run first
 *  2. FinancialGoalAgent + QuestionSuggestionAgent ← run in parallel
 *
 * Results are cached in-memory for 24 hours.
 */
export async function orchestrateAgents(userId: string): Promise<AgentResult> {
  // ── 1. Check in-memory cache ──────────────────────────────────────────────
  const cached = await getCachedAgentOutput(userId);
  if (cached) {
    console.log(`[Orchestrator] Cache hit for user: ${userId}`);
    return cached;
  }

  console.log(`[Orchestrator] Cache miss — running agents for user: ${userId}`);

  // ── 2. Fetch financial data from JSON store ───────────────────────────────
  const financialData = await getFinancialData(userId);

  // ── 3. Core Summary Agent (must finish first) ─────────────────────────────
  const summary = await runCoreSummaryAgent(userId, financialData);

  // ── 4. Goal + Question agents in parallel ─────────────────────────────────
  const [goals, questions] = await Promise.all([
    runFinancialGoalAgent(summary),
    runQuestionSuggestionAgent(summary),
  ]);

  const result: AgentResult = { summary, goals, questions };

  // ── 5. Store in in-memory cache ───────────────────────────────────────────
  await setCachedAgentOutput(userId, result);

  console.log(`[Orchestrator] All agents complete for user: ${userId}`);
  return result;
}