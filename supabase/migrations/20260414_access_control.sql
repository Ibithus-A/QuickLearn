alter table public.profiles
add column if not exists tagged_chapter text;

create or replace function public.sanitize_profile_access()
returns trigger
language plpgsql
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
    'Chapter 10: Vectors'
  ];
  chapter_one constant text := 'Chapter 1: Algebra and Functions';
  sanitized_tagged_chapter text;
begin
  new.email = lower(trim(new.email));
  new.full_name = trim(new.full_name);

  if new.tagged_chapter = any (allowed_chapters) then
    sanitized_tagged_chapter := new.tagged_chapter;
  else
    sanitized_tagged_chapter := null;
  end if;

  if new.role = 'student' and new.plan = 'basic' then
    sanitized_tagged_chapter := chapter_one;
  end if;

  new.tagged_chapter = sanitized_tagged_chapter;
  new.unlocked_chapters = (
    select coalesce(
      array_agg(chapter order by chapter_order),
      array[]::text[]
    )
    from (
      select distinct
        chapter,
        array_position(allowed_chapters, chapter) as chapter_order
      from unnest(coalesce(new.unlocked_chapters, array[]::text[])) as chapter
      where chapter = any (allowed_chapters)
        and chapter <> chapter_one
    ) sanitized_chapters
  );

  return new;
end;
$$;

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

  insert into public.profiles (id, email, full_name, role, plan, tagged_chapter, unlocked_chapters)
  values (
    new.id,
    lower(coalesce(new.email, '')),
    next_full_name,
    case
      when coalesce(new.raw_app_meta_data ->> 'role', '') = 'tutor' then 'tutor'::public.app_role
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
      when public.profiles.full_name = '' then excluded.full_name
      else public.profiles.full_name
    end,
    tagged_chapter = case
      when public.profiles.role = 'student' and public.profiles.plan = 'basic'
        then 'Chapter 1: Algebra and Functions'
      else public.profiles.tagged_chapter
    end;

  return new;
end;
$$;

update public.profiles
set
  tagged_chapter = case
    when role = 'student' and plan = 'basic' then 'Chapter 1: Algebra and Functions'
    else tagged_chapter
  end,
  unlocked_chapters = unlocked_chapters;

update public.profiles
set role = 'tutor',
    plan = 'premium',
    unlocked_chapters = array[
      'Chapter 1: Algebra and Functions',
      'Chapter 2: Proof',
      'Chapter 3: Coordinate Geometry',
      'Chapter 4: Sequences and Series',
      'Chapter 5: Trigonometry',
      'Chapter 6: Exponentials and Logarithms',
      'Chapter 7: Differentiation',
      'Chapter 8: Integration',
      'Chapter 9: Numerical Methods',
      'Chapter 10: Vectors'
    ]
where email = 'ibrahimahmed@outlook.com';

update public.profiles
set full_name = 'Ibrahim'
where role = 'tutor';
