import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import Badge from "@/shared/ui/badge";

type DashboardShellProps = {
  email: string;
  userId: string;
};

export default function DashboardShell({ email, userId }: DashboardShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="space-y-3">
          <Badge>Protected Page</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            PromptLab 대시보드
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            로그인한 사용자만 접근할 수 있는 v3 보호 페이지입니다.
            이 화면은 Supabase Auth 세션을 서버에서 확인한 뒤 렌더링합니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>로그인 계정</CardTitle>
              <CardDescription>현재 Supabase Auth 세션 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="break-all text-sm font-semibold text-slate-950">{email}</p>
              <p className="mt-2 break-all text-xs text-slate-500">{userId}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>프롬프트 관리</CardTitle>
              <CardDescription>작성한 프롬프트를 저장하고 다시 사용할 공간입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-slate-600">
                다음 단계에서 Prompt CRUD와 연결합니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI SafeCheck</CardTitle>
              <CardDescription>프롬프트 저장 전 위험 요소를 검사합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-slate-600">
                개인정보, 회사기밀, 저작권 위험, 과장 표현 검사를 연결할 예정입니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
