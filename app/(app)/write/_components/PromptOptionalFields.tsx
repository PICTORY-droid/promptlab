"use client";

import type { PromptDraftState } from "./PromptForm.client";
import Textarea from "@/shared/ui/textarea";

type PromptOptionalFieldsProps = {
  draft: PromptDraftState;
  limits: {
    safetyNotes: number;
  };
  onChange: <Key extends keyof PromptDraftState>(
    key: Key,
    value: PromptDraftState[Key],
  ) => void;
};

export default function PromptOptionalFields({
  draft,
  limits,
  onChange,
}: PromptOptionalFieldsProps) {
  return (
    <div className="space-y-4">
      <label className="block space-y-2">
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700">
            입력 제외 정보
          </span>
          <span className="text-xs text-slate-400">
            {draft.safetyNotes.length.toLocaleString("ko-KR")} /{" "}
            {limits.safetyNotes.toLocaleString("ko-KR")}자
          </span>
        </span>
        <Textarea
          className="min-h-24"
          value={draft.safetyNotes}
          placeholder="예: 고객명, 전화번호, 내부 단가, 계약 조건은 빼고 작성합니다."
          maxLength={limits.safetyNotes}
          onChange={(event) => onChange("safetyNotes", event.currentTarget.value)}
        />
      </label>
    </div>
  );
}