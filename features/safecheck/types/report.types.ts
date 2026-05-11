import type { RiskCategory, RiskLevel } from "./safecheck.types";

export type SafeCheckReport = {
  id: string;
  userId: string;
  promptId: string | null;
  score: number;
  level: RiskLevel;
  riskCategories: RiskCategory[];
  safePrompt: string | null;
  policyVersion: string;
  detectorVersion: string;
  createdAt: string;
};

export type SafeCheckReportRow = {
  id: string;
  user_id: string;
  prompt_id: string | null;
  score: number;
  level: RiskLevel;
  risk_categories: RiskCategory[];
  safe_prompt: string | null;
  policy_version: string;
  detector_version: string;
  created_at: string;
};

export function mapSafeCheckReportRowToReport(
  row: SafeCheckReportRow,
): SafeCheckReport {
  return {
    id: row.id,
    userId: row.user_id,
    promptId: row.prompt_id,
    score: row.score,
    level: row.level,
    riskCategories: row.risk_categories,
    safePrompt: row.safe_prompt,
    policyVersion: row.policy_version,
    detectorVersion: row.detector_version,
    createdAt: row.created_at,
  };
}
