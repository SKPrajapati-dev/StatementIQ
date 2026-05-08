"use client";

import React, { useEffect, useState } from "react";
import { PiggyBank, Calendar, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";
import { fdApi } from "@/lib/api";
import { FDAccount } from "@/types";

export default function FDPage() {
  const [fds, setFds] = useState<FDAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fdApi.list()
      .then(res => setFds(res.fdAccounts))
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
          <h1 className="page-title">Fixed Deposits</h1>
          <p className="page-subtitle">Manage your low-risk savings and maturity plans</p>
        </div>
      </div>

      <div className="grid-3" style={{ marginTop: "24px" }}>
        {loading ? (
          [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: "280px", borderRadius: "var(--radius-lg)" }}></div>)
        ) : fds.map(fd => {
          const startDate = new Date(fd.startDate);
          const maturityDate = new Date(fd.maturityDate);
          const today = new Date();
          const totalDays = (maturityDate.getTime() - startDate.getTime());
          const elapsedDays = (today.getTime() - startDate.getTime());
          const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

          return (
            <div key={fd.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "var(--accent-amber-glow)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <PiggyBank size={22} color="var(--accent-amber)" />
                </div>
                <span className={`badge ${fd.status === 'ACTIVE' ? 'badge-amber' : 'badge-green'}`}>{fd.status}</span>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "4px" }}>{fd.bankName} • {fd.fdNumber}</p>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>{formatCurrency(fd.principalAmount)}</h3>
              </div>

              <div className="grid-2" style={{ gap: "12px", marginBottom: "24px" }}>
                <div style={{ padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-md)" }}>
                  <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "2px" }}>Interest</p>
                  <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--accent-green)" }}>{fd.interestRate}%</p>
                </div>
                <div style={{ padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-md)" }}>
                  <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "2px" }}>Maturity</p>
                  <p style={{ fontSize: "0.95rem", fontWeight: 700 }}>{formatCurrency(fd.maturityAmount)}</p>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: "6px", display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                  <span color="var(--text-muted)">Maturity Progress</span>
                  <span style={{ fontWeight: 600 }}>{progress.toFixed(0)}%</span>
                </div>
                <div className="progress-bar" style={{ marginBottom: "16px", height: "4px" }}>
                  <div className="progress-fill" style={{ width: `${progress}%`, background: "var(--accent-amber)" }}></div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  <Calendar size={14} /> 
                  <span>Matures on: <strong>{maturityDate.toLocaleDateString()}</strong></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  <ShieldCheck size={14} /> 
                  <span>{fd.autoRenew ? 'Auto-Renewal ON' : 'No Auto-Renewal'}</span>
                </div>
              </div>

              <button className="btn btn-secondary btn-sm" style={{ marginTop: "20px", width: "100%" }}>
                FD Details <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
