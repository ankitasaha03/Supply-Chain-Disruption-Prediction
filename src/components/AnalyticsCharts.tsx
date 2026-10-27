"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  TrendingUp,
  Activity,
  AlertTriangle,
  Clock,
  DollarSign,
  BarChart3,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  HISTORICAL_AND_PREDICTIVE_RISK,
  VULNERABILITY_MATRIX_DATA,
  BOTTLENECK_DATA,
} from "@/data/mockData";
import { useSupplyChain } from "@/context/SupplyChainContext";
import { formatCurrency } from "@/lib/utils";

export function AnalyticsCharts() {
  const { isSimulationActive, isDarkMode } = useSupplyChain();
  const [selectedChartTab, setSelectedChartTab] = useState("forecast");

  // Chart colors adapt to theme
  const gridColor = isDarkMode ? "#334155" : "#e2e8f0";
  const textColor = isDarkMode ? "#94a3b8" : "#64748b";

  // Simulation shift modifier on forecast
  const chartData = HISTORICAL_AND_PREDICTIVE_RISK.map((item) => {
    if (!isSimulationActive) return item;
    return {
      ...item,
      predictedRisk: item.predictedRisk ? Math.min(100, item.predictedRisk + 12) : undefined,
      upperConfidence: item.upperConfidence ? Math.min(100, item.upperConfidence + 15) : undefined,
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Chart 1: AI 30-Day Risk Forecast (7 cols on desktop) */}
      <Card className="lg:col-span-7 border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Risk Trend: Historical vs. AI 30-Day Forecast
              </CardTitle>
              <Badge variant="cyber" className="text-[10px] py-0">
                Monte Carlo 95% CI
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Neural predictive projection factoring maritime weather, customs velocity &amp; tier inventory
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" stroke={textColor} fontSize={10} tickLine={false} />
                <YAxis stroke={textColor} fontSize={10} domain={[20, 100]} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-700 bg-slate-950/95 p-3 text-xs text-white shadow-xl backdrop-blur-md">
                          <p className="font-bold text-slate-200 mb-1">{label}</p>
                          {data.historicalRisk !== undefined && (
                            <p className="text-blue-400 font-medium">
                              Historical Index: <strong className="text-white">{data.historicalRisk}</strong>
                            </p>
                          )}
                          {data.predictedRisk !== undefined && (
                            <p className="text-indigo-400 font-medium">
                              AI Predictive Forecast: <strong className="text-white">{data.predictedRisk}</strong>
                            </p>
                          )}
                          {data.upperConfidence !== undefined && (
                            <p className="text-slate-400 text-[10px]">
                              Confidence Interval: [{data.lowerConfidence} - {data.upperConfidence}]
                            </p>
                          )}
                          <p className="text-slate-400 text-[10px] mt-1">
                            Benchmark Threshold: 50
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={75}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{ value: "Critical Alert (75)", fill: "#ef4444", fontSize: 9, position: "insideTopRight" }}
                />
                <ReferenceLine
                  y={50}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  label={{ value: "Safe Threshold (50)", fill: "#10b981", fontSize: 9, position: "insideBottomRight" }}
                />

                {/* Upper Confidence Band */}
                <Area
                  type="monotone"
                  dataKey="upperConfidence"
                  stroke="transparent"
                  fill="url(#confidenceGrad)"
                />

                {/* Historical Observed Risk */}
                <Line
                  type="monotone"
                  dataKey="historicalRisk"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#06b6d4" }}
                  name="Historical"
                />

                {/* AI Predictive Risk Line */}
                <Line
                  type="monotone"
                  dataKey="predictedRisk"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: "#3b82f6" }}
                  name="AI Prediction"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-500" /> Historical Trend
              <span className="h-2 w-2 rounded-full bg-blue-500 ml-2" /> AI Projected Mean
              <span className="h-2 w-2 rounded-full bg-indigo-400/40 ml-2" /> 95% Confidence
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Peak Vulnerability: Day +6
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Chart 2 & 3: Tabs between Vulnerability Matrix & Bottleneck Breakdown (5 cols on desktop) */}
      <Card className="lg:col-span-5 border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-indigo-500" />
              Network Stress &amp; Bottlenecks
            </CardTitle>
            <CardDescription className="text-xs">
              Vulnerability matrices and logistics dwell diagnostics
            </CardDescription>
          </div>

          <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedChartTab("forecast")}
              className={`px-2 py-0.5 text-[11px] rounded-md font-medium transition-all ${
                selectedChartTab === "forecast"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold shadow-xs"
                  : "text-slate-500"
              }`}
            >
              Bottlenecks
            </button>
            <button
              onClick={() => setSelectedChartTab("vulnerability")}
              className={`px-2 py-0.5 text-[11px] rounded-md font-medium transition-all ${
                selectedChartTab === "vulnerability"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold shadow-xs"
                  : "text-slate-500"
              }`}
            >
              SKU Matrix
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {selectedChartTab === "forecast" ? (
            /* Transportation Bottleneck Breakdown */
            <div>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={BOTTLENECK_DATA}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                    <XAxis type="number" stroke={textColor} fontSize={10} unit="h" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke={textColor}
                      fontSize={9}
                      tickLine={false}
                      width={100}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-slate-700 bg-slate-950/95 p-3 text-xs text-white shadow-xl">
                              <p className="font-bold">{item.name}</p>
                              <p className="text-amber-400">
                                Delay: <strong>{item.delayHours} Hours</strong>
                              </p>
                              <p className="text-red-400">
                                Financial Burn: <strong>${(item.financialBurn / 1000).toFixed(0)}K</strong>
                              </p>
                              <p className="text-slate-400 text-[10px]">
                                Vessels / Convoys Delayed: {item.vesselsDelayed}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="delayHours" radius={[0, 4, 4, 0]}>
                      {BOTTLENECK_DATA.map((entry, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={idx === 0 ? "#ef4444" : idx === 1 ? "#f97316" : "#3b82f6"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-amber-500" />
                  Top delay: Port of Rotterdam (178h dwell)
                </span>
                <span className="font-bold text-red-500">
                  Total Burn: $2.4M
                </span>
              </div>
            </div>
          ) : (
            /* Inventory Buffer vs Lead Time Matrix */
            <div>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 15, left: -15, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis
                      type="number"
                      dataKey="leadTimeDays"
                      name="Lead Time (Days)"
                      unit="d"
                      stroke={textColor}
                      fontSize={10}
                      label={{ value: "Lead Time (Days)", position: "insideBottom", offset: -5, fill: textColor, fontSize: 10 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="bufferDays"
                      name="Buffer Days"
                      unit="d"
                      stroke={textColor}
                      fontSize={10}
                      label={{ value: "Buffer (Days)", angle: -90, position: "insideLeft", fill: textColor, fontSize: 10 }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const p = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-slate-700 bg-slate-950/95 p-3 text-xs text-white shadow-xl">
                              <p className="font-bold text-blue-400">{p.sku}</p>
                              <p className="text-slate-300">Category: {p.category}</p>
                              <p>Lead Time: <strong className="text-white">{p.leadTimeDays} days</strong></p>
                              <p className={p.bufferDays <= 6 ? "text-red-400 font-bold" : "text-emerald-400"}>
                                Safety Buffer: {p.bufferDays} days
                              </p>
                              <p className="text-[10px] text-slate-400">Annual Run-Rate: {p.annualVolume}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ReferenceLine y={6} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Danger Zone (<6d)", fill: "#ef4444", fontSize: 9 }} />
                    <ReferenceLine x={20} stroke="#f97316" strokeDasharray="3 3" label={{ value: "Long Lead (>20d)", fill: "#f97316", fontSize: 9 }} />
                    <Scatter name="SKUs" data={VULNERABILITY_MATRIX_DATA}>
                      {VULNERABILITY_MATRIX_DATA.map((entry, index) => {
                        const isDanger = entry.bufferDays <= 6 && entry.leadTimeDays >= 20;
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={isDanger ? "#ef4444" : entry.criticality === "High" ? "#f97316" : "#3b82f6"}
                          />
                        );
                      })}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-red-500 font-semibold flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> 2 SKUs in Red Danger Zone
                </span>
                <span>Silicon &amp; Battery Cells</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
