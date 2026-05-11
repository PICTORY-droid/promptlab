import Link from "next/link";
import type { SafeCheckReport } from "@/features/safecheck/types/report.types";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import EmptyState from "@/shared/ui/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import ReportCard from "./ReportCard";

type ReportsShellProps = {
  email: string;
  userId: string;
  reports: SafeCheckReport[];
  reportLoadMessage: string | null;
};

export default function ReportsShell({
  email,
  userId,
  reports,
  reportLoadMessage,
}: ReportsShellProps) {
  const latestReport = reports[0] ?? null;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="space-y-3">
          <Badge>SafeCheck Reports</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            SafeCheck 리포트
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            로그인한 사용자가 실행한 AI SafeCheck 검사 기록을 확인합니다.
            검사 원문은 저장하지 않고, 점수와 판정, 위험 카테고리, 안전 문장 안내만 저장합니다.
          </p>
          <p className="text-xs text-slate-500">
            로그인 계정: {email} · {userId}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>전체 리포트</CardTitle>
              <CardDescription>내 계정에 저장된 검사 기록입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-slate-950">
                {reports.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>최근 판정</CardTitle>
              <CardDescription>가장 최근 검사 결과입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-slate-950">
                {latestReport?.level ?? "-"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>최근 점수</CardTitle>
              <CardDescription>가장 최근 위험 점수입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-slate-950">
                {latestReport?.score ?? "-"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>리포트 목록</CardTitle>
                <CardDescription>
                  최근 검사 기록부터 표시합니다.
                </CardDescription>
              </div>

              <Link href="/safecheck">
                <Button>새 검사 실행</Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            {reportLoadMessage ? (
              <EmptyState
                title="리포트를 불러오지 못했습니다"
                description={reportLoadMessage}
              />
            ) : reports.length === 0 ? (
              <EmptyState
                title="아직 저장된 SafeCheck 리포트가 없습니다"
                description="SafeCheck 화면에서 프롬프트를 검사하면 이곳에 기록됩니다."
                action={
                  <Link href="/safecheck">
                    <Button>첫 검사 실행하기</Button>
                  </Link>
                }
              />
            ) : (
              <div className="grid gap-5">
                {reports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
