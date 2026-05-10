# PromptLab v3 Migration Plan

## 1. 마이그레이션 목표

PromptLab v3는 기존 PromptLab의 로딩 이슈를 고치는 방식이 아니라, 기존 브랜드와 도메인을 유지한 상태에서 구조를 새로 만드는 방식으로 진행합니다.

기존 로딩 이슈는 더 이상 분석하지 않습니다.

기존 900여 개 프롬프트는 전문성이 낮고 초보적인 내용이 많으므로 핵심 데이터로 유지하지 않습니다.

AI SafeCheck는 PromptLab 내부의 프롬프트 저장 전 안전 검사 모듈로 통합합니다.

## 2. 현재 프로젝트 상태

현재 로컬 경로는 다음과 같습니다.

C:\Desktop\vibe\promptlab

현재 GitHub 저장소는 다음과 같습니다.

https://github.com/PICTORY-droid/promptlab

현재 운영 도메인은 다음과 같습니다.

https://promptlab.io.kr

현재 Vercel 프로젝트명은 다음과 같습니다.

promptlab

현재 Supabase 프로젝트 표시명은 다음과 같습니다.

PromptLab Platform

## 3. 현재 app 구조 확인 결과

현재 app 폴더에는 아래와 같은 기존 파일과 라우트가 있습니다.

- app/HomeClient.tsx
- app/api/persona/route.ts
- app/api/prompts/route.ts
- app/api/rss/route.ts
- app/auth/callback/page.tsx
- app/bigbang/page.tsx
- app/components/
- app/create/page.tsx
- app/my-collection/
- app/my-personas/
- app/persona/
- app/prompts/[id]/
- app/sitemap.ts
- app/layout.tsx
- app/page.tsx
- app/globals.css
- app/lib/supabase.ts

또한 여러 백업 파일이 남아 있습니다.

- .backup
- .backup-loading-condition
- .backup-pagination
- .backup-padding-fix
- .backup-before-cache-fix
- .backup-loading-fix
- .backup-slug-fix
- .backup-useparams-fix

이 백업 파일들은 기존 로딩 이슈와 반복 수정 흔적이므로 v3에서는 유지하지 않습니다.

## 4. 유지할 파일

아래 파일은 우선 유지 후보입니다.

- package.json
- package-lock.json
- tsconfig.json
- next.config.ts 또는 next.config.js
- postcss.config.mjs
- eslint.config.mjs
- app/globals.css
- app/layout.tsx
- app/page.tsx
- app/favicon.ico
- app/sitemap.ts
- public/
- docs/

단, app/layout.tsx와 app/page.tsx는 v3 구조에 맞게 나중에 교체할 수 있습니다.

app/lib/supabase.ts는 장기적으로 유지하지 않고 아래 구조로 대체합니다.

- server/db/supabase-browser.ts
- server/db/supabase-server.ts

## 5. 삭제 또는 대체할 파일

아래 파일과 폴더는 v3 구조에서 삭제하거나 대체합니다.

- app/HomeClient.tsx
- app/api/persona/route.ts
- app/api/prompts/route.ts
- app/api/rss/route.ts
- app/auth/callback/page.tsx
- app/bigbang/page.tsx
- app/components/
- app/create/page.tsx
- app/my-collection/
- app/my-personas/
- app/persona/
- app/prompts/[id]/

아래 백업 파일은 삭제 대상입니다.

- app/my-collection/client.tsx.backup
- app/my-collection/client.tsx.backup-loading-condition
- app/my-collection/client.tsx.backup-pagination
- app/my-collection/client.tsx.backup2
- app/my-personas/page.tsx.backup-padding-fix
- app/persona/[slug]/page.tsx.backup-before-cache-fix
- app/persona/[slug]/page.tsx.backup-loading-fix
- app/persona/[slug]/page.tsx.backup-slug-fix
- app/persona/[slug]/page.tsx.backup-useparams-fix
- app/prompts/[id]/page.tsx.backup

## 6. v3에서 새로 만들 구조

v3에서는 아래 구조를 기준으로 다시 만듭니다.

- app/_components
- app/login
- app/auth/callback
- app/(marketing)
- app/(app)/prompts
- app/(app)/prompts/[id]
- app/(app)/write
- app/(app)/dashboard
- app/(app)/safecheck
- app/(app)/admin
- app/(app)/reports
- app/api/prompts
- app/api/safecheck
- app/api/reports
- features/prompts
- features/safecheck
- features/policy
- features/reports
- features/auth
- shared/ui
- shared/lib
- server/db
- server/auth
- server/security
- server/env

## 7. 기존 데이터 처리 방침

기존 900여 개 프롬프트는 핵심 데이터로 유지하지 않습니다.

처리 방침은 다음 중 하나입니다.

1. archive 테이블 또는 백업 파일로 보관
2. 삭제
3. 일부만 선별 후 재작성

v3에서는 처음부터 30~50개의 고품질 프롬프트만 사용합니다.

고품질 프롬프트 기준은 다음과 같습니다.

- 제목
- 카테고리
- 사용 목적
- 프롬프트 본문
- 입력 변수
- 예시 입력
- 예시 출력
- 안전 주의사항
- 추천 사용 상황

## 8. Supabase 마이그레이션 방침

Supabase 프로젝트명은 PromptLab Platform으로 통일했습니다.

v3에서 사용할 테이블은 다음과 같습니다.

- promptlab_profiles
- promptlab_categories
- promptlab_prompts
- promptlab_safecheck_policies
- promptlab_safecheck_reports

기존 공수잡 또는 과거 실험용 테이블과 섞지 않습니다.

AI SafeCheck 실험용으로 만들었던 아래 테이블은 이미 삭제했습니다.

- ai_safecheck_company_policies

## 9. Auth 마이그레이션 방침

기존 auth/callback 구조는 v3에서 다시 작성합니다.

기존 파일은 다음 파일로 대체합니다.

기존:

- app/auth/callback/page.tsx

v3:

- app/auth/callback/route.ts
- app/login/page.tsx
- app/login/_components/LoginForm.client.tsx
- server/auth/get-current-user.ts

무한로딩 방지를 위해 아래 원칙을 지킵니다.

- middleware 전체 보호 금지
- /login 공개
- /auth/callback 공개
- 보호 페이지는 서버에서 세션 확인
- 세션 없으면 /login으로 1회 redirect
- client useEffect redirect 반복 금지
- 환경변수 없으면 설정 오류 표시

## 10. AI SafeCheck 통합 방침

AI SafeCheck는 독립 서비스가 아니라 PromptLab 내부 모듈로 통합합니다.

이식할 핵심 로직은 다음과 같습니다.

- risk-policy
- risk-patterns
- risk-thresholds
- policy-version
- detectors
- normalize-input
- merge-risk-findings
- calculate-risk-score
- decide-risk-level
- build-safe-prompt
- scan-text
- tests

통합 위치는 다음과 같습니다.

- features/safecheck/constants
- features/safecheck/schemas
- features/safecheck/types
- features/safecheck/server
- features/safecheck/server/detectors
- features/safecheck/tests

## 11. 삭제 전 안전 규칙

기존 파일을 삭제하기 전에 아래를 확인합니다.

- git status --short 결과 확인
- GitHub main 최신 push 확인
- 삭제 대상 목록 재확인
- package.json과 환경변수 파일은 삭제하지 않음
- public 폴더는 삭제하지 않음
- docs 폴더는 삭제하지 않음
- .env.local, .env.production.local은 Git에 올리지 않음
- service_role key 사용 금지

## 12. 마이그레이션 순서

마이그레이션은 아래 순서로 진행합니다.

1. docs/MIGRATION.md 작성
2. 현재 app 구조 유지, 삭제, 대체 분류
3. 백업 파일 삭제
4. v3 기본 폴더 생성
5. shared/ui 생성
6. server/env 생성
7. server/db Supabase client 생성
8. Auth 구조 생성
9. Prompt CRUD 구조 생성
10. AI SafeCheck 엔진 이식
11. 기존 라우트 대체
12. README 재작성
13. 테스트 추가
14. build 확인
15. Vercel 배포 확인

## 13. 현재 결정 사항

기존 로딩 이슈는 분석하지 않습니다.

기존 900여 개 프롬프트는 핵심 데이터로 유지하지 않습니다.

기존 app 구조는 v3 기준으로 대체합니다.

PromptLab을 메인 브랜드로 유지합니다.

AI SafeCheck는 PromptLab 내부 안전 검사 모듈로 통합합니다.

Supabase Auth와 CRUD를 실제 구현합니다.

모든 작업은 무료 플랜 기준으로 진행합니다.