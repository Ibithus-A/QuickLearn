create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('student', 'tutor');
  end if;

  if not exists (select 1 from pg_type where typname = 'app_plan') then
    create type public.app_plan as enum ('basic', 'premium');
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  role public.app_role not null default 'student',
  plan public.app_plan not null default 'basic',
  unlocked_chapters text[] not null default array['Chapter 1: Algebra 1']::text[],
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;

create or replace function public.is_tutor()
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

create or replace function public.sanitize_profile_access()
returns trigger
language plpgsql
as $$
declare
  allowed_chapters text[] := array[
    'Chapter 1: Algebra 1',
    'Chapter 2: Polynomials and the binomial theorem',
    'Chapter 3: Trigonometry',
    'Chapter 4: Differentiation and integration',
    'Chapter 5: Exponentials and logarithms',
    'Chapter 6: Vectors',
    'Chapter 7: Units and kinematics',
    'Chapter 8: Forces and Newton''s laws',
    'Chapter 9: Collecting, representing and interpreting data',
    'Chapter 10: Probability and discrete random variables',
    'Chapter 11: Hypothesis testing 1',
    'Chapter 12: Algebra 2',
    'Chapter 13: Sequences',
    'Chapter 14: Trigonometric identities',
    'Chapter 15: Differentiation 2',
    'Chapter 16: Integration and differential equations',
    'Chapter 17: Numerical methods',
    'Chapter 18: Motion in two dimensions',
    'Chapter 19: Forces 2',
    'Chapter 20: Probability and continuous random variables',
    'Chapter 21: Hypothesis testing 2'
  ];
begin
  new.email = lower(trim(new.email));
  new.full_name = trim(new.full_name);

  if new.plan = 'basic' then
    new.unlocked_chapters = array['Chapter 1: Algebra 1']::text[];
  else
    new.unlocked_chapters = (
      select array_agg(chapter order by ordinality)
      from (
        select distinct chapter, ordinality
        from unnest(
          array_append(coalesce(new.unlocked_chapters, array[]::text[]), 'Chapter 1: Algebra 1')
        ) with ordinality as unlocked(chapter, ordinality)
        where chapter = any (allowed_chapters)
      ) ordered
    );
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists profiles_sanitize_access on public.profiles;
create trigger profiles_sanitize_access
before insert or update on public.profiles
for each row
execute function public.sanitize_profile_access();

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
    split_part(coalesce(new.email, ''), '@', 1),
    'Student'
  );

  insert into public.profiles (id, email, full_name, role, plan, unlocked_chapters)
  values (
    new.id,
    lower(coalesce(new.email, '')),
    next_full_name,
    case
      when coalesce(new.raw_app_meta_data ->> 'role', '') = 'tutor' then 'tutor'::public.app_role
      else 'student'::public.app_role
    end,
    'basic'::public.app_plan,
    array['Chapter 1: Algebra 1']::text[]
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = case
      when public.profiles.full_name = '' then excluded.full_name
      else public.profiles.full_name
    end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into public.profiles (id, email, full_name, role, plan, unlocked_chapters)
select
  users.id,
  lower(coalesce(users.email, '')),
  coalesce(
    nullif(trim(users.raw_user_meta_data ->> 'full_name'), ''),
    split_part(coalesce(users.email, ''), '@', 1),
    'Student'
  ),
  case
    when coalesce(users.raw_app_meta_data ->> 'role', '') = 'tutor' then 'tutor'::public.app_role
    else 'student'::public.app_role
  end,
  'basic'::public.app_plan,
  array['Chapter 1: Algebra 1']::text[]
from auth.users as users
on conflict (id) do nothing;

drop policy if exists "profiles_select_own_or_tutor" on public.profiles;
create policy "profiles_select_own_or_tutor"
on public.profiles
for select
using (
  auth.uid() = id
  or public.is_tutor()
);

drop policy if exists "profiles_update_tutor_managed_access" on public.profiles;
create policy "profiles_update_tutor_managed_access"
on public.profiles
for update
using (public.is_tutor())
with check (
  public.is_tutor()
  and role = 'student'
);
