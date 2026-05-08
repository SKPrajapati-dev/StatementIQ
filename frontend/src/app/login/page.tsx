"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-bg-orb-1"></div>
      <div className="auth-bg-orb auth-bg-orb-2"></div>

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">📊</div>
          <span className="auth-logo-name">StatementIQ</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Login to access your AI-powered financial dashboard</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail 
                size={18} 
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} 
              />
              <input
                id="email"
                type="email"
                className="input"
                placeholder="name@example.com"
                style={{ paddingLeft: "40px" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <div style={{ position: "relative" }}>
              <Lock 
                size={18} 
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} 
              />
              <input
                id="password"
                type="password"
                className="input"
                placeholder="••••••••"
                style={{ paddingLeft: "40px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: "100%", marginTop: "8px" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="spinner" style={{ width: "18px", height: "18px" }} /> : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-link">
          Don&apos;t have an account? <Link href="/register">Create one</Link>
        </div>
        
        <div style={{ marginTop: "32px", padding: "16px", background: "rgba(99, 102, 241, 0.05)", borderRadius: "var(--radius-md)", border: "1px dashed var(--border-active)" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>
            <strong>Demo Credentials:</strong><br/>
            Email: demo@example.com<br/>
            Password: Password@123
          </p>
        </div>
      </div>
    </div>
  );
}
