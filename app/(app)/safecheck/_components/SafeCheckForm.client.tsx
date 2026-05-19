"use client";

import { useActionState, useState } from "react";
import { scanPromptAction, type SafeCheckActionState } from "../actions";
import ErrorMessage from "@/shared/ui/error-message";
import Textarea from "@/shared/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import LoginRequiredDialog from "@/shared/ui/LoginRequiredDialog.client";
import SafeCheckSubmitButton from "./SafeCheckSubmitButton.client";
import SafeCheckResultCard from "./SafeCheckResultCard";
import SafeCheckSafePromptCard from "./SafeCheckSafePromptCard";

const MAX_PROMPT_LENGTH = 12000;

const initialState: SafeCheckActionState = {
  ok: true,
  message: "",
  result: null,
  reportId: null,
};

type SafeCheckFormProps = {
  isLoggedIn: boolean;
};

export default function SafeCheckForm({ isLoggedIn }: SafeCheckFormProps) {
  const [state, formAction] = useActionState(scanPromptAction, initialState);
  const [textLength, setTextLength] = useState(0);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (isLoggedIn) {
      return;
    }

    event.preventDefault();
    setIsLoginDialogOpen(true);
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>검사할 내용</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} onSubmit={handleSubmit} className="space-y-3">
              <label className="block space-y-2">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-700">
                    프롬프트 본문
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">
                    {textLength.toLocaleString("ko-KR")} /{" "}
                    {MAX_PROMPT_LENGTH.toLocaleString("ko-KR")}자
                  </span>
                </span>

                <Textarea
                  name="promptText"
                  className="min-h-44 sm:min-h-72"
                  maxLength={MAX_PROMPT_LENGTH}
                  placeholder="검사할 프롬프트를 입력하세요."
                  onChange={(event) =>
                    setTextLength(event.currentTarget.value.length)
                  }
                  required
                />
              </label>

              {!state.ok ? <ErrorMessage message={state.message} /> : null}

              <SafeCheckSubmitButton />
            </form>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 sm:gap-6">
          <SafeCheckResultCard
            result={state.result}
            reportId={state.reportId}
          />

          {state.result ? (
            <SafeCheckSafePromptCard safePrompt={state.result.safePrompt} />
          ) : null}
        </div>
      </div>

      <LoginRequiredDialog
        isOpen={isLoginDialogOpen}
        title="로그인이 필요한 기능입니다"
        description="검사를 실행하면 결과와 기록이 개인 계정에 연결됩니다. 내 검사 기록을 안전하게 저장하고 다시 확인하려면 로그인이 필요합니다."
        onClose={() => setIsLoginDialogOpen(false)}
      />
    </>
  );
}