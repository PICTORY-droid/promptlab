// app/api/resume/route.ts
// Groq 무료 티어 기반 — 비용 0원

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const TEXT_MODELS = [
  "qwen/qwen3-32b",
  "llama-3.3-70b-versatile",
  "llama3-70b-8192",
];

async function callWithFallback(messages: { role: "system" | "user" | "assistant"; content: string }[]): Promise<string> {
  let lastError: Error | null = null;

  for (const model of TEXT_MODELS) {
    try {
      console.log(`[Resume] 모델 시도: ${model}`);
      const response = await client.chat.completions.create({
        model,
        max_tokens: 4000,
        messages,
      });

      const result = response.choices[0]?.message?.content;
      if (result) {
        console.log(`[Resume] 성공: ${model}`);
        return result;
      }
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      const status = err?.status;
      console.warn(`[Resume] 실패 (${model}): ${status} ${err?.message}`);

      if (status === 429 || status === 404 || status === 503 || status === 400 || status === 413) {
        lastError = error instanceof Error ? error : new Error(String(error));
        await new Promise((res) => setTimeout(res, 1000));
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error("모든 모델에서 응답을 받지 못했습니다.");
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/>\s/g, "")
    .trim();
}

function removeForeignChars(text: string): string {
  return text
    .replace(/\b(planning|plan)\b/gi, "계획 수립")
    .replace(/\b(execution|execute)\b/gi, "실행")
    .replace(/\b(skill[s]?)\b/gi, "능력")
    .replace(/\b(effort[s]?)\b/gi, "꾸준한 실천")
    .replace(/\b(goal[s]?)\b/gi, "목표")
    .replace(/\b(challenge[s]?)\b/gi, "과제")
    .replace(/\b(management)\b/gi, "관리")
    .replace(/\b(government)\b/gi, "정부")
    .replace(/\b(company)\b/gi, "회사")
    .replace(/[\u4e00-\u9fff]/g, "")
    .replace(/[\u3040-\u309f\u30a0-\u30ff]/g, "")
    .trim();
}

const SYSTEM_PROMPT = `당신은 10년 경력 한국 채용 전문가입니다.
반드시 한국어 존댓말로만 작성하세요. 반말 절대 금지.
영어 단어, 외국어 문자 절대 금지.

아래 예시의 문체를 그대로 따르세요.

[좋은 예시 — 지원 동기]
마감 이틀 전이었습니다. 신청자 수가 목표치의 30%에 머물렀고, 팀장님은 이미 포기한 표정이셨습니다. 그날 밤 홍보 방식을 처음부터 다시 짰습니다. 단체 문자 대신 지역 맘카페 운영자 90곳에 직접 메시지를 드렸습니다. 다음날 오전에만 47건이 접수됐습니다. 같은 정보라도 어떤 경로로 전달하느냐가 결과를 완전히 바꾼다는 것을 그때 알았습니다.

[좋은 예시 — 성장 과정]
처음 3주는 완전히 방향을 잘못 잡았습니다. 홍보물을 배포했는데 반응이 전혀 없었습니다. 40대 이상 직장인 대상 교육인데 인스타그램에 올리고 있었던 것입니다. 채널을 지역 커뮤니티와 직장인 카페로 바꿨더니 2주 만에 문의가 들어오기 시작했습니다. 실패했던 3주가 없었다면 그 전환도 없었을 것입니다.

[좋은 예시 — 직무 역량]
수료율 관리가 숫자만의 문제가 아니라는 것을 알게 된 것은 수강생 한 분의 전화 한 통 때문이었습니다. 야간 근무 중이라 수강 시간이 없다고 하셨습니다. 수료 기한을 확인하고 짧은 단위로 나눈 학습 일정을 문자로 드렸습니다. 일주일 뒤 수료하셨습니다. 구글 스프레드시트로 수강생별 진도율과 연락 일자를 관리했고, 매주 현황을 보고했습니다.

[좋은 예시 — 입사 후 포부]
입사 첫 달은 기존 수강생 데이터를 분석하는 데 집중할 것입니다. 수료율이 낮은 구간과 중도 포기 패턴을 먼저 파악해야 합니다. 6개월 안에 담당 수강생 수료율을 15% 이상 높이는 것을 첫 번째 기준으로 삼겠습니다. 3년 차에는 유입 경로별 전환율 데이터를 직접 구축해 홍보와 상담 방식을 데이터 기반으로 바꾸겠습니다.

공통 규칙:
- 첫 문장: 숫자 또는 구체적 장면으로 시작
- 짧은 문장과 긴 문장을 불규칙하게 교차
- 실패·시행착오 경험 반드시 포함
- 금지 표현: 열정, 노력, 기여, 최선, 역량을 키웠습니다, 이러한 경험을 통해, ~에 부합합니다
- 마지막 문장: 막연한 다짐 금지, 구체적 수치나 계획으로 마무리
- 회사 칭찬 금지
- 각 항목 500자 이상`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jobText,
      resumeText,
      userInfo,
    }: {
      jobText?: string;
      resumeText?: string;
      userInfo?: string;
    } = body;

    if (!jobText?.trim()) {
      return NextResponse.json(
        { error: "채용공고 내용을 입력해주세요." },
        { status: 400 }
      );
    }

    const hasResume = !!resumeText?.trim();

    const resumeSection = hasResume
      ? `아래는 지원자의 이력서입니다. 이력서에 실제로 적힌 내용만 사용하세요.\n\n[이력서]\n${resumeText}`
      : `이력서가 제공되지 않아 일반적인 신입 지원자 기준으로 작성합니다.`;

    const userInfoSection = userInfo?.trim()
      ? `\n\n[추가 정보]\n${userInfo.trim()}`
      : "";

    const userPrompt = `아래 채용공고와 이력서를 보고 한국어 존댓말 자기소개서를 작성하세요.

[채용공고]
${jobText}

${resumeSection}${userInfoSection}

규칙:
1. 예시 문체를 그대로 따르세요
2. 존댓말(~했습니다, ~입니다)로만 작성, 반말 절대 금지
3. 이력서에 있는 내용만 사용, 없는 내용 생성 금지
4. 없는 수치·경험은 [본인 경험 입력]으로 표시
5. 각 항목 최소 500자, 전체 최소 2000자
6. 영어 단어, 외국어 문자 완전 금지
7. ** * _ # 기호 금지, 소제목·불릿포인트 금지

출력 형식:

[채용공고 분석]
- 회사명: 
- 직무: 
- 핵심 요구 역량 3가지: 
${hasResume ? `
[이력서에서 사용한 정보 — 직접 확인하세요]
- 학력: 
- 주요 경력/프로젝트: 
- 기술 스택: 
- 자격증: 
- 사용한 수치: 
` : `
[이력서 미제공 — 아래 빈칸을 직접 채워주세요]
- 주요 경력/프로젝트: [직접 입력]
- 보유 기술: [직접 입력]
- 관련 수치/성과: [직접 입력]
`}
[자기소개서]

1. 지원 동기
(500자 이상, 존댓말)

2. 성장 과정
(500자 이상, 존댓말, 실패 경험 포함)

3. 직무 역량
(500자 이상, 존댓말, 수치 포함)

4. 입사 후 포부
(500자 이상, 존댓말, 구체적 수치 목표)`;

    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ];

    const rawResult = await callWithFallback(messages);
    const cleaned = stripMarkdown(rawResult);
    const result = removeForeignChars(cleaned);

    return NextResponse.json({ resume: result });
  } catch (error: unknown) {
    console.error("Resume API error:", error);
    const msg = error instanceof Error ? error.message : "서버 오류";
    return NextResponse.json(
      { error: `오류가 발생했습니다: ${msg}` },
      { status: 500 }
    );
  }
}