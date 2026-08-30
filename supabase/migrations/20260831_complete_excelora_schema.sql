-- Excelora: complete, non-destructive Supabase schema
-- Covers profiles, plans, chapter access, lesson/video progress, and assessments.
-- Safe to run more than once. Existing student rows are preserved.

begin;

create extension if not exists pgcrypto with schema extensions;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('tutor', 'student');
  end if;

  if not exists (select 1 from pg_type where typname = 'app_plan') then
    create type public.app_plan as enum ('basic', 'premium');
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Accounts, roles, plans, current chapter, and tutor-controlled chapter access
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role public.app_role not null default 'student',
  plan public.app_plan not null default 'basic',
  tagged_chapter text,
  unlocked_chapters text[] not null default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists email text,
  add column if not exists full_name text default '',
  add column if not exists role public.app_role default 'student',
  add column if not exists plan public.app_plan default 'basic',
  add column if not exists tagged_chapter text,
  add column if not exists unlocked_chapters text[] default array[]::text[],
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

create or replace function public.sanitize_profile_access()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  allowed_chapters text[] := array[
    'Chapter 1: Algebra and Functions',
    'Chapter 2: Proof',
    'Chapter 3: Coordinate Geometry',
    'Chapter 4: Sequences and Series',
    'Chapter 5: Trigonometry',
    'Chapter 6: Exponentials and Logarithms',
    'Chapter 7: Differentiation',
    'Chapter 8: Integration',
    'Chapter 9: Numerical Methods',
    'Chapter 10: Vectors',
    'Chapter 1: Modelling in Mechanics',
    'Chapter 2: Constant Acceleration',
    'Chapter 3: Forces and Motion',
    'Chapter 4: Variable Acceleration',
    'Chapter 5: Moments',
    'Chapter 6: Forces and Friction',
    'Chapter 7: Projectiles',
    'Chapter 8: Applications of Forces',
    'Chapter 9: Further Kinematics',
    'Chapter 1: Data Collection',
    'Chapter 2: Measures of Location and Spread',
    'Chapter 3: Representations of Data',
    'Chapter 4: Correlation',
    'Chapter 5: Probability',
    'Chapter 6: Statistical Distributions',
    'Chapter 7: Hypothesis Testing',
    'Chapter 8: Regression, Correlation and Hypothesis Testing',
    'Chapter 9: Conditional Probability',
    'Chapter 10: The Normal Distribution'
  ];
  chapter_one constant text := 'Chapter 1: Algebra and Functions';
begin
  new.email := lower(trim(coalesce(new.email, '')));
  new.full_name := trim(coalesce(new.full_name, ''));
  new.unlocked_chapters := coalesce(new.unlocked_chapters, array[]::text[]);

  if new.tagged_chapter is not null
     and not (new.tagged_chapter = any (allowed_chapters)) then
    new.tagged_chapter := null;
  end if;

  -- Basic is the Chapter 1 product glimpse. Chapter 1 is implicit and therefore
  -- is not duplicated inside unlocked_chapters.
  if new.role = 'student' and new.plan = 'basic' then
    new.tagged_chapter := chapter_one;
    new.unlocked_chapters := array[]::text[];
  else
    new.unlocked_chapters := (
      select coalesce(array_agg(chapter order by chapter_order), array[]::text[])
      from (
        select distinct
          chapter,
          array_position(allowed_chapters, chapter) as chapter_order
        from unnest(new.unlocked_chapters) as chapter
        where chapter = any (allowed_chapters)
          and chapter <> chapter_one
      ) as valid_chapters
    );
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists sanitize_profile_access_before_write on public.profiles;
create trigger sanitize_profile_access_before_write
before insert or update on public.profiles
for each row execute function public.sanitize_profile_access();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_full_name text;
begin
  next_full_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'Student'
  );

  insert into public.profiles (
    id, email, full_name, role, plan, tagged_chapter, unlocked_chapters
  )
  values (
    new.id,
    lower(coalesce(new.email, '')),
    next_full_name,
    case
      when coalesce(new.raw_app_meta_data ->> 'role', '') = 'tutor'
        then 'tutor'::public.app_role
      else 'student'::public.app_role
    end,
    'basic'::public.app_plan,
    'Chapter 1: Algebra and Functions',
    array[]::text[]
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = case
      when trim(coalesce(public.profiles.full_name, '')) = '' then excluded.full_name
      else public.profiles.full_name
    end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.handle_new_user();

-- Add profiles for Auth users created before this migration.
insert into public.profiles (
  id, email, full_name, role, plan, tagged_chapter, unlocked_chapters
)
select
  user_row.id,
  lower(coalesce(user_row.email, '')),
  coalesce(
    nullif(trim(user_row.raw_user_meta_data ->> 'full_name'), ''),
    nullif(split_part(coalesce(user_row.email, ''), '@', 1), ''),
    'Student'
  ),
  case
    when coalesce(user_row.raw_app_meta_data ->> 'role', '') = 'tutor'
      then 'tutor'::public.app_role
    else 'student'::public.app_role
  end,
  'basic'::public.app_plan,
  'Chapter 1: Algebra and Functions',
  array[]::text[]
from auth.users as user_row
on conflict (id) do nothing;

-- Repair nullable fields in older profile schemas without changing existing plans.
update public.profiles as profile
set
  email = lower(coalesce(nullif(profile.email, ''), auth_user.email, '')),
  full_name = coalesce(
    nullif(trim(profile.full_name), ''),
    nullif(trim(auth_user.raw_user_meta_data ->> 'full_name'), ''),
    nullif(split_part(coalesce(auth_user.email, ''), '@', 1), ''),
    'Student'
  ),
  role = coalesce(profile.role, 'student'::public.app_role),
  plan = coalesce(profile.plan, 'basic'::public.app_plan),
  unlocked_chapters = coalesce(profile.unlocked_chapters, array[]::text[]),
  created_at = coalesce(profile.created_at, now()),
  updated_at = coalesce(profile.updated_at, now())
from auth.users as auth_user
where auth_user.id = profile.id;

alter table public.profiles
  alter column email set not null,
  alter column full_name set not null,
  alter column full_name set default '',
  alter column role set not null,
  alter column role set default 'student',
  alter column plan set not null,
  alter column plan set default 'basic',
  alter column unlocked_chapters set not null,
  alter column unlocked_chapters set default array[]::text[],
  alter column created_at set not null,
  alter column created_at set default now(),
  alter column updated_at set not null,
  alter column updated_at set default now();

-- ---------------------------------------------------------------------------
-- Lesson, video, and current-topic progress
-- ---------------------------------------------------------------------------

create table if not exists public.student_topic_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  topic_id text not null,
  topic_title text not null,
  chapter_title text,
  subject_title text,
  status text not null default 'todo'
    constraint student_topic_progress_status_check
    check (status in ('todo', 'current', 'completed')),
  watched_video boolean not null default false,
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (student_id, topic_id)
);

alter table public.student_topic_progress
  add column if not exists topic_title text,
  add column if not exists chapter_title text,
  add column if not exists subject_title text,
  add column if not exists status text default 'todo',
  add column if not exists watched_video boolean default false,
  add column if not exists started_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists updated_at timestamptz default now();

update public.student_topic_progress
set
  topic_title = coalesce(nullif(topic_title, ''), topic_id),
  status = case
    when status in ('todo', 'current', 'completed') then status
    else 'todo'
  end,
  watched_video = coalesce(watched_video, false),
  updated_at = coalesce(updated_at, now());

alter table public.student_topic_progress
  alter column topic_title set not null,
  alter column status set not null,
  alter column status set default 'todo',
  alter column watched_video set not null,
  alter column watched_video set default false,
  alter column updated_at set not null,
  alter column updated_at set default now();

create unique index if not exists student_topic_progress_student_topic_uidx
  on public.student_topic_progress (student_id, topic_id);

create index if not exists student_topic_progress_student_updated_idx
  on public.student_topic_progress (student_id, updated_at desc);

create index if not exists student_topic_progress_chapter_student_idx
  on public.student_topic_progress (chapter_title, student_id);

-- ---------------------------------------------------------------------------
-- Timed, single-attempt student assessments and saved scores
-- ---------------------------------------------------------------------------

create table if not exists public.student_assessment_access (
  student_id uuid not null references auth.users(id) on delete cascade,
  assessment_key text not null,
  is_unlocked boolean not null default false,
  unlocked_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (student_id, assessment_key)
);

create table if not exists public.student_assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  assessment_key text not null,
  question_count integer not null check (question_count > 0),
  total_marks integer not null check (total_marks > 0),
  duration_seconds integer not null check (duration_seconds > 0),
  answers jsonb not null default '{}'::jsonb,
  locked_questions jsonb not null default '[]'::jsonb,
  question_scores jsonb not null default '{}'::jsonb,
  score integer not null default 0,
  automated_total_marks integer not null default 0,
  pending_review_marks integer not null default 0,
  marking_version text,
  last_marked_at timestamptz,
  status text not null default 'active' check (status in ('active', 'submitted')),
  started_at timestamptz not null default now(),
  deadline_at timestamptz not null,
  submitted_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (student_id, assessment_key)
);

alter table public.student_assessment_attempts
  add column if not exists answers jsonb not null default '{}'::jsonb,
  add column if not exists locked_questions jsonb not null default '[]'::jsonb,
  add column if not exists question_scores jsonb not null default '{}'::jsonb,
  add column if not exists score integer not null default 0,
  add column if not exists automated_total_marks integer not null default 0,
  add column if not exists pending_review_marks integer not null default 0,
  add column if not exists marking_version text,
  add column if not exists last_marked_at timestamptz,
  add column if not exists submitted_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'student_assessment_attempts_score_range'
      and conrelid = 'public.student_assessment_attempts'::regclass
  ) then
    alter table public.student_assessment_attempts
      add constraint student_assessment_attempts_score_range
      check (score >= 0 and score <= total_marks);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'student_assessment_attempts_automated_total_range'
      and conrelid = 'public.student_assessment_attempts'::regclass
  ) then
    alter table public.student_assessment_attempts
      add constraint student_assessment_attempts_automated_total_range
      check (automated_total_marks >= 0 and automated_total_marks <= total_marks);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'student_assessment_attempts_pending_review_range'
      and conrelid = 'public.student_assessment_attempts'::regclass
  ) then
    alter table public.student_assessment_attempts
      add constraint student_assessment_attempts_pending_review_range
      check (pending_review_marks >= 0 and pending_review_marks <= total_marks);
  end if;
end;
$$;

create index if not exists student_assessment_attempts_student_idx
  on public.student_assessment_attempts (student_id, updated_at desc);

create index if not exists student_assessment_access_assessment_idx
  on public.student_assessment_access (assessment_key, is_unlocked);

-- ---------------------------------------------------------------------------
-- RLS and permissions
-- ---------------------------------------------------------------------------

create or replace function public.current_user_is_tutor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'tutor'
  );
$$;

revoke all on function public.current_user_is_tutor() from public;
grant execute on function public.current_user_is_tutor() to authenticated;

alter table public.profiles enable row level security;
alter table public.student_topic_progress enable row level security;
alter table public.student_assessment_access enable row level security;
alter table public.student_assessment_attempts enable row level security;

-- Replace older policies so a permissive legacy policy cannot override these
-- rules (Postgres combines permissive policies with OR).
do $$
declare
  policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'profiles',
        'student_topic_progress',
        'student_assessment_access',
        'student_assessment_attempts'
      )
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      policy_row.policyname,
      policy_row.schemaname,
      policy_row.tablename
    );
  end loop;
end;
$$;

drop policy if exists profiles_read_own_or_tutor on public.profiles;
create policy profiles_read_own_or_tutor
on public.profiles for select
to authenticated
using (id = auth.uid() or public.current_user_is_tutor());

drop policy if exists profiles_tutor_update on public.profiles;
create policy profiles_tutor_update
on public.profiles for update
to authenticated
using (public.current_user_is_tutor())
with check (public.current_user_is_tutor());

drop policy if exists progress_read_own_or_tutor on public.student_topic_progress;
create policy progress_read_own_or_tutor
on public.student_topic_progress for select
to authenticated
using (student_id = auth.uid() or public.current_user_is_tutor());

grant usage on schema public to authenticated, service_role;
grant select on public.profiles to authenticated;
grant update on public.profiles to authenticated;
grant select on public.student_topic_progress to authenticated;
revoke insert, update, delete on public.student_topic_progress from anon, authenticated;
revoke all on public.student_assessment_access from anon, authenticated;
revoke all on public.student_assessment_attempts from anon, authenticated;

grant all on public.profiles to service_role;
grant all on public.student_topic_progress to service_role;
grant all on public.student_assessment_access to service_role;
grant all on public.student_assessment_attempts to service_role;

-- ---------------------------------------------------------------------------
-- Student-only progress RPCs used by the website
-- ---------------------------------------------------------------------------

create or replace function public.set_current_topic(
  p_topic_id text,
  p_topic_title text,
  p_chapter_title text,
  p_subject_title text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  viewer_id uuid := auth.uid();
begin
  if viewer_id is null then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1 from public.profiles
    where id = viewer_id and role = 'student'
  ) then
    raise exception 'Only a student can change student lesson progress';
  end if;

  if nullif(trim(p_topic_id), '') is null then
    raise exception 'A topic ID is required';
  end if;

  update public.student_topic_progress
  set
    status = 'todo',
    watched_video = false,
    completed_at = null,
    updated_at = now()
  where student_id = viewer_id
    and status = 'current'
    and topic_id <> trim(p_topic_id);

  insert into public.student_topic_progress (
    student_id, topic_id, topic_title, chapter_title, subject_title,
    status, watched_video, started_at, completed_at, updated_at
  )
  values (
    viewer_id,
    trim(p_topic_id),
    coalesce(nullif(trim(p_topic_title), ''), trim(p_topic_id)),
    nullif(trim(p_chapter_title), ''),
    nullif(trim(p_subject_title), ''),
    'current', false, now(), null, now()
  )
  on conflict (student_id, topic_id) do update
  set
    topic_title = excluded.topic_title,
    chapter_title = excluded.chapter_title,
    subject_title = excluded.subject_title,
    status = 'current',
    watched_video = false,
    started_at = coalesce(student_topic_progress.started_at, excluded.started_at),
    completed_at = null,
    updated_at = now();
end;
$$;

create or replace function public.mark_topic_completed(
  p_topic_id text,
  p_topic_title text,
  p_chapter_title text,
  p_subject_title text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  viewer_id uuid := auth.uid();
begin
  if viewer_id is null then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1 from public.profiles
    where id = viewer_id and role = 'student'
  ) then
    raise exception 'Only a student can change student lesson progress';
  end if;

  if nullif(trim(p_topic_id), '') is null then
    raise exception 'A topic ID is required';
  end if;

  insert into public.student_topic_progress (
    student_id, topic_id, topic_title, chapter_title, subject_title,
    status, watched_video, started_at, completed_at, updated_at
  )
  values (
    viewer_id,
    trim(p_topic_id),
    coalesce(nullif(trim(p_topic_title), ''), trim(p_topic_id)),
    nullif(trim(p_chapter_title), ''),
    nullif(trim(p_subject_title), ''),
    'completed', true, now(), now(), now()
  )
  on conflict (student_id, topic_id) do update
  set
    topic_title = excluded.topic_title,
    chapter_title = excluded.chapter_title,
    subject_title = excluded.subject_title,
    status = 'completed',
    watched_video = true,
    started_at = coalesce(student_topic_progress.started_at, excluded.started_at),
    completed_at = now(),
    updated_at = now();
end;
$$;

create or replace function public.mark_topic_todo(
  p_topic_id text,
  p_topic_title text,
  p_chapter_title text,
  p_subject_title text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  viewer_id uuid := auth.uid();
begin
  if viewer_id is null then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1 from public.profiles
    where id = viewer_id and role = 'student'
  ) then
    raise exception 'Only a student can change student lesson progress';
  end if;

  delete from public.student_topic_progress
  where student_id = viewer_id
    and topic_id = trim(p_topic_id);
end;
$$;

revoke all on function public.set_current_topic(text, text, text, text) from public;
revoke all on function public.mark_topic_completed(text, text, text, text) from public;
revoke all on function public.mark_topic_todo(text, text, text, text) from public;
grant execute on function public.set_current_topic(text, text, text, text) to authenticated;
grant execute on function public.mark_topic_completed(text, text, text, text) to authenticated;
grant execute on function public.mark_topic_todo(text, text, text, text) to authenticated;

-- Force PostgREST to see the new tables/functions immediately.
notify pgrst, 'reload schema';

commit;

-- Verification: the result should contain all four tables.
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'profiles',
    'student_topic_progress',
    'student_assessment_access',
    'student_assessment_attempts'
  )
order by table_name;
