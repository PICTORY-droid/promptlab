import {
  RISK_CATEGORIES,
  RISK_LEVELS,
  RISK_SCORE,
  RISK_THRESHOLDS,
  SAFE_CHECK_DETECTOR_VERSION,
  SAFE_CHECK_POLICY_VERSION,
} from "../constants/risk-policy";
import type { RiskFinding, SafeCheckResult } from "../types/safecheck.types";

type Detector = {
  category: RiskFinding["category"];
  label: string;
  reason: string;
  score: number;
  patterns: RegExp[];
};

const detectors: Detector[] = [
  {
    category: RISK_CATEGORIES.PERSONAL_INFO,
    label: "개인정보",
    reason: "전화번호, 이메일, 주민등록번호처럼 개인을 식별할 수 있는 정보가 포함될 수 있습니다.",
    score: RISK_SCORE.PERSONAL_INFO,
    patterns: [
      /\b01[016789][-\s.]?\d{3,4}[-\s.]?\d{4}\b/g,
      /\b\d{2,3}[-\s.]?\d{3,4}[-\s.]?\d{4}\b/g,
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      /\b\d{6}[-\s]?\d{7}\b/g,
    ],
  },
  {
    category: RISK_CATEGORIES.COMPANY_SECRET,
    label: "회사기밀",
    reason: "내부 자료, 비공개 전략, 영업비밀 같은 회사기밀 표현이 포함될 수 있습니다.",
    score: RISK_SCORE.COMPANY_SECRET,
    patterns: [
      /영업\s*비밀/g,
      /내부\s*자료/g,
      /대외비/g,
      /비공개\s*전략/g,
      /기밀/g,
      /사내\s*전용/g,
    ],
  },
  {
    category: RISK_CATEGORIES.CONTRACT_RISK,
    label: "계약정보",
    reason: "계약금, 위약금, 단가, 거래처 조건 같은 계약 관련 민감 정보가 포함될 수 있습니다.",
    score: RISK_SCORE.CONTRACT_RISK,
    patterns: [
      /계약금/g,
      /위약금/g,
      /단가/g,
      /견적서/g,
      /거래처/g,
      /\d+\s*(원|만원|억원)/g,
    ],
  },
  {
    category: RISK_CATEGORIES.COPYRIGHT_RISK,
    label: "저작권 위험",
    reason: "원문 복제, 전체 요약, 그대로 베끼기 같은 저작권 위험 요청이 포함될 수 있습니다.",
    score: RISK_SCORE.COPYRIGHT_RISK,
    patterns: [
      /그대로\s*베껴/g,
      /원문을\s*그대로/g,
      /전체\s*복사/g,
      /전체\s*요약/g,
      /책\s*전체/g,
      /가사\s*전체/g,
    ],
  },
  {
    category: RISK_CATEGORIES.EXAGGERATION_RISK,
    label: "허위·과장 표현",
    reason: "무조건, 100%, 보장 같은 단정적이거나 과장된 표현이 포함될 수 있습니다.",
    score: RISK_SCORE.EXAGGERATION_RISK,
    patterns: [
      /무조건/g,
      /100\s*%/g,
      /완전\s*보장/g,
      /반드시\s*성공/g,
      /절대\s*실패하지/g,
      /최고의\s*효과/g,
    ],
  },
];

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function collectMatches(text: string, patterns: RegExp[]) {
  const matches: string[] = [];

  for (const pattern of patterns) {
    const found = text.match(pattern);

    if (found) {
      matches.push(...found);
    }
  }

  return unique(matches);
}

function calculateLevel(score: number) {
  if (score >= RISK_THRESHOLDS.BLOCK) {
    return RISK_LEVELS.BLOCK;
  }

  if (score >= RISK_THRESHOLDS.REVIEW) {
    return RISK_LEVELS.REVIEW;
  }

  return RISK_LEVELS.ALLOW;
}

function buildSafePrompt(text: string, findings: RiskFinding[]) {
  if (findings.length === 0) {
    return text;
  }

  const categories = findings.map((finding) => finding.label).join(", ");

  return [
    "아래 프롬프트에는 민감하거나 위험할 수 있는 요소가 있어 바로 공개하지 않는 것을 권장합니다.",
    `확인 필요 항목: ${categories}`,
    "개인정보, 회사기밀, 계약조건, 저작권 위험 표현, 과장 표현을 제거한 뒤 다시 작성하세요.",
  ].join("\n");
}

export function scanPrompt(text: string): SafeCheckResult {
  const normalizedText = text.trim();

  const findings = detectors
    .map((detector) => {
      const matches = collectMatches(normalizedText, detector.patterns);

      if (matches.length === 0) {
        return null;
      }

      return {
        category: detector.category,
        label: detector.label,
        reason: detector.reason,
        matches,
        score: detector.score,
      } satisfies RiskFinding;
    })
    .filter((finding): finding is RiskFinding => finding !== null);

  const score = findings.reduce((sum, finding) => sum + finding.score, 0);
  const level = calculateLevel(score);

  return {
    level,
    score,
    findings,
    safePrompt: buildSafePrompt(normalizedText, findings),
    metadata: {
      policyVersion: SAFE_CHECK_POLICY_VERSION,
      detectorVersion: SAFE_CHECK_DETECTOR_VERSION,
      llmUsed: false,
    },
  };
}
