# StatementIQ - Comprehensive Implementation Plan

## Project Overview
StatementIQ is an AI-powered financial insights platform that enables bank customers to gain deep understanding of their financial accounts, including statements, loans, fixed deposits (FDs), and investments through intelligent agents powered by GitHub Copilot.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER (Web/Mobile)                 │
│  - Login/Authentication UI                                      │
│  - Dashboard - Account Overview                                 │
│  - Statement & Transaction Viewer                               │
│  - AI Chat Interface                                            │
│  - Financial Goals & Recommendations                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    API Gateway & Auth
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                    NODE.JS BACKEND API LAYER                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Express.js Server (REST/GraphQL API)                      │ │
│  │ - Authentication & Authorization                          │ │
│  │ - User Profile Management                                 │ │
│  │ - Statement Data Retrieval                                │ │
│  │ - Chat Interface Endpoints                                │ │
│  │ - Agent Management Endpoints                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │           AI AGENTS LAYER (GitHub Copilot SDK)            │ │
│  │  ┌──────────────────┐  ┌──────────────────┐              │ │
│  │  │  Core Agent      │  │  Financial Goal  │              │ │
│  │  │  - Summarizes    │  │  Agent           │              │ │
│  │  │    6+ months     │  │  - Analyzes goals│              │ │
│  │  │    data          │  │  - Personalizes  │              │ │
│  │  │  - Identifies    │  │  - Recommends    │              │ │
│  │  │    patterns      │  │    strategies    │              │ │
│  │  └──────────────────┘  └──────────────────┘              │ │
│  │                                                           │ │
│  │  ┌──────────────────────────────────────┐               │ │
│  │  │  Suggested Questions Agent           │               │ │
│  │  │  - Analyzes summaries & profiles     │               │ │
│  │  │  - Generates intelligent questions   │               │ │
│  │  │  - User selects preferred questions  │               │ │
│  │  │  - Triggers agent responses          │               │ │
│  │  └──────────────────────────────────────┘               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │            DATA PROCESSING & INTEGRATION LAYER             │ │
│  │  - Bank API Integration (Data Connectors)                │ │
│  │  - Transaction Processing                               │ │
│  │  - Data Enrichment & Normalization                      │ │
│  │  - Cache Management (Redis)                             │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                    DATA LAYER                                   │
│  ┌──────────────────────┐  ┌────────────────────────────────┐  │
│  │  PostgreSQL/MongoDB  │  │  Redis Cache                   │  │
│  │  - Users             │  │  - Session Data                │  │
│  │  - Accounts          │  │  - Analysis Cache              │  │
│  │  - Transactions      │  │  - Agent Responses             │  │
│  │  - Loans             │  │                                │  │
│  │  - Investments       │  │                                │  │
│  │  - Chat History      │  │                                │  │
│  │  - Agent Outputs     │  │                                │  │
│  └──────────────────────┘  └────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **API**: REST/GraphQL (Apollo Server)
- **AI Integration**: 
  - GitHub Copilot SDK
  - GitHub Copilot CLI (for development & testing)
- **Authentication**: JWT + OAuth2.0
- **Database**: 
  - PostgreSQL (Primary - structured data)
  - MongoDB (Alternative - flexible schema)
  - Redis (Caching & Session Management)
- **Task Queue**: Bull/BullMQ (Background Jobs)
- **Logging**: Winston/Pino
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 18+ / Vue 3 / Next.js
- **State Management**: Redux/Zustand
- **UI Library**: Material-UI / Tailwind CSS
- **Charts**: Chart.js / Recharts
- **API Client**: Axios / Fetch API

### DevOps & Deployment
- **Containerization**: Docker
- **Orchestration**: Docker Compose / Kubernetes
- **CI/CD**: GitHub Actions
- **Hosting**: AWS / Azure / GCP

---

## 3. Project Directory Structure

```
StatementIQ/
├── backend/
│   ├── src/
│   │   ├── agents/
│   │   │   ├── coreAgent.js          # 6+ month data summarizer
│   │   │   ├── financialGoalAgent.js # Personalized goals
│   │   │   ├── suggestedQuestionsAgent.js # Question generator
│   │   │   └── agentOrchestrator.js  # Manages agent workflows
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── user.routes.js
│   │   │   │   ├── accounts.routes.js
│   │   │   │   ├── statements.routes.js
│   │   │   │   ├── agents.routes.js
│   │   │   │   ├── chat.routes.js
│   │   │   │   └── insights.routes.js
│   │   │   ├── controllers/
│   │   │   │   ├── authController.js
│   │   │   │   ├── userController.js
│   │   │   │   ├── accountController.js
│   │   │   │   ├── agentController.js
│   │   │   │   └── chatController.js
│   │   │   └── middleware/
│   │   │       ├── authMiddleware.js
│   │   │       ├── errorHandler.js
│   │   │       └── validationMiddleware.js
│   │   ├── services/
│   │   │   ├── bankIntegration.service.js
│   │   │   ├── dataProcessor.service.js
│   │   │   ├── cacheService.js
│   │   │   ├── emailService.js
│   │   │   └── aiIntegration.service.js
│   │   ├── models/
│   │   │   ├── User.model.js
│   │   │   ├── Account.model.js
│   │   │   ├── Transaction.model.js
│   │   │   ├── Loan.model.js
│   │   │   ├── Investment.model.js
│   │   │   ├── ChatMessage.model.js
│   │   │   └── AgentOutput.model.js
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   ├── encryption.js
│   │   │   └── constants.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── copilot.js           # GitHub Copilot SDK config
│   │   │   └── env.js
│   │   └── app.js
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── agents/
│   ├── .env.example
│   ├── package.json
│   ├── docker-compose.yml
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Statements/
│   │   │   ├── Chat/
│   │   │   ├── Insights/
│   │   │   └── Common/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── AGENT_ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── DEPLOYMENT.md
│   └── GITHUB_COPILOT_INTEGRATION.md
├── docker-compose.yml
└── README.md
```

---

## 4. Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  phone VARCHAR(20),
  bank_id VARCHAR(100),
  date_of_birth DATE,
  kyc_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

### Accounts Table
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  account_number VARCHAR(50) UNIQUE,
  account_type ENUM('savings', 'current', 'salary'),
  balance DECIMAL(15, 2),
  currency VARCHAR(3),
  bank_code VARCHAR(10),
  linked_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES accounts(id),
  transaction_date DATE,
  amount DECIMAL(15, 2),
  transaction_type ENUM('credit', 'debit'),
  description VARCHAR(500),
  category VARCHAR(50),
  merchant VARCHAR(255),
  reference_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Loans Table
```sql
CREATE TABLE loans (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  loan_type ENUM('home', 'auto', 'personal', 'education'),
  principal_amount DECIMAL(15, 2),
  current_balance DECIMAL(15, 2),
  interest_rate DECIMAL(5, 2),
  tenure_months INT,
  emi_amount DECIMAL(10, 2),
  start_date DATE,
  end_date DATE,
  status ENUM('active', 'closed', 'default'),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Investments Table
```sql
CREATE TABLE investments (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  investment_type ENUM('stocks', 'mutual_funds', 'bonds', 'crypto', 'real_estate'),
  investment_name VARCHAR(255),
  quantity DECIMAL(15, 4),
  current_value DECIMAL(15, 2),
  invested_value DECIMAL(15, 2),
  purchase_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Chat Messages Table
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  message TEXT,
  sender ENUM('user', 'agent'),
  agent_type VARCHAR(50),
  response TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Agent Outputs Table
```sql
CREATE TABLE agent_outputs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  agent_name VARCHAR(100),
  input_data JSONB,
  output_data JSONB,
  execution_time_ms INT,
  status ENUM('success', 'failed', 'pending'),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Financial Goals Table
```sql
CREATE TABLE financial_goals (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  goal_name VARCHAR(255),
  goal_type ENUM('savings', 'investment', 'debt_reduction', 'income_growth'),
  target_amount DECIMAL(15, 2),
  current_progress DECIMAL(15, 2),
  target_date DATE,
  priority INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 5. API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT
- `POST /api/auth/forgot-password` - Password reset

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/financial-summary` - Get financial overview
- `PUT /api/users/preferences` - Update preferences

### Accounts & Statements
- `GET /api/accounts` - List all accounts
- `GET /api/accounts/:accountId` - Get account details
- `GET /api/accounts/:accountId/statements` - Get statements (paginated)
- `GET /api/accounts/:accountId/transactions` - Get transactions
- `GET /api/accounts/:accountId/balance-history` - Get balance history

### Loans
- `GET /api/loans` - List all loans
- `GET /api/loans/:loanId` - Get loan details
- `GET /api/loans/:loanId/schedule` - Get EMI schedule

### Investments
- `GET /api/investments` - List all investments
- `GET /api/investments/:investmentId` - Get investment details
- `GET /api/investments/portfolio-analysis` - Portfolio analysis

### Agents & Insights
- `POST /api/agents/core-summary` - Trigger core agent (6+ month summary)
- `POST /api/agents/financial-goals` - Trigger goal agent
- `GET /api/agents/suggested-questions` - Get suggested questions
- `GET /api/agents/outputs` - Get agent execution history
- `POST /api/agents/execute` - Execute custom agent request

### Chat
- `POST /api/chat/send-message` - Send chat message
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/suggested-question` - Ask suggested question

### Analytics
- `GET /api/analytics/spending-trends` - Spending patterns
- `GET /api/analytics/savings-rate` - Savings analysis
- `GET /api/analytics/investment-performance` - Investment metrics

---

## 6. GitHub Copilot Integration Strategy

### 6.1 Using GitHub Copilot SDK for Agents

```javascript
// Example: Core Agent using GitHub Copilot SDK
const { Anthropic } = require("@anthropic-ai/sdk");

class CoreAgent {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.GITHUB_COPILOT_API_KEY
    });
  }

  async summarizeAccountData(transactionHistory, accountDetails) {
    const prompt = `
      Analyze the following 6+ months of bank transaction data and provide:
      1. Spending patterns and categories
      2. Income stability analysis
      3. Savings rate
      4. Financial health score (1-100)
      5. Key observations and concerns
      
      Transaction Data: ${JSON.stringify(transactionHistory)}
      Account Details: ${JSON.stringify(accountDetails)}
    `;

    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }]
    });

    return response.content[0].text;
  }
}

module.exports = CoreAgent;
```

### 6.2 Integrating GitHub Copilot CLI

The GitHub Copilot CLI can be used during development:

```bash
# Using Copilot CLI to generate code
gh copilot explain "how to process transaction data in Node.js"

# Ask for debugging help
gh copilot suggest "debug this async function"

# Get best practices
gh copilot explain "microservices architecture for Node.js"
```

### 6.3 Agent Capabilities

#### Core Agent
- Analyzes 6+ months of transaction data
- Identifies spending patterns
- Calculates financial health score
- Detects anomalies

#### Financial Goal Agent
- Personalized goal generation based on user profile
- Analyzes feasibility of goals
- Recommends strategies
- Tracks progress

#### Suggested Questions Agent
- Generates contextual questions from summaries
- Prioritizes questions by relevance
- Learns from user interactions
- Improves suggestions over time

---

## 7. Development Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Project setup & infrastructure
- [ ] Database schema & setup
- [ ] User authentication system
- [ ] Bank integration API connectors
- [ ] Basic CRUD operations

### Phase 2: Core Features (Weeks 3-4)
- [ ] Account management & statement retrieval
- [ ] Transaction processing & categorization
- [ ] Cache layer implementation
- [ ] Frontend dashboard scaffolding

### Phase 3: AI Integration (Weeks 5-6)
- [ ] GitHub Copilot SDK integration
- [ ] Core Agent implementation
- [ ] Financial Goal Agent setup
- [ ] Basic agent orchestration

### Phase 4: Advanced Features (Weeks 7-8)
- [ ] Suggested Questions Agent
- [ ] Chat interface implementation
- [ ] Real-time insights generation
- [ ] Performance optimization

### Phase 5: Polish & Deployment (Weeks 9-10)
- [ ] Testing (Unit, Integration, E2E)
- [ ] Security audit & compliance
- [ ] Frontend refinement
- [ ] Documentation
- [ ] Docker containerization
- [ ] Deployment to production

---

## 8. Key Implementation Details

### 8.1 Authentication Flow
```
User Login
    ↓
Bank API Verification
    ↓
JWT Token Generation
    ↓
Session Storage (Redis)
    ↓
Dashboard Access
```

### 8.2 Agent Execution Flow
```
User Interaction
    ↓
Request Router
    ↓
Agent Orchestrator
    ↓
Data Collection & Preprocessing
    ↓
GitHub Copilot SDK Call
    ↓
Response Processing
    ↓
Cache & Store Output
    ↓
Return to User
```

### 8.3 Data Pipeline
```
Bank APIs → Data Ingestion → Normalization → Storage → 
Processing → Caching → Agent Analysis → UI Display
```

---

## 9. Security Considerations

1. **Authentication**: JWT + refresh tokens, OAuth2.0 for bank access
2. **Encryption**: End-to-end encryption for sensitive data, SSL/TLS for transit
3. **Database**: Row-level security, encrypted passwords
4. **API Security**: Rate limiting, CORS, input validation
5. **Data Privacy**: GDPR/data localization compliance
6. **Secrets Management**: Environment variables, secret vault
7. **Audit Logging**: All transactions and agent activities logged

---

## 10. Performance Optimization

1. **Caching Strategy**: Redis for frequently accessed data
2. **Database Indexing**: Optimize queries on transactions, user_id
3. **Pagination**: Implement cursor-based pagination for large datasets
4. **Async Processing**: Background jobs for heavy computations
5. **CDN**: Static assets delivery
6. **Agent Response Caching**: Cache agent outputs for similar queries

---

## 11. Monitoring & Analytics

1. **Logging**: Winston/Pino for centralized logging
2. **Monitoring**: Prometheus + Grafana
3. **Error Tracking**: Sentry
4. **Performance Monitoring**: New Relic / DataDog
5. **User Analytics**: Mixpanel / Amplitude

---

## 12. Deployment Architecture

### Development
```
Local Environment
├── Node.js Backend
├── PostgreSQL/MongoDB
└── Redis
```

### Staging
```
Docker Containers
├── Backend API Container
├── Database Container
└── Redis Container
```

### Production
```
Kubernetes Cluster
├── API Pods (Replicated)
├── Database (Managed Service)
├── Redis Cluster
└── Load Balancer
```

---

## 13. GitHub Copilot SDK Usage Examples

### Example 1: Processing Transactions
```javascript
async function analyzeTransactions(transactions) {
  const client = new Anthropic();
  
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Categorize and analyze these transactions: ${JSON.stringify(transactions)}`
    }]
  });
  
  return response.content[0].text;
}
```

### Example 2: Financial Goal Generation
```javascript
async function generateGoals(userProfile) {
  const client = new Anthropic();
  
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1500,
    messages: [{
      role: "user",
      content: `Generate personalized financial goals for: ${JSON.stringify(userProfile)}`
    }]
  });
  
  return JSON.parse(response.content[0].text);
}
```

### Example 3: Question Generation
```javascript
async function generateQuestions(summary, userHistory) {
  const client = new Anthropic();
  
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Based on this financial summary: ${summary}, generate 5 insightful questions...`
    }]
  });
  
  return response.content[0].text.split('\n').filter(q => q.trim());
}
```

---

## 14. Next Steps

1. **Repository Setup**: Initialize Git repo with proper structure
2. **Environment Setup**: Configure Node.js, databases, dependencies
3. **GitHub Copilot Setup**: 
   - Install GitHub Copilot CLI
   - Configure SDK authentication
4. **Database Setup**: Create PostgreSQL/MongoDB schema
5. **Backend Scaffolding**: Express.js app structure
6. **API Development**: Start with authentication
7. **Agent Development**: Implement core agent first
8. **Frontend Development**: Parallel with backend
9. **Integration Testing**: Test API endpoints
10. **Deployment**: Docker & cloud setup

---

## 15. Technology Dependencies

### Backend
```
"express": "^4.18.2",
"dotenv": "^16.0.3",
"jsonwebtoken": "^9.0.0",
"bcryptjs": "^2.4.3",
"pg": "^8.8.0",
"redis": "^4.6.0",
"bull": "^4.10.0",
"@anthropic-ai/sdk": "^0.15.0",
"joi": "^17.9.0",
"winston": "^3.8.0"
```

### Frontend
```
"react": "^18.2.0",
"react-router-dom": "^6.11.0",
"axios": "^1.3.0",
"zustand": "^4.3.0",
"tailwindcss": "^3.3.0"
```

---

## 16. Success Metrics

1. **User Adoption**: 1000+ users in first month
2. **Agent Accuracy**: 95%+ accurate summaries
3. **Response Time**: < 2 seconds for agent responses
4. **User Retention**: > 70% monthly retention
5. **System Uptime**: 99.9% availability
6. **User Satisfaction**: NPS > 50

---

**Document Version**: 1.0  
**Last Updated**: May 2026  
**Status**: Ready for Development
