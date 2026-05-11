"use server";

import { scanPrompt } from "@/features/safecheck/server/scan-prompt";
import type { SafeCheckResult } from "@/features/safecheck/types/safecheck.types";

export type SafeCheckActionState = {
  ok: boolean;
  message: string;
  result: SafeCheckResult | null;
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function scanPromptAction(
  _previousState: SafeCheckActionState,
  formData: FormData,
): Promise<SafeCheckActionState> {
  const promptText = getStringValue(formData, "promptText");

  if (!promptText) {
    return {
      ok: false,
      message: "검사할 프롬프트 본문을 입력하세요.",
      result: null,
    };
  }

  if (promptText.length > 12000) {
    return {
      ok: false,
      message: "프롬프트 본문은 최대 12,000자까지 검사할 수 있습니다.",
      result: null,
    };
  }

  const result = scanPrompt(promptText);

  return {
    ok: true,
    message: "검사가 완료되었습니다.",
    result,
  };
}
