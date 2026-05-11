import { describe, expect, it } from "vitest";
import { scanPrompt } from "../server/scan-prompt";

describe("scanPrompt", () => {
  it("allows a normal prompt", () => {
    const result = scanPrompt("고객 문의 내용을 정중한 이메일 답변으로 바꿔주세요.");

    expect(result.level).toBe("allow");
    expect(result.score).toBe(0);
    expect(result.findings).toHaveLength(0);
  });

  it("detects personal information", () => {
    const result = scanPrompt("홍길동 고객의 전화번호는 010-1234-5678입니다.");

    expect(result.level).not.toBe("allow");
    expect(result.findings.some((finding) => finding.category === "personal_info")).toBe(true);
  });

  it("detects company secret risk", () => {
    const result = scanPrompt("이 내부 자료와 비공개 전략을 바탕으로 제안서를 작성하세요.");

    expect(result.level).not.toBe("allow");
    expect(result.findings.some((finding) => finding.category === "company_secret")).toBe(true);
  });

  it("blocks when multiple risks are detected", () => {
    const result = scanPrompt(
      "내부 자료와 영업비밀을 사용하고, 010-1234-5678 고객에게 반드시 성공한다고 안내하세요.",
    );

    expect(result.level).toBe("block");
    expect(result.score).toBeGreaterThanOrEqual(60);
  });
});
