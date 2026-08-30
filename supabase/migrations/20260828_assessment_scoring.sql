alter table public.student_assessment_attempts
  add column if not exists locked_questions jsonb not null default '[]'::jsonb,
  add column if not exists question_scores jsonb not null default '{}'::jsonb,
  add column if not exists score integer not null default 0,
  add column if not exists automated_total_marks integer not null default 0,
  add column if not exists pending_review_marks integer not null default 0,
  add column if not exists marking_version text,
  add column if not exists last_marked_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'student_assessment_attempts_score_range'
      and conrelid = 'public.student_assessment_attempts'::regclass
  ) then
    alter table public.student_assessment_attempts
      add constraint student_assessment_attempts_score_range
      check (score >= 0 and score <= total_marks);
  end if;
end;
$$;
