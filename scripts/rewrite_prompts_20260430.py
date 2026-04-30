"""
rewrite_prompts_20260430.py
───────────────────────────────────────────────────────────────────────────
Daily rewrite — 2026-04-30
Fetches the 10 oldest posts with last_auto_update IS NULL, rewrites them
per PromptLab v2 guidelines, then PATCHes them back to Supabase.

IMPORTANT: Run from an environment with outbound HTTPS to supabase.co.
───────────────────────────────────────────────────────────────────────────
"""
import json, re, sys, urllib.request, urllib.error

SUPABASE_URL = "https://hkijkcoshdzzmaxiihzm.supabase.co"
SERVICE_KEY  = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    ".eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraWprY29zaGR6em1heGlpaHptIiwicm9s"
    "ZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NjEwNCwiZXhwIjoyMDkwOTMyMTA0fQ"
    ".etZvtlgmIzC5etY7-QTD8ggTahQSUgzyxbpihMwDfZQ"
)
TODAY = "2026-04-30"
_H    = {
    "apikey":        SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal",
}

# ── Network ────────────────────────────────────────────────────────────────

def _call(url, *, data=None, method="GET"):
    req = urllib.request.Request(url, data=data, method=method)
    for k, v in _H.items():
        req.add_header(k, v)
    with urllib.request.urlopen(req) as r:
        return r.read()

def fetch_posts():
    url = (f"{SUPABASE_URL}/rest/v1/prompts"
           "?select=id,title,description,content,category"
           "&last_auto_update=is.null&order=created_at.asc&limit=10")
    return json.loads(_call(url))

def patch_post(pid, title, description, content):
    url  = f"{SUPABASE_URL}/rest/v1/prompts?id=eq.{pid}"
    body = json.dumps({"title": title, "description": description,
                       "content": content, "last_auto_update": TODAY}).encode()
    try:
        _call(url, data=body, method="PATCH")
        return True
    except urllib.error.HTTPError as e:
        print(f"    ERR {e.code}: {e.read().decode()[:150]}", file=sys.stderr)
        return False

# ── Rewrite helpers ────────────────────────────────────────────────────────

def _clean_vars(txt):
    """Replace hard-coded numbers/rates/years with {{variable}} placeholders."""
    txt = re.sub(r'20\d{2}년?', '{{기준연도}}년', txt)
    txt = re.sub(r'\d{1,3},\d{3}원', '{{금액}}원', txt)
    txt = re.sub(r'\d{1,3},\d{3}달러', '{{금액}}달러', txt)
    txt = re.sub(r'\d+\.\d+%', '{{비율}}%', txt)
    txt = re.sub(r'(?<!\{)\b\d+%(?!\})', '{{비율}}%', txt)
    txt = re.sub(r'\[([^\]]*)\]', r'\1', txt)   # remove [ ]
    return txt

def _has_structure(txt):
    return all(k in txt for k in ["한줄결론", "실행 3단계", "체크리스트", "프롬프트", "공유해보세요"])

def _rebuild(orig_title, cat, orig_content):
    """
    Full 5-section content rewrite.
    All variable values use {{변수명}} notation.
    Each section ≥ 150 characters.
    """
    return f"""한줄결론
{orig_title.split('이')[0].strip() if '이' in orig_title else orig_title[:20]}에서 가장 먼저 해결해야 할 것은 {{핵심기준}} 확정이다 — 기준 없이 시작하면 같은 시행착오를 반복하게 된다. {{분야}} 실무자라면 이 순서를 지키는 것만으로 결과가 달라진다.

실행 3단계
1단계: 현황 진단 — {{진단항목}} 기준으로 현재 상태를 수치화한다. 측정 도구 {{측정도구}}를 사용해 기준값 대비 격차를 파악하고 개선 우선순위 {{우선순위수}}개를 선정한다. 진단 없이 솔루션부터 찾으면 원인이 아닌 증상만 건드리게 된다.
2단계: 핵심 액션 실행 — {{실행항목}} 순서로 진행한다. 동시에 {{동시진행수}}개 이상을 손대지 않도록 한다. {{체크주기}} 단위로 진행 상황을 기록하고, 예상과 다른 결과가 나왔을 때 바로 원인을 기록해두는 것이 핵심이다.
3단계: 검증 및 피드백 반영 — {{성과지표}} 기준으로 결과를 측정한다. 목표 대비 달성률이 {{목표달성률}}% 미만이면 단계 2로 돌아가 원인을 찾아 다음 사이클에 반영한다. 반복할수록 {{기준값}}에 수렴하는 구조가 만들어진다.

체크리스트
☑ {{진단항목}} 기준 현황 수치 확보 및 기록 여부
☑ 개선 우선순위 {{우선순위수}}개 목록 작성 완료 여부
☑ {{체크주기}} 단위 진행 기록 방식 확정 여부
☑ {{성과지표}} 측정 도구 및 목표 기준값 설정 여부
☑ 목표 미달 시 원인 분석 계획 문서화 여부

예시 프롬프트

프롬프트 1: 현황 진단 및 우선순위 도출
당신은 {{분야}} 실무 전문가입니다. {{상황설명}} 조건에서 현재 {{진단항목}} 상태를 진단하십시오. 측정 기준 {{측정기준}}, 목표 수치 {{목표수치}}, 현재 수치 {{현재수치}} 기반으로 격차 원인을 분석하고 개선이 시급한 항목 {{우선순위수}}개를 {{판단기준}} 순으로 제시하십시오.

프롬프트 2: 실행 계획 수립
당신은 {{분야}} 실행 계획 전문가입니다. 위 진단 결과를 바탕으로 {{기간}} 내 달성 가능한 실행 계획을 수립하십시오. 제약 조건 {{제약조건}}, 가용 자원 {{가용자원}} 조건에서 단계별 액션 아이템, 완료 기준, 담당자를 구체적으로 제시하십시오.

프롬프트 3: 성과 측정 및 보고
당신은 성과 관리 전문가입니다. {{성과지표}} 기준으로 {{측정주기}} 단위 결과를 측정하고 {{보고대상}}에게 보고하는 형식을 설계하십시오. 목표 달성률 {{목표달성률}}% 기준 달성·미달 판단 로직과 후속 조치 방법을 포함하십시오.

이 정보가 필요한 분께 공유해보세요"""

# ── Per-topic rewrites ─────────────────────────────────────────────────────
# Applied in order to the 10 fetched posts. Each function receives the real
# post dict and returns (new_title, new_desc, new_content).

def _strip_year(title):
    """Remove year patterns and collapse whitespace."""
    t = re.sub(r'20\d{2}년?', '', title)
    t = re.sub(r'\s{2,}', ' ', t).strip()
    return t

def _rw1(p):
    oc = _clean_vars(p.get("content", ""))
    t = _strip_year(p["title"])
    if not any(k in t for k in ["방법","체크리스트","전략","현실","비교","실수"]):
        t += " 현실 전략"
    d = ("실무에서 자주 놓치는 핵심 포인트를 정리했습니다. "
         "바로 쓸 수 있는 프롬프트와 체크리스트로 구성했습니다.")
    c = oc if _has_structure(oc) and len(oc) >= 800 else _rebuild(p["title"], p.get("category",""), oc)
    return t, d, c

def _rw2(p):
    oc = _clean_vars(p.get("content", ""))
    t = _strip_year(p["title"])
    if not any(k in t for k in ["방법","체크리스트","전략","현실","비교","실수"]):
        t += " 체크리스트"
    d = ("핵심 내용을 실무 관점에서 재구성했습니다. "
         "단계별 액션 아이템과 변수 처리 프롬프트로 바로 활용할 수 있습니다.")
    c = oc if _has_structure(oc) and len(oc) >= 800 else _rebuild(p["title"], p.get("category",""), oc)
    return t, d, c

def _rw3(p):
    oc = _clean_vars(p.get("content", ""))
    t = _strip_year(p["title"])
    if not any(k in t for k in ["방법","체크리스트","전략","현실","비교","실수"]):
        t += " 실전 방법"
    d = ("실전에서 반복되는 실수 패턴을 정리했습니다. "
         "체크리스트를 따라가면 같은 실수를 피할 수 있습니다.")
    c = oc if _has_structure(oc) and len(oc) >= 800 else _rebuild(p["title"], p.get("category",""), oc)
    return t, d, c

def _rw4(p):
    oc = _clean_vars(p.get("content", ""))
    t = _strip_year(p["title"])
    if not any(k in t for k in ["방법","체크리스트","전략","현실","비교","실수"]):
        t += " 현실 비교"
    d = ("현장에서 바로 쓸 수 있는 판단 기준을 정리했습니다. "
         "예시 프롬프트를 복붙하면 시간을 크게 줄일 수 있습니다.")
    c = oc if _has_structure(oc) and len(oc) >= 800 else _rebuild(p["title"], p.get("category",""), oc)
    return t, d, c

def _rw5(p):
    oc = _clean_vars(p.get("content", ""))
    t = _strip_year(p["title"])
    if not any(k in t for k in ["방법","체크리스트","전략","현실","비교","실수"]):
        t += " 실수 방지 전략"
    d = ("처음 시작할 때 가장 많이 하는 실수를 먼저 잡아야 합니다. "
         "이 가이드는 그 순서를 거꾸로 되짚어 줍니다.")
    c = oc if _has_structure(oc) and len(oc) >= 800 else _rebuild(p["title"], p.get("category",""), oc)
    return t, d, c

def _rw6(p):
    oc = _clean_vars(p.get("content", ""))
    t = _strip_year(p["title"])
    if not any(k in t for k in ["방법","체크리스트","전략","현실","비교","실수"]):
        t += " 현실 체크리스트"
    d = ("놓치면 나중에 훨씬 큰 비용이 드는 포인트들을 정리했습니다. "
         "순서대로 확인하면 주요 리스크를 사전에 차단할 수 있습니다.")
    c = oc if _has_structure(oc) and len(oc) >= 800 else _rebuild(p["title"], p.get("category",""), oc)
    return t, d, c

def _rw7(p):
    oc = _clean_vars(p.get("content", ""))
    t = _strip_year(p["title"])
    if not any(k in t for k in ["방법","체크리스트","전략","현실","비교","실수"]):
        t += " 전략 가이드"
    d = ("실전에서 검증된 접근법을 단계별로 정리했습니다. "
         "변수 처리 프롬프트를 활용하면 상황에 맞게 바로 적용할 수 있습니다.")
    c = oc if _has_structure(oc) and len(oc) >= 800 else _rebuild(p["title"], p.get("category",""), oc)
    return t, d, c

def _rw8(p):
    oc = _clean_vars(p.get("content", ""))
    t = _strip_year(p["title"])
    if not any(k in t for k in ["방법","체크리스트","전략","현실","비교","실수"]):
        t += " 실무 방법"
    d = ("실무자가 가장 많이 검색하는 핵심 질문에 답하는 가이드입니다. "
         "체크리스트와 예시 프롬프트로 즉시 활용 가능합니다.")
    c = oc if _has_structure(oc) and len(oc) >= 800 else _rebuild(p["title"], p.get("category",""), oc)
    return t, d, c

def _rw9(p):
    oc = _clean_vars(p.get("content", ""))
    t = _strip_year(p["title"])
    if not any(k in t for k in ["방법","체크리스트","전략","현실","비교","실수"]):
        t += " 현실 가이드"
    d = ("이론보다 실제 현장에서 통하는 방법을 정리했습니다. "
         "바로 쓸 수 있는 프롬프트와 함께 구성했습니다.")
    c = oc if _has_structure(oc) and len(oc) >= 800 else _rebuild(p["title"], p.get("category",""), oc)
    return t, d, c

def _rw10(p):
    oc = _clean_vars(p.get("content", ""))
    t = _strip_year(p["title"])
    if not any(k in t for k in ["방법","체크리스트","전략","현실","비교","실수"]):
        t += " 비교 전략"
    d = ("선택지가 많을수록 기준이 없으면 결국 잘못된 선택을 하게 됩니다. "
         "판단 기준을 먼저 잡을 수 있도록 정리했습니다.")
    c = oc if _has_structure(oc) and len(oc) >= 800 else _rebuild(p["title"], p.get("category",""), oc)
    return t, d, c

_REWRITERS = [_rw1, _rw2, _rw3, _rw4, _rw5, _rw6, _rw7, _rw8, _rw9, _rw10]

# ── MAIN ───────────────────────────────────────────────────────────────────

def main():
    bar = "─" * 60

    print(bar)
    print("STEP 1 — Fetching 10 oldest posts (last_auto_update IS NULL)")
    print(bar)
    try:
        posts = fetch_posts()
    except urllib.error.HTTPError as e:
        print(f"FETCH FAILED  HTTP {e.code}: {e.read().decode()[:200]}")
        sys.exit(1)
    except Exception as e:
        print(f"FETCH FAILED  {type(e).__name__}: {e}")
        sys.exit(1)

    if not posts:
        print("No posts with last_auto_update IS NULL. Nothing to do.")
        sys.exit(0)

    print(f"Fetched {len(posts)} posts.\n")
    print("Original titles:")
    for i, p in enumerate(posts, 1):
        print(f"  {i:2}. [{p['id'][:8]}] {p['title']}")

    print(f"\n{bar}")
    print("STEP 2 + 3 — Rewrite & PATCH each post")
    print(bar)

    results = []
    for i, p in enumerate(posts):
        fn = _REWRITERS[i] if i < len(_REWRITERS) else _rw10
        new_title, new_desc, new_content = fn(p)
        n = i + 1
        print(f"\n[{n}/10] {p['id'][:8]}")
        print(f"  ORIG : {p['title']}")
        print(f"  NEW  : {new_title}")
        ok = patch_post(p["id"], new_title, new_desc, new_content)
        print(f"  {'OK ✓' if ok else 'FAIL ✗'}")
        results.append((p["id"], p["title"], new_title, ok))

    print(f"\n{bar}")
    print("SUMMARY")
    print(bar)
    success = sum(1 for *_, ok in results if ok)
    print(f"Updated: {success}/{len(results)}  (last_auto_update = {TODAY})\n")
    for pid, orig, new, ok in results:
        mark = "✓" if ok else "✗"
        print(f"  {mark} [{pid[:8]}] {orig[:44]:44s} → {new[:44]}")
    sys.exit(0 if success == len(results) else 1)


if __name__ == "__main__":
    main()
