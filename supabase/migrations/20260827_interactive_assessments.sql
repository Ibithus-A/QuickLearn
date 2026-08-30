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
  score integer not null default 0 constraint student_assessment_attempts_score_range check (score >= 0 and score <= total_marks),
  automated_total_marks integer not null default 0 check (automated_total_marks >= 0 and automated_total_marks <= total_marks),
  pending_review_marks integer not null default 0 check (pending_review_marks >= 0 and pending_review_marks <= total_marks),
  marking_version text,
  last_marked_at timestamptz,
  status text not null default 'active' check (status in ('active', 'submitted')),
  started_at timestamptz not null default now(),
  deadline_at timestamptz not null,
  submitted_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (student_id, assessment_key)
);

create index if not exists student_assessment_attempts_student_idx
  on public.student_assessment_attempts (student_id, updated_at desc);

alter table public.student_assessment_access enable row level security;
alter table public.student_assessment_attempts enable row level security;

-- Assessment records are deliberately server-only. The authenticated API verifies
-- the caller and uses the service role for all reads and writes, so students cannot
-- extend deadlines, unlock papers, or overwrite submitted answers from the browser.
revoke all on public.student_assessment_access from anon, authenticated;
revoke all on public.student_assessment_attempts from anon, authenticated;
