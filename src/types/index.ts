export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type RiskCategory = 'Supplier' | 'Logistics' | 'Inventory' | 'Production';

export type Region = 'Global' | 'North America' | 'EMEA' | 'APAC' | 'LATAM';

export type Timeframe = 'Next 7 Days' | 'Next 14 Days' | 'Next 30 Days' | 'Next 90 Days';

export type NodeType = 'supplier' | 'port' | 'route' | 'warehouse' | 'plant';

export interface SupplyChainNode {
  id: string;
  name: string;
  type: NodeType;
  region: Region;
  coords: { x: number; y: number }; // Percentage coords on world topology canvas
  geo: { city: string; country: string };
  status: 'critical' | 'warning' | 'normal' | 'disrupted';
  riskScore: number; // 0 - 100
  throughput: string; // e.g. "45,000 TEU/mo"
  leadTimeDays: number;
  bufferDays: number;
  inventoryPercent: number;
  tier: 1 | 2 | 3;
  activeDisruptions: string[];
  primaryCommodity: string;
  connectedTo: string[]; // Connected Node IDs
}

export interface RiskIncident {
  id: string;
  riskLevel: RiskLevel;
  category: RiskCategory;
  affectedEntity: string;
  routeOrLocation: string;
  rootCause: string;
  predictedDelayDays: number;
  financialCostEst: number; // in USD
  aiMitigationAction: string;
  executionStatus: 'Pending' | 'In Progress' | 'Executed' | 'Dismissed';
  timestamp: string;
  confidenceScore: number; // e.g. 94%
  mitigationType: 'REROUTE' | 'SAFETY_STOCK' | 'SECONDARY_SUPPLIER' | 'EXPEDITE_FREIGHT' | 'SHIFT_PRODUCTION';
  details: string;
  tierAffected: string;
  executedAt?: string;
}

export interface DisruptionScenario {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  severity: 'CRITICAL' | 'HIGH' | 'SEVERE';
  delayModifierDays: number;
  costImpactEstimate: number;
  affectedNodeIds: string[];
  recommendedPresetAction: string;
  badge: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionPrompt?: {
    label: string;
    actionId: string;
    type: string;
    incidentId?: string;
    executed?: boolean;
    feedback?: string;
  };
  suggestions?: string[];
}

export interface VulnerabilityMatrixPoint {
  sku: string;
  category: string;
  leadTimeDays: number;
  bufferDays: number;
  riskScore: number;
  criticality: 'High' | 'Medium' | 'Low';
  annualVolume: string;
}

export interface TimeSeriesRiskForecast {
  day: string;
  historicalRisk?: number;
  predictedRisk?: number;
  upperConfidence?: number;
  lowerConfidence?: number;
  industryBenchmark: number;
  incidentCount: number;
}

export interface BottleneckItem {
  name: string;
  category: string;
  delayHours: number;
  financialBurn: number;
  impactScore: number;
  vesselsDelayed: number;
}
