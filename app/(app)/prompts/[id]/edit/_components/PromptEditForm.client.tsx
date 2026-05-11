"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import type { PromptCategory } from "@/features/prompts/types/category.types";
import { updatePromptAction, type UpdatePromptActionState } from "../actions";
import Button from "@/shared/ui/button";
import ErrorMessage from "@/shared/ui/error-message";
import Input from "@/shared/ui/input";
import Textarea from "@/shared/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

const FIELD_LIMITS = {
  title: 120,
  useCase: 500,
  promptBody: 12000,
  exampleInput: 6000,
  exampleOutput: 6000,
  safetyNotes: 3000,
} as const;

const initialState: UpdatePromptActionState = {
  ok: true,
  message: "",
};

type PromptEditFormProps = {
  prompt: Prompt;
  categories: PromptCategory[];
  categoryLoadMessage: string | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "수정 중" : "수정 저장"}
    </Button>
  );
}

function FieldCounter({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  return (
    <span className="text-xs text-slate-400">
      {current.toLocaleString("ko-KR")} / {max.toLocaleString("ko-KR")}자
    </span>
  );
}

export default function PromptEditForm({
  prompt,
  categories,
  categoryLoadMessage,
}: PromptEditFormProps) {
  const [state, formAction] = useActionState(updatePromptAction, initialState);
  const [titleLength, setTitleLength] = useState(prompt.title.length);
  const [useCaseLength, setUseCaseLength] = useState(prompt.useCase?.length ?? 0);
  const [promptBodyLength, setPromptBodyLength] = useState(
    prompt.promptBody.length,
  );
  const [exampleInputLength, setExampleInputLength] = useState(
    prompt.exampleInput?.length ?? 0,
  );
  const [exampleOutputLength, setExampleOutputLength] = useState(
    prompt.exampleOutput?.length ?? 0,
  );
  const [safetyNotesLength, setSafetyNotesLength] = useState(
    prompt.safetyNotes?.length ?? 0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>프롬프트 수정</CardTitle>
        <CardDescription>
          본인이 작성한 프롬프트만 수정할 수 있습니다. 공개 전에는 비공개와 초안 상태를 권장합니다.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="promptId" value={prompt.id} />

          <label className="block space-y-2">
            <span className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-700">제목</span>
              <FieldCounter current={titleLength} max={FIELD_LIMITS.title} />
            </span>
            <Input
              name="title"
              defaultValue={prompt.title}
              maxLength={FIELD_LIMITS.title}
              onChange={(event) => setTitleLength(event.currentTarget.value.length)}
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">카테고리</span>
            <select
              name="categoryId"
              defaultValue={prompt.categoryId ?? ""}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            >
              <option value="">카테고리 없음</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categoryLoadMessage ? (
              <span className="block text-xs text-red-600">
                카테고리를 불러오지 못했습니다. {categoryLoadMessage}
              </span>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-700">사용 목적</span>
              <FieldCounter current={useCaseLength} max={FIELD_LIMITS.useCase} />
            </span>
            <Input
              name="useCase"
              defaultValue={prompt.useCase ?? ""}
              maxLength={FIELD_LIMITS.useCase}
              onChange={(event) => setUseCaseLength(event.currentTarget.value.length)}
            />
          </label>

          <label className="block space-y-2">
            <span className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-700">프롬프트 본문</span>
              <FieldCounter current={promptBodyLength} max={FIELD_LIMITS.promptBody} />
            </span>
            <Textarea
              name="promptBody"
              defaultValue={prompt.promptBody}
              maxLength={FIELD_LIMITS.promptBody}
              onChange={(event) => setPromptBodyLength(event.currentTarget.value.length)}
              required
            />
            <span className="block text-xs leading-5 text-slate-500">
              긴 문서는 그대로 붙여넣기보다 핵심 지시문과 예시만 정리해 넣는 것을 권장합니다.
            </span>
          </label>

          <label className="block space-y-2">
            <span className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-700">예시 입력</span>
              <FieldCounter current={exampleInputLength} max={FIELD_LIMITS.exampleInput} />
            </span>
            <Textarea
              name="exampleInput"
              className="min-h-28"
              defaultValue={prompt.exampleInput ?? ""}
              maxLength={FIELD_LIMITS.exampleInput}
              onChange={(event) => setExampleInputLength(event.currentTarget.value.length)}
            />
          </label>

          <label className="block space-y-2">
            <span className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-700">예시 출력</span>
              <FieldCounter current={exampleOutputLength} max={FIELD_LIMITS.exampleOutput} />
            </span>
            <Textarea
              name="exampleOutput"
              className="min-h-28"
              defaultValue={prompt.exampleOutput ?? ""}
              maxLength={FIELD_LIMITS.exampleOutput}
              onChange={(event) => setExampleOutputLength(event.currentTarget.value.length)}
            />
          </label>

          <label className="block space-y-2">
            <span className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-700">안전 주의사항</span>
              <FieldCounter current={safetyNotesLength} max={FIELD_LIMITS.safetyNotes} />
            </span>
            <Textarea
              name="safetyNotes"
              className="min-h-28"
              defaultValue={prompt.safetyNotes ?? ""}
              maxLength={FIELD_LIMITS.safetyNotes}
              onChange={(event) => setSafetyNotesLength(event.currentTarget.value.length)}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">공개 범위</span>
              <select
                name="visibility"
                defaultValue={prompt.visibility}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              >
                <option value="private">비공개</option>
                <option value="public">공개</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">상태</span>
              <select
                name="status"
                defaultValue={prompt.status}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              >
                <option value="draft">초안</option>
                <option value="published">게시</option>
              </select>
            </label>
          </div>

          {!state.ok ? <ErrorMessage message={state.message} /> : null}

          <div className="flex flex-wrap gap-3">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
