"use client";

import React from "react";
import { useSupplyChain } from "@/context/SupplyChainContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  AlertTriangle,
  Clock,
  DollarSign,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function SummaryMetrics() {
  const {
    healthScore,
    activeHighRiskNodesCount,
    predictedDelayDaysAvg,
    financialCostTotal,
    actionsExecutedCount,
    actionsPendingCount,
    nodes,
    applyAllMitigations,
    isSimulationActive,
  } = useSupplyChain();

  // Health Score calculation visual details
  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 stroke-emerald-500";
    if (score >= 60) return "text-amber-500 stroke-amber-500";
    return "text-red-500 stroke-red-500";
  };

  const getHealthLabel = (score: number) => {
    if (score >= 85) return "Optimal Resilience";
    if (score >= 70) return "Elevated Vulnerability";
    if (score >= 50) return "Substantial Disruption";
    return "Critical Failure State";
  };

  // Node Breakdown
  const criticalSuppliers = nodes.filter((n) => n.type === "supplier" && (n.status === "critical" || n.status === "warning")).length;
  const criticalPorts = nodes.filter((n) => n.type === "port" && (n.status === "critical" || n.status === "warning")).length;
  const criticalPlants = nodes.filter((n) => n.type === "plant" && (n.status === "critical" || n.status === "warning")).length;

  const totalActions = actionsExecutedCount + actionsPendingCount;
  const executionPct = totalActions > 0 ? Math.round((actionsExecutedCount / totalActions) * 100) : 0;

  // SVG Radial circle math
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Overall Supply Chain Health Score */}
      <Card className="relative overflow-hidden border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/90 dark:to-slate-950/90 shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-4 pt-4 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Health Score Index
            </span>
            <Badge
              variant={healthScore >= 75 ? "success" : healthScore >= 55 ? "medium" : "critical"}
              className="text-[10px] py-0 px-1.5"
            >
              {isSimulationActive ? "Simulated" : "Live Telemetry"}
            </Badge>
          </div>

          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-baseline gap-1">
                {healthScore}
                <span className="text-sm font-medium text-slate-400">/100</span>
              </div>
              <p className="text-xs font-semibold mt-0.5 text-slate-700 dark:text-slate-300">
                {getHealthLabel(healthScore)}
              </p>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-18 h-18 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  className={`transition-all duration-1000 ease-out ${getHealthColor(healthScore)}`}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <Activity className="absolute h-5 w-5 text-slate-400 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="flex items-center gap-1">
              {healthScore >= 70 ? (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span>{healthScore >= 70 ? "+4.2% resilience" : "-12.5% latency impact"}</span>
            </span>
            <span>Target: &gt;88</span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Active High-Risk Nodes */}
      <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-4 pt-4 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Vulnerable Nodes
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-baseline gap-1">
              {activeHighRiskNodesCount}
              <span className="text-sm font-medium text-slate-400">/ {nodes.length} nodes</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">
                Fab: {criticalSuppliers}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">
                Port: {criticalPorts}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">
                Plant: {criticalPlants}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-amber-500 font-medium">Rotterdam &amp; TSMC Fab 18</span>
            <span className="text-[10px]">Tier 1/2</span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Predicted Delay Impact */}
      <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-4 pt-4 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Predicted Delay &amp; Cost
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Clock className="h-4 w-4" />
            </div>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-baseline gap-1">
              +{predictedDelayDaysAvg}
              <span className="text-sm font-semibold text-slate-500">Days</span>
            </div>
            <div className="text-xs font-bold text-red-500 dark:text-red-400 flex items-center gap-1 mt-1">
              <DollarSign className="h-3.5 w-3.5" />
              <span>{formatCurrency(financialCostTotal)}</span>
              <span className="text-slate-400 font-normal text-[11px]">total value-at-risk</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span>Burn rate: ~$135K / day</span>
            <span className="text-emerald-500 font-medium">AI Mitigations Cut 82%</span>
          </div>
        </CardContent>
      </Card>

      {/* 4. Automated Actions Executed vs. Pending */}
      <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-4 pt-4 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Autonomous Mitigation
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>

          <div className="my-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {actionsExecutedCount}{" "}
                <span className="text-sm font-normal text-slate-400">
                  / {totalActions} Executed
                </span>
              </span>
              <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">
                {executionPct}%
              </span>
            </div>

            <Progress
              value={executionPct}
              className="h-2"
              indicatorColor="bg-gradient-to-r from-blue-500 to-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-500">
              {actionsPendingCount} pending review
            </span>
            {actionsPendingCount > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={applyAllMitigations}
                className="h-6 text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 p-1"
              >
                <Sparkles className="h-3 w-3 mr-1 text-cyan-400" />
                Auto-Mitigate All
              </Button>
            ) : (
              <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Fully Optimized
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
