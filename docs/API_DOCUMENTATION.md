# StatementIQ - API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://api.statementiq.com/api
```

## Authentication
All endpoints (except auth) require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints

### 1.1 Register User
**POST** `/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "John Doe",
  "phone": "+1-555-0100",
  "dateOfBirth": "1990-01-15"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "userId": "uuid-here",
    "email": "user@example.com",
    "fullName": "John Doe",
    "createdAt": "2026-05-08T10:30:00Z"
  },
  "message": "User registered successfully"
}
```

### 1.2 Login
**POST** `/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "userId": "uuid-here",
      "email": "user@example.com",
      "fullName": "John Doe"
    }
  }
}
```

### 1.3 Refresh Token
**POST** `/auth/refresh-token`

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 1.4 Logout
**POST** `/auth/logout`

**Request:** (No body required)

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 1.5 Forgot Password
**POST** `/auth/forgot-password`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

---

## 2. User Profile Endpoints

### 2.1 Get User Profile
**GET** `/users/profile`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "uuid-here",
    "email": "user@example.com",
    "fullName": "John Doe",
    "phone": "+1-555-0100",
    "dateOfBirth": "1990-01-15",
    "occupation": "Software Engineer",
    "familyStatus": "married",
    "riskTolerance": "moderate",
    "annualIncome": 120000,
    "kycVerified": true,
    "createdAt": "2026-01-01T00:00:00Z"
  }
}
```

### 2.2 Update User Profile
**PUT** `/users/profile`

**Request:**
```json
{
  "fullName": "John Doe Updated",
  "phone": "+1-555-0101",
  "occupation": "Senior Software Engineer",
  "riskTolerance": "high",
  "annualIncome": 150000
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "uuid-here",
    "email": "user@example.com",
    "fullName": "John Doe Updated",
    "phone": "+1-555-0101",
    "occupation": "Senior Software Engineer",
    "riskTolerance": "high",
    "annualIncome": 150000,
    "updatedAt": "2026-05-08T12:00:00Z"
  },
  "message": "Profile updated successfully"
}
```

### 2.3 Get Financial Summary
**GET** `/users/financial-summary`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "uuid-here",
    "totalAssets": 500000,
    "totalLiabilities": 150000,
    "netWorth": 350000,
    "monthlyIncome": 10000,
    "monthlyExpenses": 6000,
    "monthlySavings": 4000,
    "savingsRate": "40%",
    "financialHealthScore": 78,
    "accountsSummary": {
      "totalAccounts": 3,
      "totalBalance": 85000,
      "accountsByType": {
        "savings": 50000,
        "current": 25000,
        "salary": 10000
      }
    },
    "loansSummary": {
      "totalLoans": 2,
      "totalOutstanding": 150000,
      "monthlyEMI": 5000
    },
    "investmentsSummary": {
      "totalInvested": 200000,
      "currentValue": 235000,
      "returns": "17.5%"
    },
    "lastUpdated": "2026-05-08T10:00:00Z"
  }
}
```

---

## 3. Accounts & Statements

### 3.1 Get All Accounts
**GET** `/accounts`

**Query Parameters:**
- `pageSize` (default: 10)
- `pageNumber` (default: 1)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accounts": [
      {
        "accountId": "uuid-here",
        "accountNumber": "****5678",
        "accountType": "savings",
        "balance": 50000,
        "currency": "USD",
        "bankCode": "HSBC",
        "linkedAt": "2025-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 3,
      "pageSize": 10,
      "pageNumber": 1
    }
  }
}
```

### 3.2 Get Account Details
**GET** `/accounts/:accountId`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accountId": "uuid-here",
    "accountNumber": "123456789",
    "accountType": "savings",
    "balance": 50000,
    "currency": "USD",
    "bankCode": "HSBC",
    "accountHolderName": "John Doe",
    "ifscCode": "HSBC0000001",
    "linkedAt": "2025-01-15T00:00:00Z",
    "recentTransactions": [
      {
        "transactionId": "uuid-here",
        "date": "2026-05-08",
        "amount": 5000,
        "type": "credit",
        "description": "Salary Deposit",
        "category": "Income",
        "merchant": "Employer Inc"
      }
    ]
  }
}
```

### 3.3 Get Statement Data
**GET** `/accounts/:accountId/statements`

**Query Parameters:**
- `from` (YYYY-MM-DD)
- `to` (YYYY-MM-DD)
- `pageSize` (default: 50)
- `pageNumber` (default: 1)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accountId": "uuid-here",
    "period": {
      "from": "2026-04-01",
      "to": "2026-04-30"
    },
    "summary": {
      "openingBalance": 45000,
      "closingBalance": 50000,
      "totalCredit": 15000,
      "totalDebit": 10000,
      "transactionCount": 45
    },
    "transactions": [
      {
        "transactionId": "uuid-here",
        "date": "2026-04-05",
        "amount": 5000,
        "type": "credit",
        "description": "Salary Deposit",
        "category": "Income",
        "merchant": "Employer Inc",
        "referenceId": "REF123456"
      }
    ],
    "pagination": {
      "total": 45,
      "pageSize": 50,
      "pageNumber": 1
    }
  }
}
```

### 3.4 Get Transactions
**GET** `/accounts/:accountId/transactions`

**Query Parameters:**
- `category` (optional)
- `from` (YYYY-MM-DD)
- `to` (YYYY-MM-DD)
- `pageSize` (default: 20)
- `pageNumber` (default: 1)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "transactionId": "uuid-here",
        "date": "2026-05-08",
        "amount": 500,
        "type": "debit",
        "description": "Grocery Store Purchase",
        "category": "Food & Dining",
        "merchant": "Whole Foods"
      }
    ],
    "categoryBreakdown": {
      "Food & Dining": 2500,
      "Transportation": 1500,
      "Utilities": 800,
      "Entertainment": 300
    },
    "pagination": {
      "total": 120,
      "pageSize": 20,
      "pageNumber": 1
    }
  }
}
```

### 3.5 Get Balance History
**GET** `/accounts/:accountId/balance-history`

**Query Parameters:**
- `months` (default: 6)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accountId": "uuid-here",
    "balanceHistory": [
      {
        "date": "2025-11-01",
        "balance": 35000
      },
      {
        "date": "2025-12-01",
        "balance": 42000
      },
      {
        "date": "2026-01-01",
        "balance": 38000
      }
    ],
    "statistics": {
      "averageBalance": 42333,
      "maxBalance": 50000,
      "minBalance": 30000
    }
  }
}
```

---

## 4. Loans Endpoints

### 4.1 Get All Loans
**GET** `/loans`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "loans": [
      {
        "loanId": "uuid-here",
        "loanType": "home",
        "loanAmount": 500000,
        "currentBalance": 450000,
        "interestRate": 7.5,
        "emiAmount": 5500,
        "tenureMonths": 240,
        "disbursalDate": "2020-01-01",
        "maturityDate": "2040-01-01",
        "status": "active",
        "nextEMIDate": "2026-06-01"
      }
    ]
  }
}
```

### 4.2 Get Loan Details
**GET** `/loans/:loanId`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "loanId": "uuid-here",
    "loanType": "home",
    "principalAmount": 500000,
    "currentBalance": 450000,
    "interestRate": 7.5,
    "emiAmount": 5500,
    "tenureMonths": 240,
    "disbursalDate": "2020-01-01",
    "maturityDate": "2040-01-01",
    "status": "active",
    "nextEMIDate": "2026-06-01",
    "statistics": {
      "totalPaid": 50000,
      "totalInterest": 172000,
      "remainingInterest": 122000,
      "completionPercentage": 10
    }
  }
}
```

### 4.3 Get EMI Schedule
**GET** `/loans/:loanId/schedule`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "loanId": "uuid-here",
    "schedule": [
      {
        "installmentNo": 1,
        "dueDate": "2026-06-01",
        "principalAmount": 3000,
        "interestAmount": 2500,
        "emiAmount": 5500,
        "balanceAfter": 447000,
        "status": "pending"
      }
    ]
  }
}
```

---

## 5. Investments Endpoints

### 5.1 Get All Investments
**GET** `/investments`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "investments": [
      {
        "investmentId": "uuid-here",
        "investmentType": "stocks",
        "investmentName": "Apple Inc",
        "quantity": 50,
        "currentValue": 8500,
        "investedValue": 7000,
        "returns": "21.4%",
        "purchaseDate": "2024-01-15"
      }
    ],
    "portfolioSummary": {
      "totalInvested": 200000,
      "currentValue": 235000,
      "totalReturns": 35000,
      "returnPercentage": "17.5%"
    }
  }
}
```

### 5.2 Get Investment Details
**GET** `/investments/:investmentId`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "investmentId": "uuid-here",
    "investmentType": "mutual_funds",
    "fundName": "Index Fund 500",
    "units": 100.5,
    "currentNAV": 2000,
    "currentValue": 201000,
    "investedValue": 150000,
    "returns": "34%",
    "purchaseDate": "2023-06-01",
    "holdings": [
      {
        "symbol": "MSFT",
        "weight": "25%"
      }
    ]
  }
}
```

### 5.3 Get Portfolio Analysis
**GET** `/investments/portfolio-analysis`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "allocation": {
      "stocks": "40%",
      "mutual_funds": "35%",
      "bonds": "15%",
      "crypto": "5%",
      "real_estate": "5%"
    },
    "riskProfile": "moderate",
    "diversification": "well_diversified",
    "recommendations": [
      "Consider increasing bond allocation for stability",
      "Diversify into international markets"
    ]
  }
}
```

---

## 6. Agents & AI Endpoints

### 6.1 Trigger Core Agent (6+ Month Summary)
**POST** `/agents/core-summary`

**Request:**
```json
{
  "accountId": "uuid-here",
  "forceRefresh": false
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "executionId": "uuid-here",
    "summary": "Based on 6 months of transaction analysis...",
    "insights": {
      "healthScore": 78,
      "topConcerns": [
        "High dining expenses",
        "Irregular income pattern"
      ],
      "opportunities": [
        "Increase monthly savings by 15%",
        "Review subscription services"
      ],
      "recommendations": [
        "Create emergency fund"
      ]
    },
    "metrics": {
      "totalIncome": 60000,
      "totalExpense": 36000,
      "savingsRate": "40%",
      "avgMonthlyIncome": 10000,
      "avgMonthlyExpense": 6000
    },
    "executedAt": "2026-05-08T10:30:00Z"
  }
}
```

### 6.2 Trigger Financial Goals Agent
**POST** `/agents/financial-goals`

**Request:**
```json
{
  "forceRefresh": false
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "goals": [
      {
        "goalId": "uuid-here",
        "name": "Emergency Fund",
        "type": "savings",
        "description": "Build 6 months of expenses",
        "targetAmount": 36000,
        "timeframe": "1_year",
        "priority": "high",
        "actionPlan": "1. Calculate monthly need... 2. Set up automatic transfers..."
      }
    ],
    "generatedAt": "2026-05-08T10:35:00Z"
  }
}
```

### 6.3 Get Suggested Questions
**GET** `/agents/suggested-questions`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "questionId": "uuid-here",
        "question": "How can I reduce my dining expenses?",
        "category": "spending",
        "priority": 5,
        "reason": "High spending compared to income"
      },
      {
        "questionId": "uuid-here",
        "question": "Should I invest in mutual funds?",
        "category": "investment",
        "priority": 4,
        "reason": "High savings rate and risk profile match"
      }
    ],
    "generatedAt": "2026-05-08T10:40:00Z"
  }
}
```

### 6.4 Get Agent Execution History
**GET** `/agents/outputs`

**Query Parameters:**
- `agentName` (optional)
- `limit` (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "outputs": [
      {
        "outputId": "uuid-here",
        "agentName": "CoreAgent",
        "status": "success",
        "executionTimeMs": 3500,
        "executedAt": "2026-05-08T10:30:00Z"
      }
    ]
  }
}
```

### 6.5 Execute Custom Agent Request
**POST** `/agents/execute`

**Request:**
```json
{
  "agentName": "CoreAgent",
  "parameters": {
    "accountId": "uuid-here",
    "months": 12
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "executionId": "uuid-here",
    "result": {},
    "executedAt": "2026-05-08T10:45:00Z"
  }
}
```

---

## 7. Chat Endpoints

### 7.1 Send Message
**POST** `/chat/send-message`

**Request:**
```json
{
  "message": "How can I increase my savings?",
  "context": "financial_goals"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "messageId": "uuid-here",
    "userMessage": "How can I increase my savings?",
    "assistantResponse": "Based on your financial profile...",
    "timestamp": "2026-05-08T11:00:00Z"
  }
}
```

### 7.2 Get Chat History
**GET** `/chat/history`

**Query Parameters:**
- `limit` (default: 50)
- `offset` (default: 0)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "messageId": "uuid-here",
        "sender": "user",
        "message": "How can I increase my savings?",
        "timestamp": "2026-05-08T11:00:00Z"
      },
      {
        "messageId": "uuid-here",
        "sender": "assistant",
        "message": "Based on your financial profile...",
        "timestamp": "2026-05-08T11:00:05Z"
      }
    ]
  }
}
```

### 7.3 Ask Suggested Question
**POST** `/chat/suggested-question`

**Request:**
```json
{
  "questionId": "uuid-here"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "question": "How can I reduce my dining expenses?",
    "answer": "Based on your transaction analysis...",
    "timestamp": "2026-05-08T11:05:00Z"
  }
}
```

---

## 8. Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters",
    "details": {}
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - User lacks permissions
- `NOT_FOUND` - Resource not found
- `INVALID_REQUEST` - Invalid request parameters
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_SERVER_ERROR` - Server error
- `SERVICE_UNAVAILABLE` - Service temporarily unavailable

---

**API Version**: 1.0  
**Last Updated**: May 2026  
**Status**: Complete
