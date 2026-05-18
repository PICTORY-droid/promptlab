import Link from "next/link";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import PageShell from "@/shared/ui/page-shell";

const operatingStandards = [
  "AI 입력 전 민감정보와 업무 보안 위험을 먼저 확인합니다.",
  "검사 원문은 저장하지 않고, 점수와 위험 카테고리 중심으로 기록합니다.",
  "저장 전 안전 문장을 확인해 공개나 공유 전 실수를 줄입니다.",
];

export default function HomePage() {
  return (
    <PageShell maxWidth="lg" contentClassName="gap-6 sm:gap-8">
      <section className="space-y-5 sm:space-y-6">
        <Badge>PromptLab</Badge>

        <div className="space-y-2">
          <p className="max-w-2xl text-base font-semibold leading-7 text-slate-950 sm:text-lg sm:leading-8">
            생성형 AI 입력 전, 민감정보와 업무 보안 위험 점검
          </p>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            작성한 프롬프트를 저장하거나 공개하기 전 SafeCheck로 먼저 확인합니다.
          </p>
        </div>
      </section>

      <Card>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-950">운영 기준</p>

            <div className="grid gap-2">
              {operatingStandards.map((standard) => (
                <p key={standard} className="text-sm leading-6 text-slate-600">
                  {standard}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
        <Link href="/safecheck" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">SafeCheck 시작</Button>
        </Link>

        <Link href="/write" className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto">
            프롬프트 작성
          </Button>
        </Link>

        <Link href="/reports" className="w-full sm:w-auto">
          <Button variant="ghost" className="w-full sm:w-auto">
            검사 기록 보기
          </Button>
        </Link>
      </div>
    </PageShell>
  );
}