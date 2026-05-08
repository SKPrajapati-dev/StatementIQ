"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, Mail, Lock, User, Hash, Phone, Loader2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    accountNumber: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register(formData);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-bg-orb-1"></div>
      <div className="auth-bg-orb auth-bg-orb-2"></div>

      <div className="auth-card" style={{ maxWidth: "500px" }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">📊</div>
          <span className="auth-logo-name">StatementIQ</span>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Get started with personalized AI financial insights</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="input-group">
              <label className="input-label" htmlFor="name">Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input id="name" type="text" className="input" placeholder="John Doe" style={{ paddingLeft: "40px" }} value={formData.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="email">Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input id="email" type="email" className="input" placeholder="john@example.com" style={{ paddingLeft: "40px" }} value={formData.email} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label className="input-label" htmlFor="accountNumber">Account Number</label>
              <div style={{ position: "relative" }}>
                <Hash size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input id="accountNumber" type="text" className="input" placeholder="1234567890" style={{ paddingLeft: "40px" }} value={formData.accountNumber} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="phone">Phone (Optional)</label>
              <div style={{ position: "relative" }}>
                <Phone size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input id="phone" type="tel" className="input" placeholder="+1..." style={{ paddingLeft: "40px" }} value={formData.phone} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input id="password" type="password" className="input" placeholder="••••••••" style={{ paddingLeft: "40px" }} value={formData.password} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: "12px" }} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="spinner" style={{ width: "18px", height: "18px" }} /> : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link href="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
