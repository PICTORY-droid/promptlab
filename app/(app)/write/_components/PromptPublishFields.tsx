"use client";

import type { PromptDraftState } from "./PromptForm.client";

type PromptPublishFieldsProps = {
  draft: PromptDraftState;
  onChange: <Key extends keyof PromptDraftState>(
    key: Key,
    value: PromptDraftState[Key],
  ) => void;
};

export default function PromptPublishFields({
  draft,
  onChange,
}: PromptPublishFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-bold text-slate-950">
          저장 전 안전 검사
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          저장 시 개인정보, 회사기밀, 저작권 위험, 과장 표현 기준이 적용됩니다.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700">공개 범위</span>
          <select
            value={draft.visibility}
            onChange={(event) =>
              onChange(
                "visibility",
                event.currentTarget.value === "public" ? "public" : "private",
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            <option value="private">비공개</option>
            <option value="public">공개</option>
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700">상태</span>
          <select
            value={draft.status}
            onChange={(event) =>
              onChange(
                "status",
                event.currentTarget.value === "published"
                  ? "published"
                  : "draft",
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            <option value="draft">초안</option>
            <option value="published">게시</option>
          </select>
        </label>
      </div>

      <div className="rounded-2xl bg-slate-50 p-3">
        <p className="text-sm font-bold text-slate-950">권장 설정</p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          처음 저장은 비공개, 초안이 안전합니다. 검토 후 공개와 게시로 바꾸세요.
        </p>
      </div>
    </div>
  );
}