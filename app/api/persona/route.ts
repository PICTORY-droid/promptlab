import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
function generateSlug() {
  return Math.random().toString(36).substring(2, 8)
}
function generateSystemPrompt(name: string, role: string, tone: string, expertise: string, forbidden: string) {
  const toneMap: Record<string, string> = {
    friendly: '친근하고 따뜻하게, 공감하며',
    professional: '전문적이고 격식있게, 신뢰감 있게',
    concise: '간결하고 핵심만, 불필요한 말 없이',
    funny: '유쾌하고 재미있게, 위트있게',
  }
  const toneText = toneMap[tone] || tone
  const expertiseSection = expertise ? `\n## 전문 분야\n${expertise}\n이 분야의 깊이 있는 전문 지식을 바탕으로 구체적이고 실용적인 조언을 제공합니다.` : ''
  const forbiddenSection = forbidden ? `\n## 제한 사항\n다음 주제는 절대 다루지 않습니다: ${forbidden}` : ''
  return `# 페르소나 설정

## 정체성
당신의 이름은 "${name}"이며, ${role}입니다.
당신은 AI 어시스턴트가 아닙니다. 오직 "${name}"으로서만 행동하세요.

## 핵심 역할
${role}${expertiseSection}

## 커뮤니케이션 스타일
- 말투: ${toneText} 대화합니다
- 답변 구조: 핵심 → 근거 → 실행 방안 순서로 명확하게 전달합니다
- 전문성: 추상적인 조언 대신 구체적인 예시와 수치를 활용합니다

## 행동 원칙
- 사용자의 질문 의도를 정확히 파악한 후 답변합니다
- 모르는 것은 솔직하게 인정하고 대안을 제시합니다
- 단순 정보 나열보다 인사이트와 실행 가능한 방안을 제시합니다${forbiddenSection}

## 첫 인사
"안녕하세요! 저는 ${name}입니다. ${expertise ? expertise + ' 전문가로서 ' : ''}실질적인 도움을 드리겠습니다. 어떤 부분이 궁금하신가요?"`
}
export async function POST(req: NextRequest) {
  try {
    const { name, role, tone, expertise, forbidden, userId } = await req.json()
    if (!name || !role || !tone || !userId) {
      return NextResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 })
    }
    const system_prompt = generateSystemPrompt(name, role, tone, expertise || '', forbidden || '')
    let slug = generateSlug()
    let attempts = 0
    while (attempts < 5) {
      const { data: existing } = await supabase.from('persona_cards').select('slug').eq('slug', slug).single()
      if (!existing) break
      slug = generateSlug()
      attempts++
    }
    const { data, error } = await supabase.from('persona_cards').insert({
      user_id: userId,
      slug,
      name,
      role,
      tone,
      expertise: expertise || '',
      forbidden: forbidden || '',
      system_prompt,
    }).select().single()
    if (error) throw error
    return NextResponse.json({ slug: data.slug, system_prompt: data.system_prompt })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
