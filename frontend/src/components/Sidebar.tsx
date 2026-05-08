"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  ReceiptText,
  Landmark,
  PiggyBank,
  TrendingUp,
  Bot,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/statements", label: "Statements", icon: ReceiptText },
  { href: "/loans", label: "Loans", icon: Landmark },
  { href: "/fixed-deposits", label: "Fixed Deposits", icon: PiggyBank },
  { href: "/investments", label: "Investments", icon: TrendingUp },
  { href: "/ai-advisor", label: "AI Advisor", icon: Bot },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div
      style={{
        width: "260px",
        height: "100vh",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "36px", paddingLeft: "8px" }}>
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
            flexShrink: 0,
          }}
        >
          📊
        </div>
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: "1.25rem",
            color: "#000000", // "some black"
          }}
        >
          StatementIQ
        </span>
        {/* Close button – mobile only */}
        <button
          onClick={() => setMobileOpen(false)}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            display: "none",
          }}
          className="mobile-close-btn"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 14px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.9rem",
                  color: isActive ? "var(--accent-primary)" : "var(--text-secondary)",
                  background: isActive ? "var(--accent-primary-glow)" : "transparent",
                  border: "1px solid",
                  borderColor: isActive ? "var(--border-active)" : "transparent",
                  transition: "all var(--transition-fast)",
                  textDecoration: "none",
                  position: "relative",
                  overflow: "hidden",
                }}
                className={clsx("nav-link", isActive && "active")}
              >
                <Icon size={18} style={{ flexShrink: 0, color: isActive ? "var(--accent-primary)" : "inherit" }} />
                <span style={{ flex: 1 }}>{label}</span>
                {isActive && <ChevronRight size={14} style={{ color: "var(--accent-primary)" }} />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User section */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "16px",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              marginBottom: "8px",
              borderRadius: "var(--radius-sm)",
              background: "var(--bg-card)",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent-primary), var(--accent-purple))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "white",
                flexShrink: 0,
              }}
            >
              {user.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.email}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{ width: "100%", justifyContent: "flex-start", gap: "10px", padding: "10px 14px" }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="desktop-sidebar">
        <SidebarContent />
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        style={{
          position: "fixed",
          top: "16px",
          left: "16px",
          zIndex: 60,
          background: "var(--bg-card)",
          border: "1px solid var(--border-card)",
          borderRadius: "var(--radius-sm)",
          padding: "8px",
          color: "var(--text-primary)",
          display: "none",
        }}
        className="mobile-menu-btn"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="sidebar-overlay open"
            onClick={() => setMobileOpen(false)}
          />
          <SidebarContent />
        </>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-sidebar { display: none; }
          .mobile-menu-btn { display: flex !important; }
          .mobile-close-btn { display: flex !important; }
        }
        @media (min-width: 901px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
