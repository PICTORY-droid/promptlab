import type { Prompt } from "@/features/prompts/types/prompt.types";
import Badge from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type PromptDetailProps = {
  prompt: Prompt;
};

function EmptyText({ children }: { children: string }) {
  return <p className="text-sm leading-6 text-slate-400">{children}</p>;
}

export default function PromptDetail({ prompt }: PromptDetailProps) {
  return (
    <article className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            {prompt.categoryName ? <Badge>{prompt.categoryName}</Badge> : null}
            <Badge variant={prompt.visibility === "public" ? "success" : "default"}>
              {prompt.visibility}
            </Badge>
            <Badge>{prompt.status}</Badge>
          </div>

          <CardTitle className="text-2xl">{prompt.title}</CardTitle>
          <CardDescription>
            {prompt.useCase || "사용 목적이 아직 입력되지 않았습니다."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {prompt.promptBody}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>예시 입력</CardTitle>
            <CardDescription>
              이 프롬프트를 사용할 때 넣을 수 있는 입력 예시입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {prompt.exampleInput ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {prompt.exampleInput}
              </p>
            ) : (
              <EmptyText>예시 입력이 아직 없습니다.</EmptyText>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>예시 출력</CardTitle>
            <CardDescription>
              기대하는 답변 형식이나 출력 예시입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {prompt.exampleOutput ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {prompt.exampleOutput}
              </p>
            ) : (
              <EmptyText>예시 출력이 아직 없습니다.</EmptyText>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>안전 주의사항</CardTitle>
          <CardDescription>
            AI SafeCheck 또는 작성자가 남긴 사용 주의사항입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {prompt.safetyNotes ? (
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {prompt.safetyNotes}
            </p>
          ) : (
            <EmptyText>안전 주의사항이 아직 없습니다.</EmptyText>
          )}
        </CardContent>
      </Card>
    </article>
  );
}
