"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Briefcase, PieChart as PieIcon, ArrowUpRight } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { investmentsApi } from "@/lib/api";
import { Investment } from "@/types";

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    investmentsApi.list()
      .then(res => setInvestments(res.investments))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const totalInvested = investments.reduce((acc, inv) => acc + inv.investedAmount, 0);
  const totalCurrent = investments.reduce((acc, inv) => acc + inv.currentValue, 0);
  const overallProfit = totalCurrent - totalInvested;
  const overallReturns = (overallProfit / totalInvested) * 100;

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-title">Investment Portfolio</h1>
          <p className="page-subtitle">Monitor your market assets and performance metrics</p>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="stat-grid" style={{ marginTop: "24px" }}>
        <div className="stat-card">
          <div className="stat-label">Total Portfolio Value</div>
          <div className="stat-value">{formatCurrency(totalCurrent)}</div>
          <div className="stat-icon" style={{ background: "var(--accent-purple-glow)", color: "var(--accent-purple)" }}>
            <Briefcase size={20} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Overall Returns</div>
          <div className="stat-value" style={{ color: overallProfit >= 0 ? "var(--accent-green)" : "var(--accent-red)" }}>
            {overallProfit >= 0 ? "+" : ""}{formatCurrency(overallProfit)}
          </div>
          <div className={`stat-change ${overallProfit >= 0 ? 'positive' : 'negative'}`}>
            {overallProfit >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {overallReturns.toFixed(2)}% total ROI
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: "1.5fr 1fr", gap: "24px", marginTop: "24px" }}>
        {/* Assets List */}
        <div className="card">
          <h2 className="section-title" style={{ marginBottom: "20px" }}>Asset Allocation</h2>
          <div className="table-wrapper">
            <table style={{ border: "none" }}>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Type</th>
                  <th style={{ textAlign: "right" }}>Returns</th>
                  <th style={{ textAlign: "right" }}>Current Value</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   [1,2,3,4].map(i => <tr key={i}><td colSpan={4}><div className="skeleton" style={{ height: "40px" }}></div></td></tr>)
                ) : investments.map(inv => {
                  const profit = inv.currentValue - inv.investedAmount;
                  const returns = (profit / inv.investedAmount) * 100;
                  return (
                    <tr key={inv.id}>
                      <td>
                        <div>
                          <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>{inv.name}</p>
                          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Folio: {inv.folio || 'N/A'}</p>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-blue" style={{ fontSize: "0.65rem" }}>{inv.type.replace('_', ' ')}</span>
                      </td>
                      <td style={{ textAlign: "right", color: profit >= 0 ? "var(--accent-green)" : "var(--accent-red)", fontWeight: 500 }}>
                        {profit >= 0 ? "+" : ""}{returns.toFixed(2)}%
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>{formatCurrency(inv.currentValue)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Portfolio Distribution (Simplified UI element) */}
        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <h2 className="section-title">Portfolio Mix</h2>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
             <div style={{ textAlign: "center" }}>
                <PieIcon size={64} color="var(--accent-primary)" style={{ opacity: 0.2, marginBottom: "16px" }} />
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Asset distribution chart coming soon</p>
             </div>
          </div>
          <div className="divider"></div>
          <button className="btn btn-primary" style={{ width: "100%" }}>
            Analyze Performance <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
