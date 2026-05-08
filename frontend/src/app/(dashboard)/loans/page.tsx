"use client";

import React, { useEffect, useState } from "react";
import { Landmark, Calendar, Percent, CreditCard, ChevronRight } from "lucide-react";
import { loansApi } from "@/lib/api";
import { Loan } from "@/types";

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loansApi.list()
      .then(res => setLoans(res.loans))
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

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-title">Active Loans</h1>
          <p className="page-subtitle">Track your liabilities and repayment schedules</p>
        </div>
      </div>

      {loading ? (
        <div className="grid-2" style={{ marginTop: "24px" }}>
          {[1,2].map(i => <div key={i} className="skeleton" style={{ height: "240px", borderRadius: "var(--radius-lg)" }}></div>)}
        </div>
      ) : (
        <div className="grid-2" style={{ marginTop: "24px" }}>
          {loans.map(loan => {
            const progress = ((loan.principalAmount - loan.outstandingAmount) / loan.principalAmount) * 100;
            return (
              <div key={loan.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Landmark size={24} color="var(--accent-primary)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{loan.loanType} Loan</h3>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{loan.bankName} • {loan.loanAccountNumber}</p>
                    </div>
                  </div>
                  <span className={`badge ${loan.status === 'ACTIVE' ? 'badge-blue' : 'badge-green'}`}>{loan.status}</span>
                </div>

                <div className="grid-2" style={{ gap: "16px", marginBottom: "24px" }}>
                  <div style={{ padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-md)" }}>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>Outstanding</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: 700 }}>{formatCurrency(loan.outstandingAmount)}</p>
                  </div>
                  <div style={{ padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-md)" }}>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>Monthly EMI</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: 700 }}>{formatCurrency(loan.emiAmount)}</p>
                  </div>
                </div>

                <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                  <span color="var(--text-muted)">Repayment Progress</span>
                  <span style={{ fontWeight: 600 }}>{progress.toFixed(1)}%</span>
                </div>
                <div className="progress-bar" style={{ marginBottom: "24px" }}>
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    <Calendar size={14} /> 
                    <span>Next EMI: <strong>{loan.nextEmiDate ? new Date(loan.nextEmiDate).toLocaleDateString() : 'N/A'}</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    <Percent size={14} /> 
                    <span>Interest Rate: <strong>{loan.interestRate}% p.a.</strong></span>
                  </div>
                </div>

                <div className="divider"></div>
                
                <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "space-between" }}>
                  View Payment Schedule <ChevronRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
