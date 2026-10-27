"use client";

import React, { useState } from "react";
import { useSupplyChain } from "@/context/SupplyChainContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  DollarSign,
  Cpu,
  Anchor,
  Warehouse,
  Factory,
  Search,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { RiskIncident, RiskCategory, RiskLevel } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";

export function RiskFeedTable() {
  const {
    filteredIncidents,
    applyMitigation,
    selectedIncident,
    setSelectedIncident,
    filters,
    setFilter,
  } = useSupplyChain();

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeTabCategory, setActiveTabCategory] = useState<"ALL" | RiskCategory>("ALL");

  const categoryIcons = {
    Supplier: <Cpu className="h-3.5 w-3.5 text-blue-400" />,
    Logistics: <Anchor className="h-3.5 w-3.5 text-cyan-400" />,
    Inventory: <Warehouse className="h-3.5 w-3.5 text-amber-400" />,
    Production: <Factory className="h-3.5 w-3.5 text-emerald-400" />,
  };

  const handleRowClick = (incident: RiskIncident) => {
    setSelectedIncident(incident);
    setDetailModalOpen(true);
  };

  const handleMitigateClick = (e: React.MouseEvent, incident: RiskIncident) => {
    e.stopPropagation();
    applyMitigation(incident.id);
  };

  // Filter based on active category tab
  const displayedIncidents = filteredIncidents.filter((inc) => {
    if (activeTabCategory !== "ALL" && inc.category !== activeTabCategory) {
      return false;
    }
    return true;
  });

  return (
    <Card className="border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-md">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-3 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              Proactive Disruption Risk Feed &amp; Autonomous Mitigation Desk
            </CardTitle>
            <Badge variant="destructive" className="text-[10px] py-0">
              {displayedIncidents.length} Detected
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Real-time multi-echelon risk telemetry with prescriptively scored mitigation countermeasures
          </CardDescription>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 self-stretch md:self-auto">
          {(["ALL", "Supplier", "Logistics", "Inventory", "Production"] as const).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setActiveTabCategory(cat)}
                className={cn(
                  "px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer",
                  activeTabCategory === cat
                    ? "bg-blue-600 text-white shadow-xs font-semibold"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                {cat === "ALL" ? "All Vectors" : cat}
              </button>
            )
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[110px]">Severity</TableHead>
              <TableHead className="w-[120px]">Category</TableHead>
              <TableHead className="w-[200px]">Affected Node &amp; Route</TableHead>
              <TableHead className="min-w-[240px]">Root Cause Diagnostic</TableHead>
              <TableHead className="w-[140px]">Predicted Impact</TableHead>
              <TableHead className="min-w-[280px]">Recommended AI Mitigation</TableHead>
              <TableHead className="w-[150px] text-right">Execution Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedIncidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-400">
                  No risk incidents matching current filters.
                </TableCell>
              </TableRow>
            ) : (
              displayedIncidents.map((incident) => {
                const isExecuted = incident.executionStatus === "Executed";
                const isExecuting = incident.executionStatus === "In Progress";
                const isCritical = incident.riskLevel === "CRITICAL";

                return (
                  <TableRow
                    key={incident.id}
                    onClick={() => handleRowClick(incident)}
                    className={cn(
                      "cursor-pointer group",
                      isCritical && !isExecuted && "bg-red-500/[0.02] dark:bg-red-500/[0.04]"
                    )}
                  >
                    {/* 1. Risk Level */}
                    <TableCell>
                      <Badge
                        variant={
                          incident.riskLevel === "CRITICAL"
                            ? "critical"
                            : incident.riskLevel === "HIGH"
                            ? "high"
                            : incident.riskLevel === "MEDIUM"
                            ? "medium"
                            : "low"
                        }
                        className="flex items-center gap-1.5 w-fit font-mono text-[11px]"
                      >
                        {isCritical && !isExecuted && (
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                        )}
                        <span>{incident.riskLevel}</span>
                      </Badge>
                      <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                        {incident.id}
                      </span>
                    </TableCell>

                    {/* 2. Category */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                        {categoryIcons[incident.category]}
                        <span>{incident.category}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {incident.tierAffected}
                      </span>
                    </TableCell>

                    {/* 3. Affected Node & Route */}
                    <TableCell>
                      <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition-colors">
                        {incident.affectedEntity}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">{incident.routeOrLocation}</span>
                      </div>
                    </TableCell>

                    {/* 4. Root Cause Diagnostic */}
                    <TableCell>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug line-clamp-2">
                        {incident.rootCause}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Observed: {incident.timestamp} &bull; AI Confidence: {incident.confidenceScore}%
                      </span>
                    </TableCell>

                    {/* 5. Predicted Impact */}
                    <TableCell>
                      <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        <span>+{incident.predictedDelayDays}d delay</span>
                      </div>
                      <div className="text-[11px] font-semibold text-red-500 dark:text-red-400 mt-0.5">
                        {formatCurrency(incident.financialCostEst)} at risk
                      </div>
                    </TableCell>

                    {/* 6. Recommended AI Mitigation Action */}
                    <TableCell>
                      <div className="rounded-lg bg-blue-50/70 dark:bg-blue-950/40 p-2 border border-blue-200/50 dark:border-blue-800/40 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed">
                          {incident.aiMitigationAction}
                        </span>
                      </div>
                    </TableCell>

                    {/* 7. Execution Status & Action Button */}
                    <TableCell className="text-right">
                      {isExecuted ? (
                        <div className="flex flex-col items-end">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Executed
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {incident.executedAt || "Active"}
                          </span>
                        </div>
                      ) : isExecuting ? (
                        <Button
                          disabled
                          size="sm"
                          className="h-8 text-xs bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 w-full"
                        >
                          <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin mr-1.5" />
                          Dispatching...
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="cyber"
                          onClick={(e) => handleMitigateClick(e, incident)}
                          className="h-8 text-xs w-full shadow-sm"
                        >
                          <Zap className="h-3.5 w-3.5 mr-1" />
                          Apply Mitigation
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Incident Deep Dive Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        {selectedIncident && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant={
                    selectedIncident.riskLevel === "CRITICAL"
                      ? "critical"
                      : selectedIncident.riskLevel === "HIGH"
                      ? "high"
                      : "medium"
                  }
                  className="font-mono text-xs"
                >
                  {selectedIncident.riskLevel}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {selectedIncident.category}
                </Badge>
                <span className="text-xs font-mono text-slate-400">
                  {selectedIncident.id}
                </span>
              </div>
              <DialogTitle className="text-lg">
                {selectedIncident.affectedEntity}
              </DialogTitle>
              <DialogDescription>
                {selectedIncident.routeOrLocation} &bull; Tier Impact: {selectedIncident.tierAffected}
              </DialogDescription>
            </DialogHeader>

            <DialogContent className="space-y-4">
              {/* Root Cause Box */}
              <div className="rounded-xl bg-slate-800/60 p-3.5 border border-slate-700/60">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
                  Root Cause Diagnostics
                </h5>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {selectedIncident.rootCause}
                </p>
                <div className="mt-2 text-xs text-slate-400 flex items-center gap-4">
                  <span>First Observed: <strong>{selectedIncident.timestamp}</strong></span>
                  <span>AI Detection Confidence: <strong>{selectedIncident.confidenceScore}%</strong></span>
                </div>
              </div>

              {/* Impact Breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-800/40 p-3 border border-slate-700/50">
                  <span className="text-xs text-slate-400 block">Predicted Operational Delay</span>
                  <div className="text-xl font-black text-amber-400 mt-1 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    +{selectedIncident.predictedDelayDays} Days
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Lead time vulnerability threshold exceeded
                  </span>
                </div>

                <div className="rounded-xl bg-slate-800/40 p-3 border border-slate-700/50">
                  <span className="text-xs text-slate-400 block">Financial Exposure at Risk</span>
                  <div className="text-xl font-black text-red-400 mt-1 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {formatCurrency(selectedIncident.financialCostEst)}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Includes line-stoppage penalties &amp; demurrage
                  </span>
                </div>
              </div>

              {/* Recommended Mitigation Playbook */}
              <div className="rounded-xl bg-blue-950/40 p-3.5 border border-blue-800/40">
                <h5 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                  Prescribed Autonomous Countermeasure
                </h5>
                <p className="text-sm text-slate-100 font-medium leading-relaxed">
                  {selectedIncident.aiMitigationAction}
                </p>
                <p className="text-xs text-slate-400 mt-2 leading-normal">
                  {selectedIncident.details}
                </p>
              </div>

              {/* Audit trail / Execution status */}
              <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>
                  Current State:{" "}
                  <strong className="text-white">{selectedIncident.executionStatus}</strong>
                </span>
                <span>Type: {selectedIncident.mitigationType}</span>
              </div>
            </DialogContent>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setDetailModalOpen(false)}>
                Close
              </Button>
              {selectedIncident.executionStatus !== "Executed" && (
                <Button
                  variant="cyber"
                  size="sm"
                  onClick={() => {
                    applyMitigation(selectedIncident.id);
                    setDetailModalOpen(false);
                  }}
                >
                  <Zap className="h-3.5 w-3.5 mr-1" />
                  Execute Mitigation Now
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </Dialog>
    </Card>
  );
}
