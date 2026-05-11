import { describe, expect, it } from "vitest";
import { promptCreateSchema, promptUpdateSchema } from "../prompts/schemas/prompt.schema";

describe("Prompt schema", () => {
  it("accepts a valid prompt create input", () => {
    const result = promptCreateSchema.safeParse({
      title: "고객 응대 이메일 프롬프트",
      promptBody: "고객 문의 내용을 정중한 이메일로 작성하세요.",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.visibility).toBe("private");
      expect(result.data.status).toBe("draft");
      expect(result.data.variables).toEqual([]);
    }
  });

  it("rejects an empty prompt body", () => {
    const result = promptCreateSchema.safeParse({
      title: "빈 프롬프트",
      promptBody: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty update payload", () => {
    const result = promptUpdateSchema.safeParse({});

    expect(result.success).toBe(false);
  });
});
