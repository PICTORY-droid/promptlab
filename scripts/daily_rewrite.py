"""
PromptLab 매일 아침 루틴 — 기존 글 10개 전면 재작성
실행: python3 scripts/daily_rewrite.py
필요 환경변수: ANTHROPIC_API_KEY
"""

import urllib.request
import urllib.error
import json
import time
import os
import sys
from datetime import date

# ── 설정 ─────────────────────────────────────────────────────────
SUPABASE_URL = "https://hkijkcoshdzzmaxiihzm.supabase.co"
SERVICE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraWprY29zaGR6em1heGlpaHptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NjEwNCwiZXhwIjoyMDkwOTMyMTA0fQ.etZvtlgmIzC5etY7-QTD8ggTahQSUgzyxbpihMwDfZQ"
ANTHROPIC_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
TODAY         = date.today().isoformat()   # 예: 2026-04-30

SUPA_HEADERS = {
    "apikey":        SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal",
}

# ── 유틸 ─────────────────────────────────────────────────────────
def supa_get(path: str) -> list:
    req = urllib.request.Request(SUPABASE_URL + path, headers=SUPA_HEADERS)
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read().decode())

def supa_patch(post_id: str, payload: dict):
    url  = f"{SUPABASE_URL}/rest/v1/prompts?id=eq.{post_id}"
    data = json.dumps(payload).encode()
    req  = urllib.request.Request(url, data=data, method="PATCH", headers=SUPA_HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return True, r.status
    except urllib.error.HTTPError as e:
        return False, e.read().decode()[:200]

def call_claude(prompt: str) -> str:
    if not ANTHROPIC_KEY:
        raise RuntimeError("ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.")
    payload = {
        "model":      "claude-sonnet-4-6",
        "max_tokens": 4096,
        "messages":   [{"role": "user", "content": prompt}],
    }
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=json.dumps(payload).encode(),
        headers={
            "x-api-key":         ANTHROPIC_KEY,
            "anthropic-version": "2023-06-01",
            "content-type":      "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        result = json.loads(r.read().decode())
        return result["content"][0]["text"].strip()

# ── 재작성 프롬프트 ───────────────────────────────────────────────
REWRITE_SYSTEM = """당신은 PromptLab 콘텐츠 에디터입니다.
아래 규칙을 반드시 지켜서 글을 전면 재작성하세요.

[제목 규칙]
- 타겟(직종/세대/상황) + 상황 + 핵심키워드 조합
- 방법/이유/체크리스트/비교/실수/현실/전략 중 1개 포함
- 특정 연도 절대 금지
- 예: "소상공인이 폐업 전 반드시 챙겨야 할 7가지 세금 현실 체크리스트"

[설명 규칙]
- 정확히 2문장으로 핵심 요약
- AI 티 나는 표현 금지 (예: "이 글에서는", "살펴보겠습니다" 등)

[본문 구조] — 반드시 이 순서대로:
1. 한줄결론 (굵게 표시 없이 일반 텍스트, 1문장)
2. 실행 3단계 (각 단계 간략 설명, 실제 숫자·수치는 모두 {{변수}} 처리)
3. 체크리스트 (☑ 기호, 5개)
4. 프롬프트 예시 (3~4개, 각각 역할 부여 + {{변수}} 4개 이상)
5. CTA: "이 정보가 필요한 분께 공유해보세요."

[절대 금지]
- 대괄호 [ ] 사용
- 특정 연도·수치 하드코딩 (모두 {{변수}} 처리)
- AI 티 나는 문장 ("안녕하세요", "이 글에서는", "~해보겠습니다")
- author_id 언급

[출력 형식 — JSON만 출력, 마크다운 코드블록 금지]
{
  "title": "재작성된 제목",
  "description": "재작성된 설명 (2문장)",
  "content": "재작성된 본문 전체"
}"""

def build_rewrite_prompt(post: dict) -> str:
    return f"""{REWRITE_SYSTEM}

--- 원본 글 ---
제목: {post['title']}
카테고리: {post['category']}
설명: {post.get('description', '')}

본문:
{post['content']}
--- 끝 ---

위 글을 규칙에 따라 전면 재작성하세요. JSON만 출력하세요."""

# ── 메인 ─────────────────────────────────────────────────────────
def main():
    if not ANTHROPIC_KEY:
        print("❌ ANTHROPIC_API_KEY 환경변수를 설정하세요.")
        print("   export ANTHROPIC_API_KEY=sk-ant-...")
        sys.exit(1)

    # 1. last_auto_update IS NULL 글 10개 가져오기 (created_at 오래된 순)
    print("📥 Supabase에서 글 10개 조회 중...")
    path = (
        "/rest/v1/prompts"
        "?last_auto_update=is.null"
        "&order=created_at.asc"
        "&limit=10"
        "&select=id,title,description,content,category"
    )
    posts = supa_get(path)
    print(f"   {len(posts)}개 글 로드 완료\n")

    success_count = 0

    for i, post in enumerate(posts, 1):
        pid   = post["id"]
        title = post["title"]
        print(f"[{i}/10] 재작성 중: {title[:50]}...")

        # 2. Claude로 재작성
        for attempt in range(3):
            try:
                raw = call_claude(build_rewrite_prompt(post))
                # JSON 파싱 (마크다운 코드블록 제거 방어)
                clean = raw.strip()
                if clean.startswith("```"):
                    clean = clean.split("```")[1]
                    if clean.startswith("json"):
                        clean = clean[4:]
                rewritten = json.loads(clean.strip())
                break
            except (json.JSONDecodeError, KeyError, urllib.error.URLError) as e:
                if attempt == 2:
                    print(f"   ⚠️  재시도 실패, 건너뜀: {e}")
                    rewritten = None
                else:
                    time.sleep(2 ** attempt)

        if not rewritten:
            continue

        # 3. Supabase PATCH
        payload = {
            "title":           rewritten["title"],
            "description":     rewritten["description"],
            "content":         rewritten["content"],
            "last_auto_update": TODAY,
        }
        ok, info = supa_patch(pid, payload)
        if ok:
            print(f"   ✅ 업데이트 완료: {rewritten['title'][:55]}")
            success_count += 1
        else:
            print(f"   ❌ PATCH 실패 [{pid[:8]}]: {info}")

        time.sleep(0.5)   # API 레이트 리밋 방지

    print(f"\n🏁 완료: {success_count}/{len(posts)}개 업데이트 (last_auto_update = {TODAY})")


if __name__ == "__main__":
    main()
