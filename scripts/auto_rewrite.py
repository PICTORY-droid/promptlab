"""
auto_rewrite.py  (세션 1 / 세션 2 공용)
---------------------------------------
last_auto_update IS NULL 인 글을 created_at 오래된 순으로 10개 가져와
Claude API로 가이드라인 기준 전면 재작성 후 Supabase에 PATCH.

사전 준비:
    pip install anthropic
    export ANTHROPIC_API_KEY="sk-ant-..."

실행:
    python scripts/auto_rewrite.py
"""

import urllib.request
import urllib.error
import json
import time
import sys

# ── 설정 ──────────────────────────────────────────────────────────────
SUPABASE_URL = "https://hkijkcoshdzzmaxiihzm.supabase.co"
SERVICE_KEY  = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraWprY29zaGR6em1heGlpaHptIiwicm9sZSI6"
    "InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NjEwNCwiZXhwIjoyMDkwOTMyMTA0fQ."
    "etZvtlgmIzC5etY7-QTD8ggTahQSUgzyxbpihMwDfZQ"
)
TODAY        = "2026-04-24"
CLAUDE_MODEL = "claude-sonnet-4-6"

SB_HEADERS = {
    "apikey":        SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal",
}

# ── 시스템 프롬프트 ────────────────────────────────────────────────────
SYSTEM_PROMPT = """\
당신은 PromptLab 콘텐츠 에디터입니다.
아래 규칙을 완벽히 준수해 글을 전면 재작성하십시오.

【절대 규칙】
1. 대괄호 [ ] 절대 사용 금지
2. 특정 연도(2024, 2025, 2026…) 제목·본문에 하드코딩 금지
3. 변동 가능한 모든 수치(임금·세율·금리·법령·정책·점수·기간)는 반드시 {{변수명}} 처리
4. AI 티 나는 문장("~살펴보겠습니다", "~알아보겠습니다", "~중요합니다", "~드리겠습니다") 금지
5. 결과물은 반드시 유효한 JSON 한 개만 출력 (코드 블록·설명·머리말 없음)

【재작성 기준】
title:
  - 타겟(직종/세대/규모) + 상황 + 핵심키워드 조합
  - 연도 없음
  - 방법/이유/체크리스트/비교/실수/현실/전략 중 1개 포함
  - 예: "소상공인 사업장 세무조사 실제 대비 전략 5가지"

description:
  - 2문장, 사용자 이익 중심
  - 첫 문장: 핵심 문제 제기
  - 둘째 문장: 이 글이 해결해주는 것

content (아래 5섹션 순서 엄수):

1) 한줄결론
   1문장. "~하면 ~가 된다" 구조. AI 투 표현 금지.

2) 실행 3단계
   1단계: ... ({{변수}} 1개 이상 포함)
   2단계: ... ({{변수}} 1개 이상 포함)
   3단계: ... ({{변수}} 1개 이상 포함)

3) 체크리스트
   ☑ 항목1 ({{변수}} 포함)
   ☑ 항목2
   ☑ 항목3 ({{변수}} 포함)
   ☑ 항목4
   ☑ 항목5 ({{변수}} 포함)

4) 프롬프트 예시
   프롬프트 1: 제목
   당신은 [역할]입니다. {{변수들}}을 바탕으로 [구체적 지시].

   프롬프트 2: 제목
   ...

   프롬프트 3: 제목
   ...

   프롬프트 4: 제목
   ...

5) CTA
   이 정보가 필요한 분께 공유해보세요.

출력 JSON 형식 (이것만 출력, 다른 텍스트 없음):
{
  "title": "...",
  "description": "...",
  "content": "..."
}
"""

# ── Supabase 유틸 ──────────────────────────────────────────────────────
def sb_get(path: str) -> list:
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/{path}",
        headers={k: v for k, v in SB_HEADERS.items()
                 if k not in ("Prefer",)},
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read())


def sb_patch(record_id: str, payload: dict) -> bool:
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/prompts?id=eq.{record_id}",
        data=data,
        method="PATCH",
        headers=SB_HEADERS,
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status in (200, 204)
    except urllib.error.HTTPError as e:
        print(f"  PATCH 오류 {e.code}: {e.read().decode()[:200]}")
        return False


# ── Claude API 호출 ────────────────────────────────────────────────────
def rewrite_with_claude(client, post: dict, attempt: int = 1) -> dict | None:
    user_msg = (
        f"아래 글을 규칙에 따라 전면 재작성하십시오.\n\n"
        f"[원본 제목]\n{post['title']}\n\n"
        f"[원본 설명]\n{post['description']}\n\n"
        f"[원본 본문]\n{post['content']}\n\n"
        f"[카테고리]\n{post['category']}\n\n"
        f"JSON만 출력하십시오."
    )

    try:
        msg = client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=3500,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_msg}],
        )
        raw = msg.content[0].text.strip()

        # 코드블록 감싸진 경우 제거
        if "```" in raw:
            parts = raw.split("```")
            for part in parts:
                stripped = part.strip()
                if stripped.startswith("{") or stripped.startswith("json\n{"):
                    raw = stripped.lstrip("json").strip()
                    break

        result = json.loads(raw)

        # 필수 키 검증
        for key in ("title", "description", "content"):
            if key not in result:
                raise ValueError(f"필수 키 없음: {key}")

        # CTA 없으면 추가
        if "공유해보세요" not in result["content"]:
            result["content"] += "\n\n이 정보가 필요한 분께 공유해보세요."

        return result

    except (json.JSONDecodeError, ValueError) as e:
        if attempt < 3:
            print(f"  재시도 {attempt}/3 ({e})")
            time.sleep(2)
            return rewrite_with_claude(client, post, attempt + 1)
        print(f"  Claude 파싱 실패: {e}")
        return None
    except Exception as e:
        print(f"  Claude 호출 오류: {e}")
        return None


# ── 품질 체크 ──────────────────────────────────────────────────────────
def quality_check(result: dict) -> list[str]:
    issues = []
    content = result.get("content", "")

    # 연도 하드코딩 체크
    for year in ("2023", "2024", "2025", "2026", "2027"):
        if year in result.get("title", "") or year in content:
            issues.append(f"연도 하드코딩: {year}")

    # 변수 처리 체크
    if "{{" not in content:
        issues.append("변수 처리 없음")

    # CTA 체크
    if "공유해보세요" not in content:
        issues.append("CTA 없음")

    # 대괄호 체크
    if "[" in result.get("title", "") or "[" in content:
        issues.append("대괄호 사용")

    # 섹션 구조 체크
    for section in ("한줄결론", "실행 3단계", "체크리스트", "프롬프트"):
        if section not in content:
            issues.append(f"섹션 없음: {section}")

    return issues


# ── 메인 ──────────────────────────────────────────────────────────────
def main():
    try:
        import anthropic
    except ImportError:
        print("anthropic 패키지가 없습니다. 먼저 실행하세요:")
        print("  pip install anthropic")
        sys.exit(1)

    import os
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("환경 변수 ANTHROPIC_API_KEY 를 설정하세요.")
        print("  export ANTHROPIC_API_KEY='sk-ant-...'")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

    # 1. 대상 10개 조회
    print("=" * 60)
    print(f"PromptLab 자동 재작성  |  날짜: {TODAY}")
    print("=" * 60)
    print("\nSupabase에서 대상 글 10개 조회 중…")

    try:
        posts = sb_get(
            "prompts?last_auto_update=is.null"
            "&order=created_at.asc"
            "&limit=10"
            "&select=id,title,description,content,category"
        )
    except Exception as e:
        print(f"Supabase 조회 실패: {e}")
        sys.exit(1)

    print(f"  {len(posts)}개 조회 완료\n")

    if not posts:
        print("재작성할 글이 없습니다 (last_auto_update IS NULL 없음).")
        return

    # 2. 재작성 + 품질 체크 + PATCH
    success = 0
    failed  = 0

    for i, post in enumerate(posts, 1):
        print(f"\n[{i:02d}/10] {post['title'][:55]}")

        result = rewrite_with_claude(client, post)
        if result is None:
            print("  → 스킵 (Claude 응답 실패)")
            failed += 1
            continue

        # 품질 체크
        issues = quality_check(result)
        if issues:
            print(f"  ⚠ 품질 경고: {', '.join(issues)}")

        payload = {
            "title":            result["title"],
            "description":      result["description"],
            "content":          result["content"],
            "last_auto_update": TODAY,
        }
        ok = sb_patch(post["id"], payload)
        if ok:
            print(f"  ✓ {result['title'][:55]}")
            success += 1
        else:
            print("  ✗ PATCH 실패")
            failed += 1

        # 레이트 리밋 여유
        if i < len(posts):
            time.sleep(1.5)

    # 3. 결과 요약
    print("\n" + "=" * 60)
    print(f"완료: {success}개 성공 / {failed}개 실패")
    print(f"last_auto_update = {TODAY} 로 업데이트됨")
    print("=" * 60)


if __name__ == "__main__":
    main()
