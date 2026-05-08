# StatementIQ - AI-Powered Financial Analysis Platform

A full-stack TypeScript application that uses AI agents to analyze financial data and provide personalized financial insights.

## Project Structure

```
copilot-training/
├── src/
│   ├── agents/              # AI Agent implementations
│   │   ├── agent-orchestrator.ts    # Main orchestration logic
│   │   ├── core-summary.agent.ts    # Financial summary analysis
│   │   ├── financial-goal.agent.ts  # Goal generation
│   │   ├── question-suggestion.agent.ts  # Question suggestions
│   │   └── github-models.client.ts  # Copilot SDK integration
│   ├── routes/              # Express route handlers
│   │   ├── agent.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── statements.routes.ts
│   │   ├── loans.routes.ts
│   │   ├── fd.routes.ts
│   │   └── investments.routes.ts
│   ├── services/            # Business logic services
│   │   ├── auth.service.ts
│   │   ├── cache.service.ts
│   │   └── data.service.ts
│   ├── middleware/          # Express middleware
│   │   └── auth.middleware.ts
│   ├── lib/                 # Utilities
│   │   ├── db.ts            # In-memory database
│   │   └── date-utils.ts    # Date utilities
│   └── config.ts            # Configuration
├── types/                   # TypeScript type definitions
│   ├── agent.types.ts
│   ├── financial.types.ts
│   └── user.types.ts
├── index.ts                 # Application entry point
├── package.json
├── tsconfig.json
└── .env.example

```

## Features

- **Multi-Agent Architecture**: Orchestrated AI agents for comprehensive financial analysis
  - Core Summary Agent: Analyzes transactions, loans, and investments
  - Financial Goal Agent: Generates personalized financial goals
  - Question Suggestion Agent: Suggests relevant financial questions

- **AI-Powered Analysis**: Uses GitHub Copilot API for financial data processing
- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **In-Memory Caching**: 24-hour TTL caching for agent outputs
- **RESTful API**: Express.js API with proper middleware and error handling

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Set up environment variables:
   - `JWT_SECRET`: A secret key for JWT signing
   - `GITHUB_TOKEN`: Your GitHub personal access token (optional, uses CLI auth)
   - `PORT`: Server port (default: 3000)

4. Authenticate with GitHub Copilot CLI:
```bash
gh copilot auth login
```

## Running the Application

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm run start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Financial Data
- `GET /api/statements` - Get user transactions
- `GET /api/loans` - Get user loans
- `GET /api/fd` - Get fixed deposits
- `GET /api/investments` - Get investments

### AI Agents
- `GET /api/agent/summary` - Get financial summary
- `GET /api/agent/goals` - Get financial goals
- `GET /api/agent/questions` - Get suggested questions
- `GET /api/agent/all` - Get all agent outputs
- `POST /api/agent/refresh` - Refresh agent cache
- `GET /api/agent/status` - Check cache status

## Agent Execution Flow

1. **User Request** → API endpoint
2. **Check Cache** → Return if valid
3. **Fetch Financial Data** → Load from database
4. **Core Summary Agent** → Analyze financial data
5. **Parallel Execution**:
   - Financial Goal Agent → Generate goals
   - Question Suggestion Agent → Generate questions
6. **Cache Results** → Store for 24 hours
7. **Return Results** → Send to client

## Development Notes

- The database is in-memory and resets on server restart
- All financial analysis uses the GitHub Copilot API
- Proper error handling and middleware stack included
- TypeScript strict mode enabled for type safety

## Author

StatementIQ Development Team
