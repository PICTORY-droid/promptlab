"use client";

import { useEffect, useMemo, useState } from "react";
import type { SafeCheckReport } from "@/features/safecheck/types/report.types";
import Button from "@/shared/ui/button";
import ReportCard from "./ReportCard";

const PAGE_SIZE = 5;

type ReportsPaginationProps = {
  reports: SafeCheckReport[];
  onPageLabelChange: (label: string) => void;
};

export default function ReportsPagination({
  reports,
  onPageLabelChange,
}: ReportsPaginationProps) {
  const [pageIndex, setPageIndex] = useState(0);

  const totalPages = Math.max(1, Math.ceil(reports.length / PAGE_SIZE));
  const hasPreviousPage = pageIndex > 0;
  const hasNextPage = pageIndex < totalPages - 1;

  const currentReports = useMemo(() => {
    const startIndex = pageIndex * PAGE_SIZE;
    return reports.slice(startIndex, startIndex + PAGE_SIZE);
  }, [pageIndex, reports]);

  useEffect(() => {
    onPageLabelChange(`${pageIndex + 1} / ${totalPages}`);
  }, [onPageLabelChange, pageIndex, totalPages]);

  function goToPreviousPage() {
    setPageIndex((current) => Math.max(0, current - 1));
  }

  function goToNextPage() {
    setPageIndex((current) => Math.min(totalPages - 1, current + 1));
  }

  return (
    <section className="space-y-3">
      <div className="grid gap-2">
        {currentReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button
          type="button"
          variant="secondary"
          disabled={!hasPreviousPage}
          onClick={goToPreviousPage}
        >
          ← 이전
        </Button>

        <Button
          type="button"
          disabled={!hasNextPage}
          onClick={goToNextPage}
        >
          다음 기록 →
        </Button>
      </div>
    </section>
  );
}