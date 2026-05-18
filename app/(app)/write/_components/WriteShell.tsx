import type { PromptCategory } from "@/features/prompts/types/category.types";
import Badge from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import PageShell from "@/shared/ui/page-shell";
import PromptForm from "./PromptForm.client";

type WriteShellProps = {
  email: string;
  categories: PromptCategory[];
  categoryLoadMessage: string | null;
};

export default function WriteShell({
  categories,
  categoryLoadMessage,
}: WriteShellProps) {
  return (
    <PageShell maxWidth="md">
      <header className="space-y-2">
        <Badge>개인 작성</Badge>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          제목과 본문을 먼저 작성한 뒤, 필요한 정보만 추가합니다.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>프롬프트 작성</CardTitle>
        </CardHeader>

        <CardContent>
          <PromptForm
            categories={categories}
            categoryLoadMessage={categoryLoadMessage}
          />
        </CardContent>
      </Card>
    </PageShell>
  );
}