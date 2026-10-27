"use client";

import React, { useState } from "react";
import { useSupplyChain } from "@/context/SupplyChainContext";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  RotateCcw,
  AlertTriangle,
  Clock,
  DollarSign,
  Layers,
  Sparkles,
  Flame,
  Ship,
  Wind,
  ShieldX,
  Factory,
} from "lucide-react";
import { DISRUPTION_SCENARIOS } from "@/data/mockData";
import { DisruptionScenario } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";

export function DisruptionSimulatorModal() {
  const {
    isSimulatingModalOpen,
    setIsSimulatingModalOpen,
    simulateDisruption,
    isSimulationActive,
    activeScenario,
    resetSimulation,
  } = useSupplyChain();

  const [selectedScenario, setSelectedScenario] = useState<DisruptionScenario>(
    DISRUPTION_SCENARIOS[0]
  );
  const [severityPct, setSeverityPct] = useState<number>(85);
  const [durationDays, setDurationDays] = useState<number>(21);

  const scenarioIcons: Record<string, React.ReactNode> = {
    "scenario-suez-choke": <Ship className="h-5 w-5 text-red-400" />,
    "scenario-lithium-shortage": <Flame className="h-5 w-5 text-orange-400" />,
    "scenario-taiwan-typhoon": <Wind className="h-5 w-5 text-cyan-400" />,
    "scenario-port-strike": <ShieldX className="h-5 w-5 text-amber-400" />,
    "scenario-tier1-insolvency": <Factory className="h-5 w-5 text-purple-400" />,
  };

  const handleInject = () => {
    simulateDisruption(selectedScenario, severityPct);
  };

  const calculatedDelay = (
    selectedScenario.delayModifierDays *
    (severityPct / 100)
  ).toFixed(1);
  const calculatedCost = Math.round(
    selectedScenario.costImpactEstimate * (severityPct / 100)
  );

  return (
    <Dialog open={isSimulatingModalOpen} onOpenChange={setIsSimulatingModalOpen}>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-500">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle>AI Supply Chain Disruption Stress Simulator</DialogTitle>
            <DialogDescription>
              Inject synthetic macroeconomic, geopolitical, and meteorological shocks to test network elasticity
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <DialogContent className="space-y-4">
        {/* Preset Scenarios Selector Grid */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Select Preconfigured Disruption Scenario
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {DISRUPTION_SCENARIOS.map((scenario) => {
              const isSelected = selectedScenario.id === scenario.id;
              return (
                <div
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario)}
                  className={cn(
                    "rounded-xl border p-3 cursor-pointer transition-all flex flex-col justify-between",
                    isSelected
                      ? "border-red-500 bg-red-950/30 ring-1 ring-red-500/50 shadow-md"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {scenarioIcons[scenario.id] || <AlertTriangle className="h-4 w-4 text-red-400" />}
                      <span className="text-xs font-bold text-white line-clamp-1">
                        {scenario.title}
                      </span>
                    </div>
                    <Badge variant="critical" className="text-[9px] py-0 px-1 font-mono shrink-0">
                      {scenario.severity}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1.5 leading-snug">
                    {scenario.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/80">
                    <span className="text-amber-400 font-semibold">
                      +{scenario.delayModifierDays}d delay
                    </span>
                    <span className="text-red-400 font-semibold">
                      {formatCurrency(scenario.costImpactEstimate)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Sliders for Intensity & Duration */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-200">
                Disruption Severity Multiplier: {severityPct}%
              </span>
              <p className="text-[11px] text-slate-400">
                Scales port dwell queues, transit delays, and line stoppages
              </p>
            </div>
            <Badge variant="cyber" className="text-xs font-mono">
              {severityPct >= 80 ? "Catastrophic" : severityPct >= 50 ? "Severe" : "Moderate"}
            </Badge>
          </div>

          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={severityPct}
            onChange={(e) => setSeverityPct(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>20% (Partial Slowdown)</span>
            <span>60% (Major Congestion)</span>
            <span>100% (Total Chokepoint Gridlock)</span>
          </div>
        </div>

        {/* Projected Impact Preview Box */}
        <div className="rounded-xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-red-950/40 border border-red-500/30 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Projected Shock Propagation (Calculated Real-Time)
            </span>
            <span className="text-[10px] font-mono text-amber-400">
              {selectedScenario.affectedNodeIds.length} Key Facilities Affected
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-black/40 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Lead Time Latency Shock</span>
              <span className="text-lg font-black text-amber-400 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                +{calculatedDelay} Days
              </span>
            </div>
            <div className="rounded-lg bg-black/40 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Financial Shock Exposure</span>
              <span className="text-lg font-black text-red-400 flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {formatCurrency(calculatedCost)}
              </span>
            </div>
          </div>

          <div className="mt-2.5 text-[11px] text-slate-300 bg-black/30 rounded p-2 border border-white/5">
            <strong>Prescribed Countermeasure:</strong> {selectedScenario.recommendedPresetAction}
          </div>
        </div>
      </DialogContent>

      <DialogFooter className="flex items-center justify-between">
        <div>
          {isSimulationActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetSimulation}
              className="text-xs text-slate-300 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset Baseline
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSimulatingModalOpen(false)}
            className="text-xs text-slate-400"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleInject}
            className="bg-gradient-to-r from-red-600 to-amber-600 font-bold text-xs"
          >
            <Zap className="h-3.5 w-3.5 mr-1" />
            Inject Shock Telemetry
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
