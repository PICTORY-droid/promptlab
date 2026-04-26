import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobImageBase64, jobMediaType } = await req.json();

    if (!resumeText) {
      return NextResponse.json({ error: "자소서 내용을 입력해주세요." }, { status: 400 });
    }

    let company = "지원 회사";
    let jobTitle = "지원 직무";
    let companyInfo = "";

    if (jobImageBase64 && jobMediaType) {
      const extractRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro-exp-03-25",
          messages: [{
            role: "user",
            content: [
              { type: "image_url", image_url: { url: `data:${jobMediaType};base64,${jobImageBase64}` } },
              { type: "text", text: '이 채용공고에서 정보를 추출하세요. JSON만 출력: {"company":"회사명","jobTitle":"직무명","companyInfo":"핵심요약"}' },
            ],
          }],
          max_tokens: 300,
        }),
      });
      const extractData = await extractRes.json();
      try {
        const clean = (extractData.choices?.[0]?.message?.content || "{}").replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        company = parsed.company || company;
        jobTitle = parsed.jobTitle || jobTitle;
        companyInfo = parsed.companyInfo || companyInfo;
      } catch { }
    }

    const textContent = `회사: ${company} / 직무: ${jobTitle}

자기소개서:
${resumeText}

면접 질문 8개를 JSON 배열로 생성하세요. JSON만 출력하세요.
형식: [{"type":"자소서 기반","question":"질문","reason":"이유","followUp":"꼬리질문","answer":"모범답변 방향"}]
질문 유형: 자소서 기반 2개, 직무 적합 2개, 인성협업 2개, AI역량 2개`;

    const msgContent = jobImageBase64 && jobMediaType
      ? [
          { type: "image_url", image_url: { url: `data:${jobMediaType};base64,${jobImageBase64}` } },
          { type: "text", text: textContent },
        ]
      : textContent;

    const questionRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro-exp-03-25",
        messages: [{ role: "user", content: msgContent }],
        max_tokens: 3000,
      }),
    });

    const questionData = await questionRes.json();
    if (!questionRes.ok) throw new Error(questionData.error?.message || "OpenRouter 오류");

    const questionText = questionData.choices?.[0]?.message?.content || "[]";
    let questions = [];
    try {
      const clean = questionText.replace(/```json|```/g, "").trim();
      questions = JSON.parse(clean);
    } catch {
      questions = [{ type: "기타", question: questionText, reason: "", followUp: "", answer: "" }];
    }

    return NextResponse.json({ company, jobTitle, companyInfo, questions });
  } catch (error: unknown) {
    console.error("Interview API error:", error);
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ error: `API 오류: ${message}` }, { status: 500 });
  }
}
