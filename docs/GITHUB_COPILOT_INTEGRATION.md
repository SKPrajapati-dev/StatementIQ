# GitHub Copilot SDK Integration Guide for StatementIQ

## Overview
This document details how to integrate GitHub Copilot SDK for the StatementIQ AI agents. We'll use Claude 3.5 Sonnet model via the Anthropic SDK to power our three main agents.

---

## 1. Setup & Configuration

### 1.1 Installation

```bash
npm install @anthropic-ai/sdk dotenv
```

### 1.2 Environment Configuration

Create `.env` file:
```
GITHUB_COPILOT_API_KEY=your_api_key_here
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/statementiq
REDIS_URL=redis://localhost:6379
```

### 1.3 Initialize Copilot Client

**File: `backend/src/config/copilot.js`**

```javascript
const Anthropic = require("@anthropic-ai/sdk").default;

class CopilotClient {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.GITHUB_COPILOT_API_KEY
    });
  }

  async sendMessage(userMessage, systemPrompt = null, conversationHistory = []) {
    const messages = [
      ...conversationHistory,
      { role: "user", content: userMessage }
    ];

    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages
    });

    return {
      content: response.content[0].text,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens
      },
      stopReason: response.stop_reason
    };
  }
}

module.exports = new CopilotClient();
```

---

## 2. Core Agent Implementation

### 2.1 Core Agent - 6+ Month Data Summarizer

**File: `backend/src/agents/coreAgent.js`**

```javascript
const CopilotClient = require("../config/copilot");
const TransactionService = require("../services/transaction.service");

class CoreAgent {
  constructor() {
    this.name = "CoreAgent";
    this.description = "Summarizes 6+ months of account data and financial patterns";
  }

  async execute(userId, accountId) {
    try {
      // 1. Fetch 6+ months of transaction data
      const transactions = await TransactionService.getTransactions(
        accountId,
        { months: 6 }
      );

      // 2. Fetch account details
      const accountDetails = await TransactionService.getAccountDetails(accountId);

      // 3. Calculate basic metrics
      const metrics = this.calculateMetrics(transactions);

      // 4. Generate summary using Copilot
      const summary = await this.generateSummary(
        transactions,
        accountDetails,
        metrics
      );

      // 5. Extract insights
      const insights = await this.extractInsights(summary, metrics);

      return {
        success: true,
        data: {
          summary,
          insights,
          metrics,
          generatedAt: new Date()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  calculateMetrics(transactions) {
    const credits = transactions.filter(t => t.type === 'credit');
    const debits = transactions.filter(t => t.type === 'debit');

    const totalIncome = credits.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = debits.reduce((sum, t) => sum + t.amount, 0);
    const avgMonthlyIncome = totalIncome / 6;
    const avgMonthlyExpense = totalExpense / 6;
    const savingsRate = ((totalIncome - totalExpense) / totalIncome * 100).toFixed(2);

    return {
      totalIncome,
      totalExpense,
      avgMonthlyIncome,
      avgMonthlyExpense,
      savingsRate,
      transactionCount: transactions.length
    };
  }

  async generateSummary(transactions, accountDetails, metrics) {
    const systemPrompt = `You are a financial analyst. Analyze bank account data and provide:
1. Spending pattern analysis
2. Income stability assessment
3. Financial health score (1-100)
4. Key observations and concerns
5. Top spending categories

Be concise but comprehensive. Format your response with clear sections.`;

    const userMessage = `
Analyze this financial data:

Account: ${accountDetails.accountNumber}
Account Type: ${accountDetails.type}
Current Balance: $${accountDetails.balance}

6-Month Metrics:
- Total Income: $${metrics.totalIncome}
- Total Expense: $${metrics.totalExpense}
- Avg Monthly Income: $${metrics.avgMonthlyIncome}
- Avg Monthly Expense: $${metrics.avgMonthlyExpense}
- Savings Rate: ${metrics.savingsRate}%
- Transaction Count: ${metrics.transactionCount}

Recent Transactions (sample):
${JSON.stringify(transactions.slice(0, 20), null, 2)}
    `;

    const response = await CopilotClient.sendMessage(userMessage, systemPrompt);
    return response.content;
  }

  async extractInsights(summary, metrics) {
    const systemPrompt = `Extract key financial insights from the summary. Return as JSON with:
{
  "healthScore": number,
  "topConcerns": [string],
  "opportunities": [string],
  "recommendations": [string]
}`;

    const userMessage = `From this financial summary, extract insights:
${summary}

Additional metrics: Savings Rate: ${metrics.savingsRate}%`;

    const response = await CopilotClient.sendMessage(userMessage, systemPrompt);
    
    try {
      return JSON.parse(response.content);
    } catch {
      return {
        healthScore: 0,
        topConcerns: [],
        opportunities: [],
        recommendations: []
      };
    }
  }
}

module.exports = new CoreAgent();
```

---

## 3. Financial Goal Agent

### 3.1 Personalized Financial Goal Agent

**File: `backend/src/agents/financialGoalAgent.js`**

```javascript
const CopilotClient = require("../config/copilot");
const UserService = require("../services/user.service");

class FinancialGoalAgent {
  constructor() {
    this.name = "FinancialGoalAgent";
    this.description = "Generates personalized financial goals based on user profile";
  }

  async execute(userId, coreAgentOutput) {
    try {
      // 1. Fetch user profile
      const userProfile = await UserService.getUserProfile(userId);

      // 2. Get financial summary from core agent
      const financialSummary = coreAgentOutput.summary;
      const metrics = coreAgentOutput.metrics;

      // 3. Generate personalized goals
      const goals = await this.generateGoals(userProfile, metrics, financialSummary);

      // 4. Score and prioritize goals
      const prioritizedGoals = this.prioritizeGoals(goals);

      // 5. Create action plans for each goal
      const goalsWithPlans = await this.createActionPlans(
        prioritizedGoals,
        metrics
      );

      return {
        success: true,
        data: {
          goals: goalsWithPlans,
          generatedAt: new Date()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async generateGoals(userProfile, metrics, financialSummary) {
    const systemPrompt = `You are a financial advisor. Generate 5-7 personalized financial goals based on the user profile and financial situation.

Format your response as a JSON array with this structure:
[
  {
    "name": "Goal Name",
    "type": "savings|investment|debt_reduction|income_growth|emergency_fund",
    "description": "Brief description",
    "timeframe": "3_months|6_months|1_year|3_years|5_years",
    "estimatedAmount": number,
    "priority": "high|medium|low",
    "reasoning": "Why this goal is important"
  }
]`;

    const userMessage = `
Create personalized financial goals for:

User Profile:
- Age: ${userProfile.age}
- Occupation: ${userProfile.occupation}
- Family Status: ${userProfile.familyStatus}
- Risk Tolerance: ${userProfile.riskTolerance}
- Income: $${userProfile.annualIncome}

Current Financial Status:
- Savings Rate: ${metrics.savingsRate}%
- Average Monthly Income: $${metrics.avgMonthlyIncome}
- Average Monthly Expense: $${metrics.avgMonthlyExpense}
- Current Debt: ${metrics.debtAmount || 'None'}

Financial Summary:
${financialSummary}
    `;

    const response = await CopilotClient.sendMessage(userMessage, systemPrompt);
    
    try {
      return JSON.parse(response.content);
    } catch {
      return [];
    }
  }

  prioritizeGoals(goals) {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return goals.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  async createActionPlans(goals, metrics) {
    const systemPrompt = `Create actionable step-by-step plans for achieving each goal. Return as JSON.`;

    for (const goal of goals) {
      const userMessage = `Create an action plan for this goal:
Goal: ${goal.name}
Type: ${goal.type}
Timeframe: ${goal.timeframe}
Target Amount: $${goal.estimatedAmount}
Current Monthly Savings: $${metrics.avgMonthlyIncome - metrics.avgMonthlyExpense}

Provide 5-7 specific, measurable action steps.`;

      const response = await CopilotClient.sendMessage(userMessage, systemPrompt);
      goal.actionPlan = response.content;
    }

    return goals;
  }
}

module.exports = new FinancialGoalAgent();
```

---

## 4. Suggested Questions Agent

### 4.1 Question Generation Agent

**File: `backend/src/agents/suggestedQuestionsAgent.js`**

```javascript
const CopilotClient = require("../config/copilot");

class SuggestedQuestionsAgent {
  constructor() {
    this.name = "SuggestedQuestionsAgent";
    this.description = "Generates contextual questions based on financial summaries";
  }

  async execute(userId, coreAgentOutput, goalAgentOutput, userChatHistory = []) {
    try {
      // 1. Prepare context
      const context = {
        summary: coreAgentOutput.summary,
        insights: coreAgentOutput.insights,
        goals: goalAgentOutput.goals,
        history: userChatHistory
      };

      // 2. Generate initial questions
      const questions = await this.generateQuestions(context);

      // 3. Rank questions by relevance
      const rankedQuestions = this.rankQuestions(questions, context);

      // 4. Select top 5 questions
      const topQuestions = rankedQuestions.slice(0, 5);

      return {
        success: true,
        data: {
          questions: topQuestions,
          generatedAt: new Date()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async generateQuestions(context) {
    const systemPrompt = `You are a financial advisor assistant. Generate insightful, actionable questions about the user's finances based on their account summary and goals.

Focus on:
1. Opportunities they might be missing
2. Concerns based on their spending patterns
3. Ways to optimize their financial goals
4. Investments and savings strategies

Return as JSON array:
[
  {
    "question": "The actual question",
    "category": "spending|savings|investment|debt|goals",
    "priority": 1-5,
    "reason": "Why this question is important"
  }
]`;

    const userMessage = `
Based on this financial context, generate 8-10 insightful questions:

Financial Summary:
${context.summary}

Key Insights:
${JSON.stringify(context.insights, null, 2)}

Financial Goals:
${JSON.stringify(context.goals, null, 2)}
    `;

    const response = await CopilotClient.sendMessage(userMessage, systemPrompt);
    
    try {
      return JSON.parse(response.content);
    } catch {
      return [];
    }
  }

  rankQuestions(questions, context) {
    // Score questions based on relevance
    return questions
      .map(q => ({
        ...q,
        relevanceScore: this.calculateRelevance(q, context)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .map(q => {
        delete q.relevanceScore;
        return q;
      });
  }

  calculateRelevance(question, context) {
    let score = question.priority;
    
    // Boost score if question relates to insights
    if (question.reason && context.insights) {
      const concernMatch = context.insights.topConcerns?.some(c =>
        question.reason.toLowerCase().includes(c.toLowerCase())
      );
      if (concernMatch) score += 2;
    }

    // Check if already discussed
    if (context.history && context.history.length > 0) {
      const alreadyAsked = context.history.some(msg =>
        msg.content.toLowerCase().includes(question.question.toLowerCase())
      );
      if (alreadyAsked) score -= 1;
    }

    return score;
  }
}

module.exports = new SuggestedQuestionsAgent();
```

---

## 5. Agent Orchestrator

### 5.1 Master Orchestrator

**File: `backend/src/agents/agentOrchestrator.js`**

```javascript
const CoreAgent = require("./coreAgent");
const FinancialGoalAgent = require("./financialGoalAgent");
const SuggestedQuestionsAgent = require("./suggestedQuestionsAgent");
const CacheService = require("../services/cacheService");
const AgentOutputService = require("../services/agentOutput.service");

class AgentOrchestrator {
  async executeFullAnalysis(userId, accountId) {
    try {
      console.log(`Starting full analysis for user ${userId}`);

      // 1. Execute Core Agent
      const coreResult = await this.executeWithCache(
        `core_${userId}_${accountId}`,
        () => CoreAgent.execute(userId, accountId)
      );

      if (!coreResult.success) throw new Error("Core Agent failed");

      // 2. Execute Financial Goal Agent
      const goalResult = await this.executeWithCache(
        `goal_${userId}_${accountId}`,
        () => FinancialGoalAgent.execute(userId, coreResult.data)
      );

      if (!goalResult.success) throw new Error("Goal Agent failed");

      // 3. Execute Suggested Questions Agent
      const questionResult = await SuggestedQuestionsAgent.execute(
        userId,
        coreResult.data,
        goalResult.data
      );

      if (!questionResult.success) throw new Error("Questions Agent failed");

      // 4. Combine results
      const combinedResult = {
        core: coreResult.data,
        goals: goalResult.data,
        suggestedQuestions: questionResult.data,
        executedAt: new Date()
      };

      // 5. Store in database
      await AgentOutputService.save(userId, combinedResult);

      // 6. Cache for quick access
      await CacheService.set(`analysis_${userId}`, combinedResult, 3600); // 1 hour

      return {
        success: true,
        data: combinedResult
      };
    } catch (error) {
      console.error("Agent orchestration failed:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async executeWithCache(cacheKey, executeFn, ttl = 1800) {
    // Check cache first
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for ${cacheKey}`);
      return cached;
    }

    // Execute and cache
    const result = await executeFn();
    if (result.success) {
      await CacheService.set(cacheKey, result, ttl);
    }
    return result;
  }

  async handleUserQuestion(userId, question, conversationHistory = []) {
    const systemPrompt = `You are StatementIQ, a financial insights assistant. Answer the user's question based on their financial data and previous insights. Be specific, actionable, and empathetic.`;

    const userMessage = `${question}

Context: Use the financial data and insights from previous analysis to inform your response.`;

    const response = await CopilotClient.sendMessage(
      userMessage,
      systemPrompt,
      conversationHistory
    );

    return {
      response: response.content,
      usage: response.usage
    };
  }
}

module.exports = new AgentOrchestrator();
```

---

## 6. Best Practices

### 6.1 Error Handling
- Implement retry logic for API failures
- Graceful degradation if agent fails
- User-friendly error messages

### 6.2 Caching Strategy
- Cache agent outputs for 1-2 hours
- Invalidate cache on new transactions
- Use Redis for fast access

### 6.3 Rate Limiting
- Implement per-user rate limits
- Queue long-running agent tasks
- Monitor API usage and costs

### 6.4 Prompt Engineering
- Use clear, structured prompts
- Include relevant context
- Request JSON output for parsing
- Provide examples in system prompts

### 6.5 Testing
```javascript
// Example: Unit test for Core Agent
const CoreAgent = require("../agents/coreAgent");

describe("CoreAgent", () => {
  it("should calculate metrics correctly", () => {
    const transactions = [
      { type: 'credit', amount: 5000 },
      { type: 'debit', amount: 2000 }
    ];
    
    const metrics = CoreAgent.calculateMetrics(transactions);
    expect(metrics.totalIncome).toBe(5000);
    expect(metrics.totalExpense).toBe(2000);
  });
});
```

---

## 7. Token Usage & Cost Management

```javascript
// Track token usage
let totalInputTokens = 0;
let totalOutputTokens = 0;

function trackUsage(response) {
  totalInputTokens += response.usage.inputTokens;
  totalOutputTokens += response.usage.outputTokens;
  console.log(`Total tokens used: ${totalInputTokens + totalOutputTokens}`);
}
```

---

**Document Version**: 1.0  
**Model Used**: Claude 3.5 Sonnet  
**SDK Version**: @anthropic-ai/sdk ^0.15.0
