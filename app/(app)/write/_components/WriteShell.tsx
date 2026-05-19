import type { PromptCategory } from "@/features/prompts/types/category.types";
import Badge from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import PageShell from "@/shared/ui/page-shell";
import PromptForm from "./PromptForm.client";

type WriteShellProps = {
  email: string | null;
  isLoggedIn: boolean;
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
      </header>

      <Card>
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