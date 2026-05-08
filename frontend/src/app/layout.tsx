import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "StatementIQ – AI-Powered Financial Analysis",
  description: "Understand your finances with AI-driven insights on transactions, loans, FDs, and investments.",
  keywords: ["financial analysis", "AI", "banking", "investments", "loans", "StatementIQ"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
