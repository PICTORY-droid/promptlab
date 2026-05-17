import type { PromptCategory } from "@/features/prompts/types/category.types";
import Badge from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import PromptForm from "./PromptForm.client";
import WriteSafeCheckPanel from "./WriteSafeCheckPanel.client";

type WriteShellProps = {
  email: string;
  categories: PromptCategory[];
  categoryLoadMessage: string | null;
};

export default function WriteShell({
  email,
  categories,
  categoryLoadMessage,
}: WriteShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 sm:py-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Badge>개인 작성</Badge>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                프롬프트 작성
              </h1>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                작성하고, 저장 전 SafeCheck로 점검합니다.
              </p>
            </div>

            <p className="hidden max-w-48 truncate rounded-2xl bg-slate-50 px-3 py-2 text-right text-xs font-semibold text-slate-500 sm:block">
              {email}
            </p>
          </div>
        </div>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="p-4 pb-3 sm:p-5 sm:pb-3">
            <CardTitle>저장 전 SafeCheck</CardTitle>
            <CardDescription>
              본문만 붙여넣고 저장 전 위험 문구를 확인합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
            <WriteSafeCheckPanel />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-3 sm:p-5 sm:pb-3">
            <CardTitle>프롬프트 정보</CardTitle>
            <CardDescription>
              제목, 본문, 공개 범위를 입력합니다.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
            <PromptForm
              categories={categories}
              categoryLoadMessage={categoryLoadMessage}
            />
          </CardContent>
        </Card>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="text-sm font-bold text-slate-950">
              권장 저장
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              처음에는 비공개, 초안으로 저장하세요.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="text-sm font-bold text-slate-950">
              작성 기준
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              개인정보, 회사기밀, 실제 고객 정보는 넣지 않습니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}