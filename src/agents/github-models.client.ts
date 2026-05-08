import { CopilotClient, approveAll } from "@github/copilot-sdk";

export const MODELS = {
  /** Use for deep analysis tasks: core summary, financial goals */
  SMART: "gpt-4.1",
  /** Use for lighter tasks: question suggestions, short summaries */
  FAST: "gpt-4.1",
} as const;

/**
 * Runs a single prompt+system-instruction pair through the Copilot SDK.
 * Creates a fresh client + session per call (safe for concurrent use).
 *
 * @param systemInstructions  The "system prompt" text
 * @param userContent         The user-facing input (plain text or JSON string)
 * @param model               Which model to use (default: SMART)
 * @returns The assistant's full text response
 */
export async function runCopilotPrompt(
  systemInstructions: string,
  userContent: string,
  model: string = MODELS.SMART
): Promise<string> {
  // No token needed — uses the logged-in GitHub Copilot CLI session automatically
  const client = new CopilotClient({
    gitHubToken: process.env.COPILOT_GITHUB_TOKEN,
    useLoggedInUser: false,
  });

  await client.start();

  // Combine system instructions + user content into one prompt since
  // the Copilot SDK's `send` API takes a single `prompt` string.
  const fullPrompt = `${systemInstructions}\n\n---\n\n${userContent}`;

  const session = await client.createSession({
    model,
    onPermissionRequest: approveAll,
  });

  let responseText = "";

  // Log streaming chunks if they arrive
  session.on("assistant.message_delta", (event: any) => {
    console.log("[CopilotSession] Received message chunk:", event.data?.deltaContent);
  });

  // Wait for the final message and session idle state
  const response = await session.sendAndWait({ prompt: fullPrompt });
  responseText = response?.data?.content ?? "";


  await session.disconnect();
  await client.stop();

  return responseText.trim();
}