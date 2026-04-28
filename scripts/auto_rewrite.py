"""
PromptLab 자동 재작성 스크립트
- last_auto_update IS NULL인 글을 created_at 오래된 순으로 10개 가져와서
- Claude API로 전면 재작성 후 Supabase에 PATCH
- 실행: python scripts/auto_rewrite.py
- 필요 환경변수: ANTHROPIC_API_KEY
"""

import os
import json
import urllib.request
import urllib.error
from datetime import date

SUPABASE_URL = "https://hkijkcoshdzzmaxiihzm.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraWprY29zaGR6em1heGlpaHptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NjEwNCwiZXhwIjoyMDkwOTMyMTA0fQ.etZvtlgmIzC5etY7-QTD8ggTahQSUgzyxbpihMwDfZQ"
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
TODAY = str(date.today())

SUPABASE_HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

REWRITE_SYSTEM = """당신은 PromptLab 콘텐츠 에디터입니다. 주어진 글을 아래 기준으로 전면 재작성하십시오.

재작성 기준:
1. 제목: 타겟(직종+세대+상황)+키워드 조합. 연도 숫자 절대 금지. 방법/이유/체크리스트/비교/실수/현실/전략 중 1개 포함.
2. 설명: 2문장. 첫 문장 핵심 가치, 두 번째 문장 실용성 강조.
3. 본문 구조(이 순서 엄수):
   한줄결론
   [한 문장으로 핵심 결론]

   실행 3단계
   1단계: [구체적 행동]
   2단계: [구체적 행동]
   3단계: [구체적 행동]

   체크리스트
   ☑ [확인 항목 5개]

   프롬프트 예시

   프롬프트 1: [역할명]
   당신은 [전문가역할]입니다. [변수포함 지시문]

   프롬프트 2: [역할명]
   당신은 [전문가역할]입니다. [변수포함 지시문]

   프롬프트 3: [역할명]
   당신은 [전문가역할]입니다. [변수포함 지시문]

   이 정보가 필요한 분께 공유해보세요.

4. 변수 처리: 모든 수치·법령·금리·임금·세율·정책값을 {{변수명}} 형태로 처리. 고정 수치 절대 금지.
5. AI 티 나는 문장 금지: "~할 수 있습니다", "중요합니다" 같은 AI체 제거.
6. 대괄호 [ ] 절대 금지.

JSON으로만 응답하십시오:
{"title": "...", "description": "...", "content": "..."}"""


def claude_rewrite(original: dict) -> dict | None:
    prompt = f"""아래 글을 전면 재작성하십시오.

원본 제목: {original['title']}
원본 설명: {original.get('description', '')}
원본 카테고리: {original.get('category', '')}
원본 본문 (처음 500자):
{(original.get('content') or '')[:500]}

JSON으로만 응답: {{"title": "...", "description": "...", "content": "..."}}"""

    payload = {
        "model": "claude-sonnet-4-6",
        "max_tokens": 4096,
        "system": REWRITE_SYSTEM,
        "messages": [{"role": "user", "content": prompt}],
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=data,
        method="POST",
    )
    req.add_header("x-api-key", ANTHROPIC_API_KEY)
    req.add_header("anthropic-version", "2023-06-01")
    req.add_header("content-type", "application/json")

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            text = result["content"][0]["text"].strip()
            # JSON 파싱 (코드블록 제거)
            if text.startswith("```"):
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            return json.loads(text.strip())
    except Exception as e:
        print(f"  Claude API 오류: {e}")
        return None


def fetch_posts() -> list:
    url = (
        f"{SUPABASE_URL}/rest/v1/prompts"
        "?last_auto_update=is.null"
        "&order=created_at.asc"
        "&limit=10"
        "&select=id,title,description,content,category"
    )
    req = urllib.request.Request(url)
    for k, v in SUPABASE_HEADERS.items():
        req.add_header(k, v)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


def patch_post(post_id: str, rewritten: dict) -> bool:
    url = f"{SUPABASE_URL}/rest/v1/prompts?id=eq.{post_id}"
    payload = {
        "title": rewritten["title"],
        "description": rewritten["description"],
        "content": rewritten["content"],
        "last_auto_update": TODAY,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="PATCH")
    for k, v in SUPABASE_HEADERS.items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return True
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")[:200]
        print(f"  Supabase PATCH 오류 {e.code}: {body}")
        return False


def main():
    if not ANTHROPIC_API_KEY:
        print("오류: ANTHROPIC_API_KEY 환경변수를 설정하세요.")
        print("  export ANTHROPIC_API_KEY=sk-ant-...")
        return

    print(f"오늘 날짜: {TODAY}")
    print("Supabase에서 10개 조회 중...")

    try:
        posts = fetch_posts()
    except Exception as e:
        print(f"Supabase 조회 실패: {e}")
        return

    print(f"조회된 글: {len(posts)}개\n")

    success = 0
    for i, post in enumerate(posts, 1):
        print(f"[{i}/10] {post['title'][:60]}")
        print(f"  재작성 중...")

        rewritten = claude_rewrite(post)
        if not rewritten:
            print(f"  재작성 실패, 건너뜀")
            continue

        print(f"  새 제목: {rewritten['title'][:60]}")

        ok = patch_post(post["id"], rewritten)
        if ok:
            print(f"  Supabase 업데이트 완료")
            success += 1
        else:
            print(f"  업데이트 실패")
        print()

    print(f"완료: {success}/{len(posts)}개 재작성 및 업데이트 (last_auto_update = {TODAY})")


if __name__ == "__main__":
    main()
