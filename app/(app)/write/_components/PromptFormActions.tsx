"use client";

import { useFormStatus } from "react-dom";
import Button from "@/shared/ui/button";
import type { PromptFormStep } from "./PromptFormStepTabs";

type PromptFormActionsProps = {
  currentStep: PromptFormStep;
  canGoNextFromCore: boolean;
  onStepChange: (step: PromptFormStep) => void;
};

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "저장 중" : "프롬프트 저장"}
    </Button>
  );
}

export default function PromptFormActions({
  currentStep,
  canGoNextFromCore,
  onStepChange,
}: PromptFormActionsProps) {
  if (currentStep === "core") {
    return (
      <div className="sticky bottom-3 z-10 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <Button
          type="button"
          className="w-full"
          disabled={!canGoNextFromCore}
          onClick={() => onStepChange("settings")}
        >
          저장 설정으로 이동
        </Button>
      </div>
    );
  }

  return (
    <div className="sticky bottom-3 z-10 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <Button
        type="button"
        variant="secondary"
        onClick={() => onStepChange("core")}
      >
        이전
      </Button>
      <SaveButton />
    </div>
  );
}