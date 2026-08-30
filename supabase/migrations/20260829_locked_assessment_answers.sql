alter table public.student_assessment_attempts
  add column if not exists locked_questions jsonb not null default '[]'::jsonb,
  add column if not exists automated_total_marks integer not null default 0,
  add column if not exists pending_review_marks integer not null default 0;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'student_assessment_attempts_automated_total_range'
      and conrelid = 'public.student_assessment_attempts'::regclass
  ) then
    alter table public.student_assessment_attempts
      add constraint student_assessment_attempts_automated_total_range
      check (automated_total_marks >= 0 and automated_total_marks <= total_marks);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'student_assessment_attempts_pending_review_range'
      and conrelid = 'public.student_assessment_attempts'::regclass
  ) then
    alter table public.student_assessment_attempts
      add constraint student_assessment_attempts_pending_review_range
      check (pending_review_marks >= 0 and pending_review_marks <= total_marks);
  end if;
end;
$$;
