import { config } from "../config";
import { AgentResult } from "../types/agent.types";

/**
 * In-memory cache — replaces Redis.
 * Simple Map with TTL expiry checked on every read.
 * Resets when the server restarts (acceptable for dev/demo).
 */
interface CacheEntry {
  data: AgentResult;
  expiresAt: number; // epoch ms
}

const store = new Map<string, CacheEntry>();

export async function getCachedAgentOutput(userId: string): Promise<AgentResult | null> {
  const entry = store.get(userId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(userId);
    return null;
  }
  return entry.data;
}

export async function setCachedAgentOutput(
  userId: string,
  result: AgentResult,
  ttlMs: number = config.cache.agentTtlMs
): Promise<void> {
  store.set(userId, { data: result, expiresAt: Date.now() + ttlMs });
}

export async function invalidateAgentCache(userId: string): Promise<void> {
  store.delete(userId);
}