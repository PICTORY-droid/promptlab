# PromptLab v3 TASKS

## 1. 작업 기준

PromptLab v3는 기존 PromptLab의 로딩 이슈를 고치는 방식이 아니라, 새 구조로 재구축하는 방식으로 진행합니다.

기존 900여 개 프롬프트는 핵심 데이터로 유지하지 않습니다.

AI SafeCheck는 PromptLab 내부의 프롬프트 저장 전 안전 검사 모듈로 통합합니다.

모든 작업은 무료 플랜 기준으로 진행합니다.

사용 기준은 다음과 같습니다.

- GitHub Free
- Vercel Hobby
- Supabase Free
- 유료 LLM API 필수 의존 없음
- Supabase service_role key 사용 금지
- Vercel Pro 사용 금지
- Supabase Pro 사용 금지
- Log Drains 사용 금지
- 대용량 Storage 사용 금지

## 2. 완료된 작업

- [x] GitHub 저장소명 promptshare에서 promptlab으로 변경
- [x] 로컬 폴더명 promptshare에서 promptlab으로 변경
- [x] Vercel 프로젝트명 promptlab으로 변경
- [x] Supabase 프로젝트명 PromptLab Platform으로 변경
- [x] 운영 도메인 promptlab.io.kr 유지 확인
- [x] 가비아 DNS 수정 불필요 확인
- [x] 기존 Supabase 실험 테이블 ai_safecheck_company_policies 삭제
- [x] docs/PRD.md 작성
- [x] docs/ARCHITECTURE.md 작성

## 3. 전체 구현 순서

PromptLab v3 구현 순서는 다음과 같습니다.

1. 문서 기반 작업 계획 확정
2. 기존 코드 백업 및 삭제 범위 확정
3. 기본 폴더 구조 생성
4. shared/ui 공통 컴포넌트 구성
5. server/env 환경변수 검증 구조 생성
6. Supabase browser/server client 생성
7. Supabase Auth 로그인 구현
8. 보호 페이지 서버 세션 확인 구현
9. Supabase DB 테이블 생성
10. Prompt schema와 type 작성
11. Prompt CRUD 서버 로직 작성
12. Prompt 목록 화면 구현
13. Prompt 상세 화면 구현
14. Prompt 작성 화면 구현
15. AI SafeCheck 엔진 이식
16. 저장 전 SafeCheck 검사 연결
17. SafeCheck 리포트 메타데이터 저장
18. 관리자 정책 설정 구현
19. 테스트 환경 추가
20. README 재작성
21. Vercel 배포 확인
22. 데모데이 시나리오 작성

## 4. 1단계, 문서 기반 작업 계획 확정

목표는 구현 전 기준 문서를 고정하는 것입니다.

작업 항목은 다음과 같습니다.

- [x] PRD 작성
- [x] Architecture 작성
- [ ] TASKS 작성
- [ ] README 임시 상태 정리
- [ ] 수업 커리큘럼 반영 항목 확인
- [ ] 무료 플랜 유지 항목 확인

완료 기준은 다음과 같습니다.

- docs/PRD.md 존재
- docs/ARCHITECTURE.md 존재
- docs/TASKS.md 존재
- GitHub main 브랜치에 push 완료

## 5. 2단계, 기존 코드 정리 범위 확정

기존 로딩 이슈는 분석하지 않습니다.

기존 코드 중 살릴 것과 버릴 것을 나눕니다.

살릴 후보는 다음과 같습니다.

- package.json의 필수 의존성
- Tailwind 설정
- Supabase 연결에 필요한 환경변수 이름
- 도메인과 Vercel 배포 설정
- 일부 정적 에셋
- 사용할 수 있는 디자인 아이디어

버릴 후보는 다음과 같습니다.

- 무한로딩을 유발하는 기존 화면 구조
- 품질 낮은 기존 프롬프트 데이터
- 원인 추적이 어려운 클라이언트 로딩 코드
- 화면 안에 DB 접근이 섞인 코드
- 재사용이 어려운 복잡한 컴포넌트
- v3 구조와 맞지 않는 라우트

작업 항목은 다음과 같습니다.

- [ ] 현재 app 구조 목록 확인
- [ ] 현재 package.json 확인
- [ ] 현재 Supabase 관련 파일 확인
- [ ] 삭제할 라우트 목록 작성
- [ ] 유지할 설정 파일 목록 작성
- [ ] 기존 데이터 archive 또는 삭제 방침 확정

완료 기준은 다음과 같습니다.

- 기존 구조를 직접 고치지 않고 v3 기준으로 교체할 범위 확정
- 삭제 전 GitHub 최신 push 완료
- 작업 전 git status clean 확인

## 6. 3단계, 기본 폴더 구조 생성

목표 구조는 다음과 같습니다.

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
- docs
- public

작업 항목은 다음과 같습니다.

- [ ] app 기본 구조 생성
- [ ] features 기본 구조 생성
- [ ] shared 기본 구조 생성
- [ ] server 기본 구조 생성
- [ ] docs 유지
- [ ] 불필요한 기존 route 정리

완료 기준은 다음과 같습니다.

- 폴더 구조가 ARCHITECTURE.md와 일치
- TypeScript 에러 없음
- production build 성공

## 7. 4단계, shared/ui 공통 컴포넌트 구성

공통 UI는 재사용 가능한 작은 단위로 분리합니다.

생성할 컴포넌트는 다음과 같습니다.

- button.tsx
- card.tsx
- input.tsx
- textarea.tsx
- badge.tsx
- dialog.tsx
- spinner.tsx
- empty-state.tsx
- error-message.tsx

작업 항목은 다음과 같습니다.

- [ ] shared/ui/button.tsx 생성
- [ ] shared/ui/card.tsx 생성
- [ ] shared/ui/input.tsx 생성
- [ ] shared/ui/textarea.tsx 생성
- [ ] shared/ui/badge.tsx 생성
- [ ] shared/ui/dialog.tsx 생성
- [ ] shared/ui/spinner.tsx 생성
- [ ] shared/ui/empty-state.tsx 생성
- [ ] shared/ui/error-message.tsx 생성
- [ ] shared/lib/cn.ts 생성

완료 기준은 다음과 같습니다.

- 공통 버튼, 카드, 입력 컴포넌트 재사용 가능
- 화면 컴포넌트에서 중복 스타일 감소
- TypeScript 에러 없음
- build 성공

## 8. 5단계, 환경변수 검증 구조 생성

환경변수가 없을 때 무한로딩하지 않고 명확한 오류를 보여줘야 합니다.

필수 환경변수는 다음과 같습니다.

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

사용하지 않을 환경변수는 다음과 같습니다.

- SUPABASE_SERVICE_ROLE_KEY

작업 항목은 다음과 같습니다.

- [ ] server/env/env.ts 생성
- [ ] 환경변수 누락 시 명확한 에러 반환
- [ ] 클라이언트에 service_role key 노출 금지
- [ ] README에 환경변수 설명 추가 예정

완료 기준은 다음과 같습니다.

- 환경변수 누락 시 앱이 무한로딩하지 않음
- service_role key 사용 없음
- TypeScript 에러 없음

## 9. 6단계, Supabase client 생성

Supabase client는 브라우저용과 서버용을 분리합니다.

생성할 파일은 다음과 같습니다.

- server/db/supabase-browser.ts
- server/db/supabase-server.ts

작업 항목은 다음과 같습니다.

- [ ] @supabase/supabase-js 설치 확인
- [ ] @supabase/ssr 설치 확인
- [ ] supabase-browser.ts 작성
- [ ] supabase-server.ts 작성
- [ ] 쿠키 기반 서버 client 구성
- [ ] 환경변수 검증 연결

완료 기준은 다음과 같습니다.

- 브라우저 client와 서버 client 분리
- 서버 컴포넌트에서 세션 확인 가능
- TypeScript 에러 없음
- build 성공

## 10. 7단계, Supabase Auth 로그인 구현

Auth는 PromptLab 기준으로 구현합니다.

생성할 파일은 다음과 같습니다.

- app/login/page.tsx
- app/login/_components/LoginForm.client.tsx
- app/auth/callback/route.ts

작업 항목은 다음과 같습니다.

- [ ] login 페이지 생성
- [ ] LoginForm.client.tsx 생성
- [ ] 이메일 로그인 구현
- [ ] auth callback route 생성
- [ ] 로그인 성공 후 dashboard 이동
- [ ] 로그인 실패 시 오류 메시지 표시
- [ ] 무한로딩 방지 처리

완료 기준은 다음과 같습니다.

- /login 공개 접근 가능
- /auth/callback 공개 접근 가능
- 로그인 성공 후 /dashboard 이동
- 로그인 실패 시 오류 표시
- client useEffect redirect 반복 없음

## 11. 8단계, 보호 페이지 서버 세션 확인 구현

middleware 전체 보호 방식은 사용하지 않습니다.

보호 대상은 다음과 같습니다.

- /dashboard
- /write
- /admin
- /reports

작업 항목은 다음과 같습니다.

- [ ] server/auth/get-current-user.ts 생성
- [ ] dashboard page에서 서버 세션 확인
- [ ] write page에서 서버 세션 확인
- [ ] admin page에서 서버 세션 확인
- [ ] reports page에서 서버 세션 확인
- [ ] 세션 없으면 /login으로 1회 redirect

완료 기준은 다음과 같습니다.

- 로그인 안 된 사용자는 보호 페이지 접근 불가
- 로그인된 사용자는 보호 페이지 접근 가능
- /login과 /auth/callback은 보호하지 않음
- 무한 리다이렉트 없음

## 12. 9단계, Supabase DB 테이블 생성

초기 테이블은 다음과 같습니다.

- promptlab_profiles
- promptlab_categories
- promptlab_prompts
- promptlab_safecheck_policies
- promptlab_safecheck_reports

작업 항목은 다음과 같습니다.

- [ ] SQL 작성
- [ ] promptlab_profiles 생성
- [ ] promptlab_categories 생성
- [ ] promptlab_prompts 생성
- [ ] promptlab_safecheck_policies 생성
- [ ] promptlab_safecheck_reports 생성
- [ ] RLS 활성화
- [ ] 사용자별 접근 정책 생성
- [ ] 공개 프롬프트 조회 정책 생성

완료 기준은 다음과 같습니다.

- Supabase Table Editor에서 테이블 확인
- RLS 활성화 확인
- 사용자는 자기 데이터만 수정 가능
- 공개 프롬프트는 조회 가능

## 13. 10단계, Prompt schema와 type 작성

생성할 파일은 다음과 같습니다.

- features/prompts/schemas/prompt.schema.ts
- features/prompts/types/prompt.types.ts
- features/prompts/constants/prompt-status.ts
- features/prompts/constants/prompt-visibility.ts

작업 항목은 다음과 같습니다.

- [ ] prompt create schema 작성
- [ ] prompt update schema 작성
- [ ] prompt response type 작성
- [ ] visibility type 작성
- [ ] status type 작성
- [ ] 입력값 검증 강화

완료 기준은 다음과 같습니다.

- 프롬프트 입력값이 Zod로 검증됨
- 타입과 schema 분리
- TypeScript 에러 없음

## 14. 11단계, Prompt CRUD 서버 로직 작성

생성할 파일은 다음과 같습니다.

- features/prompts/server/get-prompts.ts
- features/prompts/server/get-prompt.ts
- features/prompts/server/create-prompt.ts
- features/prompts/server/update-prompt.ts
- features/prompts/server/delete-prompt.ts

작업 항목은 다음과 같습니다.

- [ ] 공개 프롬프트 목록 조회
- [ ] 내 프롬프트 목록 조회
- [ ] 프롬프트 상세 조회
- [ ] 프롬프트 생성
- [ ] 프롬프트 수정
- [ ] 프롬프트 삭제 또는 archived 처리
- [ ] 소유자 검증
- [ ] 입력값 검증

완료 기준은 다음과 같습니다.

- Create 동작
- Read 동작
- Update 동작
- Delete 또는 archive 동작
- 화면 코드에 Supabase 쿼리 직접 작성 없음

## 15. 12단계, Prompt 목록 화면 구현

생성할 컴포넌트는 다음과 같습니다.

- PromptList.tsx
- PromptCard.tsx
- PromptFilters.client.tsx
- PromptSearch.client.tsx
- PromptCategoryTabs.client.tsx

작업 항목은 다음과 같습니다.

- [ ] /prompts page 생성
- [ ] 공개 프롬프트 목록 조회
- [ ] 프롬프트 카드 표시
- [ ] 카테고리 필터 표시
- [ ] 검색 UI 표시
- [ ] 빈 목록 상태 표시
- [ ] 오류 상태 표시

완료 기준은 다음과 같습니다.

- /prompts 접근 가능
- 프롬프트 목록 렌더링
- 컴포넌트 분리 완료
- build 성공

## 16. 13단계, Prompt 상세 화면 구현

생성할 컴포넌트는 다음과 같습니다.

- PromptDetail.tsx
- PromptMeta.tsx
- PromptSafeCheckSummary.tsx

작업 항목은 다음과 같습니다.

- [ ] /prompts/[id] page 생성
- [ ] 프롬프트 상세 조회
- [ ] 제목 표시
- [ ] 카테고리 표시
- [ ] 프롬프트 본문 표시
- [ ] 사용 예시 표시
- [ ] 안전 주의사항 표시
- [ ] SafeCheck 요약 표시

완료 기준은 다음과 같습니다.

- 상세 페이지 접근 가능
- 존재하지 않는 프롬프트 처리
- 공개 여부 정책 반영

## 17. 14단계, Prompt 작성 화면 구현

생성할 컴포넌트는 다음과 같습니다.

- PromptEditor.client.tsx
- PromptForm.client.tsx
- PromptMetadataForm.client.tsx
- SafeCheckPanel.tsx
- SavePromptButton.client.tsx

작업 항목은 다음과 같습니다.

- [ ] /write page 생성
- [ ] 로그인 사용자만 접근 가능
- [ ] 제목 입력
- [ ] 카테고리 선택
- [ ] 사용 목적 입력
- [ ] 프롬프트 본문 입력
- [ ] 변수 입력
- [ ] 예시 입력
- [ ] 예시 출력 입력
- [ ] 안전 주의사항 입력
- [ ] 저장 버튼 구현

완료 기준은 다음과 같습니다.

- 작성 화면 표시
- 입력 상태 관리
- 컴포넌트 분리
- 저장 전 SafeCheck 연결 준비

## 18. 15단계, AI SafeCheck 엔진 이식

AI SafeCheck 프로젝트에서 검증된 rule 기반 검사 엔진을 이식합니다.

이식할 영역은 다음과 같습니다.

- features/safecheck/constants
- features/safecheck/schemas
- features/safecheck/types
- features/safecheck/server/detectors
- features/safecheck/server/scan-text.ts
- features/safecheck/server/build-safe-prompt.ts
- features/safecheck/server/calculate-risk-score.ts
- features/safecheck/server/decide-risk-level.ts
- features/safecheck/server/merge-risk-findings.ts
- features/safecheck/server/normalize-input.ts

작업 항목은 다음과 같습니다.

- [ ] risk policy 이식
- [ ] risk patterns 이식
- [ ] thresholds 이식
- [ ] detector 이식
- [ ] score 계산 이식
- [ ] safe prompt 생성 이식
- [ ] scanText 이식
- [ ] PromptLab 타입에 맞게 경로 정리
- [ ] 기존 AI SafeCheck 결과와 동일한지 확인

완료 기준은 다음과 같습니다.

- SafeCheck 엔진 단독 실행 가능
- LLM 없이 rule 기반 판정 가능
- 검사 원문 저장하지 않음
- TypeScript 에러 없음

## 19. 16단계, SafeCheck UI 구현

생성할 컴포넌트는 다음과 같습니다.

- SafeCheckShell.tsx
- SafeCheckGuideCard.tsx
- SafeCheckInput.client.tsx
- SafeCheckResult.tsx
- RiskDecisionBanner.tsx
- RiskScoreCard.tsx
- RiskEvidenceList.tsx
- SafePromptPreview.tsx
- ConsistencyMeta.tsx

작업 항목은 다음과 같습니다.

- [ ] /safecheck page 생성
- [ ] 검사 입력 UI 구현
- [ ] 위험 점수 표시
- [ ] 최종 판정 표시
- [ ] 탐지 근거 표시
- [ ] 안전 문장 표시
- [ ] 정책 메타데이터 표시
- [ ] 사용 방법 안내 표시

완료 기준은 다음과 같습니다.

- PromptLab 내부에서 SafeCheck 단독 사용 가능
- AI SafeCheck 독립 MVP 기능 재현
- 컴포넌트 분리 완료

## 20. 17단계, 저장 전 SafeCheck 연결

프롬프트 저장 전 SafeCheck를 실행합니다.

작업 항목은 다음과 같습니다.

- [ ] /write의 SafeCheckPanel 연결
- [ ] 프롬프트 본문 검사
- [ ] 위험 항목 표시
- [ ] 안전 문장 제안
- [ ] 위험 점수 표시
- [ ] 저장 가능 여부 표시
- [ ] 안전 문장으로 교체 기능 구현

완료 기준은 다음과 같습니다.

- 저장 전 검사 가능
- 위험 프롬프트는 바로 저장하지 않도록 경고
- 사용자가 안전 문장으로 수정 가능
- 검사 원문 민감정보 저장 없음

## 21. 18단계, Report 메타데이터 저장

검사 리포트는 원문이 아니라 메타데이터 중심으로 저장합니다.

생성할 파일은 다음과 같습니다.

- features/reports/schemas/report.schema.ts
- features/reports/types/report.types.ts
- features/reports/server/create-report.ts
- features/reports/server/get-reports.ts

작업 항목은 다음과 같습니다.

- [ ] report schema 작성
- [ ] report type 작성
- [ ] create-report 구현
- [ ] get-reports 구현
- [ ] prompt_id 연결
- [ ] user_id 연결
- [ ] 원문 저장 금지 처리

완료 기준은 다음과 같습니다.

- score 저장
- level 저장
- risk_categories 저장
- safe_prompt 저장
- policy_version 저장
- detector_version 저장
- 민감 원문 저장 없음

## 22. 19단계, Admin 정책 설정 구현

생성할 컴포넌트는 다음과 같습니다.

- AdminShell.tsx
- PolicyForm.client.tsx
- KeywordTable.tsx
- AddKeywordDialog.client.tsx

생성할 서버 로직은 다음과 같습니다.

- features/policy/server/get-policy.ts
- features/policy/server/save-policy.ts

작업 항목은 다음과 같습니다.

- [ ] /admin page 생성
- [ ] 로그인 사용자만 접근 가능
- [ ] 정책 조회
- [ ] 정책 저장
- [ ] 금지어 추가
- [ ] 금지어 삭제
- [ ] 원문 저장 금지 설정
- [ ] LLM rewrite 사용 여부 설정

완료 기준은 다음과 같습니다.

- 사용자별 정책 저장 가능
- 사용자별 정책 조회 가능
- 금지어 관리 가능
- RLS로 자기 정책만 접근 가능

## 23. 20단계, 테스트 환경 추가

현재 기존 PromptLab에는 npm test script가 없습니다.

v3 재구축 과정에서 Vitest 기반 테스트를 추가합니다.

작업 항목은 다음과 같습니다.

- [ ] Vitest 설치 확인
- [ ] test script 추가
- [ ] safecheck detector test 작성
- [ ] risk score test 작성
- [ ] scan-text regression test 작성
- [ ] prompt schema test 작성
- [ ] prompt CRUD test 작성
- [ ] policy schema test 작성
- [ ] auth guard test 작성

완료 기준은 다음과 같습니다.

- npm test 실행 가능
- 핵심 로직 테스트 통과
- regression test 작성
- build 전 검증 루틴 확립

## 24. 21단계, README 재작성

README는 수업 제출용으로 다시 작성합니다.

포함할 내용은 다음과 같습니다.

- 프로젝트 소개
- 배포 링크
- 고객 정의
- 문제 정의
- 주요 기능
- 수업 커리큘럼 반영표
- 기술 스택
- 프로젝트 구조
- 컴포넌트 분리 기준
- Supabase Auth/CRUD 설명
- AI SafeCheck 통합 설명
- 보안 설계 원칙
- 무료 플랜 운영 원칙
- 실행 방법
- 테스트 방법
- 현재 한계
- 향후 개선 계획
- 데모 시나리오

작업 항목은 다음과 같습니다.

- [ ] 기존 README 백업 또는 교체
- [ ] PromptLab v3 설명 작성
- [ ] 수업 커리큘럼 반영표 작성
- [ ] Supabase Auth/CRUD 반영
- [ ] AI SafeCheck 통합 반영
- [ ] 무료 플랜 원칙 반영
- [ ] 테스트 상태 반영

완료 기준은 다음과 같습니다.

- GitHub 첫 화면에서 프로젝트 이해 가능
- 수업 제출용 설명 충분
- 실제 구현 범위와 한계가 정확함

## 25. 22단계, 데모데이 준비

데모 흐름은 다음과 같습니다.

1. PromptLab v3 소개
2. 문제 정의 설명
3. 로그인
4. 프롬프트 작성
5. AI SafeCheck 검사
6. 위험 항목 확인
7. 안전 문장 제안
8. 수정 후 저장
9. 내 프롬프트 목록 조회
10. Supabase Auth/CRUD 설명
11. 컴포넌트 분리 구조 설명
12. 테스트와 배포 설명

작업 항목은 다음과 같습니다.

- [ ] 데모용 사용자 계정 준비
- [ ] 데모용 고품질 프롬프트 준비
- [ ] 위험 프롬프트 예시 준비
- [ ] 안전 문장 변환 예시 준비
- [ ] 발표 흐름 정리
- [ ] README와 데모 내용 일치 확인

완료 기준은 다음과 같습니다.

- 발표 시나리오 5분 이내 설명 가능
- 실제 웹에서 시연 가능
- 수업 커리큘럼 반영 설명 가능

## 26. 매 단계 공통 검증

각 단계가 끝나면 아래를 확인합니다.

    npx tsc --noEmit
    npm run build
    git status --short

v3 테스트 환경 추가 후에는 아래도 포함합니다.

    npm test

검증 기준은 다음과 같습니다.

- TypeScript 에러 없음
- build 성공
- 의도하지 않은 파일 변경 없음
- 요청한 파일 외 임의 수정 없음
- 커밋 단위 명확함

## 27. 커밋 규칙

커밋 메시지 예시는 다음과 같습니다.

- docs: add promptlab v3 tasks
- chore: scaffold promptlab v3 folders
- feat: add supabase auth
- feat: add prompt crud
- feat: integrate safecheck engine
- feat: add prompt safecheck flow
- test: add safecheck regression tests
- docs: update promptlab readme

## 28. 현재 다음 작업

현재 다음 작업은 다음과 같습니다.

1. docs/TASKS.md 저장
2. TypeScript와 build 확인
3. docs/TASKS.md 커밋
4. PromptLab v3 기본 폴더 구조 생성 시작

지금은 아직 기존 코드를 삭제하지 않습니다.

다음 단계에서 먼저 폴더 구조를 생성하고, 이후 기존 라우트 정리 범위를 확정합니다.