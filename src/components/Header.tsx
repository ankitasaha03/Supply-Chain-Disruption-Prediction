"use client";

import React from "react";
import { useSupplyChain } from "@/context/SupplyChainContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  ShieldAlert,
  Zap,
  RotateCcw,
  Bot,
  Sun,
  Moon,
  Search,
  Activity,
  Globe2,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { Region, Timeframe, RiskLevel } from "@/types";

export function Header() {
  const {
    filters,
    setFilter,
    resetFilters,
    incidents,
    isSimulationActive,
    activeScenario,
    setIsSimulatingModalOpen,
    resetSimulation,
    isDarkMode,
    toggleTheme,
    isChatOpen,
    setIsChatOpen,
  } = useSupplyChain();

  const criticalAndHighCount = incidents.filter(
    (i) =>
      (i.riskLevel === "CRITICAL" || i.riskLevel === "HIGH") &&
      i.executionStatus !== "Executed" &&
      i.executionStatus !== "Dismissed"
  ).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 dark:border-slate-800/80 dark:bg-slate-950/85 backdrop-blur-xl transition-colors">
      {/* Top Banner if Simulation is Active */}
      {isSimulationActive && activeScenario && (
        <div className="bg-gradient-to-r from-red-600/90 via-amber-600/90 to-red-600/90 px-4 py-1.5 text-xs text-white font-medium flex items-center justify-between shadow-inner animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-white animate-ping" />
            <span className="font-bold tracking-wider uppercase text-[11px]">
              Active Simulation Injected:
            </span>
            <span className="font-semibold">{activeScenario.title}</span>
            <span className="opacity-80 hidden md:inline">
              — Estimated network latency shock: +{activeScenario.delayModifierDays} days
            </span>
          </div>
          <button
            onClick={resetSimulation}
            className="inline-flex items-center gap-1.5 rounded bg-black/30 hover:bg-black/50 px-2.5 py-0.5 text-xs font-semibold text-white transition-all border border-white/20 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Revert to Live Baseline
          </button>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="px-4 lg:px-6 py-3 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Left: Branding & Status Badge */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 shadow-md shadow-blue-500/20 text-white font-bold text-lg">
            <Layers className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border-2 border-slate-950" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                SYNAPSE <span className="text-blue-600 dark:text-blue-400 font-mono text-sm font-semibold">SCM.AI</span>
              </h1>
              <Badge variant="cyber" className="text-[10px] py-0 px-1.5 hidden sm:inline-flex">
                v2.4 CORE
              </Badge>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>TELEMETRY ACTIVE</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Predictive Multi-Tier Disruption & Automated Mitigation Platform
            </p>
          </div>

          {/* Critical Risk Pill */}
          <div className="ml-2 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/25 px-2.5 py-1 text-xs">
            <ShieldAlert className="h-4 w-4 text-red-500 animate-bounce" />
            <div className="flex items-center gap-1">
              <span className="font-bold text-red-600 dark:text-red-400">
                {criticalAndHighCount}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium hidden md:inline">
                High Risks
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls: Actions, Simulation, Chat & Theme */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          {/* Simulate Disruption Button */}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsSimulatingModalOpen(true)}
            className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold shadow-md shadow-red-500/20 border border-red-400/30 text-xs h-8 px-3"
          >
            <Zap className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Simulate</span> Disruption Event
          </Button>

          {/* AI Assistant Drawer Toggle */}
          <Button
            variant="cyber"
            size="sm"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="text-xs h-8 px-3 relative"
          >
            <Bot className="h-3.5 w-3.5 mr-1" />
            <span>AI Ops Copilot</span>
            <span className="ml-1 rounded-full bg-cyan-400/30 px-1 py-0.2 text-[9px] text-cyan-200">
              Live
            </span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 text-slate-600 dark:text-slate-300"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Global Filter Toolbar */}
      <div className="px-4 lg:px-6 py-2 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Region Filter */}
          <div className="flex items-center gap-1.5 w-36">
            <Globe2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <Select
              value={filters.region}
              onChange={(e) => setFilter("region", e.target.value as Region)}
              className="h-7 text-xs py-0"
            >
              <option value="Global">All Regions</option>
              <option value="North America">North America</option>
              <option value="EMEA">EMEA</option>
              <option value="APAC">APAC</option>
              <option value="LATAM">LATAM</option>
            </Select>
          </div>

          {/* Timeframe Filter */}
          <div className="flex items-center gap-1.5 w-36">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <Select
              value={filters.timeframe}
              onChange={(e) => setFilter("timeframe", e.target.value as Timeframe)}
              className="h-7 text-xs py-0"
            >
              <option value="Next 7 Days">Next 7 Days</option>
              <option value="Next 14 Days">Next 14 Days</option>
              <option value="Next 30 Days">Next 30 Days</option>
              <option value="Next 90 Days">Next 90 Days</option>
            </Select>
          </div>

          {/* Risk Severity Filter */}
          <div className="flex items-center gap-1.5 w-36">
            <ShieldAlert className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <Select
              value={filters.riskSeverity}
              onChange={(e) =>
                setFilter("riskSeverity", e.target.value as "ALL" | RiskLevel)
              }
              className="h-7 text-xs py-0"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Only</option>
              <option value="MEDIUM">Medium Only</option>
              <option value="LOW">Low Only</option>
            </Select>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[180px] max-w-xs flex-1">
            <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search nodes, routes, SKUs..."
              value={filters.searchQuery}
              onChange={(e) => setFilter("searchQuery", e.target.value)}
              className="h-7 pl-8 pr-2 text-xs bg-white/70 dark:bg-slate-900/70"
            />
          </div>
        </div>

        {/* Reset Filters CTA if active */}
        {(filters.region !== "Global" ||
          filters.timeframe !== "Next 14 Days" ||
          filters.riskSeverity !== "ALL" ||
          filters.searchQuery !== "") && (
          <button
            onClick={resetFilters}
            className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Filters
          </button>
        )}
      </div>
    </header>
  );
}
