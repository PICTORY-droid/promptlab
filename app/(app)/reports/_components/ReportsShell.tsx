import Badge from "@/shared/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import EmptyState from "@/shared/ui/empty-state";

type ReportsShellProps = {
  email: string;
  userId: string;
};

export default function ReportsShell({ email, userId }: ReportsShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="space-y-3">
          <Badge>Protected Page</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            AI SafeCheck 리포트
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            PromptLab v3에서 실행한 AI SafeCheck 검사 결과 메타데이터를
            확인하는 화면입니다. 검사 원문은 저장하지 않고 점수, 판정,
            위험 카테고리, 안전 문장, 정책 버전만 저장하는 구조로 확장합니다.
          </p>
          <p className="text-xs text-slate-500">
            로그인 계정: {email} · {userId}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>검사 리포트 목록</CardTitle>
              <CardDescription>
                다음 단계에서 Supabase의 promptlab_safecheck_reports 테이블과 연결합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="아직 저장된 리포트가 없습니다"
                description="프롬프트 작성 화면에서 AI SafeCheck 검사를 실행하고 저장하면 이곳에서 리포트 메타데이터를 확인할 수 있습니다."
              />
            </CardContent>
          </Card>

          <aside className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>저장 대상</CardTitle>
                <CardDescription>
                  리포트에 저장할 수 있는 안전한 메타데이터입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm leading-6 text-slate-600">
                  <li>위험 점수</li>
                  <li>최종 판정</li>
                  <li>위험 카테고리</li>
                  <li>안전 문장</li>
                  <li>정책 버전</li>
                  <li>탐지기 버전</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>저장 금지 대상</CardTitle>
                <CardDescription>
                  PromptLab v3 보안 원칙상 저장하지 않는 데이터입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm leading-6 text-slate-600">
                  <li>검사 원문 속 고객명 원문</li>
                  <li>전화번호 원문</li>
                  <li>진료기록 원문</li>
                  <li>상담기록 원문</li>
                  <li>회사기밀 원문</li>
                  <li>계약정보 원문</li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}
