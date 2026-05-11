import Link from "next/link";
import { notFound } from "next/navigation";
import { getPrompt } from "@/features/prompts/server/get-prompt";
import Button from "@/shared/ui/button";
import PromptDetail from "./_components/PromptDetail";

type PromptDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PromptDetailPage({
  params,
}: PromptDetailPageProps) {
  const { id } = await params;
  const result = await getPrompt(id);

  if (!result.ok) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <div>
          <Link href="/prompts">
            <Button variant="ghost">공개 프롬프트 목록으로</Button>
          </Link>
        </div>

        <PromptDetail prompt={result.prompt} />
      </section>
    </main>
  );
}
