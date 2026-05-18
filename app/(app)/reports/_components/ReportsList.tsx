"use client";

import Link from "next/link";
import { useState } from "react";
import type { SafeCheckReport } from "@/features/safecheck/types/report.types";
import Button from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import EmptyState from "@/shared/ui/empty-state";
import ReportsPagination from "./ReportsPagination.client";

type ReportsListProps = {
  reports: SafeCheckReport[];
  reportLoadMessage: string | null;
};

export default function ReportsList({
  reports,
  reportLoadMessage,
}: ReportsListProps) {
  const [pageLabel, setPageLabel] = useState<string | null>(
    reports.length > 0 ? "1 / 1" : null,
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <CardTitle>기록 목록</CardTitle>
            {pageLabel ? (
              <span className="shrink-0 text-xs font-semibold text-slate-400">
                {pageLabel}
              </span>
            ) : null}
          </div>

          <Link href="/safecheck">
            <Button className="whitespace-nowrap">새 검사</Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {reportLoadMessage ? (
          <EmptyState
            title="검사 기록을 불러오지 못했습니다"
            description={reportLoadMessage}
          />
        ) : reports.length === 0 ? (
          <EmptyState
            title="검사 기록 없음"
            description="SafeCheck를 실행하면 기록이 여기에 표시됩니다."
            action={
              <Link href="/safecheck">
                <Button>첫 검사 실행</Button>
              </Link>
            }
          />
        ) : (
          <ReportsPagination
            reports={reports}
            onPageLabelChange={setPageLabel}
          />
        )}
      </CardContent>
    </Card>
  );
}