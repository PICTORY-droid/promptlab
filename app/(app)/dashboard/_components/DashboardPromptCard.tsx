import Link from "next/link";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type DashboardPromptCardProps = {
  prompt: Prompt;
};

export default function DashboardPromptCard({
  prompt,
}: DashboardPromptCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          {prompt.categoryName ? <Badge>{prompt.categoryName}</Badge> : null}
          <Badge variant={prompt.visibility === "public" ? "success" : "default"}>
            {prompt.visibility}
          </Badge>
          <Badge>{prompt.status}</Badge>
        </div>

        <CardTitle>{prompt.title}</CardTitle>
        <CardDescription>
          {prompt.useCase || "사용 목적이 아직 입력되지 않았습니다."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
          {prompt.promptBody}
        </p>
        <p className="mt-4 text-xs text-slate-400">
          수정일: {new Date(prompt.updatedAt).toLocaleDateString("ko-KR")}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={`/prompts/${prompt.id}`}>
            <Button variant="secondary">상세 보기</Button>
          </Link>
          <Link href={`/prompts/${prompt.id}/edit`}>
            <Button>수정하기</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
