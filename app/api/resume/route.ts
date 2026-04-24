// app/api/resume/route.ts
// Gemini 2.0 Flash 기반 — 무료 티어 (하루 1,500회)

import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.82,
        maxOutputTokens: 4000,
        topP: 0.95,
      },
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Gemini API 오류: ${res.status} ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini 응답이 비어있습니다.");
  return text;
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
  const whitelist = ["AIPD", "AIPT", "GAC", "SNS", "B2B", "AI", "PM", "LLM", "DB", "UI", "UX", "KPI", "ATS", "POT"];
  return text
    .replace(/[\u4e00-\u9fff]/g, "")
    .replace(/[\u3040-\u309f]/g, "")
    .replace(/[\u30a0-\u30ff]/g, "")
    .replace(/[\u0900-\u097f]/g, "")
    .replace(/[\u0400-\u04ff]/g, "")
    .replace(/[\u0600-\u06ff]/g, "")
    .replace(/[\u0e00-\u0e7f]/g, "")
    .replace(/[\u1e00-\u1eff]/g, "")
    .replace(/[a-zA-Z]{3,}/g, (match) => {
      if (whitelist.some((w) => match.toUpperCase() === w)) return match;
      return "";
    })
    .replace(/\s{2,}/g, " ")
    .trim();
}

function cleanResumeText(text: string): string {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;
      const colonIdx = line.indexOf(":");
      if (colonIdx !== -1) {
        const value = line.slice(colonIdx + 1).replace(/[,\s·]/g, "").trim();
        if (!value) return false;
      }
      return true;
    })
    .join("\n");
}

// ─────────────────────────────────────────────────────────────
// SYSTEM PROMPT
// ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `당신은 삼성전자·구글 채용팀 출신 15년 경력 자기소개서 전문 컨설턴트입니다.
반드시 한국어 존댓말(~했습니다, ~입니다)로만 작성합니다.
영어·외국어 문자, 마크다운 기호(** * # _ >) 절대 금지.
소제목·불릿포인트 절대 금지.

━━━ 절대 금지 표현 ━━━
아래 표현이 하나라도 나오면 즉시 해당 문장을 다시 씁니다:
열정 / 노력 / 기여 / 최선 / 성장 / 도전 / 더 나은 /
이를 통해 / 이러한 경험을 통해 / 이렇게 / 이러한 / 이와 같이 /
~에 부합합니다 / ~하고자 합니다 / ~드리겠습니다 /
기여할 수 있을 것입니다 / 기여하고 싶습니다 /
중요하다는 것을 알게 되었습니다 / 생각하게 되었습니다 /
관심을 가지게 되었습니다 / 일하고 싶습니다 /
조직의 성장 / 함께 성장 / 발전하겠습니다 /
책임감을 가지고 / 성실히 수행 / 새로운 아이디어 /
~할 것입니다(단독 마무리) / 도움이 될 것입니다

━━━ Burstiness 규칙 ━━━
짧은 문장(10자 이내)과 긴 문장(40자 이상)을 반드시 불규칙하게 교차합니다.
동일 어미(~습니다. ~습니다.)를 연속 2회 이상 절대 금지.
수치는 비정형으로: "3개월"→"13주", "50%"→"47.3%"

━━━ 인사담당자 신뢰 기준 ━━━
첫 문장: 숫자 또는 현장 장면으로 시작. "저는~" 절대 금지.
STAR 구조(상황→문제→행동→결과) + 두괄식 필수.
실패·시행착오 경험 반드시 포함. 면접에서 답할 수 있는 수준.
회사 칭찬·회사 복지·근무조건 언급 절대 금지.
이력서 원문 사실만 사용. 없는 내용은 [본인 경험 입력] 표시.
각 항목 600자 이상. 전체 2500자 이상.`;

// ─────────────────────────────────────────────────────────────
// POST 핸들러
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobText, resumeText, userInfo }: {
      jobText?: string;
      resumeText?: string;
      userInfo?: string;
    } = body;

    if (!jobText?.trim()) {
      return NextResponse.json({ error: "채용공고 내용을 입력해주세요." }, { status: 400 });
    }

    const hasResume = !!resumeText?.trim();
    const cleanedResume = hasResume ? cleanResumeText(resumeText!.trim()) : "";

    const resumeSection = hasResume
      ? `[이력서 — 아래 내용만 사용, 없는 내용은 [본인 경험 입력] 표시]\n${cleanedResume}`
      : `[이력서 미제공 — 모든 수치·경험은 [본인 경험 입력] 표시]`;

    const userInfoSection = userInfo?.trim()
      ? `\n[추가 정보]\n${userInfo.trim()}`
      : "";

    const prompt = `채용공고와 이력서를 보고 자기소개서를 작성하세요.

[채용공고]
${jobText}

${resumeSection}${userInfoSection}

━━━ 작성 규칙 ━━━
1. 이력서에 없는 내용 생성 금지. 없으면 [본인 경험 입력].
2. 채용공고의 직무와 내 경험의 연결점만 씁니다. 회사 칭찬·복지·근무조건 언급 금지.
3. 각 항목 작성 전 스스로 점검:
   - 첫 문장이 숫자 또는 현장 장면인가?
   - 금지 표현이 없는가?
   - 짧은 문장↔긴 문장이 교차하는가?
   - 600자 이상인가?

━━━ 올바른 문체 기준 ━━━

나쁜 예 (절대 금지):
"교육마케팅에 관심을 가지게 되었습니다. 이를 통해 에듀위키에 기여하고 싶습니다. 도움이 될 것이라 생각합니다."
→ 금지 표현 3개, 균일한 리듬, AI 탐지 즉시 걸림. 회사 복지(출퇴근 거리 등) 언급 금지.

좋은 예 (이 방향으로):
"반응이 없었습니다. 47개 과정을 홍보하면서 전국 카페 90여 곳에 직접 자료를 배포했지만, 4주가 지나도록 문의 전화가 단 한 통도 오지 않았습니다. 채널이 틀렸다는 것을 그때 알았습니다. 지역 커뮤니티와 직장인 카페로 바꾸자 11일 만에 문의가 들어왔습니다. 같은 내용도 어디서 전달하느냐가 결과를 완전히 바꿉니다."
→ 짧은 문장 시작, 구체적 수치, 실패→전환 구조, 금지 표현 없음.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

출력 형식 (마크다운·기호 없이):

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
[이력서 미제공 — 빈칸을 직접 채워주세요]
- 주요 경력/프로젝트: [직접 입력]
- 보유 기술: [직접 입력]
- 관련 수치/성과: [직접 입력]
`}
[자기소개서]

1. 지원 동기
점검 완료 후 작성 (600자 이상 | 첫 문장: 숫자·장면 | 금지 표현 없음 | 회사 칭찬·복지 언급 금지)

2. 성장 과정
점검 완료 후 작성 (600자 이상 | 실패 경험 포함 | 동일 어미 연속 금지)

3. 직무 역량
점검 완료 후 작성 (600자 이상 | 이력서 수치 활용 | 금지 표현 없음)

4. 입사 후 포부
점검 완료 후 작성 (600자 이상 | 마지막 문장: 구체적 수치·기간 | 회사 칭찬 금지)`;

    const rawResult = await callGemini(prompt);
    const cleaned = stripMarkdown(rawResult);
    const result = removeForeignChars(cleaned);

    return NextResponse.json({ resume: result });
  } catch (error: unknown) {
    console.error("Resume API error:", error);
    const msg = error instanceof Error ? error.message : "서버 오류";
    return NextResponse.json({ error: `오류가 발생했습니다: ${msg}` }, { status: 500 });
  }
}