"use client";

import type { PromptDraftState } from "./PromptForm.client";
import Input from "@/shared/ui/input";
import Textarea from "@/shared/ui/textarea";

type PromptCoreFieldsProps = {
  draft: PromptDraftState;
  limits: {
    title: number;
    promptBody: number;
  };
  onChange: <Key extends keyof PromptDraftState>(
    key: Key,
    value: PromptDraftState[Key],
  ) => void;
};

export default function PromptCoreFields({
  draft,
  limits,
  onChange,
}: PromptCoreFieldsProps) {
  return (
    <div className="space-y-4">
      <label className="block space-y-2">
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700">제목</span>
          <span className="text-xs text-slate-400">
            {draft.title.length.toLocaleString("ko-KR")} /{" "}
            {limits.title.toLocaleString("ko-KR")}자
          </span>
        </span>
        <Input
          value={draft.title}
          placeholder="예: 고객 응대 이메일 작성"
          maxLength={limits.title}
          onChange={(event) => onChange("title", event.currentTarget.value)}
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700">
            프롬프트 본문
          </span>
          <span className="text-xs text-slate-400">
            {draft.promptBody.length.toLocaleString("ko-KR")} /{" "}
            {limits.promptBody.toLocaleString("ko-KR")}자
          </span>
        </span>
        <Textarea
          className="min-h-56"
          value={draft.promptBody}
          placeholder={`예:
당신은 고객 응대 담당자입니다.
문의를 정중한 답변으로 변경하세요.
확인되지 않은 내용은 단정하지 마세요.`}
          maxLength={limits.promptBody}
          onChange={(event) => onChange("promptBody", event.currentTarget.value)}
          required
        />
      </label>
    </div>
  );
}