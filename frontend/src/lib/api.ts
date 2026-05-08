import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Transaction,
  Loan,
  FDAccount,
  Investment,
  AgentResult,
  QuestionAnswer,
  AgentStatus,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://statementiq-8uvl.onrender.com";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("statementiq_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body.message || body.error || message;
    } catch {}
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}

// ─── Auth ───────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: RegisterRequest) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: LoginRequest) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () => request<{ user: User }>("/api/auth/me"),
};

// ─── Financial Data ─────────────────────────────────────────────────────────
export const statementsApi = {
  list: (months = 6) =>
    request<{ transactions: Transaction[]; count: number }>(
      `/api/statements?months=${months}`
    ),
  get: (id: string) => request<Transaction>(`/api/statements/${id}`),
};

export const loansApi = {
  list: () => request<{ loans: Loan[]; count: number }>("/api/loans"),
  get: (id: string) => request<Loan>(`/api/loans/${id}`),
};

export const fdApi = {
  list: () =>
    request<{ fdAccounts: FDAccount[]; count: number }>("/api/fd"),
  get: (id: string) => request<FDAccount>(`/api/fd/${id}`),
};

export const investmentsApi = {
  list: () =>
    request<{ investments: Investment[]; count: number }>("/api/investments"),
  get: (id: string) => request<Investment>(`/api/investments/${id}`),
};

// ─── Agent / AI ─────────────────────────────────────────────────────────────
export const agentApi = {
  all: () => request<AgentResult>("/api/agent/all"),
  summary: () => request<{ summary: AgentResult["summary"] }>("/api/agent/summary"),
  goals: () => request<{ goals: AgentResult["goals"] }>("/api/agent/goals"),
  questions: () => request<{ questions: string[] }>("/api/agent/questions"),
  refresh: () => request<AgentResult>("/api/agent/refresh", { method: "POST" }),
  status: () => request<AgentStatus>("/api/agent/status"),
  answerQuestion: (question: string) =>
    request<QuestionAnswer>("/api/agent/questions/answer", {
      method: "POST",
      body: JSON.stringify({ question }),
    }),
};

export { ApiError };
