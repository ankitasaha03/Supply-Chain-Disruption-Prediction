"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  SupplyChainNode,
  RiskIncident,
  DisruptionScenario,
  ChatMessage,
  Region,
  Timeframe,
  RiskCategory,
} from "@/types";
import {
  INITIAL_NODES,
  INITIAL_INCIDENTS,
  DISRUPTION_SCENARIOS,
} from "@/data/mockData";

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "critical" | "info";
  timestamp: string;
}

interface FilterState {
  region: Region;
  timeframe: Timeframe;
  riskSeverity: "ALL" | "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  category: "ALL" | RiskCategory;
  searchQuery: string;
}

interface SupplyChainContextType {
  // Data
  nodes: SupplyChainNode[];
  incidents: RiskIncident[];
  selectedNode: SupplyChainNode | null;
  setSelectedNode: (node: SupplyChainNode | null) => void;
  selectedIncident: RiskIncident | null;
  setSelectedIncident: (incident: RiskIncident | null) => void;

  // Filters
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  filteredIncidents: RiskIncident[];
  filteredNodes: SupplyChainNode[];

  // Metrics
  healthScore: number;
  activeHighRiskNodesCount: number;
  predictedDelayDaysAvg: number;
  financialCostTotal: number;
  actionsExecutedCount: number;
  actionsPendingCount: number;

  // Actions
  applyMitigation: (incidentId: string) => Promise<void>;
  applyAllMitigations: () => Promise<void>;
  dismissIncident: (incidentId: string) => void;

  // Simulation
  isSimulationActive: boolean;
  activeScenario: DisruptionScenario | null;
  isSimulatingModalOpen: boolean;
  setIsSimulatingModalOpen: (open: boolean) => void;
  simulateDisruption: (scenario: DisruptionScenario, severityPct?: number) => void;
  resetSimulation: () => void;

  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Chat Drawer
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendMessage: (text: string) => void;
  executeActionFromChat: (actionId: string, incidentId?: string) => void;

  // Toasts
  toasts: ToastNotification[];
  removeToast: (id: string) => void;
  addToast: (toast: Omit<ToastNotification, "id" | "timestamp">) => void;
}

const SupplyChainContext = createContext<SupplyChainContextType | undefined>(undefined);

export function SupplyChainProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<SupplyChainNode[]>(INITIAL_NODES);
  const [incidents, setIncidents] = useState<RiskIncident[]>(INITIAL_INCIDENTS);
  const [selectedNode, setSelectedNode] = useState<SupplyChainNode | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<RiskIncident | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<DisruptionScenario | null>(null);
  const [isSimulatingModalOpen, setIsSimulatingModalOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Global filters
  const [filters, setFilters] = useState<FilterState>({
    region: "Global",
    timeframe: "Next 14 Days",
    riskSeverity: "ALL",
    category: "ALL",
    searchQuery: "",
  });

  const setFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      region: "Global",
      timeframe: "Next 14 Days",
      riskSeverity: "ALL",
      category: "ALL",
      searchQuery: "",
    });
  }, []);

  // Theme Toggle
  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof document !== "undefined") {
        if (next) {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
        }
      }
      return next;
    });
  }, []);

  // Ensure default dark class on mount
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toast Helper
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((t: Omit<ToastNotification, "id" | "timestamp">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastNotification = {
      ...t,
      id,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  // Initial Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "assistant",
      text: "👋 **Welcome to Synapse AI SCM Intelligence Center.**\n\nI continuously monitor global telemetry, marine AIS transponders, port congestion indexes, and Tier 1-3 supplier buffer health.\n\nCurrently, **2 Critical Bottlenecks** require operational clearance (TSMC Fab 18 wafer delay & Rotterdam container backlog). How can I assist your operations desk?",
      timestamp: "Just now",
      suggestions: [
        "Show top 3 supplier risks this week",
        "What happens if Port of Rotterdam delays increase by 4 days?",
        "Suggest alternate vendors for Microchip Batch #A92",
        "Auto-remediate all container rerouting",
      ],
    },
  ]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      if (filters.region !== "Global" && node.region !== filters.region) {
        return false;
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return (
          node.name.toLowerCase().includes(q) ||
          node.primaryCommodity.toLowerCase().includes(q) ||
          node.geo.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [nodes, filters.region, filters.searchQuery]);

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      if (filters.riskSeverity !== "ALL" && incident.riskLevel !== filters.riskSeverity) {
        return false;
      }
      if (filters.category !== "ALL" && incident.category !== filters.category) {
        return false;
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return (
          incident.affectedEntity.toLowerCase().includes(q) ||
          incident.rootCause.toLowerCase().includes(q) ||
          incident.routeOrLocation.toLowerCase().includes(q) ||
          incident.aiMitigationAction.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [incidents, filters.riskSeverity, filters.category, filters.searchQuery]);

  // Calculated Metrics
  const actionsExecutedCount = useMemo(() => {
    return incidents.filter((i) => i.executionStatus === "Executed").length;
  }, [incidents]);

  const actionsPendingCount = useMemo(() => {
    return incidents.filter((i) => i.executionStatus === "Pending" || i.executionStatus === "In Progress").length;
  }, [incidents]);

  const activeHighRiskNodesCount = useMemo(() => {
    return nodes.filter((n) => n.status === "critical" || n.status === "warning").length;
  }, [nodes]);

  const predictedDelayDaysAvg = useMemo(() => {
    const active = incidents.filter((i) => i.executionStatus !== "Executed" && i.executionStatus !== "Dismissed");
    if (!active.length) return 0.5;
    const total = active.reduce((acc, curr) => acc + curr.predictedDelayDays, 0);
    return Number((total / active.length).toFixed(1));
  }, [incidents]);

  const financialCostTotal = useMemo(() => {
    const active = incidents.filter((i) => i.executionStatus !== "Executed" && i.executionStatus !== "Dismissed");
    return active.reduce((acc, curr) => acc + curr.financialCostEst, 0);
  }, [incidents]);

  // Dynamic Health score: 100 base minus penalty per unmitigated risk
  const healthScore = useMemo(() => {
    let score = 94;
    incidents.forEach((inc) => {
      if (inc.executionStatus !== "Executed" && inc.executionStatus !== "Dismissed") {
        if (inc.riskLevel === "CRITICAL") score -= 14;
        else if (inc.riskLevel === "HIGH") score -= 8;
        else if (inc.riskLevel === "MEDIUM") score -= 4;
        else score -= 1;
      }
    });
    if (isSimulationActive) {
      score -= 16;
    }
    return Math.max(18, Math.min(99, score));
  }, [incidents, isSimulationActive]);

  // Apply Mitigation
  const applyMitigation = useCallback(
    async (incidentId: string) => {
      const target = incidents.find((i) => i.id === incidentId);
      if (!target || target.executionStatus === "Executed") return;

      // Mark in progress
      setIncidents((prev) =>
        prev.map((i) =>
          i.id === incidentId ? { ...i, executionStatus: "In Progress" as const } : i
        )
      );

      // Simulate micro dispatch delay
      await new Promise((r) => setTimeout(r, 650));

      setIncidents((prev) =>
        prev.map((i) => {
          if (i.id === incidentId) {
            return {
              ...i,
              executionStatus: "Executed" as const,
              predictedDelayDays: Math.max(0.2, Number((i.predictedDelayDays * 0.18).toFixed(1))),
              financialCostEst: Math.round(i.financialCostEst * 0.12),
              executedAt: "Just now",
            };
          }
          return i;
        })
      );

      // Relax node health if relevant
      setNodes((prev) =>
        prev.map((node) => {
          if (
            node.name.toLowerCase().includes("rotterdam") &&
            target.affectedEntity.toLowerCase().includes("rotterdam")
          ) {
            return { ...node, status: "warning", riskScore: 52 };
          }
          if (
            node.name.toLowerCase().includes("tsmc") &&
            target.affectedEntity.toLowerCase().includes("tsmc")
          ) {
            return { ...node, status: "warning", riskScore: 56 };
          }
          return node;
        })
      );

      // Trigger Confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#3b82f6", "#10b981", "#6366f1"],
        });
      } catch (err) {
        // silent
      }

      addToast({
        title: "Mitigation Executed Successfully",
        message: `Dispatched: "${target.aiMitigationAction.slice(0, 70)}..."`,
        type: "success",
      });

      // Update Chat
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: "assistant",
          text: `⚡ **Action Dispatched:** Successfully initiated automated mitigation for **${target.affectedEntity}**.\n\n- **Strategy:** ${target.aiMitigationAction}\n- **Delay Recouped:** Saved ~${(target.predictedDelayDays * 0.82).toFixed(1)} days.\n- **Cost Saved:** ~$${(target.financialCostEst * 0.88).toLocaleString()}.\n- **New Health Score:** Recalibrated telemetry reflects updated risk envelope.`,
          timestamp: "Just now",
        },
      ]);
    },
    [incidents, addToast]
  );

  // Batch Apply All Mitigations
  const applyAllMitigations = useCallback(async () => {
    const pendings = incidents.filter((i) => i.executionStatus === "Pending");
    if (!pendings.length) {
      addToast({
        title: "No Actions Pending",
        message: "All detected risk vectors currently have active mitigation strategies.",
        type: "info",
      });
      return;
    }

    setIncidents((prev) =>
      prev.map((i) =>
        i.executionStatus === "Pending" ? { ...i, executionStatus: "In Progress" as const } : i
      )
    );

    await new Promise((r) => setTimeout(r, 900));

    setIncidents((prev) =>
      prev.map((i) => ({
        ...i,
        executionStatus: "Executed" as const,
        predictedDelayDays: Math.max(0.2, Number((i.predictedDelayDays * 0.2).toFixed(1))),
        financialCostEst: Math.round(i.financialCostEst * 0.15),
        executedAt: "Just now",
      }))
    );

    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        status: node.status === "critical" ? "warning" : "normal",
        riskScore: Math.max(20, Math.round(node.riskScore * 0.5)),
      }))
    );

    try {
      confetti({
        particleCount: 90,
        spread: 90,
        origin: { y: 0.7 },
        colors: ["#10b981", "#3b82f6", "#f59e0b"],
      });
    } catch (e) {
      // silent
    }

    addToast({
      title: "Batch Mitigations Applied",
      message: `Executed AI recommendations across ${pendings.length} supply chain nodes.`,
      type: "success",
    });

    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: `🎯 **Bulk Mitigation Completed:** Executed automated playbooks across **${pendings.length} risk vectors**.\n\nAll logistics reroutes, secondary silicon allocations, and buffer transfers have been committed to ERP & carrier telemetry.`,
        timestamp: "Just now",
      },
    ]);
  }, [incidents, addToast]);

  // Dismiss Incident
  const dismissIncident = useCallback((incidentId: string) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId ? { ...i, executionStatus: "Dismissed" as const } : i))
    );
  }, []);

  // Simulate Disruption
  const simulateDisruption = useCallback(
    (scenario: DisruptionScenario, severityPct: number = 100) => {
      setIsSimulationActive(true);
      setActiveScenario(scenario);
      setIsSimulatingModalOpen(false);

      const ratio = severityPct / 100;
      const injectedIncident: RiskIncident = {
        id: `SIM-${Date.now().toString().slice(-4)}`,
        riskLevel: scenario.severity === "CRITICAL" ? "CRITICAL" : "HIGH",
        category: scenario.category,
        affectedEntity: scenario.title,
        routeOrLocation: "Global Multi-Node Corridor",
        rootCause: `[INJECTED SIMULATION] ${scenario.description}`,
        predictedDelayDays: Number((scenario.delayModifierDays * ratio).toFixed(1)),
        financialCostEst: Math.round(scenario.costImpactEstimate * ratio),
        aiMitigationAction: scenario.recommendedPresetAction,
        executionStatus: "Pending",
        timestamp: "Simulated just now",
        confidenceScore: 97,
        mitigationType: "REROUTE",
        details: `Stress test scenario generated by AI disruption engine. Impacting ${scenario.affectedNodeIds.length} primary nodes.`,
        tierAffected: "Multi-Tier Network",
      };

      setIncidents((prev) => [injectedIncident, ...prev]);

      // Degrade affected nodes
      setNodes((prev) =>
        prev.map((node) => {
          if (scenario.affectedNodeIds.includes(node.id)) {
            return {
              ...node,
              status: "critical",
              riskScore: Math.min(99, Math.round(node.riskScore + 30 * ratio)),
              activeDisruptions: [
                `[SIMULATION] ${scenario.title}`,
                ...node.activeDisruptions.filter((d) => !d.startsWith("[SIMULATION]")),
              ],
            };
          }
          return node;
        })
      );

      addToast({
        title: "Disruption Scenario Injected",
        message: `Simulation Active: ${scenario.title} (${severityPct}% intensity).`,
        type: "critical",
      });

      // Add to AI chat with direct action prompt
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: "assistant",
          text: `🚨 **DISRUPTION EVENT SIMULATED: ${scenario.title.toUpperCase()}**\n\n- **Category:** ${scenario.category}\n- **Predicted Delay Shock:** +${(scenario.delayModifierDays * ratio).toFixed(1)} days\n- **Financial Exposure:** $${Math.round(scenario.costImpactEstimate * ratio).toLocaleString()}\n- **Nodes Affected:** ${scenario.affectedNodeIds.join(", ")}\n\n**AI Recommendation:** ${scenario.recommendedPresetAction}`,
          timestamp: "Just now",
          actionPrompt: {
            label: "Execute Recommended Scenario Countermeasure",
            actionId: "apply-scenario-mitigation",
            type: "SIMULATION_MITIGATION",
            incidentId: injectedIncident.id,
          },
          suggestions: [
            "Show cascading bottlenecks for this scenario",
            "What is the cost differential if we switch to air freight?",
            "Revert simulation to baseline",
          ],
        },
      ]);
    },
    [addToast]
  );

  // Reset Simulation
  const resetSimulation = useCallback(() => {
    setIsSimulationActive(false);
    setActiveScenario(null);
    setNodes(INITIAL_NODES);
    setIncidents(INITIAL_INCIDENTS);
    addToast({
      title: "Simulation Reset to Baseline",
      message: "Telemetry restored to live operational feed.",
      type: "info",
    });
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        text: "🔄 **Simulation Cleared:** Network parameters have been restored to current live operational telemetry.",
        timestamp: "Just now",
      },
    ]);
  }, [addToast]);

  // AI Chat message sender
  const sendMessage = useCallback(
    (text: string) => {
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "user",
        text,
        timestamp: "Just now",
      };

      setChatMessages((prev) => [...prev, userMsg]);

      // Intelligent AI mock logic
      setTimeout(() => {
        const lower = text.toLowerCase();
        let reply = "";
        let actionPrompt: ChatMessage["actionPrompt"] | undefined = undefined;
        let suggestions: string[] = [
          "Show top 3 supplier risks this week",
          "What happens if Port of Rotterdam delays increase by 4 days?",
          "Suggest alternate vendors for Microchip Batch #A92",
        ];

        if (lower.includes("top 3") || lower.includes("supplier risk")) {
          reply = `Here are the top **3 Supplier Risks** flagged by neural telemetry:\n\n1. **TSMC Fab 18 (Batch #A92)** — *Tainan, TW*\n   - **Risk:** 84/100 (Critical) | Delay: **8.5 Days** | Exposure: **$1.42M**\n   - **Action:** Activate GlobalFoundries Dresden secondary fab allocation.\n\n2. **Foxconn Zhengzhou Assembly** — *Zhengzhou, CN*\n   - **Risk:** 62/100 (Warning) | Delay: **3.8 Days** | Exposure: **$510K**\n   - **Action:** Shift 40% run-rate to Bac Giang, Vietnam.\n\n3. **Santos Critical Minerals** — *Santos, BR*\n   - **Risk:** 34/100 (Normal/Watch) | Buffer: **19 Days** | High lithium inventory.`;
          actionPrompt = {
            label: "Authorize GlobalFoundries Silicon Allocation",
            actionId: "authorize-gf-silicon",
            type: "SUPPLIER_ACTION",
            incidentId: "RISK-8921",
          };
        } else if (lower.includes("rotterdam") || lower.includes("port of rotterdam")) {
          reply = `**Impact Analysis: +4 Days Rotterdam Delay**\n\nIf Rotterdam dwell times expand by 4 days:\n- **Giga Berlin Run-Rate:** Inventory buffer drops from 4.8 days to **0.8 days** (critical line stoppage threshold in 72h).\n- **Financial Delta:** Additional demurrage and expedited road haulage costs of **+$420,000**.\n- **Recommended AI Playbook:** Divert inbound container vessels to **Antwerp Terminal** and initiate bonded rail freight directly into Brandenburg.`;
          actionPrompt = {
            label: "Reroute Shipments to Antwerp Terminal Now",
            actionId: "reroute-antwerp",
            type: "LOGISTICS_REROUTE",
            incidentId: "RISK-8922",
          };
        } else if (lower.includes("microchip") || lower.includes("batch #a92") || lower.includes("alternate vendor")) {
          reply = `**Alternate Supplier Match for Microchip Batch #A92:**\n\n- **Primary Option: GlobalFoundries (Fab 1, Dresden)**\n  - Capacity Available: **14,500 units/mo**\n  - Qualification Status: **Pre-Audited (ISO 26262 Auto Grade)**\n  - Unit Price Delta: **+3.8%** ($44.50 vs $42.85)\n  - Transit Time: **36 Hours via Frankfurt air corridor**\n\n- **Secondary Option: Samsung Austin Foundry**\n  - Capacity Available: **8,000 units/mo**\n  - Lead Time: **18 Days**`;
          actionPrompt = {
            label: "Lock 2,400 Units from GlobalFoundries Dresden",
            actionId: "lock-gf-lot",
            type: "SUPPLIER_ACTION",
            incidentId: "RISK-8921",
          };
        } else if (lower.includes("revert") || lower.includes("reset")) {
          resetSimulation();
          return;
        } else if (lower.includes("reroute") || lower.includes("mitigate all")) {
          applyAllMitigations();
          return;
        } else {
          reply = `I evaluated your query: "${text}".\n\n- **Current Fleet & SCM Status:** ${nodes.length} monitored facilities, ${incidents.filter((i) => i.executionStatus === "Pending").length} pending mitigation playbooks.\n- **Network Health:** Operating at **${healthScore}% efficiency** with an aggregate value-at-risk of **$${(financialCostTotal / 1000000).toFixed(2)}M**.\n\nWould you like me to run an automated simulation or adjust lead time buffers?`;
          suggestions = [
            "Simulate Geopolitical Port Closure",
            "Apply all pending mitigations",
            "Show transportation bottleneck breakdown",
          ];
        }

        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          sender: "assistant",
          text: reply,
          timestamp: "Just now",
          actionPrompt,
          suggestions,
        };

        setChatMessages((prev) => [...prev, assistantMsg]);
      }, 700);
    },
    [nodes.length, incidents, healthScore, financialCostTotal, resetSimulation, applyAllMitigations]
  );

  // Execute Action from Chat Prompt
  const executeActionFromChat = useCallback(
    async (actionId: string, incidentId?: string) => {
      if (incidentId) {
        await applyMitigation(incidentId);
      } else {
        await applyAllMitigations();
      }

      setChatMessages((prev) =>
        prev.map((msg) => {
          if (msg.actionPrompt && msg.actionPrompt.actionId === actionId) {
            return {
              ...msg,
              actionPrompt: {
                ...msg.actionPrompt,
                executed: true,
                feedback: "Action Executed & Synced with Core ERP",
              },
            };
          }
          return msg;
        })
      );
    },
    [applyMitigation, applyAllMitigations]
  );

  return (
    <SupplyChainContext.Provider
      value={{
        nodes,
        incidents,
        selectedNode,
        setSelectedNode,
        selectedIncident,
        setSelectedIncident,
        filters,
        setFilter,
        resetFilters,
        filteredIncidents,
        filteredNodes,
        healthScore,
        activeHighRiskNodesCount,
        predictedDelayDaysAvg,
        financialCostTotal,
        actionsExecutedCount,
        actionsPendingCount,
        applyMitigation,
        applyAllMitigations,
        dismissIncident,
        isSimulationActive,
        activeScenario,
        isSimulatingModalOpen,
        setIsSimulatingModalOpen,
        simulateDisruption,
        resetSimulation,
        isDarkMode,
        toggleTheme,
        isChatOpen,
        setIsChatOpen,
        chatMessages,
        sendMessage,
        executeActionFromChat,
        toasts,
        removeToast,
        addToast,
      }}
    >
      {children}
    </SupplyChainContext.Provider>
  );
}

export function useSupplyChain() {
  const context = useContext(SupplyChainContext);
  if (!context) {
    throw new Error("useSupplyChain must be used within a SupplyChainProvider");
  }
  return context;
}
