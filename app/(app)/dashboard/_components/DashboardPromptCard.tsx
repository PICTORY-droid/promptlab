import Link from "next/link";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import Badge from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type DashboardPromptCardProps = {
  prompt: Prompt;
};

function getStatusLabel(status: string) {
  if (status === "archived") {
    return "보관";
  }

  if (status === "published") {
    return "게시";
  }

  return "초안";
}

function getVisibilityLabel(visibility: string) {
  if (visibility === "public") {
    return "공개";
  }

  return "비공개";
}

export default function DashboardPromptCard({
  prompt,
}: DashboardPromptCardProps) {
  const description = prompt.useCase || prompt.promptBody || "설명이 없습니다.";

  return (
    <Link href={`/prompts/${prompt.id}`} className="block h-full">
      <Card className="h-full transition hover:border-slate-300">
        <CardHeader className="p-3 pb-2">
          <div className="flex items-center gap-1.5">
            <Badge variant={prompt.visibility === "public" ? "success" : "default"}>
              {getVisibilityLabel(prompt.visibility)}
            </Badge>
            <Badge>{getStatusLabel(prompt.status)}</Badge>
          </div>

          <CardTitle className="line-clamp-2 text-sm leading-5">
            {prompt.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-3 pt-0">
          <p className="line-clamp-2 min-h-10 text-xs leading-5 text-slate-600">
            {description}
          </p>

          <p className="mt-3 text-[11px] text-slate-400">
            {new Date(prompt.updatedAt).toLocaleDateString("ko-KR")}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}