import type { Prompt } from "@/features/prompts/types/prompt.types";
import PageHeader from "@/shared/ui/page-header";
import PageShell from "@/shared/ui/page-shell";
import DashboardPromptList from "./DashboardPromptList";
import DashboardSummaryCards from "./DashboardSummaryCards";

type DashboardShellProps = {
  email: string;
  prompts: Prompt[];
  promptLoadMessage: string | null;
};

export default function DashboardShell({
  prompts,
  promptLoadMessage,
}: DashboardShellProps) {
  return (
    <PageShell>
      <PageHeader
        badge="개인 메뉴"
        title="대시보드"
        description="내 프롬프트를 확인합니다."
      />

      <DashboardSummaryCards promptCount={prompts.length} />

      <DashboardPromptList
        prompts={prompts}
        promptLoadMessage={promptLoadMessage}
      />
    </PageShell>
  );
}