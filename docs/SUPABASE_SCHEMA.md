# PromptLab v3 Supabase Schema

## 1. 목적

이 문서는 PromptLab v3에서 사용할 Supabase Database 구조를 정리합니다.

PromptLab v3는 Supabase Free 플랜 기준으로 구현합니다.

사용 기능은 다음과 같습니다.

- Supabase Auth
- PostgreSQL Database
- CRUD
- Row Level Security
- 사용자별 데이터 분리

사용하지 않는 기능은 다음과 같습니다.

- Supabase Pro
- service_role key
- 대용량 Storage
- Edge Functions 필수 의존
- Log Drains
- 유료 LLM API 필수 의존

## 2. 테이블 목록

PromptLab v3에서 사용할 초기 테이블은 다음과 같습니다.

- promptlab_profiles
- promptlab_categories
- promptlab_prompts
- promptlab_safecheck_policies
- promptlab_safecheck_reports

## 3. 저장하지 않는 데이터

PromptLab v3는 AI SafeCheck 검사 원문 속 민감정보를 저장하지 않습니다.

저장하지 않을 데이터는 다음과 같습니다.

- 고객명 원문
- 전화번호 원문
- 이메일 원문
- 진료기록 원문
- 상담기록 원문
- 회사기밀 원문
- 계약정보 원문
- 기타 민감정보 원문

AI SafeCheck 리포트에는 점수, 판정, 위험 카테고리, 안전 문장, 정책 버전, 탐지기 버전 같은 메타데이터만 저장합니다.

## 4. SQL 실행 전 주의사항

Supabase SQL Editor에서 실행합니다.

기존 공수잡 또는 다른 프로젝트 테이블과 섞이지 않도록 모든 테이블 이름은 `promptlab_` prefix를 사용합니다.

아래 SQL은 기존 테이블이 있으면 삭제하지 않습니다.

이미 존재하는 테이블은 `create table if not exists`로 건너뜁니다.

실행 전 Supabase 프로젝트명이 `PromptLab Platform`인지 확인합니다.

## 5. Table 생성 SQL

```sql
create extension if not exists "pgcrypto";

create table if not exists public.promptlab_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promptlab_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promptlab_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.promptlab_categories(id) on delete set null,
  title text not null,
  use_case text,
  prompt_body text not null,
  variables jsonb not null default '[]'::jsonb,
  example_input text,
  example_output text,
  safety_notes text,
  visibility text not null default 'private',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promptlab_prompts_visibility_check check (visibility in ('private', 'public')),
  constraint promptlab_prompts_status_check check (status in ('draft', 'published', 'archived'))
);

create table if not exists public.promptlab_safecheck_policies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  policy_name text not null default '기본 보안 정책',
  sensitive_keywords text[] not null default '{}',
  block_original_storage boolean not null default true,
  enable_llm_rewrite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promptlab_safecheck_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt_id uuid references public.promptlab_prompts(id) on delete set null,
  score integer not null default 0,
  level text not null,
  risk_categories text[] not null default '{}',
  safe_prompt text,
  policy_version text not null default 'promptlab-v3-initial',
  detector_version text not null default 'safecheck-v1-initial',
  created_at timestamptz not null default now(),
  constraint promptlab_safecheck_reports_level_check check (level in ('allow', 'review', 'block'))
);

```

## 6. updated_at 자동 갱신 함수

```sql
create or replace function public.promptlab_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists promptlab_profiles_set_updated_at on public.promptlab_profiles;
create trigger promptlab_profiles_set_updated_at
before update on public.promptlab_profiles
for each row
execute function public.promptlab_set_updated_at();

drop trigger if exists promptlab_categories_set_updated_at on public.promptlab_categories;
create trigger promptlab_categories_set_updated_at
before update on public.promptlab_categories
for each row
execute function public.promptlab_set_updated_at();

drop trigger if exists promptlab_prompts_set_updated_at on public.promptlab_prompts;
create trigger promptlab_prompts_set_updated_at
before update on public.promptlab_prompts
for each row
execute function public.promptlab_set_updated_at();

drop trigger if exists promptlab_safecheck_policies_set_updated_at on public.promptlab_safecheck_policies;
create trigger promptlab_safecheck_policies_set_updated_at
before update on public.promptlab_safecheck_policies
for each row
execute function public.promptlab_set_updated_at();
```

## 7. RLS 활성화

```sql
alter table public.promptlab_profiles enable row level security;
alter table public.promptlab_categories enable row level security;
alter table public.promptlab_prompts enable row level security;
alter table public.promptlab_safecheck_policies enable row level security;
alter table public.promptlab_safecheck_reports enable row level security;
```

## 8. RLS 정책

```sql
drop policy if exists "promptlab_profiles_select_own" on public.promptlab_profiles;
drop policy if exists "promptlab_profiles_insert_own" on public.promptlab_profiles;
drop policy if exists "promptlab_profiles_update_own" on public.promptlab_profiles;

create policy "promptlab_profiles_select_own"
on public.promptlab_profiles
for select
to authenticated
using (auth.uid() = user_id);

create policy "promptlab_profiles_insert_own"
on public.promptlab_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "promptlab_profiles_update_own"
on public.promptlab_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


drop policy if exists "promptlab_categories_select_all" on public.promptlab_categories;

create policy "promptlab_categories_select_all"
on public.promptlab_categories
for select
to anon, authenticated
using (true);


drop policy if exists "promptlab_prompts_select_public" on public.promptlab_prompts;
drop policy if exists "promptlab_prompts_select_own" on public.promptlab_prompts;
drop policy if exists "promptlab_prompts_insert_own" on public.promptlab_prompts;
drop policy if exists "promptlab_prompts_update_own" on public.promptlab_prompts;
drop policy if exists "promptlab_prompts_delete_own" on public.promptlab_prompts;

create policy "promptlab_prompts_select_public"
on public.promptlab_prompts
for select
to anon, authenticated
using (visibility = 'public' and status = 'published');

create policy "promptlab_prompts_select_own"
on public.promptlab_prompts
for select
to authenticated
using (auth.uid() = user_id);

create policy "promptlab_prompts_insert_own"
on public.promptlab_prompts
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "promptlab_prompts_update_own"
on public.promptlab_prompts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "promptlab_prompts_delete_own"
on public.promptlab_prompts
for delete
to authenticated
using (auth.uid() = user_id);


drop policy if exists "promptlab_safecheck_policies_select_own" on public.promptlab_safecheck_policies;
drop policy if exists "promptlab_safecheck_policies_insert_own" on public.promptlab_safecheck_policies;
drop policy if exists "promptlab_safecheck_policies_update_own" on public.promptlab_safecheck_policies;
drop policy if exists "promptlab_safecheck_policies_delete_own" on public.promptlab_safecheck_policies;

create policy "promptlab_safecheck_policies_select_own"
on public.promptlab_safecheck_policies
for select
to authenticated
using (auth.uid() = user_id);

create policy "promptlab_safecheck_policies_insert_own"
on public.promptlab_safecheck_policies
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "promptlab_safecheck_policies_update_own"
on public.promptlab_safecheck_policies
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "promptlab_safecheck_policies_delete_own"
on public.promptlab_safecheck_policies
for delete
to authenticated
using (auth.uid() = user_id);


drop policy if exists "promptlab_safecheck_reports_select_own" on public.promptlab_safecheck_reports;
drop policy if exists "promptlab_safecheck_reports_insert_own" on public.promptlab_safecheck_reports;
drop policy if exists "promptlab_safecheck_reports_delete_own" on public.promptlab_safecheck_reports;

create policy "promptlab_safecheck_reports_select_own"
on public.promptlab_safecheck_reports
for select
to authenticated
using (auth.uid() = user_id);

create policy "promptlab_safecheck_reports_insert_own"
on public.promptlab_safecheck_reports
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "promptlab_safecheck_reports_delete_own"
on public.promptlab_safecheck_reports
for delete
to authenticated
using (auth.uid() = user_id);
```

## 9. 기본 카테고리 Seed

```sql
insert into public.promptlab_categories (name, slug, description, sort_order)
values
  ('업무', 'business', '보고서, 이메일, 고객 응대, 기획서 작성용 프롬프트', 10),
  ('글쓰기', 'writing', '블로그, 원고, 소설, 대본 작성용 프롬프트', 20),
  ('마케팅', 'marketing', '광고 문구, 상세페이지, SNS 콘텐츠 작성용 프롬프트', 30),
  ('음악 생성', 'music-generation', '가사, 음악 콘셉트, 곡 분위기 설계용 프롬프트', 40),
  ('교육', 'education', '강의, 학습, 설명, 문제 생성용 프롬프트', 50),
  ('AI SafeCheck', 'ai-safecheck', '프롬프트 안전 검사와 보안 점검용 프롬프트', 60)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  updated_at = now();
```

## 10. 실행 순서

Supabase SQL Editor에서 아래 순서대로 실행합니다.

1. Table 생성 SQL
2. updated_at 자동 갱신 함수
3. RLS 활성화
4. RLS 정책
5. 기본 카테고리 Seed

## 11. 실행 후 확인할 것

Supabase Table Editor에서 아래 테이블이 보이는지 확인합니다.

- promptlab_profiles
- promptlab_categories
- promptlab_prompts
- promptlab_safecheck_policies
- promptlab_safecheck_reports

Authentication에서 이메일 로그인이 켜져 있는지 확인합니다.

RLS가 모든 테이블에 enabled 상태인지 확인합니다.

promptlab_categories에 기본 카테고리 6개가 들어갔는지 확인합니다.

## 12. 다음 구현 작업

SQL 실행 후 코드에서는 다음 작업을 진행합니다.

- features/prompts/schemas/prompt.schema.ts
- features/prompts/types/prompt.types.ts
- features/prompts/server/create-prompt.ts
- features/prompts/server/get-prompts.ts
- features/prompts/server/get-prompt.ts
- features/prompts/server/update-prompt.ts
- features/prompts/server/delete-prompt.ts
- app/(app)/prompts/page.tsx
- app/(app)/prompts/[id]/page.tsx
- app/(app)/write 저장 기능 연결