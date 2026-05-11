import type { RISK_CATEGORIES, RISK_LEVELS } from "../constants/risk-policy";

export type RiskCategory =
  (typeof RISK_CATEGORIES)[keyof typeof RISK_CATEGORIES];

export type RiskLevel =
  (typeof RISK_LEVELS)[keyof typeof RISK_LEVELS];

export type RiskFinding = {
  category: RiskCategory;
  label: string;
  reason: string;
  matches: string[];
  score: number;
};

export type SafeCheckResult = {
  level: RiskLevel;
  score: number;
  findings: RiskFinding[];
  safePrompt: string;
  metadata: {
    policyVersion: string;
    detectorVersion: string;
    llmUsed: false;
  };
};
