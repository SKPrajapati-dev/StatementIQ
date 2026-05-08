"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RootPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
       <div className="spinner"></div>
    </div>
  );
}
