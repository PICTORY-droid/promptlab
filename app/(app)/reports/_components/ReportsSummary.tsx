import type { SafeCheckReport } from "@/features/safecheck/types/report.types";

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
  const reportCountLabel = `검사 기록 ${reportCount.toLocaleString("ko-KR")}개`;
  const latestReportLabel = latestReport
    ? `최근 판정 점수 ${latestReport.score}점 ${getLevelLabel(latestReport.level)}`
    : "최근 판정 기록 없음";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3">
      <p className="text-sm font-semibold leading-6 text-slate-700">
        {reportCountLabel} / {latestReportLabel}
      </p>
    </section>
  );
}