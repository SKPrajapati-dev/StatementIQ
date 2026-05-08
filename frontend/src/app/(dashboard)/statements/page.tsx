"use client";

import React, { useEffect, useState } from "react";
import { ReceiptText, Search, Filter, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { statementsApi } from "@/lib/api";
import { Transaction } from "@/types";

export default function StatementsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    statementsApi.list(6)
      .then(res => setTransactions(res.transactions))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = transactions.filter(tx => 
    tx.description.toLowerCase().includes(filter.toLowerCase()) ||
    tx.category?.toLowerCase().includes(filter.toLowerCase())
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val);
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Detailed history of your account activity</p>
        </div>
        <div className="badge badge-blue">Last 6 Months</div>
      </div>

      <div className="card" style={{ marginTop: "24px", padding: "0" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", gap: "16px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input 
              className="input" 
              placeholder="Search description or category..." 
              style={{ paddingLeft: "40px" }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary">
            <Filter size={18} /> Filter
          </button>
        </div>

        <div className="table-wrapper" style={{ border: "none", borderRadius: "0" }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th style={{ textAlign: "right" }}>Amount</th>
                <th style={{ textAlign: "right" }}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i}>
                    <td colSpan={5}><div className="skeleton" style={{ height: "40px" }}></div></td>
                  </tr>
                ))
              ) : filtered.map(tx => (
                <tr key={tx.id}>
                  <td>{new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ 
                        width: "32px", height: "32px", borderRadius: "8px", 
                        background: tx.type === "CREDIT" ? "var(--accent-green-glow)" : "var(--accent-red-glow)",
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        {tx.type === "CREDIT" ? <ArrowDownLeft size={16} color="var(--accent-green)" /> : <ArrowUpRight size={16} color="var(--accent-red)" />}
                      </div>
                      {tx.description}
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", fontSize: "0.7rem" }}>
                      {tx.category || "General"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: tx.type === "CREDIT" ? "var(--accent-green)" : "var(--text-primary)" }}>
                    {tx.type === "DEBIT" ? "-" : ""}{formatCurrency(tx.amount)}
                  </td>
                  <td style={{ textAlign: "right", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {formatCurrency(tx.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
