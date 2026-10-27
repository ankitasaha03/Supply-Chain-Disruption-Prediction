import type { Metadata } from "next";
import "./globals.css";
import { SupplyChainProvider } from "@/context/SupplyChainContext";
import { ToastContainer } from "@/components/ToastContainer";

export const metadata: Metadata = {
  title: "Synapse AI SCM | Supply Chain Disruption & Risk Intelligence Platform",
  description:
    "Autonomous enterprise supply chain risk intelligence platform proactively detecting bottlenecks across suppliers, inventory, production, and multimodal freight with one-click automated mitigations.",
  keywords: [
    "Supply Chain Risk Management",
    "AI Disruption Intelligence",
    "Predictive Logistics",
    "Inventory Optimization",
    "Autonomous SCM",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-blue-600 selection:text-white antialiased transition-colors duration-200">
        <SupplyChainProvider>
          {children}
          <ToastContainer />
        </SupplyChainProvider>
      </body>
    </html>
  );
}
