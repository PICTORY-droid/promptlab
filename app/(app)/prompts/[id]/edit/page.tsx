import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/get-current-user";
import { getPrompt } from "@/features/prompts/server/get-prompt";
import { getCategories } from "@/features/prompts/server/get-categories";
import Button from "@/shared/ui/button";
import PromptEditForm from "./_components/PromptEditForm.client";

type PromptEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PromptEditPage({ params }: PromptEditPageProps) {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    redirect("/login");
  }

  const { id } = await params;
  const promptResult = await getPrompt(id);

  if (!promptResult.ok) {
    notFound();
  }

  if (promptResult.prompt.userId !== currentUser.user.id) {
    notFound();
  }

  const categoriesResult = await getCategories();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap gap-3">
          <Link href={`/prompts/${promptResult.prompt.id}`}>
            <Button variant="ghost">상세 페이지로</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary">대시보드로</Button>
          </Link>
        </div>

        <PromptEditForm
          prompt={promptResult.prompt}
          categories={categoriesResult.ok ? categoriesResult.categories : []}
          categoryLoadMessage={
            categoriesResult.ok ? null : categoriesResult.message
          }
        />
      </section>
    </main>
  );
}
