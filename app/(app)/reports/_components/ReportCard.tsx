import type { SafeCheckReport } from "@/features/safecheck/types/report.types";
import Badge from "@/shared/ui/badge";

type ReportCardProps = {
  report: SafeCheckReport;
};

function getLevelLabel(level: string) {
  if (level === "block") {
    return "차단";
  }

  if (level === "review") {
    return "검토 필요";
  }

  return "허용";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

export default function ReportCard({ report }: ReportCardProps) {
  const firstCategory = report.riskCategories[0] ?? "위험 없음";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <Badge>{getLevelLabel(report.level)}</Badge>
            <Badge>점수 {report.score}</Badge>
            <Badge>{firstCategory}</Badge>
          </div>

          <p className="line-clamp-2 text-sm font-semibold leading-6 text-slate-950">
            {report.safePrompt || "저장된 안전 문장 안내가 없습니다."}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {formatDate(report.createdAt)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
        <span>정책 {report.policyVersion}</span>
        <span>탐지기 {report.detectorVersion}</span>
      </div>
    </article>
  );
}