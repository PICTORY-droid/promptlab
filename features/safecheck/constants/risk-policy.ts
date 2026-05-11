export const SAFE_CHECK_POLICY_VERSION = "promptlab-safecheck-v1";
export const SAFE_CHECK_DETECTOR_VERSION = "rule-detector-v1";

export const RISK_CATEGORIES = {
  PERSONAL_INFO: "personal_info",
  COMPANY_SECRET: "company_secret",
  CONTRACT_RISK: "contract_risk",
  COPYRIGHT_RISK: "copyright_risk",
  EXAGGERATION_RISK: "exaggeration_risk",
} as const;

export const RISK_LEVELS = {
  ALLOW: "allow",
  REVIEW: "review",
  BLOCK: "block",
} as const;

export const RISK_SCORE = {
  PERSONAL_INFO: 35,
  COMPANY_SECRET: 40,
  CONTRACT_RISK: 25,
  COPYRIGHT_RISK: 25,
  EXAGGERATION_RISK: 20,
} as const;

export const RISK_THRESHOLDS = {
  REVIEW: 20,
  BLOCK: 60,
} as const;
