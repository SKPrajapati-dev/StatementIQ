"use client";

import React, { useEffect, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target, 
  AlertTriangle, 
  RefreshCcw,
  Plus,
  ArrowUpRight,
  PieChart as PieChartIcon
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { agentApi } from "@/lib/api";
import { AgentResult } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<AgentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);
      
      const result = refresh ? await agentApi.refresh() : await agentApi.all();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (loading) {
    return (
      <div className="page-header">
        <div className="skeleton" style={{ width: "200px", height: "32px", marginBottom: "8px" }}></div>
        <div className="skeleton" style={{ width: "300px", height: "18px" }}></div>
        <div className="stat-grid" style={{ marginTop: "32px" }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: "120px", borderRadius: "var(--radius-lg)" }}></div>)}
        </div>
      </div>
    );
  }

  const { summary, goals } = data || {};

  return (
    <div>
      <div className="section-header" style={{ marginBottom: "24px" }}>
        <div>
          <h1 className="page-title">Welcome back, {user?.name.split(' ')[0]}</h1>
          <p className="page-subtitle">Your financial health at a glance</p>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={() => fetchData(true)}
          disabled={refreshing}
        >
          <RefreshCcw size={16} className={refreshing ? "spinner" : ""} />
          {refreshing ? "Refreshing..." : "Update Insights"}
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Savings Rate</div>
          <div className="stat-value">{summary?.savingsRate.toFixed(1)}%</div>
          <div className="stat-icon" style={{ background: "var(--accent-primary-glow)", color: "var(--accent-primary)" }}>
            <Wallet size={20} />
          </div>
          <div className={summary && summary.savingsRate > 20 ? "stat-change positive" : "stat-change negative"}>
            {summary && summary.savingsRate > 20 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {summary && summary.savingsRate > 20 ? "Good savings" : "Needs attention"}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Health Score</div>
          <div className="stat-value" style={{ 
            color: summary && summary.overallFinancialHealthScore > 80 ? "var(--accent-green)" : 
                   summary && summary.overallFinancialHealthScore > 60 ? "var(--accent-secondary)" : "var(--accent-amber)"
          }}>
            {summary?.overallFinancialHealthScore}/100
          </div>
          <div className="stat-icon" style={{ background: "var(--accent-secondary-glow)", color: "var(--accent-secondary)" }}>
            <Target size={20} />
          </div>
          <div className="stat-change" style={{ color: "var(--text-muted)" }}>
            AI Assessment
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Avg. Monthly Income</div>
          <div className="stat-value">{formatCurrency(summary?.monthlyAvgIncome || 0)}</div>
          <div className="stat-icon" style={{ background: "var(--accent-green-glow)", color: "var(--accent-green)" }}>
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Avg. Monthly Expense</div>
          <div className="stat-value">{formatCurrency(summary?.monthlyAvgExpense || 0)}</div>
          <div className="stat-icon" style={{ background: "var(--accent-red-glow)", color: "var(--accent-red)" }}>
            <TrendingDown size={20} />
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Spending Breakdown</h2>
            <PieChartIcon size={18} color="var(--text-muted)" />
          </div>
          <div style={{ height: "300px", marginTop: "16px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary?.topSpendingCategories} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  stroke="var(--text-secondary)" 
                  fontSize={12} 
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(215, 90, 71, 0.05)' }}
                  contentStyle={{ 
                    background: 'var(--bg-card)', 
                    borderColor: 'var(--border-card)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--text-primary)'
                  }}
                  //formatter={(val: number) => formatCurrency(val)}
                />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                  {summary?.topSpendingCategories.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? "var(--accent-primary)" : "var(--accent-secondary)"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <h2 className="section-title">AI Insights</h2>
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
            {summary?.keyInsights.slice(0, 4).map((insight, i) => (
              <div key={i} className="insight-item info">
                {insight}
              </div>
            ))}
            {summary?.warningFlags.map((flag, i) => (
              <div key={i} className="insight-item danger">
                <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: "2px" }} />
                {flag}
              </div>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: "16px", width: "100%" }}>
            View Full Analysis <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      <div style={{ marginTop: "32px" }}>
        <div className="section-header">
          <h2 className="section-title">Personalized Financial Goals</h2>
        </div>
        <div className="grid-3">
          {goals?.map((goal, i) => (
            <div key={i} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>{goal.title}</h3>
                <span className={`badge ${goal.priority === 1 ? 'badge-red' : 'badge-blue'}`}>
                  P{goal.priority}
                </span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "20px", height: "40px", overflow: "hidden" }}>
                {goal.description}
              </p>
              <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                <span color="var(--text-muted)">Target</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(goal.targetAmount)}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${Math.min(100, (goal.monthlySavings * 12 / goal.targetAmount) * 100)}%`,
                    background: goal.priority === 1 ? "var(--accent-red)" : "var(--accent-primary)"
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
