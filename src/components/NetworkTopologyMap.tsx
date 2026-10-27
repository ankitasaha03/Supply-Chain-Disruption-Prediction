"use client";

import React, { useState } from "react";
import { useSupplyChain } from "@/context/SupplyChainContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Factory,
  Anchor,
  Warehouse,
  Cpu,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Info,
  Navigation,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { SupplyChainNode, NodeType } from "@/types";
import { cn } from "@/lib/utils";

export function NetworkTopologyMap() {
  const { filteredNodes, nodes, selectedNode, setSelectedNode, applyMitigation, incidents } =
    useSupplyChain();
  const [viewMode, setViewMode] = useState<"topology" | "grid">("topology");
  const [hoveredNode, setHoveredNode] = useState<SupplyChainNode | null>(null);

  // Active node to inspect: selectedNode || hoveredNode || default to first critical node
  const activeInspectNode =
    selectedNode || hoveredNode || filteredNodes.find((n) => n.status === "critical") || filteredNodes[0];

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case "supplier":
        return <Cpu className="h-3.5 w-3.5" />;
      case "port":
        return <Anchor className="h-3.5 w-3.5" />;
      case "warehouse":
        return <Warehouse className="h-3.5 w-3.5" />;
      case "plant":
        return <Factory className="h-3.5 w-3.5" />;
      default:
        return <Truck className="h-3.5 w-3.5" />;
    }
  };

  const getStatusColor = (status: SupplyChainNode["status"]) => {
    switch (status) {
      case "critical":
        return {
          bg: "bg-red-500",
          border: "border-red-400",
          ring: "ring-red-500/50",
          text: "text-red-500",
          halo: "bg-red-500/30",
        };
      case "warning":
        return {
          bg: "bg-amber-500",
          border: "border-amber-400",
          ring: "ring-amber-500/50",
          text: "text-amber-500",
          halo: "bg-amber-500/30",
        };
      case "disrupted":
        return {
          bg: "bg-purple-500",
          border: "border-purple-400",
          ring: "ring-purple-500/50",
          text: "text-purple-500",
          halo: "bg-purple-500/30",
        };
      default:
        return {
          bg: "bg-emerald-500",
          border: "border-emerald-400",
          ring: "ring-emerald-500/50",
          text: "text-emerald-500",
          halo: "bg-emerald-500/30",
        };
    }
  };

  return (
    <Card className="border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-md">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Navigation className="h-4 w-4 text-blue-500" />
              Global Supply Network Topology &amp; Risk Heatmap
            </CardTitle>
            <Badge variant="cyber" className="text-[10px] py-0">
              Live Fleet AIS
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Interactive multi-echelon corridor mesh with real-time choke point alerts
          </CardDescription>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800/90 p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode("topology")}
              className={cn(
                "px-2.5 py-1 text-xs rounded-md font-medium transition-all",
                viewMode === "topology"
                  ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              )}
            >
              Network Canvas
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-2.5 py-1 text-xs rounded-md font-medium transition-all",
                viewMode === "grid"
                  ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              )}
            >
              Node Hierarchy
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-1">
        {viewMode === "topology" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left 8 Cols: Interactive Visual Topology Map */}
            <div className="lg:col-span-8 relative h-[360px] md:h-[400px] w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden shadow-inner flex items-center justify-center">
              {/* World Map Schematic Grid lines */}
              <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

              {/* Continents stylized background outlines (SVG silhouettes) */}
              <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 500">
                {/* Americas */}
                <path d="M150,80 Q250,70 300,140 Q280,240 220,280 Q180,340 220,440 Q170,410 130,290 Z" fill="#64748b" />
                {/* Eurasia & Africa */}
                <path d="M450,90 Q650,60 850,110 Q890,240 760,260 Q620,290 580,220 Q540,380 480,420 Q440,280 430,190 Z" fill="#64748b" />
                {/* Australia */}
                <path d="M780,340 Q880,330 890,410 Q810,430 770,390 Z" fill="#64748b" />
              </svg>

              {/* Connecting Shipping Corridors (SVG Bezier Curves) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#818cf8" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="dangerCorridorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Draw shipping lanes between connected nodes */}
                {nodes.map((node) =>
                  node.connectedTo.map((targetId) => {
                    const target = nodes.find((n) => n.id === targetId);
                    if (!target) return null;
                    const isDangerous =
                      node.status === "critical" || target.status === "critical";

                    // Curvature control
                    const x1 = `${node.coords.x}%`;
                    const y1 = `${node.coords.y}%`;
                    const x2 = `${target.coords.x}%`;
                    const y2 = `${target.coords.y}%`;

                    return (
                      <g key={`${node.id}-${targetId}`}>
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={isDangerous ? "url(#dangerCorridorGrad)" : "url(#corridorGrad)"}
                          strokeWidth={isDangerous ? "2" : "1.2"}
                          strokeDasharray={isDangerous ? "4 4" : "3 3"}
                          className="opacity-70"
                        />
                      </g>
                    );
                  })
                )}
              </svg>

              {/* Interactive Nodes Placed by Coordinates */}
              {filteredNodes.map((node) => {
                const colors = getStatusColor(node.status);
                const isSelected = activeInspectNode?.id === node.id;
                const isCritical = node.status === "critical";

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ left: `${node.coords.x}%`, top: `${node.coords.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  >
                    {/* Pulsing Radar Ring for Critical Nodes */}
                    {isCritical && (
                      <span className="absolute -inset-3 rounded-full bg-red-500/20 animate-ping pointer-events-none" />
                    )}

                    {/* Outer Glow Halo */}
                    <div
                      className={cn(
                        "relative flex items-center justify-center rounded-full p-2 transition-all duration-300 shadow-lg border",
                        colors.halo,
                        isSelected ? "scale-125 ring-2 ring-white" : "group-hover:scale-110",
                        colors.border,
                        "bg-slate-900/90 text-white"
                      )}
                    >
                      {getNodeIcon(node.type)}

                      {/* Small Status Indicator Dot */}
                      <span
                        className={cn(
                          "absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-slate-900",
                          colors.bg
                        )}
                      />
                    </div>

                    {/* Tooltip Label pill */}
                    <div
                      className={cn(
                        "absolute left-1/2 -translate-x-1/2 top-full mt-1.5 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-medium shadow-md transition-all pointer-events-none",
                        isSelected
                          ? "bg-blue-600 text-white font-bold opacity-100 z-30"
                          : "bg-slate-900/90 text-slate-300 opacity-80 group-hover:opacity-100"
                      )}
                    >
                      {node.name.split(" ")[0]} ({node.riskScore})
                    </div>
                  </div>
                );
              })}

              {/* Map Legend Overlay */}
              <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-3 rounded-lg bg-slate-900/85 p-2 px-3 border border-slate-800 text-[10px] text-slate-300 backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Critical Risk (&gt;75)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Elevated (50-75)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Optimal (&lt;50)</span>
                </div>
              </div>

              {/* Active Nodes Count Pill */}
              <div className="absolute top-3 right-3 rounded-lg bg-slate-900/80 px-2.5 py-1 text-[11px] font-mono text-cyan-400 border border-slate-800 backdrop-blur-md">
                {filteredNodes.length} NODES MONITORED
              </div>
            </div>

            {/* Right 4 Cols: Selected Node Deep Dive Inspector */}
            <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-4 flex flex-col justify-between">
              {activeInspectNode ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                        {getNodeIcon(activeInspectNode.type)}
                        <span>
                          {activeInspectNode.type} &bull; {activeInspectNode.region}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                        {activeInspectNode.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activeInspectNode.geo.city}, {activeInspectNode.geo.country} &bull; Tier-{activeInspectNode.tier}
                      </p>
                    </div>

                    <Badge
                      variant={
                        activeInspectNode.status === "critical"
                          ? "critical"
                          : activeInspectNode.status === "warning"
                          ? "high"
                          : "low"
                      }
                      className="font-mono text-xs"
                    >
                      Risk: {activeInspectNode.riskScore}/100
                    </Badge>
                  </div>

                  {/* Primary Commodity */}
                  <div className="rounded-lg bg-white dark:bg-slate-950/80 p-2.5 border border-slate-200/80 dark:border-slate-800 text-xs">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                      Primary Cargo / Component
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {activeInspectNode.primaryCommodity}
                    </span>
                  </div>

                  {/* Performance Indicators Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-white dark:bg-slate-950/80 p-2 border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Lead Time</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {activeInspectNode.leadTimeDays} Days
                      </span>
                    </div>
                    <div className="rounded-lg bg-white dark:bg-slate-950/80 p-2 border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Buffer Stock</span>
                      <span
                        className={cn(
                          "font-bold",
                          activeInspectNode.bufferDays <= 6 ? "text-red-500" : "text-emerald-500"
                        )}
                      >
                        {activeInspectNode.bufferDays} Days
                      </span>
                    </div>
                    <div className="rounded-lg bg-white dark:bg-slate-950/80 p-2 border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Inventory Level</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {activeInspectNode.inventoryPercent}% Capacity
                      </span>
                    </div>
                    <div className="rounded-lg bg-white dark:bg-slate-950/80 p-2 border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Throughput</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] truncate block">
                        {activeInspectNode.throughput}
                      </span>
                    </div>
                  </div>

                  {/* Active Disruptions at this node */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Active Threat Vectors ({activeInspectNode.activeDisruptions.length})
                    </span>
                    {activeInspectNode.activeDisruptions.length > 0 ? (
                      <div className="space-y-1.5">
                        {activeInspectNode.activeDisruptions.map((dis, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded p-1.5"
                          >
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            <span>{dis}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded p-2">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        <span>No unmitigated disruptions detected at this facility.</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Select a node on the canvas to inspect its telemetry.
                </div>
              )}

              {/* Connected Corridors summary */}
              {activeInspectNode && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>
                    Linked Nodes:{" "}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {activeInspectNode.connectedTo.length} routes
                    </strong>
                  </span>
                  <span className="font-mono text-[10px] text-blue-500">ID: {activeInspectNode.id}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Grid View Mode */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredNodes.map((node) => {
              const colors = getStatusColor(node.status);
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-3.5 hover:border-blue-500/50 transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg text-white",
                          colors.bg
                        )}
                      >
                        {getNodeIcon(node.type)}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {node.name}
                        </h5>
                        <p className="text-[10px] text-slate-500">
                          {node.geo.city}, {node.geo.country}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        node.status === "critical"
                          ? "critical"
                          : node.status === "warning"
                          ? "high"
                          : "low"
                      }
                      className="text-[10px] font-mono py-0"
                    >
                      {node.riskScore}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium line-clamp-1 mb-2">
                    {node.primaryCommodity}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500">
                    <span>Buffer: {node.bufferDays}d</span>
                    <span>Lead: {node.leadTimeDays}d</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Tier-{node.tier}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
