# PromptLab v3

PromptLab v3는 AI 프롬프트를 작성, 저장, 수정, 공개 관리하는 웹 서비스입니다.

초기 PromptLab은 프롬프트를 모아 보여주는 구조에 가까웠습니다. v3에서는 사용자가 직접 작성한 프롬프트를 관리하고, 저장 전 SafeCheck로 위험 요소를 확인하는 구조로 정리했습니다.

SafeCheck는 개인정보, 회사기밀, 계약 정보, 저작권 위험 표현 등을 룰 기반으로 점검합니다. 검사 원문은 리포트에 저장하지 않는 것을 원칙으로 합니다.

| 항목 | 내용 |
|---|---|
| 운영 주소 | https://promptlab.io.kr |
| GitHub 저장소 | https://github.com/PICTORY-droid/promptlab |
| 주요 기술 | Next.js, React, TypeScript, Supabase, Vercel |
| Android 패키지명 | `kr.io.promptlab.twa` |

---

## 프로젝트 목적

PromptLab v3는 프롬프트를 단순히 복사해서 쓰는 공간이 아니라, 직접 작성하고 관리하는 작업 공간을 목표로 합니다.

프롬프트를 많이 모아두는 것보다, 사용자가 작성한 프롬프트를 다시 찾고, 수정하고, 필요할 때 공개하거나 비공개로 관리할 수 있는 구조가 더 중요하다고 판단했습니다.

현재 프로젝트에서 다루는 범위는 다음과 같습니다.

- 프롬프트 작성과 수정
- 사용자별 프롬프트 관리
- 공개, 비공개, 초안 상태 구분
- 저장 전 SafeCheck 검사
- 검사 결과 리포트 관리
- PWA와 Android TWA 배포 준비

이 프로젝트는 수업에서 다룬 PRD, 사용자 흐름, 인증, CRUD, Supabase, 배포, 룰 기반 검사, AI 도구 활용 개발 과정을 실제 서비스 형태로 정리한 결과물입니다.

---

## 서비스 범위

PromptLab v3는 일반적인 AI 글쓰기 도구가 아닙니다.

사용자가 AI에게 입력할 프롬프트를 작성하고, 저장하고, 다시 활용할 수 있게 돕는 관리 도구에 가깝습니다.

현재 범위에 포함한 기능은 다음과 같습니다.

- 프롬프트 작성
- 프롬프트 수정
- 프롬프트 목록 관리
- 공개 여부 관리
- SafeCheck 검사
- 검사 결과 요약
- 로그인 기반 사용자 공간
- PWA, Android TWA 준비

현재 범위에서 제외한 기능은 다음과 같습니다.

- 유료 LLM API 필수 사용
- PDF, HWP, OCR 업로드
- 대용량 문서 분석
- 기업 SSO
- 네이티브 Android 앱 직접 개발
- 법률 검토 또는 보안 인증 보장

---

## 주요 기능

### 프롬프트 작성과 관리

사용자는 프롬프트를 구조화된 항목으로 작성할 수 있습니다.

관리 항목은 다음과 같습니다.

- 제목
- 카테고리
- 사용 목적
- 프롬프트 본문
- 예시 입력
- 예시 출력
- 안전 주의사항
- 공개 범위
- 상태

프롬프트를 단순 텍스트로만 저장하지 않고, 나중에 다시 확인하기 쉬운 형태로 관리하는 것을 기준으로 했습니다.

### SafeCheck

SafeCheck는 프롬프트 저장 전 위험 요소를 점검하는 기능입니다.

검사 대상은 다음과 같습니다.

- 개인정보
- 회사기밀
- 거래처 또는 계약 정보
- 저작권 위험 표현
- 허위, 과장 표현
- 민감정보 가능성

SafeCheck는 완전한 보안 제품이나 법률 검토 도구가 아닙니다.

프롬프트를 저장하거나 공개하기 전에 위험 요소를 한 번 더 확인하도록 돕는 사전 점검 기능입니다.

### 검사 리포트

SafeCheck 결과는 리포트 형태로 확인할 수 있도록 구성합니다.

리포트에는 다음 정보를 저장하는 방향을 기준으로 합니다.

- 위험 점수
- 검사 판정
- 탐지 카테고리
- 안전 문장 안내
- 정책 버전
- 탐지기 버전
- 검사 시각

검사 원문은 리포트에 저장하지 않는 것을 원칙으로 합니다.

---

## SafeCheck 정책

SafeCheck는 룰 기반으로 동작합니다.

외부 LLM에 원문을 보내 판정하는 방식이 아니라, 정해진 패턴과 키워드, 점수 기준으로 위험 요소를 확인합니다.

기본 원칙은 다음과 같습니다.

- 검사 원문을 리포트에 저장하지 않음
- 민감한 원문을 외부 LLM에 기본 전송하지 않음
- 핵심 판정은 룰 기반으로 처리
- 점수, 판정, 카테고리 같은 메타데이터 중심으로 저장
- 100% 탐지나 법적 보장을 주장하지 않음

판정 기준은 다음과 같습니다.

| 판정 | 설명 |
|---|---|
| `allow` | 위험도가 낮아 저장 가능 |
| `review` | 위험 요소가 있어 검토 필요 |
| `block` | 위험도가 높아 저장 또는 공개 제한 필요 |

---

## 프로젝트 구조

PromptLab v3는 화면, 기능 로직, 서버 로직을 분리하는 방향으로 구성합니다.

```text
app/
  라우트와 페이지 조립

app/**/_components/
  라우트별 UI 컴포넌트

shared/ui/
  재사용 UI 컴포넌트

features/
  기능별 도메인 로직

server/
  인증, DB, 보안, 서버 전용 코드

docs/
  기획, 구조, 배포, 마이그레이션 문서
```

개발 기준은 다음과 같습니다.

- page 파일은 화면 조립 중심으로 작성
- 라우트별 UI는 `_components`로 분리
- 공통 UI는 `shared/ui`로 분리
- 비즈니스 로직은 UI 컴포넌트에 직접 작성하지 않음
- Supabase, 인증, DB 접근은 화면 코드와 분리
- 서버 컴포넌트와 클라이언트 컴포넌트를 구분
- 클라이언트 컴포넌트는 브라우저 이벤트와 상태가 필요한 경우에만 사용

---

## 기술 스택

| 구분 | 기술 |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js App Router, Server Actions |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Validation | Zod |
| Test | Vitest |
| Deploy | Vercel |
| PWA | Web Manifest, Icons |
| Android 준비 | TWA, Bubblewrap |
| Version Control | Git, GitHub |

---

## Supabase와 데이터 처리

PromptLab v3는 Supabase를 사용해 인증과 데이터 저장 기능을 구성합니다.

주요 데이터 영역은 다음과 같습니다.

- 사용자 계정과 세션
- 프롬프트 데이터
- 프롬프트 상태와 공개 범위
- SafeCheck 검사 결과 메타데이터

데이터 처리 기준은 다음과 같습니다.

- 비밀번호를 직접 저장하지 않음
- Supabase 키를 소스 코드에 하드코딩하지 않음
- 환경변수로 설정값 관리
- service role key를 클라이언트나 공개 저장소에 노출하지 않음
- 사용자별 데이터는 서버 측 검사와 DB 정책으로 보호
- SafeCheck 검사 원문은 리포트에 저장하지 않음

---

## MCP-style Tool Adapter

PromptLab v3에는 MCP 개념을 반영한 내부 tool adapter 구조가 있습니다.

현재 외부 MCP 서버를 운영하는 구조는 아닙니다.

SafeCheck 실행을 UI와 분리하기 위해 tool-calling 방식의 내부 구조를 둔 것입니다.

도구 역할은 다음과 같습니다.

```text
scan_ai_input
```

이 도구는 프롬프트 텍스트를 받아 SafeCheck 검사 로직을 실행하고, 점수, 판정, 카테고리, 안내 문구 같은 구조화된 결과를 반환하는 역할을 합니다.

---

## PWA와 Android TWA 상태

PromptLab은 웹 서비스를 기준으로 운영합니다.

추후 Android 앱 형태로도 배포할 수 있도록 PWA와 TWA 준비를 진행했습니다.

현재 로컬에서 확인된 Android/TWA 상태는 다음과 같습니다.

| 항목 | 값 |
|---|---|
| Android 프로젝트 폴더 | `C:\Desktop\vibe\promptlab-android` |
| 패키지명 | `kr.io.promptlab.twa` |
| Host | `promptlab.io.kr` |
| Start URL | `/` |
| Web Manifest URL | `https://promptlab.io.kr/manifest.webmanifest` |
| 로컬 AAB 산출물 | `app-release-bundle.aab` |
| 로컬 APK 산출물 | `app-release-signed.apk` |
| Keystore alias | `android` |

현재 확인된 상태는 다음과 같습니다.

- Bubblewrap Android 프로젝트가 로컬에 생성됨
- AAB 빌드 산출물이 로컬에 존재함
- 다음 단계는 Play Console 내부 테스트 트랙 업로드
- Play Console 검증은 아직 완료로 보지 않음
- Digital Asset Links 설정은 Play Console의 앱 서명 인증서 SHA256 확인 후 진행 필요

`assetlinks.json`에 넣을 최종 SHA256 값은 로컬 keystore만 보고 확정하지 않습니다.

Google Play App Signing을 사용하는 경우 Play Console에서 제공하는 앱 서명 인증서 SHA256을 기준으로 확인해야 합니다.

---

## 로컬 실행 방법

의존성 설치:

```bash
npm install
```

개발 서버 실행:

```bash
npm run dev
```

로컬 접속 주소:

```text
http://localhost:3000
```

TypeScript 검사:

```bash
npx tsc --noEmit
```

테스트 실행:

```bash
npm test
```

프로덕션 빌드 확인:

```bash
npm run build
```

---

## 배포

PromptLab v3는 Vercel을 통해 배포합니다.

기본 배포 흐름은 다음과 같습니다.

```text
로컬 개발
→ TypeScript 검사
→ 테스트
→ production build
→ git commit
→ GitHub push
→ Vercel 자동 배포
```

운영 주소는 다음과 같습니다.

```text
https://promptlab.io.kr
```
---

## 수업 커리큘럼 반영

| 수업 내용 | PromptLab v3 반영 내용 |
|---|---|
| Vibe Coding | AI 도구를 활용해 기획, 구현, 수정, 배포를 반복하며 개발 |
| Prompt | 프롬프트 작성, 저장, 수정, 공개 관리 기능 구현 |
| Context | 프롬프트 사용 목적, 예시 입력, 예시 출력, 안전 주의사항을 구조화 |
| PRD | `docs/PRD.md`로 프로젝트 목적, 기능 범위, 제외 범위 정리 |
| 고객 정의 | 프롬프트를 작성하고 재사용하려는 사용자, 저장 전 위험 검토가 필요한 사용자를 대상으로 설정 |
| 유저 스토리 | 로그인 → 프롬프트 작성 → SafeCheck 검사 → 저장 → 목록 관리 흐름으로 설계 |
| LLM | MVP에서는 유료 LLM API를 필수로 사용하지 않고, 보안과 비용 문제를 고려해 룰 기반 검사 선택 |
| AI Agent | SafeCheck를 프롬프트 저장 전 보조 검사 모듈로 구성 |
| Context Engineering | 검사 원문을 저장하지 않고 점수, 판정, 카테고리 같은 필요한 메타데이터만 저장 |
| MCP | 외부 MCP 서버가 아니라 내부 MCP-style Tool Adapter로 `scan_ai_input` 구조 구현 |
| Rule | 개인정보, 회사기밀, 계약 정보, 저작권 위험, 과장 표현을 룰 기반으로 검사 |
| Task 분해 | `docs/TASKS.md` 기준으로 기능을 작은 단위로 나누어 구현 |
| Git | GitHub 저장소로 버전 관리 |
| 배포 | Vercel과 운영 도메인 `promptlab.io.kr`로 배포 |
| Database | Supabase PostgreSQL 사용 |
| CRUD | 프롬프트 작성, 조회, 수정, 상태 관리 기능 구성 |
| Authentication | Supabase Auth 기반 사용자 인증 구성 |
| BaaS | Supabase를 BaaS로 사용 |
| Firebase | 수업에서 비교 대상 또는 개념으로 다루었지만, 프로젝트 구현은 Supabase로 통일 |
| Supabase | 인증, DB, 사용자별 데이터 관리에 사용 |
| 바이브 디자인 | 공통 UI, 안내 카드, 반응형 화면, PWA 아이콘을 프로젝트 분위기에 맞게 구성 |
| 시각 에셋 | 앱 아이콘, manifest, TWA용 아이콘, 스토어 준비 에셋 구성 |
| 최종 프로젝트 | PromptLab v3를 최종 프로젝트로 정리 |
| 데모데이 | 로그인, 프롬프트 작성, SafeCheck 검사, 저장, 리포트 확인 흐름으로 시연 가능 |

---

## 관련 문서

| 문서 | 설명 |
|---|---|
| `docs/PRD.md` | 프로젝트 목표와 기능 범위 |
| `docs/ARCHITECTURE.md` | 전체 구조와 모듈 분리 기준 |
| `docs/TASKS.md` | 작업 분해와 구현 흐름 |
| `docs/MIGRATION.md` | 기존 PromptLab에서 v3로 전환한 기준 |
| `docs/SUPABASE_SCHEMA.md` | Supabase 테이블과 데이터 구조 |
| `docs/PLAY_STORE_DATA_SAFETY.md` | Google Play Data Safety 준비 문서 |
| `docs/TWA_BUBBLEWRAP_PREP.md` | TWA, Bubblewrap 기반 Android 준비 문서 |

---

## 진행 중인 작업

현재 기준으로 이어서 확인할 작업은 다음과 같습니다.

1. PromptLab v3 문서와 실제 코드 구조 정렬
2. 기존 프롬프트 공유형 구조의 레거시 정리
3. 컴포넌트 분리 기준 유지
4. SafeCheck 데이터 처리 경계 명확화
5. Play Console 내부 테스트 트랙에 AAB 업로드
6. Play App Signing SHA256 확인 후 `assetlinks.json` 반영
7. README와 문서 내용을 구현 상태 기준으로 유지

---

## 프로젝트 위치

PromptLab v3는 AI 프롬프트 관리 웹 서비스입니다.

AI SafeCheck는 별도 실험 프로젝트에서 시작했지만, 현재 방향에서는 PromptLab 내부의 저장 전 안전 검사 모듈로 다룹니다.

이 프로젝트는 완전한 보안 솔루션이나 법률 검토 도구를 목표로 하지 않습니다.

현재 기준은 사용자가 프롬프트를 저장하거나 공개하기 전에 위험 요소를 검토할 수 있게 돕는 룰 기반 검사 구조입니다.