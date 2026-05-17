import type { SafeCheckReport } from "@/features/safecheck/types/report.types";
import ReportsSummaryItem from "./ReportsSummaryItem";

type ReportsSummaryProps = {
  reportCount: number;
  latestReport: SafeCheckReport | null;
};

function getLevelLabel(level: string | undefined) {
  if (level === "block") {
    return "차단";
  }

  if (level === "review") {
    return "검토 필요";
  }

  if (level === "allow") {
    return "허용";
  }

  return "기록 없음";
}

export default function ReportsSummary({
  reportCount,
  latestReport,
}: ReportsSummaryProps) {
  return (
    <section className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3">
      <ReportsSummaryItem
        label="전체"
        title="검사 기록"
        value={`${reportCount.toLocaleString("ko-KR")}개`}
      />

      <ReportsSummaryItem
        label="최근 판정"
        title={latestReport ? `점수 ${latestReport.score}` : "점수 없음"}
        value={getLevelLabel(latestReport?.level)}
      />
    </section>
  );
}