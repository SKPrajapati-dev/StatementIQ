export const config = {
  cache: {
    agentTtlMs: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: "7d",
  },
  copilot: {
    timeout: 30000, // 30 seconds timeout for API calls
  },
};
