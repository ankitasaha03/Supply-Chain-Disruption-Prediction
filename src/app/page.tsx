"use client";

import React from "react";
import { Header } from "@/components/Header";
import { SummaryMetrics } from "@/components/SummaryMetrics";
import { NetworkTopologyMap } from "@/components/NetworkTopologyMap";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { RiskFeedTable } from "@/components/RiskFeedTable";
import { AIAssistantDrawer } from "@/components/AIAssistantDrawer";
import { DisruptionSimulatorModal } from "@/components/DisruptionSimulatorModal";
import { useSupplyChain } from "@/context/SupplyChainContext";
import {
  Bot,
  Server,
  Radio,
} from "lucide-react";

export default function DashboardPage() {
  const {
    isChatOpen,
    setIsChatOpen,
  } = useSupplyChain();

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Dynamic Header & System Controls */}
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 px-4 lg:px-6 py-6 space-y-6 max-w-[1720px] mx-auto w-full">
        {/* Section 1: Executive KPI Summary Cards */}
        <section aria-label="Summary KPI Cards">
          <SummaryMetrics />
        </section>

        {/* Section 2: Global Disruption Topology & Network Mesh */}
        <section aria-label="Network Topology and Geospatial Heatmap">
          <NetworkTopologyMap />
        </section>

        {/* Section 3: Predictive Analytics & Bottleneck Diagnostics */}
        <section aria-label="Predictive Analytics and Bottlenecks">
          <AnalyticsCharts />
        </section>

        {/* Section 4: Live Disruption Risk Feed & Autonomous Mitigation Table */}
        <section aria-label="Risk Feed and Mitigation Table">
          <RiskFeedTable />
        </section>
      </div>

      {/* Footer / Telemetry Status Bar */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 lg:px-6 py-3 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-500">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>GLOBAL AIS &amp; ERP TELEMETRY STREAM ONLINE</span>
          </div>
          <span className="hidden sm:inline text-slate-400">&bull;</span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Sub-second Monte Carlo latency recalculation enabled
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1">
            <Server className="h-3 w-3 text-slate-400" />
            Cluster: EU-WEST-1 (Active-Active)
          </span>
          <span>Synapse Enterprise SCM &copy; 2026</span>
        </div>
      </footer>

      {/* Slide-over AI Operations Assistant Drawer */}
      <AIAssistantDrawer />

      {/* Interactive Disruption Stress Simulator Modal */}
      <DisruptionSimulatorModal />

      {/* Floating Quick AI Trigger Pill (visible when chat closed) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-blue-400/30"
        >
          <Bot className="h-4 w-4 animate-bounce" />
          <span>Ask AI Ops Copilot</span>
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
        </button>
      )}
    </main>
  );
}
