// app/api/resume/route.ts
// OpenRouter 무료 텍스트 모델 기반 — 비용 0원

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://promptlab.io.kr",
    "X-Title": "PromptLab",
  },
});

const TEXT_MODELS = [
  "openrouter/auto",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "google/gemma-3-12b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
];

async function callWithFallback(prompt: string): Promise<string> {
  let lastError: Error | null = null;

  for (const model of TEXT_MODELS) {
    try {
      console.log(`[Resume] 모델 시도: ${model}`);
      const response = await client.chat.completions.create({
        model,
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
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

      if (status === 429 || status === 404 || status === 503) {
        lastError = error instanceof Error ? error : new Error(String(error));
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error("모든 모델에서 응답을 받지 못했습니다.");
}

// 마크다운 기호 제거 함수
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

    const prompt = `당신은 삼성전자·구글 출신 10년 경력 채용 전문가입니다.

아래는 채용공고입니다.

[채용공고]
${jobText}

${resumeSection}${userInfoSection}

아래 규칙을 반드시 지켜 자기소개서를 작성하세요.

━━━ 절대 원칙 (위반 시 전체 재작성) ━━━

[0. 출력 형식 금지 — 최우선]
- **텍스트**, *텍스트*, __텍스트__, # 제목, > 인용 등 마크다운 문법 절대 사용 금지
- ** * _ # > 기호 출력 완전 금지 — 일반 텍스트로만 작성
- 이 규칙을 어기면 즉시 전체 재작성

[1. 환각 금지 — 가장 중요]
- 이력서에 실제로 적힌 내용만 사용. 없는 수치·경험·회사명·프로젝트명 절대 생성 금지
- 이력서 없는 경우: 수치/경험 자리에 반드시 [본인 경험 입력] 또는 [수치 직접 입력] 빈칸으로 출력
- 이력서에 있는 수치도 그대로 사용. 임의로 변경하거나 추정치 생성 금지

[2. AI 탐지 우회 — 문체 규칙]
기업 AI 탐지 시스템은 아래를 감지한다. 반드시 회피할 것:

(금지) Burstiness 패턴 — 모든 문장이 비슷한 길이로 균일하게 이어지는 것
(필수) 짧은 문장(7~12자)과 긴 문장(45자 이상)을 불규칙하게 교차할 것
예시: "이틀을 날렸다. 배포 직전이었고 팀장은 이미 QA 단계에 들어가 있었다."

(금지) Perplexity 낮은 표현 — AI가 자주 선택하는 뻔한 단어
절대 사용 금지 단어: 열정, 도전, 성장, 기여, 발전, 최선, 노력, 하고자, 드리겠습니다, 해왔습니다, 통해, 위해, 바탕으로, 역량을 키워

(금지) 동일 문장 구조 연속 — "~했습니다. ~했습니다. ~했습니다." 반복
(필수) 서술어 다양하게: "~했다 / ~이었다 / ~이 문제였다 / ~를 날렸다 / ~가 안 됐다"

(금지) 딱 떨어지는 수치 — "50% 향상", "3배 개선" (AI 신호)
(필수) 비정형 수치 사용 — "47.3% 향상", "2.4배", "11일 단축"

[3. 삼성·구글급 인사담당자 신뢰 기준]
- 첫 문장은 반드시 훅 — 수치, 충격적 사실, 구체적 상황으로 바로 시작. "저는~"으로 시작 금지
- 실패 또는 시행착오 경험 반드시 1개 이상 포함 (면접에서 검증 가능한 수준으로)
- 회사 칭찬 금지 — "글로벌 기업인 ~", "세계 최고의 ~" 류 완전 금지
- 내 경험이 이 직무와 왜 맞는지만 서술
- 프로젝트명·팀 규모·기간·수치를 구체화 (이력서에 있는 경우)
- 자소서 내용은 면접에서 그대로 답변 가능한 수준이어야 함

[4. 문단 구조 — KKK + STAR]
각 항목 순서:
① 결론 (두괄식) — 첫 문장에서 핵심 경험/역량을 바로 제시
② Situation — 상황 (2문장 이내)
③ Task + Action — 내가 한 행동 (분량의 절반 이상, 가장 구체적으로)
④ Result — 수치로 된 결과 (이력서 근거만)
⑤ 연결 — 이 경험이 지원 직무와 어떻게 이어지는지 1문장

[5. 항목별 전략]
- 지원 동기: 회사 칭찬 금지. "내 [구체적 경험]이 이 직무의 [구체적 요구사항]과 일치하기 때문"으로만
- 성장 과정: 실패→행동→결과 흐름 필수. 성공만 나열하면 AI 신호로 읽힘
- 직무 역량: 채용공고 핵심 키워드를 Action과 Result 안에 자연스럽게 삽입
- 입사 후 포부: "열심히 하겠습니다" 금지. 1년차 구체적 행동 계획 → 3년 방향으로

[6. 형식]
- 각 항목 500~700자
- 문단 구분 없이 하나의 흐름으로 작성
- 소제목·불릿포인트 본문 내 사용 금지

출력 형식 (아래 형식 그대로, 순서 변경 금지):

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
- 사용한 수치: (이력서에서 가져온 수치만 나열)
` : `
[이력서 미제공 — 아래 빈칸을 직접 채워주세요]
- 주요 경력/프로젝트: [직접 입력]
- 보유 기술: [직접 입력]
- 관련 수치/성과: [직접 입력]
`}
[자기소개서]

1. 지원 동기
(내용)

2. 성장 과정
(내용)

3. 직무 역량
(내용)

4. 입사 후 포부
(내용)`;

    const rawResult = await callWithFallback(prompt);
    const result = stripMarkdown(rawResult);

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