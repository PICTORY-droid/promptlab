#!/usr/bin/env python3
"""
daily_rewrite.py  —  매일 아침 세션 1 자동화 스크립트
last_auto_update IS NULL인 글을 created_at 오래된 순으로 10개 가져와서
Claude API로 전면 재작성 후 Supabase에 PATCH.

사용법:
    pip install anthropic
    export ANTHROPIC_API_KEY=sk-ant-...
    python scripts/daily_rewrite.py
"""

import os
import json
import urllib.request
import urllib.error
from datetime import date

try:
    import anthropic
except ImportError:
    print("오류: anthropic 패키지가 없습니다. 먼저 'pip install anthropic' 실행하세요.")
    raise SystemExit(1)

# ─── 설정 ────────────────────────────────────────────────────────────────────
SUPABASE_URL = "https://hkijkcoshdzzmaxiihzm.supabase.co"
SERVICE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    ".eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraWprY29zaGR6em1heGlpaHptIiwi"
    "cm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NjEwNCwiZXhwIjoyMDkw"
    "OTMyMTA0fQ.etZvtlgmIzC5etY7-QTD8ggTahQSUgzyxbpihMwDfZQ"
)
TODAY = date.today().isoformat()  # 예: "2026-04-29"
LIMIT = 10

SUPABASE_HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

REWRITE_SYSTEM = """당신은 PromptLab의 콘텐츠 편집장입니다.
아래 규칙을 철저히 따라 프롬프트 글을 전면 재작성하세요.

## 재작성 규칙
1. 제목: 타겟(직종·세대·상황) + 상황 + 핵심 키워드 조합으로 강화. 특정 연도 절대 금지.
2. 설명: 2문장 핵심 요약. 독자의 통증(pain)을 먼저, 해결책을 뒤에.
3. 본문 구조 (순서 고정):
   - 한줄결론 (굵게 처리 없이 평문으로, 핵심 주장 1문장)
   - 실행 3단계 (번호 목록, 각 단계 2~4문장)
   - 체크리스트 (☑ 기호, 5~7항목)
   - 프롬프트 예시 (프롬프트 3~4개, 각 150자 이상, 변수 {{변수명}} 포함)
   - CTA 마지막 줄: "이 정보가 필요한 분께 공유해보세요."
4. 변수 처리: 변동 가능한 모든 수치(금리, 세율, 임금, 법령 기준 등) → {{변수명}} 형태
5. AI 티 제거: "먼저", "다음으로", "마지막으로" 같은 기계적 전환어 금지.
   "~입니다", "~합니다" 과잉 사용 금지. 자연스러운 구어체 사용.
6. 대괄호 [ ] 절대 금지
7. $$ 달러쿼팅 미완성 금지 (짝수 개 유지)

## 출력 형식 (반드시 JSON만, 다른 텍스트 없이)
{
  "title": "재작성된 제목",
  "description": "재작성된 설명 (2문장)",
  "content": "재작성된 본문"
}"""


# ─── Supabase REST 유틸 ──────────────────────────────────────────────────────
def _supabase(method: str, path: str, payload: dict | None = None) -> dict | list | None:
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    body = json.dumps(payload).encode() if payload else None
    req = urllib.request.Request(url, data=body, method=method)
    for k, v in SUPABASE_HEADERS.items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req) as r:
            raw = r.read().decode()
            return json.loads(raw) if raw.strip() else {}
    except urllib.error.HTTPError as e:
        print(f"  [Supabase] HTTP {e.code}: {e.read().decode()[:300]}")
        return None


def fetch_posts() -> list[dict]:
    return _supabase(
        "GET",
        "prompts?last_auto_update=is.null"
        "&order=created_at.asc"
        f"&limit={LIMIT}"
        "&select=id,title,description,content,category",
    ) or []


def patch_post(post_id: str, rewritten: dict) -> bool:
    result = _supabase(
        "PATCH",
        f"prompts?id=eq.{post_id}",
        {
            "title": rewritten["title"],
            "description": rewritten["description"],
            "content": rewritten["content"],
            "last_auto_update": TODAY,
        },
    )
    return result is not None


# ─── Claude 재작성 ────────────────────────────────────────────────────────────
def rewrite(post: dict, client: "anthropic.Anthropic") -> dict:
    user_msg = (
        f"카테고리: {post.get('category', '')}\n\n"
        f"제목: {post['title']}\n\n"
        f"설명: {post.get('description', '')}\n\n"
        f"본문:\n{post.get('content', '')}"
    )
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        system=REWRITE_SYSTEM,
        messages=[{"role": "user", "content": user_msg}],
    )
    text = message.content[0].text.strip()

    # 코드 블록 제거
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].split("```")[0].strip()

    return json.loads(text)


# ─── 메인 ────────────────────────────────────────────────────────────────────
def main() -> None:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("오류: ANTHROPIC_API_KEY 환경변수가 없습니다.")
        print("  export ANTHROPIC_API_KEY=sk-ant-...")
        raise SystemExit(1)

    client = anthropic.Anthropic(api_key=api_key)

    print(f"오늘 날짜: {TODAY}")
    print("Supabase에서 글 가져오는 중 (last_auto_update IS NULL, 오래된 순)...")
    posts = fetch_posts()

    if not posts:
        print("처리할 글이 없습니다. (last_auto_update IS NULL인 글 없음)")
        return

    print(f"{len(posts)}개 글 가져옴.\n")

    ok = 0
    for i, post in enumerate(posts, 1):
        short = post["title"][:55]
        print(f"[{i:02d}/{len(posts)}] 재작성 중: {short}...")
        try:
            rewritten = rewrite(post, client)
            success = patch_post(post["id"], rewritten)
            if success:
                ok += 1
                print(f"       완료: {rewritten['title'][:55]}")
            else:
                print(f"       PATCH 실패 — 원본 ID: {post['id']}")
        except json.JSONDecodeError as e:
            print(f"       JSON 파싱 오류: {e}")
        except Exception as e:
            print(f"       오류: {e}")

    print(f"\n완료: {ok}/{len(posts)}개 재작성 및 last_auto_update = {TODAY} 업데이트됨.")


if __name__ == "__main__":
    main()
